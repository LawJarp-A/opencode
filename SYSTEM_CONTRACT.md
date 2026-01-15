# ShopOS System Contract

## Overview

This document defines the formal contract between all components of the ShopOS system, including data schemas, API endpoints, event protocols, and integration patterns.

**Version**: 1.0.0  
**Last Updated**: 2026-01-15  
**Status**: ✅ Active

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     Frontend (SolidJS)                        │
│                     localhost:3000                            │
│  • Action Dashboard                                           │
│  • Progress Tracker                                           │
│  • Results View                                               │
└────────────┬─────────────────────────────┬──────────────────┘
             │ HTTP POST                    │ WebSocket
             │ /api/session/create          │ /api/session/:id/events
             ▼                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  Backend API Layer                            │
│                  localhost:4096                               │
│  • session-api.ts (Session management)                        │
│  • Event streaming (WebSocket)                                │
└────────────┬─────────────────────────────────────────────────┘
             │ Session API
             ▼
┌──────────────────────────────────────────────────────────────┐
│              Orchestration Layer (Future)                     │
│  • Intent Classifier                                          │
│  • Plan Generator                                             │
│  • Execution Coordinator                                      │
└────────────┬─────────────────────────────────────────────────┘
             │ Agent Invocation
             ▼
┌──────────────────────────────────────────────────────────────┐
│                  OpenCode Session                             │
│  • SessionPrompt.prompt()                                     │
│  • Event Bus                                                  │
│  • Agent System                                               │
└────────────┬─────────────────────────────────────────────────┘
             │ LLM API
             ▼
┌──────────────────────────────────────────────────────────────┐
│                  LLM Provider                                 │
│  • Claude (Anthropic)                                         │
│  • GPT-4 (OpenAI)                                             │
│  • Gemini (Google)                                            │
└──────────────────────────────────────────────────────────────┘
```

---

## Core Data Schemas

All schemas are defined in `packages/opencode/src/orchestrator/schemas.ts` using Zod for runtime validation.

### 1. Intent Schema

Represents user intention from the frontend.

```typescript
interface Intent {
  id: string                    // Unique intent identifier
  actionType: string            // Action type (e.g., "Create a marketing campaign")
  prompt: string                // User's natural language prompt
  context?: Record<string, any> // Additional context data
  timestamp: number             // Unix timestamp (ms)
  metadata?: {
    source?: "ui" | "api" | "cli"
    userID?: string
    sessionContext?: any
  }
}
```

**Example**:
```json
{
  "id": "intent_1737054321000",
  "actionType": "Create a marketing campaign",
  "prompt": "Create a Q1 2026 campaign for a new coffee brand targeting millennials",
  "context": {
    "brand": "CoffeeCo",
    "budget": 50000,
    "targetAudience": "millennials"
  },
  "timestamp": 1737054321000,
  "metadata": {
    "source": "ui",
    "userID": "user_abc123"
  }
}
```

---

### 2. ExecutionStep Schema

Represents a single step in an execution plan.

```typescript
interface ExecutionStep {
  id: string                           // Unique step identifier
  description: string                  // Human-readable description
  status: ExecutionStepStatus          // Current status
  agentRef?: string                    // Agent/tool handling this step
  dependencies?: string[]              // Step IDs this depends on
  timestamps: {
    started?: number
    completed?: number
  }
  result?: any                         // Step result (populated on completion)
  error?: {
    message: string
    code?: string
    stack?: string
    recoverable?: boolean
  }
}

type ExecutionStepStatus = 
  | "pending" 
  | "in-progress" 
  | "completed" 
  | "failed" 
  | "skipped"
```

**Example**:
```json
{
  "id": "step_1",
  "description": "Analyze target audience and market context",
  "status": "in-progress",
  "agentRef": "marketing-analyst",
  "dependencies": [],
  "timestamps": {
    "started": 1737054322150
  }
}
```

---

### 3. ExecutionPlan Schema

Represents the complete execution plan for an intent.

```typescript
interface ExecutionPlan {
  id: string                 // Unique plan identifier
  intentID: string           // Reference to originating intent
  sessionID: string          // OpenCode session ID
  steps: ExecutionStep[]     // Ordered list of steps
  metadata?: {
    estimatedDuration?: number
    complexity?: "low" | "medium" | "high"
    parallelizable?: boolean
    createdAt?: number
  }
}
```

---

### 4. ExecutionEvent Schema

Events emitted during execution, streamed to frontend via WebSocket.

```typescript
interface ExecutionEvent {
  type: ExecutionEventType       // Event type
  sessionID: string              // Session ID
  step?: ExecutionStep           // Step data (for step events)
  error?: {                      // Error data (for failure events)
    message: string
    code?: string
    stack?: string
    step?: string                // Step ID where error occurred
  }
  progress?: {                   // Progress data (for progress events)
    current: number
    total: number
    percentage: number
  }
  timestamp: number              // Unix timestamp (ms)
  metadata?: Record<string, any>
}

type ExecutionEventType = 
  | "execution.started"
  | "execution.step.started"
  | "execution.step.progress"
  | "execution.step.completed"
  | "execution.step.failed"
  | "execution.completed"
  | "execution.failed"
  | "execution.cancelled"
```

**Example Events**:

```json
// Step Started Event
{
  "type": "execution.step.started",
  "sessionID": "session_def456",
  "step": {
    "id": "step_1",
    "description": "Analyze target audience and market context",
    "status": "in-progress",
    "timestamps": { "started": 1737054322150 }
  },
  "timestamp": 1737054322150
}

// Step Completed Event
{
  "type": "execution.step.completed",
  "sessionID": "session_def456",
  "step": {
    "id": "step_1",
    "description": "Analyze target audience and market context",
    "status": "completed",
    "timestamps": { 
      "started": 1737054322150,
      "completed": 1737054334890
    },
    "result": {
      "audience": "Millennials aged 25-35",
      "preferences": ["sustainability", "convenience", "quality"]
    }
  },
  "timestamp": 1737054334890
}
```

---

## API Contracts

### HTTP Endpoints

#### POST /api/session/create

Create a new execution session from user intent.

**Request**:
```typescript
{
  actionType: string     // Action type from UI
  prompt: string         // User prompt (min 1 char)
  context?: Record<string, any>  // Optional context
}
```

**Response** (200 OK):
```typescript
{
  sessionID: string      // Created session ID
  status: "created"      // Always "created"
}
```

**Example**:
```bash
curl -X POST http://localhost:4096/api/session/create \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "Create a marketing campaign",
    "prompt": "Create a Q1 2026 campaign for coffee brand",
    "context": {}
  }'

# Response:
# {"sessionID":"session_43da2005bffedRsXgPt7onMl34","status":"created"}
```

**Error Responses**:
- `400 Bad Request` - Invalid input (missing required fields)
- `500 Internal Server Error` - Server error during session creation

---

#### GET /api/session/:sessionID/messages

Retrieve all assistant messages from a completed session.

**Response** (200 OK):
```typescript
Array<{
  id: string         // Message ID
  content: string    // Message content
  timestamp: number  // When message was created
}>
```

**Example**:
```bash
curl http://localhost:4096/api/session/session_43da2005bffedRsXgPt7onMl34/messages

# Response:
# [
#   {
#     "id": "msg_1",
#     "content": "Here's the campaign plan...",
#     "timestamp": 1737054350000
#   }
# ]
```

**Error Responses**:
- `404 Not Found` - Session not found

---

### WebSocket Endpoints

#### WS /api/session/:sessionID/events

Subscribe to real-time execution events for a session.

**Connection**:
```javascript
const ws = new WebSocket('ws://localhost:4096/api/session/session_43da.../events')
```

**Message Format**:
All messages are JSON-encoded `ExecutionEvent` objects.

**Event Sequence**:
```
1. execution.started          // Execution begins
2. execution.step.started     // Step 1 starts
3. execution.step.completed   // Step 1 completes
4. execution.step.started     // Step 2 starts
5. execution.step.completed   // Step 2 completes
6. execution.step.started     // Step 3 starts
7. execution.step.completed   // Step 3 completes
8. execution.completed        // All steps done
```

**Example Frontend Usage**:
```typescript
import { client } from '@/services/opencode-client'

const sessionID = await client.createSession({
  actionType: "Create a marketing campaign",
  prompt: "Q1 campaign for coffee brand"
})

const unsubscribe = client.subscribeToEvents(sessionID, {
  onStepStarted: (step) => {
    console.log(`Step started: ${step.description}`)
    // Update progress tracker UI
  },
  onStepCompleted: (step) => {
    console.log(`Step completed: ${step.description}`)
    // Update progress tracker UI
  },
  onCompleted: () => {
    console.log('Execution completed!')
    // Transition to results view
  },
  onError: (error) => {
    console.error('Execution error:', error)
    // Show error UI
  }
})
```

---

## Execution Flow

### Sequence Diagram

```
┌─────────┐           ┌─────────┐           ┌──────────┐         ┌─────────┐
│   UI    │           │   API   │           │  Execute │         │   LLM   │
└────┬────┘           └────┬────┘           └────┬─────┘         └────┬────┘
     │                     │                     │                    │
     │ POST /session/create│                     │                    │
     │────────────────────>│                     │                    │
     │                     │                     │                    │
     │             Session.create()              │                    │
     │                     │────────────────────>│                    │
     │                     │                     │                    │
     │    {sessionID}      │                     │                    │
     │<────────────────────│                     │                    │
     │                     │                     │                    │
     │ WS Connect          │    executeSession() │                    │
     │────────────────────>│────────────────────>│                    │
     │                     │                     │                    │
     │                     │     step.started    │                    │
     │<────────────────────│<────────────────────│                    │
     │                     │                     │                    │
     │                     │                     │ SessionPrompt      │
     │                     │                     │───────────────────>│
     │                     │                     │                    │
     │                     │                     │   LLM Response     │
     │                     │                     │<───────────────────│
     │                     │                     │                    │
     │                     │    step.completed   │                    │
     │<────────────────────│<────────────────────│                    │
     │                     │                     │                    │
     │                     │  execution.completed│                    │
     │<────────────────────│<────────────────────│                    │
     │                     │                     │                    │
```

### Step-by-Step Flow

1. **User submits prompt** in frontend UI
2. **Frontend calls** `POST /api/session/create`
3. **Backend creates** OpenCode session
4. **Backend starts** `executeSession()` asynchronously
5. **Frontend connects** to WebSocket `/api/session/:id/events`
6. **For each step**:
   - Backend emits `execution.step.started` event
   - Backend invokes `SessionPrompt.prompt()` → Claude
   - Claude processes and responds
   - Backend emits `execution.step.completed` event
7. **After all steps**, backend emits `execution.completed`
8. **Frontend fetches** messages via `GET /api/session/:id/messages`
9. **Frontend displays** results in UI

---

## Error Handling

### Error Types

1. **Validation Errors** (400)
   - Missing required fields
   - Invalid data types
   - Schema validation failures

2. **Not Found Errors** (404)
   - Session doesn't exist
   - Resource not found

3. **Execution Errors** (500)
   - LLM API failures
   - Step execution failures
   - Unexpected exceptions

### Error Event Format

```typescript
{
  "type": "execution.step.failed", 
  "sessionID": "session_...",
  "step": {
    "id": "step_2",
    "status": "failed",
    "error": {
      "message": "LLM API rate limit exceeded",
      "code": "RATE_LIMIT_ERROR",
      "recoverable": true
    }
  },
  "timestamp": 1737054340000
}
```

### Retry Strategy

- **Recoverable errors**: Retry with exponential backoff (future Phase 3)
- **Non-recoverable errors**: Fail immediately, emit error event
- **User cancellation**: Emit `execution.cancelled` event

---

## Versioning Strategy

### API Versioning
- Current: **v1** (implicit)
- Future: `/v2/api/session/create` for breaking changes
- Backward compatibility maintained for 6 months

### Schema Versioning
- Schemas use semantic versioning
- Non-breaking changes: Add optional fields
- Breaking changes: Require new major version

### Event Protocol Versioning
- Events include version in metadata (future)
- Clients can specify supported versions

---

## Security Considerations

### Authentication
- **Current**: None (development mode)
- **Future**: Bearer token or API key required
- **Environment**: `OPENCODE_SERVER_PASSWORD` for basic auth

### Input Validation
- All inputs validated against Zod schemas
- SQL injection prevention (not applicable, no SQL)
- XSS prevention in results rendering (frontend)

### Rate Limiting
- **Current**: None
- **Future**: Per-user rate limits
  - 10 sessions per minute
  - 100 sessions per hour

---

## Performance Characteristics

### Expected Latencies
- **Session creation**: < 100ms
- **WebSocket connection**: < 50ms
- **Step execution**: 2-30 seconds (depends on LLM)
- **Total execution**: 10-90 seconds (3-step plan)

### Resource Limits
- **Max steps per plan**: 10
- **Max execution time**: 5 minutes (future timeout)
- **WebSocket idle timeout**: 10 minutes

---

## Testing Contract

### Unit Tests
- Schema validation
- API endpoint logic
- Event emission

### Integration Tests
- Full flow: Intent → Plan → Execution → Results
- WebSocket event streaming
- Error handling

### Contract Tests
- Request/response schemas match documentation
- Event schemas match documentation
- Backward compatibility tests

---

## Change Log

### Version 1.0.0 (2026-01-15)
- Initial schema definitions
- HTTP and WebSocket API contracts
- Event protocol specification
- Error handling conventions

---

**Document Status**: ✅ Active  
**Maintained By**: ShopOS Engineering Team  
**Review Cycle**: Quarterly or on breaking changes
