import z from "zod"

/**
 * Orchestrator Schemas
 * 
 * This module defines the formal data structures for the ShopOS orchestration layer.
 * These schemas enforce type safety and runtime validation for all data flowing through
 * the system from user intent to execution results.
 */

// ============================================================================
// INTENT SCHEMAS
// ============================================================================

/**
 * User Intent Schema
 * 
 * Represents the raw user intention from the frontend UI.
 * This is the entry point for all orchestration flows.
 * 
 * @example
 * ```typescript
 * const intent: Intent = {
 *   id: "intent_abc123",
 *   actionType: "Create a marketing campaign",
 *   prompt: "Create a Q1 2026 campaign for coffee brand targeting millennials",
 *   context: { brand: "CoffeeCo", budget: 50000 },
 *   timestamp: Date.now()
 * }
 * ```
 */
export const Intent = z.object({
    /** Unique identifier for this intent */
    id: z.string().describe("Unique intent identifier"),

    /** Type of action requested (matches UI action card) */
    actionType: z.string().describe("Action type from frontend (e.g., 'Create a marketing campaign')"),

    /** Natural language prompt from user */
    prompt: z.string().min(1).describe("User's natural language prompt"),

    /** Optional context data (files, metadata, etc.) */
    context: z.record(z.string(), z.any()).optional().describe("Additional context data"),

    /** Timestamp when intent was created */
    timestamp: z.number().describe("Unix timestamp (ms) when intent was created"),

    /** Optional metadata */
    metadata: z.object({
        source: z.enum(["ui", "api", "cli"]).optional(),
        userID: z.string().optional(),
        sessionContext: z.any().optional()
    }).optional()
})

export type Intent = z.infer<typeof Intent>

// ============================================================================
// EXECUTION STEP SCHEMAS
// ============================================================================

/**
 * Execution Step Status
 * 
 * Lifecycle states for an execution step.
 */
export const ExecutionStepStatus = z.enum([
    "pending",      // Step is queued but not started
    "in-progress",  // Step is currently executing
    "completed",    // Step completed successfully
    "failed",       // Step failed with error
    "skipped"       // Step was skipped due to conditions
])

export type ExecutionStepStatus = z.infer<typeof ExecutionStepStatus>

/**
 * Execution Step Schema
 * 
 * Represents a single step in an execution plan.
 * Steps are executed sequentially or in parallel based on dependencies.
 * 
 * @example
 * ```typescript
 * const step: ExecutionStep = {
 *   id: "step_1",
 *   description: "Analyze target audience and market context",
 *   status: "in-progress",
 *   agentRef: "marketing-analyst",
 *   dependencies: [],
 *   timestamps: {
 *     started: Date.now()
 *   }
 * }
 * ```
 */
export const ExecutionStep = z.object({
    /** Unique step identifier */
    id: z.string().describe("Unique step identifier"),

    /** Human-readable description of what this step does */
    description: z.string().describe("Step description shown in progress tracker"),

    /** Current status of the step */
    status: ExecutionStepStatus,

    /** Reference to the agent/tool handling this step */
    agentRef: z.string().optional().describe("Agent or tool identifier"),

    /** IDs of steps that must complete before this one */
    dependencies: z.array(z.string()).optional().describe("Step IDs this step depends on"),

    /** Execution timestamps */
    timestamps: z.object({
        started: z.number().optional().describe("When step execution started"),
        completed: z.number().optional().describe("When step completed/failed")
    }),

    /** Step result data (populated on completion) */
    result: z.any().optional().describe("Step execution result"),

    /** Error information (if failed) */
    error: z.object({
        message: z.string(),
        code: z.string().optional(),
        stack: z.string().optional(),
        recoverable: z.boolean().optional()
    }).optional()
})

export type ExecutionStep = z.infer<typeof ExecutionStep>

// ============================================================================
// EXECUTION PLAN SCHEMAS
// ============================================================================

/**
 * Execution Plan Schema
 * 
 * Represents the complete execution plan for an intent.
 * The plan contains all steps, their dependencies, and execution metadata.
 * 
 * @example
 * ```typescript
 * const plan: ExecutionPlan = {
 *   id: "plan_xyz789",
 *   intentID: "intent_abc123",
 *   sessionID: "session_def456",
 *   steps: [step1, step2, step3],
 *   metadata: {
 *     estimatedDuration: 30000,
 *     complexity: "medium"
 *   }
 * }
 * ```
 */
export const ExecutionPlan = z.object({
    /** Unique plan identifier */
    id: z.string().describe("Unique execution plan identifier"),

    /** Reference to the originating intent */
    intentID: z.string().describe("Intent ID that generated this plan"),

    /** OpenCode session ID for execution */
    sessionID: z.string().describe("OpenCode session ID"),

    /** Ordered list of execution steps */
    steps: z.array(ExecutionStep).describe("Execution steps in this plan"),

    /** Plan-level metadata */
    metadata: z.object({
        estimatedDuration: z.number().optional().describe("Estimated execution time (ms)"),
        complexity: z.enum(["low", "medium", "high"]).optional(),
        parallelizable: z.boolean().optional().describe("Whether steps can run in parallel"),
        createdAt: z.number().optional()
    }).optional()
})

export type ExecutionPlan = z.infer<typeof ExecutionPlan>

// ============================================================================
// EVENT SCHEMAS
// ============================================================================

/**
 * Execution Event Types
 * 
 * All event types emitted during execution lifecycle.
 */
export const ExecutionEventType = z.enum([
    "execution.started",          // Execution began
    "execution.step.started",     // Step started
    "execution.step.progress",    // Step progress update
    "execution.step.completed",   // Step completed successfully
    "execution.step.failed",      // Step failed
    "execution.completed",        // All steps completed
    "execution.failed",           // Execution failed
    "execution.cancelled"         // User cancelled execution
])

export type ExecutionEventType = z.infer<typeof ExecutionEventType>

/**
 * Execution Event Schema
 * 
 * Events emitted during execution and streamed to frontend via WebSocket.
 * 
 * @example
 * ```typescript
 * const event: ExecutionEvent = {
 *   type: "execution.step.started",
 *   sessionID: "session_def456",
 *   step: { id: "step_1", description: "Analyzing...", status: "in-progress" },
 *   timestamp: Date.now()
 * }
 * ```
 */
export const ExecutionEvent = z.object({
    /** Event type */
    type: ExecutionEventType,

    /** Session ID this event belongs to */
    sessionID: z.string().describe("OpenCode session ID"),

    /** Step data (for step-related events) */
    step: ExecutionStep.optional(),

    /** Error information (for failure events) */
    error: z.object({
        message: z.string(),
        code: z.string().optional(),
        stack: z.string().optional(),
        step: z.string().optional().describe("Step ID where error occurred")
    }).optional(),

    /** Progress information (for progress events) */
    progress: z.object({
        current: z.number(),
        total: z.number(),
        percentage: z.number()
    }).optional(),

    /** Event timestamp */
    timestamp: z.number().describe("Unix timestamp (ms)"),

    /** Additional metadata */
    metadata: z.record(z.string(), z.any()).optional()
})

export type ExecutionEvent = z.infer<typeof ExecutionEvent>

// ============================================================================
// RESULT SCHEMAS
// ============================================================================

/**
 * Execution Result Schema
 * 
 * Final result of a completed execution.
 * 
 * @example
 * ```typescript
 * const result: ExecutionResult = {
 *   sessionID: "session_def456",
 *   intentID: "intent_abc123",
 *   status: "completed",
 *   outputs: [
 *     { type: "campaign-plan", data: {...} }
 *   ],
 *   duration: 28340,
 *   timestamp: Date.now()
 * }
 * ```
 */
export const ExecutionResult = z.object({
    /** Session ID */
    sessionID: z.string(),

    /** Intent ID */
    intentID: z.string(),

    /** Overall execution status */
    status: z.enum(["completed", "failed", "cancelled"]),

    /** Output artifacts from execution */
    outputs: z.array(z.object({
        type: z.string().describe("Output type (e.g., 'campaign-plan', 'analysis-report')"),
        data: z.any().describe("Output data"),
        format: z.string().optional().describe("Data format (json, markdown, etc.)"),
        stepID: z.string().optional().describe("Step that produced this output")
    })),

    /** Execution duration in milliseconds */
    duration: z.number(),

    /** Completion timestamp */
    timestamp: z.number(),

    /** Summary message */
    summary: z.string().optional(),

    /** Error information if failed */
    error: z.any().optional()
})

export type ExecutionResult = z.infer<typeof ExecutionResult>

// ============================================================================
// API REQUEST/RESPONSE SCHEMAS
// ============================================================================

/**
 * Session Creation Request Schema
 * 
 * Request body for POST /api/session/create
 */
export const CreateSessionRequest = z.object({
    actionType: z.string().describe("Action type from UI"),
    prompt: z.string().min(1).describe("User prompt"),
    context: z.record(z.string(), z.any()).optional().describe("Additional context")
})

export type CreateSessionRequest = z.infer<typeof CreateSessionRequest>

/**
 * Session Creation Response Schema
 * 
 * Response from POST /api/session/create
 */
export const CreateSessionResponse = z.object({
    sessionID: z.string().describe("Created session ID"),
    status: z.literal("created").describe("Session status")
})

export type CreateSessionResponse = z.infer<typeof CreateSessionResponse>

/**
 * Session Messages Response Schema
 * 
 * Response from GET /api/session/:sessionID/messages
 */
export const SessionMessagesResponse = z.array(z.object({
    id: z.string(),
    content: z.string(),
    timestamp: z.number()
}))

export type SessionMessagesResponse = z.infer<typeof SessionMessagesResponse>

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Validate and parse data against a schema
 * 
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Parsed and validated data
 * @throws {z.ZodError} If validation fails
 */
export function validate<T extends z.ZodTypeAny>(
    schema: T,
    data: unknown
): z.infer<T> {
    return schema.parse(data)
}

/**
 * Safe validation that returns result object
 * 
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Success/failure result with data or error
 */
export function safeParse<T extends z.ZodTypeAny>(
    schema: T,
    data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
    const result = schema.safeParse(data)
    if (result.success) {
        return { success: true, data: result.data }
    }
    return { success: false, error: result.error }
}
