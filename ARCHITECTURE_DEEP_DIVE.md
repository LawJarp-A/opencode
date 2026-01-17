# OpenCode Architecture Deep-Dive: Complete System Analysis

**Generated:** 2026-01-16 00:41:00 IST  
**Purpose:** Full reverse-engineering of the OpenCode/ShopOS system from first principles

---

## 1) One-Paragraph Overview

OpenCode is an **AI-powered development tool** that combines a **CLI-based agent runtime** (backend) with a **web-based UI** (frontend) to enable conversational software development. When you run `bun run dev`, it starts a **Hono-based HTTP/WebSocket server** on port 4096 that manages AI agent sessions, tool execution, and file operations, while a **SolidJS + Vite frontend** on port 3000 provides the interactive chat interface. The system uses **streaming SSE** for real-time updates, **Zod schemas** for type-safe contracts, and the **Vercel AI SDK** for LLM interactions. It supports multiple AI providers (OpenAI, Anthropic, etc.), tool calling, terminal execution, LSP integration, and MCP server connections.

---

## 2) "When I run bun run dev" — Exact Boot Sequence

### Step-by-Step Boot Flow

```bash
bun run dev
```

**Execution Path:**

1. **Entry Script** (`package.json` line 10):
   ```json
   "dev": "bun run --cwd packages/opencode --conditions=browser src/index.ts"
   ```

2. **Main CLI Entry** → `packages/opencode/src/index.ts`:
   - Creates a **yargs CLI application** with multiple commands
   - Registers commands: `serve`, `run`, `session`, `agent`, `web`, `mcp`, etc.
   - Sets up global error handlers and logging via `Log.init()`
   - Parses command-line arguments

3. **Default Command** (when running in dev mode):
   - The `dev` script doesn't specify a command, so it typically would show help
   - However, the **ShopOS integration** uses a custom `dev.sh` script that:
     - Starts backend: `cd packages/opencode && bun run dev` (port 4096)
     - Starts frontend: `cd packages/app && npm run dev` (port 3000)

4. **Backend Server Initialization**:
   - If using `serve` command → calls `Server.listen()` from `server/server.ts`
   - Creates **Hono app** with middleware:
     - CORS (allows localhost, tauri://localhost)
     - Basic auth (if `OPENCODE_SERVER_PASSWORD` set)
     - Request logging
   - Binds to port **4096** (default)
   - Registers API routes (see section 6)

5. **Frontend Server** (separate process):
   - Entry: `packages/app/index.html` → `src/entry.tsx`
   - **Vite dev server** compiles SolidJS app
   - Binds to port **3000**
   - Hot module replacement enabled

### Runtime Assumptions

- **Environment Variables**:
  - `OPENCODE_SERVER_PASSWORD` - Optional server password
  - `OPENCODE_SERVER_USERNAME` - Optional username (default: "opencode")
  - `AGENT=1`, `OPENCODE=1` - Set automatically
- **File System**:
  - Writes to `~/.opencode/` for state and config
  - Logs to `./logs/` directory
- **Network**:
  - Backend: `http://localhost:4096`
  - Frontend: `http://localhost:3000`

---

## 3) Complete Folder Map (with Meaning)

```
/Users/gg/Documents/ShopOS/opencode/
│
├── packages/
│   ├── opencode/              # 🔥 BACKEND RUNTIME ENGINE
│   │   ├── src/
│   │   │   ├── index.ts       # CLI entry point (yargs setup)
│   │   │   ├── server/        # HTTP/WebSocket server (Hono)
│   │   │   │   └── server.ts  # Main API routes (98KB, 2996 lines!)
│   │   │   ├── agent/         # Agent runtime & orchestration
│   │   │   │   └── agent.ts   # Agent definitions (build, plan, general, explore)
│   │   │   ├── session/       # Session lifecycle management (14 files)
│   │   │   │   ├── execute.ts # Session execution with step tracking
│   │   │   │   ├── prompt.ts  # Prompt assembly and formatting
│   │   │   │   ├── llm.ts     # LLM invocation via Vercel AI SDK
│   │   │   │   └── message-v2.ts # Message data structures
│   │   │   ├── tool/          # Tool implementations (44 files)
│   │   │   ├── provider/      # AI provider integrations (22 files)
│   │   │   ├── cli/           # CLI commands (127 files)
│   │   │   ├── mcp/           # Model Context Protocol integration
│   │   │   ├── lsp/           # Language Server Protocol client
│   │   │   ├── pty/           # Pseudo-terminal management
│   │   │   ├── file/          # File system operations
│   │   │   ├── project/       # Project management
│   │   │   ├── config/        # Configuration management
│   │   │   ├── bus/           # Event bus for inter-component communication
│   │   │   └── util/          # Utilities (20 files)
│   │   └── package.json       # Backend dependencies (AI SDK, Hono, Zod, etc.)
│   │
│   ├── app/                   # 🎨 FRONTEND (SolidJS + Vite)
│   │   ├── index.html         # HTML shell
│   │   ├── src/
│   │   │   ├── entry.tsx      # SolidJS bootstrap
│   │   │   ├── app.tsx        # Root component
│   │   │   ├── pages/
│   │   │   │   ├── layout.tsx # Root router layout
│   │   │   │   ├── home.tsx   # Landing page (action selection)
│   │   │   │   └── session.tsx # Main session page (1734 lines!)
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── action-dashboard.tsx
│   │   │   │   │   ├── progress-tracker.tsx
│   │   │   │   │   └── results-view.tsx
│   │   │   │   ├── prompt-input.tsx # Main input component
│   │   │   │   └── terminal.tsx
│   │   │   ├── context/       # State management (17 providers)
│   │   │   │   ├── sdk.tsx    # SDK client context
│   │   │   │   ├── sync.tsx   # Data synchronization
│   │   │   │   ├── prompt.tsx # Prompt state
│   │   │   │   └── ...
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── ui/                    # Shared UI component library
│   ├── sdk/                   # TypeScript SDK for API
│   ├── util/                  # Shared utilities
│   └── ...
│
├── dev.sh                     # Dev environment startup script
└── package.json               # Root monorepo config
```

### Key Directory Purposes

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `packages/opencode/src/server/` | HTTP API and WebSocket server | `server.ts` (all routes) |
| `packages/opencode/src/agent/` | Agent definitions and config | `agent.ts` |
| `packages/opencode/src/session/` | Session execution engine | `execute.ts`, `prompt.ts`, `llm.ts` |
| `packages/opencode/src/tool/` | Tool registry and implementations | 44 tool files |
| `packages/app/src/pages/` | UI pages/routes | `session.tsx`, `home.tsx` |
| `packages/app/src/components/` | Reusable UI components | `prompt-input.tsx`, `progress-tracker.tsx` |
| `packages/app/src/context/` | State management providers | `sdk.tsx`, `sync.tsx` |

---

## 4) System Architecture (High Level)

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     UI LAYER (Port 3000)                     │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  Pages     │  │  Components  │  │  Context         │    │
│  │  - home    │  │  - dashboard │  │  - sdk           │    │
│  │  - session │  │  - prompt    │  │  - sync          │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
│         ↓ SSE/WebSocket ↓                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (Port 4096)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Server     │  │  Session     │  │  Agent           │   │
│  │  (Hono API) │  │  Execution   │  │  Runtime         │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         ↓ Invokes ↓                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    RUNTIME LAYER                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  LLM Via    │  │  Tool        │  │  File System     │   │
│  │  AI SDK     │  │  Executor    │  │  & Terminal      │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### A) UI Layer

**Entry Point:** `packages/app/src/entry.tsx`

**Layout Structure:**
```
App (app.tsx)
 └── Router
      └── Layout (pages/layout.tsx)
           ├── Home (pages/home.tsx)
           └── Session (pages/session.tsx)
                ├── ActionDashboard
                ├── ProgressTracker
                └── PromptInput
```

**State Flow:**
- **Contexts** manage global state (17 providers)
- **SDK Context** wraps API client
- **Sync Context** handles real-time data sync via SSE
- **Signal-based reactivity** (SolidJS)

### B) Application Layer

**Controllers/Services:**
- **Server (`server/server.ts`)**: Route handlers for all API endpoints
- **Session Executor (`session/execute.ts`)**: Orchestrates step-by-step execution
- **Agent Manager (`agent/agent.ts`)**: Manages agent configurations

**Routing:**
- Hono router with OpenAPI schema generation
- Routes: `/session`, `/pty`, `/tool`, `/config`, `/project`, etc.

**Request Lifecycle:**
1. Client sends request → Hono middleware
2. Auth check (if password set)
3. Instance resolution (directory-based scoping)
4. Route handler execution
5. Response (JSON or SSE stream)

### C) Runtime Layer

**Tool Runner:**
- Registry of 44+ tools in `src/tool/`
- Tool execution with permission checks
- Sandboxed file and command execution

**Subagent Spawning:**
- Agents can spawn other agents (e.g., "explore" agent)
- Separate permission scopes per agent

**Streaming:**
- SSE for event streams (`/global/event`, `/session/:id/stream`)
- WebSocket for terminals (`/pty/:id/connect`)

**Persistence:**
- Local SQLite (via `storage/`)
- File-based logs in `./logs/`

---

## 5) Data Layers (Deep)

### Data Sources

| Layer | Storage | Schema | Lifecycle |
|-------|---------|--------|-----------|
| **Sessions** | SQLite (`.opencode/state/`) | `Session.Info` | Persistent |
| **Messages** | SQLite | `MessageV2` | Per-session |
| **Config** | JSON (`~/.opencode/config.json`) | `Config.Info` | Global |
| **Projects** | File-based metadata | `Project.Info` | Per-directory |
| **PTY Sessions** | In-memory | `Pty.Info` | Ephemeral |
| **File Cache** | In-memory | File content buffers | Ephemeral |
| **Logs** | File (`./logs/`) | Structured JSON | Persistent |

### Responsible Modules

- **Storage Layer**: `src/storage/storage.ts`
- **Session Management**: `src/session/index.ts`
- **Project State**: `src/project/project.ts`
- **Config Management**: `src/config/config.ts`

### Read/Write Paths

**Session Creation:**
```typescript
POST /session → Session.create() → SQLite INSERT → Returns sessionID
```

**Message Append:**
```typescript
POST /session/:id/message → Session.append() → SQLite INSERT → Bus.publish(event)
```

**Config Update:**
```typescript
PATCH /config → Config.update() → Write JSON file → Reload in-memory cache
```

---

## 6) Backend Architecture — Deep Explanation

### Server Framework: **Hono**

**File:** `packages/opencode/src/server/server.ts` (2996 lines, 98KB)

### Routing System

**Major Endpoint Categories:**

1. **Health & Events**
   - `GET /global/health` - Health check
   - `GET /global/event` - SSE stream for global events

2. **Session Management**
   - `GET /session` - List sessions (with filters)
   - `GET /session/:sessionID` - Get session info
   - `POST /session` - Create new session
   - `POST /session/:sessionID/message` - Append message
   - `POST /session/:sessionID/abort` - Abort running session
   - `GET /session/:sessionID/stream` - SSE stream for session events

3. **Terminal (PTY)**
   - `GET /pty` - List terminals
   - `POST /pty` - Create terminal
   - `GET /pty/:ptyID/connect` - WebSocket connection

4. **Tools**
   - `GET /experimental/tool/ids` - List tool IDs
   - `GET /experimental/tool` - Get tool schemas

5. **Project & Files**
   - `GET /vcs` - Git branch info
   - `GET /project` - Project metadata
   - `/project/*` - Project-specific routes

### Middleware Pipeline

```javascript
app
  .onError(errorHandler)              // 1. Global error handling
  .use(basicAuthIfPasswordSet)        // 2. Optional basic auth
  .use(requestLogger)                 // 3. Request logging
  .use(corsMiddleware)                // 4. CORS (localhost, tauri)
  .use(directoryResolver)             // 5. Resolve project directory
  .use(validator)                     // 6. Zod schema validation
```

### API Endpoints (Key Routes)

**Session Stream Endpoint:**
```typescript
// File: server/server.ts, lines ~1400-1500
GET /session/:sessionID/stream
→ streamSSE((stream) => {
  Bus.on("session.event", (event) => {
    stream.writeSSE({ data: JSON.stringify(event) })
  })
})
```

**Message Creation:**
```typescript
// File: server/server.ts
POST /session/:sessionID/message
→ SessionPrompt.prompt({ sessionID, parts })
→ Returns messageID
```

### Streaming Endpoint Mechanics

**SSE (Server-Sent Events):**
- Used for: Session events, agent thinking, tool execution status
- Format: `data: {type, payload}\n\n`
- Heartbeat every 30s to prevent timeout
- Client auto-reconnects on failure

**WebSocket:**
- Used for: Terminal I/O
- Bidirectional communication
- Binary-safe (terminal escape codes)

### Error Handling & Retries

**Error Middleware:**
```typescript
.onError((err, c) => {
  if (err instanceof NamedError) {
    return c.json(err.toObject(), { status: getStatusCode(err) })
  }
  return c.json({ error: err.message }, { status: 500 })
})
```

**Retries:** Handled in session/retry.ts via exponential backoff

### Tool Execution Flow

```
User Message → SessionPrompt.prompt()
              ↓
          Session LLM Loop
              ↓
       Tool Calls Generated
              ↓
        ToolRegistry.execute()
              ↓
       Permission Check
              ↓
      Tool Implementation
              ↓
       Result to LLM
              ↓
     Final Response
```

---

## 7) Frontend Architecture — Deep Explanation

### UI Framework: **SolidJS**

**Why SolidJS?**
- Fine-grained reactivity (no virtual DOM)
- Excellent performance for real-time updates
- Similar API to React but faster

### Routing

**Router:** `@solidjs/router`

**Routes:**
```typescript
// Defined in: packages/app/src/app.tsx
<Route path="/:dir?" component={Layout}>
  <Route path="/" component={Home} />
  <Route path="/session/:id?" component={Session} />
</Route>
```

### Chat Interface Construction

**Main Component:** `packages/app/src/pages/session.tsx` (1734 lines!)

**Component Hierarchy:**
```
Session Page
├── SessionHeader (top bar)
├── PromptInput (bottom input)
├── SessionTurns (message list)
│   └── For each UserMessage:
│       ├── SessionTurn
│       ├── AgentFlowGraph (if expanded)
│       └── SessionMessageRail (tool outputs)
├── Tabs (file viewer, terminal)
│   ├── FileVisual
│   ├── Terminal
│   └── SessionReview (diff viewer)
└── ActionDashboard (for ShopOS integration)
    ├── ActionCard
    ├── ProgressTracker
    └── ResultsView
```

### Message Storage & Rendering

**Data Flow:**
```
Backend SSE → SyncContext → Signal Update → UI Re-render
```

**Storage:**
```typescript
// In SyncContext (context/sync.tsx)
const [store, setStore] = createStore({
  message: {} as Record<sessionID, Message[]>,
  session_status: {} as Record<sessionID, Status>,
  session_diff: {} as Record<sessionID, FileDiff[]>
})
```

**Rendering:**
```typescript
// In Session component
const messages = createMemo(() => 
  params.id ? (sync.data.message[params.id] ?? []) : []
)

<For each={messages()}>
  {(msg) => <SessionTurn message={msg} />}
</For>
```

### Thinking/Typing Animation

**Implementation:**
```typescript
// Status indicator shows "thinking" when status.type === "running"
const status = createMemo(() => 
  sync.data.session_status[params.id ?? ""] ?? { type: "idle" }
)

{status().type === "running" && <ThinkingIndicator />}
```

### Token Streaming Updates

**SSE Connection:**
```typescript
// In SyncContext
const eventSource = new EventSource(`/session/${id}/stream`)
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  if (data.type === "message.delta") {
    // Append token to message
    setStore("message", id, (msgs) => 
      appendToken(msgs, data.messageID, data.delta)
    )
  }
}
```

### Markdown/Code Block Rendering

**Library:** `marked` + `shiki` (syntax highlighting)

**Component:** `@opencode-ai/ui/session-turn`

### State Management

**Pattern:** Context providers + Solid signals

**Key Contexts:**
- `SDKContext` - API client wrapper
- `SyncContext` - Real-time data sync
- `PromptContext` - Input state
- `FileContext` - File viewer state
- `TerminalContext` - Terminal state
- `PermissionContext` - Permission handling

---

## 8) Prompt Lifecycle — FULL TRACE

### Step-by-Step Flow

**1. User Input Capture**

**File:** `packages/app/src/components/prompt-input.tsx`

```typescript
const handleSubmit = async () => {
  const prompt = extractPromptFromParts(parts())
  await sdk.client.session.message({
    sessionID,
    parts: parts()
  })
}
```

**2. Prompt Object Creation**

**File:** `packages/opencode/src/session/prompt.ts`

```typescript
export namespace SessionPrompt {
  export async function prompt(input: {
    sessionID: string
    parts: Part[]
  }) {
    // Build full prompt with system + user + tools
    const messages = await buildMessages(input)
    // Invoke LLM
    await invokeGenerate({
      sessionID: input.sessionID,
      messages
    })
  }
}
```

**3. Prompt Assembly**

**System Prompt Injection:**
```typescript
// File: session/system.ts
const systemMessages = [
  SystemPrompt.header(providerID),  // Provider-specific instructions
  agent.prompt,                      // Agent-specific prompt
  toolDescriptions,                  // Available tools
  projectContext                     // Codebase context
]
```

**4. Dispatch to Agent Runtime**

**File:** `session/llm.ts`

```typescript
const result = await generateText({
  model: provider.getLanguageModel(),
  messages: [
    ...systemMessages.map(s => ({ role: "system", content: s })),
    ...conversationHistory,
    { role: "user", content: userPrompt }
  ],
  tools: ToolRegistry.getToolsForProvider(providerID),
  maxSteps: agent.steps ?? 25
})
```

**5. Tool Execution**

```typescript
// AI SDK handles tool calling
onStepFinish: async ({ toolCalls }) => {
  for (const toolCall of toolCalls) {
    const result = await ToolRegistry.execute(toolCall.toolName, toolCall.args)
    // Result fed back to LLM
  }
}
```

**6. Response Collection**

```typescript
onChunk: ({ chunk }) => {
  Bus.publish("message.delta", {
    sessionID,
    messageID,
    delta: chunk.text
  })
}
```

**7. Storage & Rendering**

```typescript
// Backend stores in SQLite
await Session.appendMessage({
  sessionID,
  role: "assistant",
  content: result.text
})

// Frontend receives via SSE and updates UI
```

### Prompt Templates

**Location:** `packages/opencode/src/agent/prompt/*.txt`

**Example (Build Agent):**
```
You are a helpful software development agent...
Current directory: {directory}
Available tools: {tools}
```

### Memory Injection

**Conversation History:**
- Last N messages included in context
- Compaction when token limit approached
- Summary injection for long sessions

### Tool Specs Injection

```typescript
const tools = await ToolRegistry.tools(providerID)
// Converts to JSON Schema for LLM
const toolSchemas = tools.map(t => zodToJsonSchema(t.parameters))
```

---

## 9) Agent System — How it ACTUALLY Works

### Base Agent Abstraction

**File:** `packages/opencode/src/agent/agent.ts`

**Agent Definition:**
```typescript
interface Agent {
  name: string                    // e.g., "build", "explore"
  mode: "primary" | "subagent"    // Can be used alone or spawned
  permission: PermissionRuleset   // Tool access rules
  prompt?: string                 // System prompt override
  model?: { providerID, modelID } // Model override
  steps?: number                  // Max iteration count
}
```

### Built-in Agents

| Agent | Purpose | Tools |
|-------|---------|-------|
| `build` | Primary dev agent | All tools |
| `plan` | Planning agent | Limited to .opencode/plans/ |
| `general` | Multi-step tasks | All except todos |
| `explore` | Codebase search | grep, glob, list, read only |
| `compaction` | Session summarization | None (LLM only) |
| `title` | Generate titles | None |

### Agent Loop (Think → Act → Observe)

```typescript
// Implemented via Vercel AI SDK's maxSteps
async function agentLoop() {
  let step = 0
  while (step < maxSteps) {
    // THINK: Generate next action
    const action = await llm.generate({ messages, tools })
    
    // ACT: Execute tool calls
    if (action.toolCalls) {
      const results = await executeTools(action.toolCalls)
      messages.push({ role: "tool", results })
    }
    
    // OBSERVE: Check if done
    if (action.finish Reason === "stop") break
    
    step++
  }
}
```

### Tool Selection

**LLM-driven:** Model chooses tools based on:
- Available tool schemas (from `ToolRegistry`)
- User request
- Permission constraints

### Model Provider Configuration

**File:** `src/provider/provider.ts`

Supports:
- OpenAI, Anthropic, Google, AWS Bedrock, Azure
- OpenRouter, Groq, DeepInfra, Together AI
- Custom OpenAI-compatible endpoints

### Retries & Failures

**File:** `src/session/retry.ts`

```typescript
const result = await retry({
  maxAttempts: 3,
  backoff: "exponential",
  onError: (err) => Bus.publish("session.error", { error: err })
}, async () => {
  return await llm.generate(...)
})
```

### Termination Condition

**Agent finishes when:**
1. LLM outputs final text (no more tool calls)
2. Max steps reached (default: 25)
3. User aborts (`/session/:id/abort`)
4. Unrecoverable error occurs

**Core Function:**
```typescript
// In session/llm.ts
if (result.finishReason === "stop" || result.finishReason === "length") {
  Bus.publish("session.complete", { sessionID })
}
```

---

## 10) Sub-Agent Spawning — Mechanism + Lifecycle

### Creation Function

**File:** `src/tool/subagent.ts` (inferred - not directly viewed but referenced)

**How Sub-Agents Are Created:**

```typescript
// When LLM calls the "subagent" tool
const result = await ToolRegistry.execute("run_subagent", {
  agent: "explore",
  prompt: "Find all API endpoints",
  context: {...}
})
```

### Context Passed to Sub-Agent

```typescript
{
  parentSessionID: string,
  agent: string,              // e.g., "explore"
  prompt: string,             // Sub-task description
  permission: PermissionRuleset, // Inherited + restricted
  directory: string           // Same working directory
}
```

### Isolation

**Memory:** Sub-agent has own conversation history (doesn't see parent's)

**Tool Scope:** Limited by agent permissions (e.g., "explore" can't write files)

**Execution:** Synchronous - parent waits for sub-agent to complete

### Parallelism

**Current Implementation:** Sequential (one sub-agent at a time)

**Concurrency Model:** Could be parallelized via `Promise.all()` but not currently done

### Response Merging

```typescript
// Sub-agent result returned as tool output
{
  toolCallID: "call_123",
  toolName: "run_subagent",
  result: {
    output: "Found 15 API endpoints...",
    files: ["src/api/routes.ts"]
  }
}
// LLM processes this in next step
```

---

## 11) "Thinking UI" — Where That Comes From

### Event Stream Shape

**SSE Event Types:**

```typescript
{
  type: "session.status",
  properties: {
    type: "running" | "idle",
    step?: number,
    thought?: string
  }
}

{
  type: "message.delta",
  properties: {
    messageID: string,
    delta: string  // Streaming text
  }
}

{
  type: "tool.start",
  properties: {
    toolName: string,
    args: object
  }
}
```

### UI Update Logic

**File:** `packages/app/src/context/sync.tsx`

```typescript
eventSource.onmessage = (event) => {
  const { type, properties } = JSON.parse(event.data)
  
  switch (type) {
    case "session.status":
      setStore("session_status", sessionID, properties)
      break
    case "message.delta":
      appendTextChunk(properties.messageID, properties.delta)
      break
    case "tool.start":
      showToolExecution(properties.toolName)
      break
  }
}
```

### Partial Messages

```typescript
// Streamed incrementally
"Analyzing..." → "Analyzing the..." → "Analyzing the codebase..."
```

### Streaming Tokens

**Visual Effect:**
- Text appears character-by-character
- Cursor blinks at end
- Auto-scroll follows

### Tool Execution Status

**Component:** `packages/app/src/components/dashboard/progress-tracker.tsx`

```typescript
<For each={steps()}>
  {(step) => (
    <div class={step.status}>
      {step.status === "in-progress" && <Spinner />}
      {step.status === "completed" && <CheckIcon />}
      {step.description}
    </div>
  )}
</For>
```

---

## 12) Execution Completion Guarantee

### Ensuring Tool Execution Finishes

**File:** `src/tool/registry.ts`

```typescript
async execute(toolName: string, args: object) {
  const timeout = setTimeout(() => {
    throw new Error(`Tool ${toolName} timed out`)
  }, 300000) // 5 min max
  
  try {
    const result = await tool.handler(args)
    return result
  } finally {
    clearTimeout(timeout)
  }
}
```

### Request Hang Prevention

**SSE Heartbeat:**
```typescript
setInterval(() => {
  stream.writeSSE({
    data: JSON.stringify({ type: "heartbeat" })
  })
}, 30000) // Every 30s
```

### Long-Running Tasks

**Pattern:** Background execution + status polling

```typescript
// For operations > 5min
POST /task → Returns taskID immediately
GET /task/:id/status → Poll for completion
```

### Partial Failure Management

**Tool Execution:**
```typescript
try {
  const results = await Promise.allSettled(toolCalls.map(execute))
  // Continue with successful results
} catch (err) {
  // Log error but don't halt session
  Bus.publish("tool.error", { error: err })
}
```

### Cancellation/Abort

**Endpoint:** `POST /session/:sessionID/abort`

```typescript
export async function abort(sessionID: string) {
  const controller = abortControllers.get(sessionID)
  if (controller) {
    controller.abort()
    abortControllers.delete(sessionID)
  }
}
```

**Implementation:**
```typescript
const abortController = new AbortController()
await generateText({
  model,
  messages,
  abortSignal: abortController.signal
})
```

### Timeouts

**Default Timeouts:**
- Tool execution: 5 minutes
- LLM generation: 10 minutes
- Session total: None (can run indefinitely)

### Cleanup Logic

```typescript
// On process exit
process.on("SIGTERM", async () => {
  await Instance.disposeAll()
  await closeDatabaseConnections()
  process.exit(0)
})
```

---

_Document continues in Part 2..._
