import { Session } from "../session"
import { Identifier } from "../id/id"
import { Bus } from "../bus"
import z from "zod"

/**
 * Session API - Bridge between frontend UI and OpenCode backend
 * 
 * This module provides:
 * 1. HTTP endpoint for creating sessions from UI intent
 * 2. WebSocket streaming for real-time execution events
 */

// Schema for session creation request
export const CreateSessionInput = z.object({
    actionType: z.string(),
    prompt: z.string(),
    context: z.record(z.any()).optional()
})

export type CreateSessionInput = z.infer<typeof CreateSessionInput>

/**
 * Create a new OpenCode session from frontend intent
 * 
 * POST /api/session/create
 * 
 * Request body:
 * {
 *   actionType: "Create a marketing campaign",
 *   prompt: "Create a Q1 campaign for...",
 *   context: { files: [...], data: {...} }
 * }
 * 
 * Response:
 * {
 *   sessionID: "session_abc123",
 *   status: "created"
 * }
 */
export async function createSessionEndpoint(input: CreateSessionInput) {
    // Validate input
    const validated = CreateSessionInput.parse(input)

    // Create OpenCode session
    const session = await Session.create({
        title: validated.actionType
    })

    // Import and start execution asynchronously (fire and forget)
    // This allows the endpoint to return immediately while execution runs in background
    import("../session/execute").then(({ executeSession }) => {
        executeSession({
            sessionID: session.id,
            actionType: validated.actionType,
            prompt: validated.prompt,
            context: validated.context || {}
        }).catch((error) => {
            console.error("Execution failed:", error)
            Bus.publish({
                type: "execution.error",
                sessionID: session.id,
                error: {
                    message: error.message,
                    stack: error.stack
                }
            })
        })
    })

    return {
        sessionID: session.id,
        status: "created"
    }
}

/**
 * Stream session execution events via WebSocket
 * 
 * WebSocket: ws://localhost:8080/api/session/:sessionID/events
 * 
 * Events emitted:
 * - execution.step.started
 * - execution.step.completed
 * - execution.step.failed
 * - execution.completed
 * - execution.error
 */
export function streamSessionEvents(sessionID: string, ws: any) {
    console.log(`[StreamEvents] Starting event stream for session: ${sessionID}`)

    // Subscribe to all bus events for this session
    const unsubscribe = Bus.subscribeAll((event: any) => {
        console.log(`[StreamEvents] Bus event received:`, event.type, event.properties?.sessionID)

        // Filter events for this specific session
        const eventSessionID = event.properties?.sessionID
        if (eventSessionID === sessionID) {
            console.log(`[StreamEvents] Matching event for ${sessionID}, sending to WebSocket:`, event.type)
            // Send event to WebSocket client - convert from Bus format to frontend format
            try {
                ws.send(JSON.stringify({
                    type: event.type,
                    ...event.properties
                }))
                console.log(`[StreamEvents] Event sent successfully`)
            } catch (error) {
                console.error("Failed to send event:", error)
            }
        } else {
            console.log(`[StreamEvents] Event filtered out (sessionID mismatch: expected ${sessionID}, got ${eventSessionID})`)
        }
    })

    // Cleanup on WebSocket close
    ws.on?.('close', () => {
        unsubscribe()
    })

    // Also handle WebSocket errors
    ws.on?.('error', (error: any) => {
        console.error("WebSocket error:", error)
        unsubscribe()
    })
}

/**
 * Get session messages for results display
 * 
 * Fetches all assistant messages from a session to display
 * LLM outputs in the frontend results view.
 * 
 * @param sessionID Session ID to fetch messages from
 * @returns Array of message objects with content and metadata
 */
export async function getSessionMessages(sessionID: string) {
    const { MessageV2 } = await import("../session/message-v2")

    // Get all messages from session
    const messages: any[] = []
    for await (const msg of MessageV2.stream(sessionID)) {
        if (msg.info.role === 'assistant') {
            // Extract text content from parts
            const textParts = msg.parts.filter((p: any) => p.type === 'text' && !p.synthetic)
            const content = textParts.map((p: any) => p.text).join('\n\n')

            if (content.trim()) {
                messages.push({
                    id: msg.info.id,
                    content,
                    timestamp: msg.info.time.created
                })
            }
        }
    }

    return messages
}
