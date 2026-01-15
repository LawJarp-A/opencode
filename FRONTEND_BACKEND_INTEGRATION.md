# Frontend ↔ Backend ↔ OpenCode Integration Plan

## Goal
Connect the ShopOS frontend UI to the OpenCode backend, enabling real execution through LLMs and tools.

---

## Current State Analysis

### What You Have Built
**Frontend (`packages/app/src/`)**:
- ✅ Action Dashboard with 3-column results layout
- ✅ Progress Tracker component
- ✅ Results View component
- ✅ Prompt Input component
- ✅ UI state flow (input → loading → executing → result)

**Backend (`packages/opencode/src/`)**:
- ✅ Session management system
- ✅ Agent system with LLM integration
- ✅ Event bus for real-time updates
- ✅ Tool execution framework
- ✅ Storage system

### What's Missing
❌ **The Bridge** - Frontend doesn't know how to talk to backend
❌ **Session Creation** - No way to create OpenCode sessions from UI
❌ **Event Streaming** - No real-time updates from backend to UI
❌ **Result Mapping** - No way to render OpenCode outputs in UI

---

## Integration Architecture

```
┌─────────────────────┐
│   Frontend (UI)     │
│  localhost:3000     │
└──────────┬──────────┘
           │ (1) HTTP/WebSocket
           ▼
┌─────────────────────┐
│   Backend API       │
│  OpenCode Server    │
└──────────┬──────────┘
           │ (2) Session API
           ▼
┌─────────────────────┐
│ OpenCode Session    │
│   + Event Bus       │
└──────────┬──────────┘
           │ (3) Agent Invocation
           ▼
┌─────────────────────┐
│   LLM + Tools       │
│  (Claude, etc.)     │
└─────────────────────┘
```

---

## Phase 1: Backend API Layer (Foundation)

### 1.1 Create Backend API Endpoint
**File**: `packages/opencode/src/server/session-api.ts` (new)

**Responsibilities**:
- Receive user intent from frontend
- Create OpenCode session
- Return session ID to frontend
- Stream execution events

**API Contract**:
```typescript
// POST /api/session/create
{
  actionType: "Create a marketing campaign",
  prompt: "Create a Q1 campaign for...",
  context: { files: [...], data: {...} }
}

// Response
{
  sessionID: "session_abc123",
  status: "created"
}

// WebSocket /api/session/:sessionID/events
// Streams execution events in real-time
```

**Tasks**:
- [ ] Create `session-api.ts` with session creation endpoint
- [ ] Add session streaming endpoint (WebSocket or SSE)
- [ ] Integrate with existing OpenCode session system
- [ ] Test with curl/Postman

---

### 1.2 Extend OpenCode Server
**File**: `packages/opencode/src/server/server.ts` (modify)

**Tasks**:
- [ ] Add HTTP endpoint for session creation
- [ ] Add WebSocket handler for event streaming
- [ ] Map frontend requests to OpenCode session creation
- [ ] Verify server runs alongside UI (same port or CORS-enabled)

---

## Phase 2: Frontend API Client

### 2.1 Create API Client Service
**File**: `packages/app/src/services/opencode-client.ts` (new)

**Responsibilities**:
- Send intent to backend
- Establish WebSocket connection for events
- Handle connection failures and retries

**Implementation**:
```typescript
export class OpenCodeClient {
  async createSession(intent: Intent): Promise<string> {
    // POST to backend
  }
  
  subscribeToEvents(sessionID: string, callbacks: {
    onStepStarted: (step) => void,
    onStepCompleted: (step) => void,
    onPlanCompleted: (result) => void,
    onError: (error) => void
  }): () => void {
    // WebSocket connection
  }
}
```

**Tasks**:
- [ ] Create `opencode-client.ts`
- [ ] Implement session creation method
- [ ] Implement event subscription via WebSocket
- [ ] Add error handling and reconnection logic
- [ ] Test connection to backend

---

### 2.2 Create Execution Context
**File**: `packages/app/src/context/execution-context.tsx` (new)

**Responsibilities**:
- Manage active session state
- Subscribe to backend events
- Provide execution state to UI components

**Implementation**:
```typescript
export function ExecutionProvider(props) {
  const [sessionID, setSessionID] = createSignal<string | null>(null)
  const [executionState, setExecutionState] = createSignal<ExecutionState>('idle')
  const [currentStep, setCurrentStep] = createSignal<Step | null>(null)
  const [results, setResults] = createSignal<Results | null>(null)
  
  // Subscribe to events when session is created
  createEffect(() => {
    if (!sessionID()) return
    const unsubscribe = client.subscribeToEvents(sessionID(), {
      onStepStarted: (step) => setCurrentStep(step),
      onStepCompleted: (step) => { /* update progress */ },
      onPlanCompleted: (result) => setResults(result),
    })
    return unsubscribe
  })
  
  return <ExecutionContext.Provider value={{...}}>
    {props.children}
  </ExecutionContext.Provider>
}
```

**Tasks**:
- [ ] Create execution context
- [ ] Add state management for session, steps, results
- [ ] Add event subscription logic
- [ ] Export hooks: `useExecution()`, `useSessionID()`, `useResults()`

---

## Phase 3: Wire UI to Backend

### 3.1 Update Action Dashboard
**File**: `packages/app/src/components/dashboard/action-dashboard.tsx` (modify)

**Changes**:
```typescript
// Remove simulation
- setTimeout(() => { setFlowState("executing") }, 2000)

// Add real session creation
+ const handleSubmit = async () => {
+   setFlowState("loading")
+   const sessionID = await client.createSession({
+     actionType: currentAction().title,
+     prompt: prompt.text(),
+     context: {}
+   })
+   setSessionID(sessionID)
+   setFlowState("executing")
+ }
```

**Tasks**:
- [ ] Import and use `OpenCodeClient`
- [ ] Replace fake submission with real API call
- [ ] Use `ExecutionContext` for state
- [ ] Remove all `setTimeout` simulations
- [ ] Remove mock data

---

### 3.2 Update Progress Tracker
**File**: `packages/app/src/components/dashboard/progress-tracker.tsx` (modify)

**Changes**:
```typescript
// Remove simulation
- useEffect(() => { /* fake step updates */ })

// Subscribe to real events
+ const { currentStep, steps } = useExecution()
+ 
+ createEffect(() => {
+   setTasks(steps().map(step => ({
+     id: step.id,
+     label: step.description,
+     status: step.status
+   })))
+ })
```

**Tasks**:
- [ ] Use `useExecution()` hook
- [ ] Remove simulation logic
- [ ] Display real step updates from backend events
- [ ] Show actual step descriptions from OpenCode

---

### 3.3 Update Results View
**File**: `packages/app/src/components/dashboard/results-view.tsx` (modify)

**Changes**:
```typescript
// Remove hardcoded content
- <div>Hardcoded campaign plan...</div>

// Render real results
+ const { results } = useExecution()
+ 
+ return (
+   <Show when={results()}>
+     <ResultRenderer results={results()} />
+   </Show>
+ )
```

**Tasks**:
- [ ] Use `useExecution()` hook
- [ ] Remove all mock data
- [ ] Dynamically render based on result type
- [ ] Handle different action types (campaign, analysis, etc.)

---

## Phase 4: Backend Session Execution

### 4.1 Create Session Execution Handler
**File**: `packages/opencode/src/session/execute.ts` (new)

**Responsibilities**:
- Take user intent
- Generate execution steps
- Invoke OpenCode agents sequentially
- Emit events for each step
- Collect results

**Implementation Sketch**:
```typescript
export async function executeSession(input: {
  sessionID: string
  actionType: string
  prompt: string
}) {
  // 1. Create execution plan
  const steps = generateSteps(input.actionType, input.prompt)
  
  // 2. Execute each step
  for (const step of steps) {
    Bus.publish(Event.StepStarted, { sessionID: input.sessionID, step })
    
    const result = await invokeAgent({
      sessionID: input.sessionID,
      step: step.description,
      context: step.context
    })
    
    Bus.publish(Event.StepCompleted, { sessionID: input.sessionID, step, result })
  }
  
  // 3. Collect final results
  const finalResults = await collectResults(input.sessionID)
  Bus.publish(Event.PlanCompleted, { sessionID: input.sessionID, results: finalResults })
}
```

**Tasks**:
- [ ] Create `execute.ts` with execution logic
- [ ] Implement step generation for each action type
- [ ] Integrate with OpenCode agent invocation
- [ ] Emit events at each stage
- [ ] Handle errors and retries

---

### 4.2 Define Execution Events
**File**: `packages/opencode/src/session/events.ts` (new)

**Event Schemas**:
```typescript
export const ExecutionEvent = {
  StepStarted: BusEvent.define("execution.step.started", z.object({
    sessionID: z.string(),
    step: StepSchema
  })),
  
  StepCompleted: BusEvent.define("execution.step.completed", z.object({
    sessionID: z.string(),
    step: StepSchema,
    result: z.any()
  })),
  
  PlanCompleted: BusEvent.define("execution.plan.completed", z.object({
    sessionID: z.string(),
    results: ResultsSchema
  }))
}
```

**Tasks**:
- [ ] Define all execution events
- [ ] Add to OpenCode event bus
- [ ] Document event schemas

---

## Phase 5: LLM Integration

### 5.1 Agent Invocation
**File**: `packages/opencode/src/session/agent-invoke.ts` (new)

**Responsibilities**:
- Call OpenCode agents with user intent
- Pass context (files, previous results)
- Stream LLM responses
- Return structured results

**Implementation**:
```typescript
export async function invokeAgent(input: {
  sessionID: string
  step: string
  context: any
}) {
  // Use existing OpenCode session prompt system
  const response = await SessionPrompt.command({
    sessionID: input.sessionID,
    messageID: Identifier.ascending("message"),
    model: "anthropic/claude-3-5-sonnet-20241022",
    command: input.step,
    arguments: JSON.stringify(input.context)
  })
  
  return response
}
```

**Tasks**:
- [ ] Create agent invocation wrapper
- [ ] Use existing `SessionPrompt.command()`
- [ ] Map UI action types to agent commands
- [ ] Test with real LLM calls

---

## Phase 6: Testing End-to-End

### 6.1 Integration Test
**Scenario**: "Create a marketing campaign"

1. User clicks action card in UI
2. User types prompt
3. User submits
4. Frontend calls backend API
5. Backend creates OpenCode session
6. Backend invokes Claude via OpenCode
7. Backend emits step events
8. Frontend updates progress tracker in real-time
9. Claude generates campaign plan
10. Backend emits completion event
11. Frontend displays results

**Tasks**:
- [ ] Run full flow manually
- [ ] Verify each step
- [ ] Fix any breaks in the chain
- [ ] Verify UI updates in real-time
- [ ] Verify results display correctly

---

## Implementation Order (Recommended)

### Week 1: Foundation
1. Create backend API endpoint (`session-api.ts`)
2. Extend OpenCode server to handle HTTP + WebSocket
3. Test backend locally with curl

### Week 2: Frontend Connection
4. Create API client (`opencode-client.ts`)
5. Create execution context
6. Update Action Dashboard to use real API
7. Test connection end-to-end

### Week 3: Real Execution
8. Create session execution handler
9. Define execution events
10. Implement agent invocation
11. Test with real LLM

### Week 4: UI Integration
12. Update Progress Tracker with real events
13. Update Results View with real data
14. Remove all simulations
15. End-to-end testing

---

## Key Files to Create/Modify

### New Files (Backend)
- `packages/opencode/src/server/session-api.ts` - API endpoints
- `packages/opencode/src/session/execute.ts` - Execution logic
- `packages/opencode/src/session/events.ts` - Event definitions
- `packages/opencode/src/session/agent-invoke.ts` - LLM invocation

### New Files (Frontend)
- `packages/app/src/services/opencode-client.ts` - API client
- `packages/app/src/context/execution-context.tsx` - State management

### Modified Files (Frontend)
- `packages/app/src/components/dashboard/action-dashboard.tsx`
- `packages/app/src/components/dashboard/progress-tracker.tsx`
- `packages/app/src/components/dashboard/results-view.tsx`

### Modified Files (Backend)
- `packages/opencode/src/server/server.ts` - Add new endpoints

---

## Success Criteria

✅ User submits prompt in UI  
✅ Backend receives request and creates OpenCode session  
✅ OpenCode invokes Claude LLM  
✅ UI updates progress in real-time via WebSocket  
✅ Results appear in UI automatically  
✅ No fake timers or mock data  
✅ Continuation works (submit follow-up → new session → new execution)

---

**Next Step**: Start with creating the backend API endpoint and testing it independently.
