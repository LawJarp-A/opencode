/// <reference path="../env.d.ts" />
import { tool } from "@opencode-ai/plugin"
import fs from "fs"
import path from "path"
import https from "https"

const DESCRIPTION = `Generate an image using Gemini Imagen 3 model.
Returns a markdown image link that can be displayed in the chat or result modal.

IMPORTANT: Requires GEMINI_API_KEY environment variable to be set.`

export default tool({
    description: DESCRIPTION,
    args: {
        prompt: tool.schema
            .string()
            .describe("The prompt to generate an image for"),
        filename: tool.schema
            .string()
            .describe("Optional filename for the saved image. Defaults to timestamp.")
            .optional(),
        showInResult: tool.schema
            .boolean()
            .describe("If true, triggers the result modal with the generated image.")
            .optional(),
    },
    async execute(args) {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return "Error: GEMINI_API_KEY environment variable is not set. Please add it to your .env file."
        }

        const prompt = args.prompt
        const filename = args.filename
            ? args.filename.replace(/[^a-z0-9]/gi, "_").toLowerCase()
            : `image-${Date.now()}`

        const publicDir = path.resolve(process.cwd(), "packages/app/public/generated")
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true })
        }
        const filePath = path.join(publicDir, `${filename}.png`)
        const publicUrl = `/generated/${filename}.png`

        console.log(`Generating image for: "${prompt}"...`)

        return new Promise<string>((resolve, reject) => {
            const options = {
                hostname: "generativelanguage.googleapis.com",
                path: `/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }

            const req = https.request(options, (res) => {
                let data = ""
                res.on("data", (chunk) => (data += chunk))
                res.on("end", () => {
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
                            console.log("Response shape:", JSON.stringify(response).substring(0, 200))
                            return reject(new Error("No image data found in response."))
                        }

                        const buffer = Buffer.from(base64Image, "base64")
                        fs.writeFileSync(filePath, buffer)

                        const markdown = `![${prompt}](${publicUrl})`

                        let result = `# Image Generated Successfully\n\n${markdown}\n\n**Prompt**: ${prompt}\n**File**: ${filename}.png`

                        if (args.showInResult) {
                            const modalData = {
                                type: "result_modal",
                                title: "Image Generation Complete",
                                chips: ["View Full Size", "Download", "Generate Variant"],
                                workflows: [],
                                content: `Here is your generated image:\n\n${markdown}`,
                            }
                            result += `\n\n\`\`\`json result\n${JSON.stringify(modalData)}\n\`\`\``
                        }

                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })
            })

            req.on("error", (e) => reject(e))
            req.write(
                JSON.stringify({
                    instances: [{ prompt: prompt }],
                    parameters: { sampleCount: 1, aspectRatio: "1:1" },
                })
            )
            req.end()
        })
    },
})
