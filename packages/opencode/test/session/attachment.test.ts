import { describe, expect, test } from "bun:test"
import { join } from "path"
import { write } from "bun"
import { SessionPrompt } from "../../src/session/prompt"
import { MessageV2 } from "../../src/session/message-v2"
import { Identifier } from "../../src/id/id"

describe("hydrateFiles", () => {
    test("should hydrate text/plain file part from filesystem", async () => {
        const tmpFile = join(process.env.TMPDIR || "/tmp", `test-attach-${Date.now()}.txt`)
        const content = "Hello World Content"
        await write(tmpFile, content)

        const msg: MessageV2.WithParts = {
            info: {
                id: Identifier.ascending("message"),
                role: "user",
                sessionID: Identifier.ascending("session"),
                time: { created: Date.now() },
                agent: "default",
                model: { providerID: "mock", modelID: "mock" }
            },
            parts: [{
                id: Identifier.ascending("part"),
                messageID: Identifier.ascending("message"),
                sessionID: Identifier.ascending("session"),
                type: "file",
                mime: "text/plain",
                url: `file://${tmpFile}`,
                filename: "test.txt"
            }]
        }

        await SessionPrompt.hydrateFiles([msg])

        const part = msg.parts[0]
        expect(part.type).toBe("text")
        // @ts-ignore
        if (part.type === "text") {
            expect(part.text).toContain("[File: test.txt]")
            expect(part.text).toContain(content)
            expect(part.synthetic).toBe(true)
        }
    })

    test("should hydrate text/plain file part from data URI", async () => {
        const content = "Data URI Content"
        const base64 = Buffer.from(content).toString("base64")
        const url = `data:text/plain;base64,${base64}`

        const msg: MessageV2.WithParts = {
            info: {
                id: Identifier.ascending("message"),
                role: "user",
                sessionID: Identifier.ascending("session"),
                time: { created: Date.now() },
                agent: "default",
                model: { providerID: "mock", modelID: "mock" }
            },
            parts: [{
                id: Identifier.ascending("part"),
                messageID: Identifier.ascending("message"),
                sessionID: Identifier.ascending("session"),
                type: "file",
                mime: "text/plain",
                url: url,
                filename: "data.txt"
            }]
        }

        await SessionPrompt.hydrateFiles([msg])

        const part = msg.parts[0]
        expect(part.type).toBe("text")
        // @ts-ignore
        if (part.type === "text") {
            expect(part.text).toContain("[File: data.txt]")
            expect(part.text).toContain(content)
        }
    })
})
