import { createContext, createSignal, createEffect, useContext, ParentComponent } from "solid-js"
import { client, ExecutionStep } from "../services/opencode-client"

/**
 * Execution Context
 * 
 * Manages active session state and real-time execution events.
 * Provides execution state to all UI components.
 */

export interface ExecutionContextValue {
    sessionID: () => string | null
    setSessionID: (id: string | null) => void
    steps: () => ExecutionStep[]
    isExecuting: () => boolean
    isCompleted: () => boolean
    error: () => any | null
}

const ExecutionContext = createContext<ExecutionContextValue>()

/**
 * Execution Provider
 * 
 * Wraps the app and provides execution state to all components.
 * Automatically subscribes to WebSocket events when a session is created.
 */
export const ExecutionProvider: ParentComponent = (props) => {
    const [sessionID, setSessionID] = createSignal<string | null>(null)
    const [steps, setSteps] = createSignal<ExecutionStep[]>([])
    const [isExecuting, setIsExecuting] = createSignal(false)
    const [isCompleted, setIsCompleted] = createSignal(false)
    const [error, setError] = createSignal<any | null>(null)

    // Subscribe to execution events when session is created
    createEffect(() => {
        const id = sessionID()
        if (!id) return

        console.log('[ExecutionContext] Subscribing to session:', id)

        // Reset state for new session
        setSteps([])
        setIsExecuting(true)
        setIsCompleted(false)
        setError(null)

        const unsubscribe = client.subscribeToEvents(id, {
            onConnected: () => {
                console.log('[ExecutionContext] Connected to execution stream')
            },

            onStepStarted: (event) => {
                console.log('[ExecutionContext] Step started:', event.step)
                setSteps((prev) => {
                    // Check if step already exists (in case of reconnection)
                    const existing = prev.find(s => s.id === event.step.id)
                    if (existing) {
                        return prev.map(s =>
                            s.id === event.step.id
                                ? { ...s, status: 'in-progress' as const }
                                : s
                        )
                    }
                    // Add new step
                    return [...prev, { ...event.step, status: 'in-progress' as const }]
                })
            },

            onStepCompleted: (event) => {
                console.log('[ExecutionContext] Step completed:', event.step)
                setSteps((prev) =>
                    prev.map(s =>
                        s.id === event.step.id
                            ? { ...s, status: 'completed' as const }
                            : s
                    )
                )
            },

            onStepFailed: (event) => {
                console.log('[ExecutionContext] Step failed:', event.step, event.error)
                setSteps((prev) =>
                    prev.map(s =>
                        s.id === event.step.id
                            ? { ...s, status: 'failed' as const }
                            : s
                    )
                )
                setError(event.error)
            },

            onCompleted: (event) => {
                console.log('[ExecutionContext] Execution completed')
                setIsExecuting(false)
                setIsCompleted(true)
            },

            onError: (err) => {
                console.error('[ExecutionContext] Execution error:', err)
                setError(err)
                setIsExecuting(false)
            },
        })

        // Cleanup on session change
        return () => {
            console.log('[ExecutionContext] Unsubscribing from session:', id)
            unsubscribe()
        }
    })

    const value: ExecutionContextValue = {
        sessionID,
        setSessionID,
        steps,
        isExecuting,
        isCompleted,
        error,
    }

    return (
        <ExecutionContext.Provider value={value}>
            {props.children}
        </ExecutionContext.Provider>
    )
}

/**
 * Hook to access execution state
 * 
 * Usage:
 * const { sessionID, steps, isExecuting } = useExecution()
 */
export function useExecution(): ExecutionContextValue {
    const context = useContext(ExecutionContext)
    if (!context) {
        throw new Error("useExecution must be used within ExecutionProvider")
    }
    return context
}
