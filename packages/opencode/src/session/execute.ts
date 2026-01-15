import { SessionPrompt } from "./prompt"
import { Identifier } from "../id/id"
import { Bus } from "../bus"
import { BusEvent } from "../bus/bus-event"
import z from "zod"

/**
 * Session Execution Handler
 * 
 * Takes user intent and executes it step-by-step using OpenCode agents and LLMs.
 * Emits events at each stage for real-time UI updates.
 */

// Define Bus event types
const ExecutionStepStarted = BusEvent.define(
    "execution.step.started",
    z.object({
        sessionID: z.string(),
        step: z.object({
            id: z.string(),
            description: z.string(),
            status: z.literal('in-progress')
        }),
        timestamp: z.number()
    })
)

const ExecutionStepCompleted = BusEvent.define(
    "execution.step.completed",
    z.object({
        sessionID: z.string(),
        step: z.object({
            id: z.string(),
            description: z.string(),
            status: z.literal('completed')
        }),
        timestamp: z.number()
    })
)

const ExecutionStepFailed = BusEvent.define(
    "execution.step.failed",
    z.object({
        sessionID: z.string(),
        step: z.object({
            id: z.string(),
            description: z.string(),
            status: z.literal('failed')
        }),
        error: z.object({
            message: z.string(),
            stack: z.string().optional()
        }),
        timestamp: z.number()
    })
)

const ExecutionCompleted = BusEvent.define(
    "execution.completed",
    z.object({
        sessionID: z.string(),
        timestamp: z.number()
    })
)

const ExecutionError = BusEvent.define(
    "execution.error",
    z.object({
        sessionID: z.string(),
        error: z.object({
            message: z.string(),
            stack: z.string().optional()
        }),
        timestamp: z.number()
    })
)

export interface ExecutionStep {
    id: string
    description: string
    status: 'pending' | 'in-progress' | 'completed' | 'failed'
}

export interface ExecuteSessionInput {
    sessionID: string
    actionType: string
    prompt: string
    context: Record<string, any>
}

/**
 * Execute a session by invoking LLM step-by-step
 * 
 * Flow:
 * 1. Generate steps based on action type
 * 2. For each step:
 *    - Emit "step.started" event
 *    - Invoke LLM via SessionPrompt
 *    - Emit "step.completed" event
 * 3. Emit "execution.completed" event
 */
export async function executeSession(input: ExecuteSessionInput) {
    console.log(`[Execution] Starting session ${input.sessionID} for action: ${input.actionType}`)

    try {
        // Get execution steps for this action type
        const steps = getStepsForAction(input.actionType)

        // Execute each step sequentially
        for (const step of steps) {
            console.log(`[Execution] Step ${step.id}: ${step.description}`)

            // Emit step started event
            await Bus.publish(ExecutionStepStarted, {
                sessionID: input.sessionID,
                step: {
                    ...step,
                    status: 'in-progress' as const
                },
                timestamp: Date.now()
            })

            try {
                // Invoke LLM via OpenCode's SessionPrompt system using prompt() API
                await SessionPrompt.prompt({
                    sessionID: input.sessionID,
                    parts: [{
                        type: "text",
                        text: `${step.description}\n\nUser request: ${input.prompt}`
                    }]
                })

                // Emit step completed event
                await Bus.publish(ExecutionStepCompleted, {
                    sessionID: input.sessionID,
                    step: {
                        ...step,
                        status: 'completed' as const
                    },
                    timestamp: Date.now()
                })

                console.log(`[Execution] Step ${step.id} completed successfully`)

            } catch (stepError: any) {
                console.error(`[Execution] Step ${step.id} failed:`, stepError)

                // Emit step failed event
                await Bus.publish(ExecutionStepFailed, {
                    sessionID: input.sessionID,
                    step: {
                        ...step,
                        status: 'failed' as const
                    },
                    error: {
                        message: stepError.message,
                        stack: stepError.stack
                    },
                    timestamp: Date.now()
                })

                // Stop execution on first failure
                throw stepError
            }
        }

        // All steps completed successfully
        console.log(`[Execution] Session ${input.sessionID} completed successfully`)

        await Bus.publish(ExecutionCompleted, {
            sessionID: input.sessionID,
            timestamp: Date.now()
        })

    } catch (error: any) {
        console.error(`[Execution] Session ${input.sessionID} failed:`, error)

        await Bus.publish(ExecutionError, {
            sessionID: input.sessionID,
            error: {
                message: error.message,
                stack: error.stack
            },
            timestamp: Date.now()
        })

        throw error
    }
}

/**
 * Get execution steps for a given action type
 * 
 * Each action type has a predefined set of steps that guide the LLM execution.
 * These steps provide structure and transparency to the user.
 */
function getStepsForAction(actionType: string): ExecutionStep[] {
    const stepTemplates: Record<string, ExecutionStep[]> = {
        "Create a marketing campaign": [
            { id: "1", description: "Analyze target audience and market context", status: 'pending' },
            { id: "2", description: "Define campaign objectives and key messages", status: 'pending' },
            { id: "3", description: "Generate comprehensive campaign plan with channels and timeline", status: 'pending' }
        ],
        "Do some analysis": [
            { id: "1", description: "Review and validate input data", status: 'pending' },
            { id: "2", description: "Perform exploratory analysis to identify patterns", status: 'pending' },
            { id: "3", description: "Generate insights and actionable recommendations", status: 'pending' }
        ],
        "Simulate business Scenario": [
            { id: "1", description: "Define scenario parameters and assumptions", status: 'pending' },
            { id: "2", description: "Run simulations across different scenarios", status: 'pending' },
            { id: "3", description: "Analyze outcomes and identify optimal strategy", status: 'pending' }
        ],
        "Prep for the day": [
            { id: "1", description: "Review today's schedule and commitments", status: 'pending' },
            { id: "2", description: "Identify priorities and time blocks", status: 'pending' },
            { id: "3", description: "Create focused action plan for the day", status: 'pending' }
        ],
        "Manage Products": [
            { id: "1", description: "Review current product catalog and status", status: 'pending' },
            { id: "2", description: "Identify optimization opportunities", status: 'pending' },
            { id: "3", description: "Generate product management recommendations", status: 'pending' }
        ],
        "Get on a call with us": [
            { id: "1", description: "Capture context and call objectives", status: 'pending' },
            { id: "2", description: "Prepare agenda and key discussion points", status: 'pending' },
            { id: "3", description: "Finalize scheduling and next steps", status: 'pending' }
        ]
    }

    // Return steps for action type, or default steps if not found
    return stepTemplates[actionType] || [
        { id: "1", description: "Analyze request and gather context", status: 'pending' },
        { id: "2", description: "Process and execute task", status: 'pending' },
        { id: "3", description: "Generate final output", status: 'pending' }
    ]
}
