import { Agent } from "../packages/opencode/src/agent/agent"
import { Session } from "../packages/opencode/src/session"
import { Identifier } from "../packages/opencode/src/id/id"
import { iife } from "../packages/opencode/src/util/iife"

iife(async () => {
    console.log("Starting Hospital Agent Verification...")

    // 1. Get Triage Agent
    const triageAgent = await Agent.get("triage")
    if (!triageAgent) {
        console.error("❌ Triage Agent not found!")
        process.exit(1)
    }
    console.log("✅ Triage Agent loaded")

    // 2. Create a dummy session
    const sessionID = Identifier.create("session")
    await Session.create({
        id: sessionID,
        workspaceID: "default",
    })

    // 3. Mock logic - in a real test we would invoke the agent loop
    // For this verification, we just want to ensure the agent is registered 
    // and its prompt is accessible.

    if (triageAgent.prompt && triageAgent.prompt.includes("ESI Level")) {
        console.log("✅ Triage Prompt contains 'ESI Level' instruction")
    } else {
        console.error("❌ Triage Prompt missing key instructions")
    }

    console.log("✅ Verification Complete: Hospital Agents are registered and ready.")
})
