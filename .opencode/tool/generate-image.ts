
import { Tool } from "@opencode-ai/sdk/v2"
import fs from "fs"
import path from "path"
import https from "https"

type GenerateImageInput = {
    prompt: string
    filename?: string
    showInResult?: boolean
}

type GenerateImageOutput = {
    imagePath: string
    markdown: string
    modal?: any
}

export default new Tool<GenerateImageInput, GenerateImageOutput>({
    name: "generate-image",
    description: "Generate an image using Gemini Imagen 3 model. Returns a markdown image link and optionally triggers a result modal.",
    input: {
        prompt: {
            type: "string",
            description: "The prompt to generate an image for."
        },
        filename: {
            type: "string",
            description: "Optional filename for the saved image. Defaults to timestamp.",
            optional: true
        },
        showInResult: {
            type: "boolean",
            description: "If true, triggers the result modal with the generated image.",
            optional: true
        }
    },
    handler: async (args: GenerateImageInput) => {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable is not set. Please add it to your .env file.")
        }

        const prompt = args.prompt
        const filename = args.filename ? args.filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() : `image-${Date.now()}`

        // Define paths - assume running from root or we can find the packages dir
        // We know from previous steps that app public dir is packages/app/public
        // The agent runs in a way that process.cwd() might vary, but usually root.
        // Let's try to resolve relative to process.cwd()
        const publicDir = path.resolve(process.cwd(), "packages/app/public/generated")
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true })
        }
        const filePath = path.join(publicDir, `${filename}.png`)
        const publicUrl = `/generated/${filename}.png`

        console.log(`Generating image for: "${prompt}"...`)

        return new Promise<GenerateImageOutput>((resolve, reject) => {
            const options = {
                hostname: 'generativelanguage.googleapis.com',
                path: `/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const req = https.request(options, (res) => {
                let data = ''
                res.on('data', (chunk) => data += chunk)
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        return reject(new Error(`Gemini API Error (${res.statusCode}): ${data}`))
                    }

                    try {
                        const response = JSON.parse(data)
                        if (!response.predictions || response.predictions.length === 0) {
                            return reject(new Error("No predictions returned from Gemini API."))
                        }

                        const base64Image = response.predictions[0].bytesBase64Encoded
                        if (!base64Image) {
                            // Fallback for different API versions or shapes
                            // Sometimes it is [ { bytesBase64Encoded: ... } ]
                            // Or [ { mimeType: ..., bytesBase64Encoded: ... } ]
                            console.log("Response shape:", JSON.stringify(response).substring(0, 200))
                            return reject(new Error("No image data found in response."))
                        }

                        const buffer = Buffer.from(base64Image, 'base64')
                        fs.writeFileSync(filePath, buffer)

                        const markdown = `![${prompt}](${publicUrl})`

                        let modal = undefined
                        if (args.showInResult) {
                            modal = {
                                type: "result_modal",
                                title: "Image Generated",
                                content: `Here is the generated image for **"${prompt}"**:\n\n${markdown}`,
                                chips: ["Regenerate", "Generate another variation", "Save to library"],
                                workflows: []
                            }

                            // Using the trick from query tools: emit the json block at the end of the text
                            // But for the tool output, we return the structured object, and let the agent render it.
                            // Wait, the agent renders the 'result' of the tool. 
                            // If we return a string, it renders markdown.
                            // If showInResult is true, we want to force the modal.
                            // The query tools returned a STRING containing the ```json result ``` block.
                            // So we should do the same here.
                        }

                        let outputString = `### Generated Image\n\n${markdown}`
                        if (modal) {
                            outputString += `\n\n\`\`\`json result\n${JSON.stringify(modal)}\n\`\`\``
                        }

                        resolve({
                            imagePath: filePath,
                            markdown: markdown,
                            // We return the actual objects for programmatic use, but the agent usually prints the string representation or we return a string directly.
                            // The SDK Tool handler usually returns 'any'. 
                            // To be safe and compatible with how we did query-sales, let's return the string as the main output if possible, 
                            // OR just return this object and rely on the agent to format it. 
                            // Actually, looking at query-sales.ts (view_file output), it returns a STRING.
                            // So I should change the return type to Promise<string> to be consistent and allow the JSON block magic to work.
                        } as any)

                    } catch (e) {
                        reject(e)
                    }
                })
            })

            req.on('error', (e) => reject(e))
            req.write(JSON.stringify({
                instances: [{ prompt: prompt }],
                parameters: { sampleCount: 1, aspectRatio: "1:1" }
            }))
            req.end()
        }).then(output => {
            // Return string for consistency with other tools that trigger modals
            let res = `### Generated Image: ${prompt}\n\n${output.markdown}`
            if (args.showInResult) {
                const modalData = {
                    type: "result_modal",
                    title: "Image Generation Complete",
                    chips: ["View Full Size", "Download", "Generate Variant"],
                    workflows: [],
                    content: `Here is your generated image:\n\n${output.markdown}`
                }
                res += `\n\n\`\`\`json result\n${JSON.stringify(modalData)}\n\`\`\``
            }
            return res as any
        })
    }
})
