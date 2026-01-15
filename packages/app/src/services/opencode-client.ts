/**
 * OpenCode Client
 * 
 * Frontend service for communicating with OpenCode backend.
 * Handles session creation and real-time event streaming via WebSocket.
 */

import { createLogger } from "../utils/logger"

const log = createLogger("OpenCodeClient")

// Configuration
const BACKEND_URL = import.meta.env.VITE_OPENCODE_URL || 'http://localhost:4096'
const WS_BACKEND_URL = BACKEND_URL.replace('http://', 'ws://').replace('https://', 'wss://')

export interface CreateSessionIntent {
    actionType: string
    prompt: string
    context?: Record<string, any>
}

export interface CreateSessionResponse {
    sessionID: string
    status: 'created'
}

export interface ExecutionStep {
    id: string
    description: string
    status: 'pending' | 'in-progress' | 'completed' | 'failed'
}

export interface ExecutionEventCallbacks {
    onStepStarted?: (event: any) => void
    onStepCompleted?: (event: any) => void
    onStepFailed?: (event: any) => void
    onCompleted?: (event: any) => void
    onError?: (error: any) => void
    onConnected?: () => void
}

/**
 * OpenCode Client
 * 
 * Provides methods to:
 * 1. Create sessions from user intent
 * 2. Subscribe to real-time execution events via WebSocket
 */
export class OpenCodeClient {
    private baseURL: string
    private wsBaseURL: string

    constructor(baseURL: string = BACKEND_URL) {
        this.baseURL = baseURL
        this.wsBaseURL = WS_BACKEND_URL
    }

    /**
     * Create a new session from user intent
     * 
     * POST /api/session/create
     * 
     * @param intent User's action type, prompt, and context
     * @returns Promise resolving to session ID
     */
    async createSession(intent: CreateSessionIntent): Promise<string> {
        try {
            log.apiCall("POST", "/api/session/create")

            const response = await fetch(`${this.baseURL}/api/session/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(intent),
            })

            if (!response.ok) {
                throw new Error(`Failed to create session: ${response.statusText}`)
            }

            const data: CreateSessionResponse = await response.json()
            log.sessionEvent(data.sessionID, "created", { actionType: intent.actionType })
            return data.sessionID
        } catch (error) {
            log.error("Session creation failed", error)
            throw error
        }
    }

    /**
     * Subscribe to real-time execution events for a session
     * 
     * WebSocket: ws://localhost:4096/api/session/:sessionID/events
     * 
     * Events:
     * - execution.step.started
     * - execution.step.completed
     * - execution.step.failed
     * - execution.completed
     * - execution.error
     * 
     * @param sessionID Session ID to subscribe to
     * @param callbacks Event handler callbacks
     * @returns Unsubscribe function
     */
    subscribeToEvents(
        sessionID: string,
        callbacks: ExecutionEventCallbacks
    ): () => void {
        const wsURL = `${this.wsBaseURL}/api/session/${sessionID}/events`
        console.log('[OpenCodeClient] Connecting to:', wsURL)

        const ws = new WebSocket(wsURL)
        let isConnected = false

        ws.onopen = () => {
            console.log('[OpenCodeClient] WebSocket connected')
            isConnected = true
            callbacks.onConnected?.()
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log('[OpenCodeClient] Event received:', data.type)

                switch (data.type) {
                    case 'execution.step.started':
                        callbacks.onStepStarted?.(data)
                        break
                    case 'execution.step.completed':
                        callbacks.onStepCompleted?.(data)
                        break
                    case 'execution.step.failed':
                        callbacks.onStepFailed?.(data)
                        break
                    case 'execution.completed':
                        callbacks.onCompleted?.(data)
                        break
                    case 'execution.error':
                        callbacks.onError?.(data.error)
                        break
                    default:
                        // Ignore unknown event types
                        console.log('[OpenCodeClient] Unknown event type:', data.type)
                }
            } catch (error) {
                console.error('[OpenCodeClient] Failed to parse event:', error)
                callbacks.onError?.(error)
            }
        }

        ws.onerror = (error) => {
            console.error('[OpenCodeClient] WebSocket error:', error)
            callbacks.onError?.(error)
        }

        ws.onclose = () => {
            console.log('[OpenCodeClient] WebSocket closed')
        }

        // Return unsubscribe function
        return () => {
            if (isConnected && ws.readyState === WebSocket.OPEN) {
                ws.close()
            }
        }
    }

    /**
     * Get session messages (LLM outputs)
     * 
     * Fetch all assistant messages from a completed session
     * for display in the results view.
     * 
     * @param sessionID Session ID to fetch messages from
     * @returns Promise resolving to array of messages
     */
    async getSessionMessages(sessionID: string): Promise<any[]> {
        try {
            log.apiCall("GET", `/api/session/${sessionID}/messages`)

            const response = await fetch(`${this.baseURL}/api/session/${sessionID}/messages`)

            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.statusText}`)
            }

            const messages = await response.json()
            log.info("Messages fetched", { sessionID, count: messages.length })
            return messages
        } catch (error) {
            log.error("Failed to fetch messages", error)
            throw error
        }
    }
}

// Singleton instance
export const client = new OpenCodeClient()
