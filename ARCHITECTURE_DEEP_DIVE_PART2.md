# OpenCode Architecture Deep-Dive: Part 2

_Continued from Part 1..._

---

## 13) Observability + Debugging

### Logs

**Backend Logging System:**

**File:** `packages/opencode/src/util/log.ts`

```typescript
export namespace Log {
  export function create({ service }: { service: string }) {
    return {
      info(message: string, data?: object),
      error(message: string, data?: object),
      debug(message: string, data?: object),
      time(message: string, data?: object) // Returns timer
    }
  }
}
```

**Log Locations:**
- **Console:** STDERR (structured JSON)
- **File:** `./logs/opencode_TIMESTAMP.log`
- **Format:** Newline-delimited JSON (NDJSON)

**Example log entry:**
```json
{
  "level": "INFO",
  "service": "server",
  "message": "request",
  "method": "POST",
  "path": "/session/abc123/message",
  "timestamp": "2026-01-16T00:44:25.123Z"
}
```

### Traces

**Vercel AI SDK Telemetry:**
```typescript
// Experimental OpenTelemetry support
experimental_telemetry: {
  isEnabled: config.experimental?.openTelemetry,
 metadata: {
    userId: config.username
  }
}
```

### Telemetry Hooks

**Not currently implemented** - but hooks exist for:
- Request duration tracking
- Tool execution timing
- LLM token usage
- Error rates

### Debugging Config

**Enable Debug Mode:**
```bash
# Set log level
bun run dev --log-level DEBUG

# Print logs to console
bun run dev --print-logs
```

**Frontend Debug:**
```javascript
// In browser console
localStorage.setItem("debug", "*")
// Then refresh page
```

### Dev Tools

**Backend:**
- `--print-logs` flag for verbose output
- `why-is-node-running` package for leak detection
- TypeScript source maps enabled

**Frontend:**
- Solid DevTools browser extension
- Vite HMR (Hot Module Replacement)
- React Query DevTools (if using)

---

## 14) Security / Sandbox Model

### Tool Runner Sandboxing

**File System Access Boundaries:**

```typescript
// Permission system checks every file operation
const allowed = await Permission.check({
  action: "read",
  path: "/path/to/file",
  agent: "build"
})

if (!allowed) {
  throw new PermissionDeniedError()
}
```

**Restrictions:**
- External directory access requires explicit permission
- `.env` files default to "ask" permission
- Agent-specific tool restrictions (e.g., "explore" can't write)

### Command Execution Constraints

**PTY (Terminal) Execution:**
- Runs in user's shell (no additional sandboxing)
- CWD limited to project directory
- No sudo/elevated privileges by default

**Tool `bash` command:**
- Timeout: 5 minutes
- Can be restricted by agent permissions
- Output captured and returned to LLM

### Prompt Injection Risk Mitigations

**Current Protections:**
1. **System Prompt Prefix:** Hard-coded instructions that user can't override
2. **Tool Schema Validation:** Zod ensures only valid tool calls
3. **Permission System:** Multi-layer approval for sensitive operations

**Potential Risks:**
- User can craft prompts to trick agent into unintended actions
- No content filtering on LLM responses
- File read operations could leak sensitive data to LLM

**Recommendations:**
- Review permission rules in `~/.opencode/config.json`
- Use "ask" mode for sensitive operations
- Don't run on untrusted codebases

---

## 15) Dependency Graph (The 20 Most Important Modules)

### Top 20 Critical Dependencies

| Rank | Module | Purpose | Key Exports |
|------|--------|---------|-------------|
| **1** | `hono` | HTTP server framework | `Hono`, `Context` |
| **2** | `ai` (Vercel AI SDK) | Unified LLM interface | `generateText`, `streamText` |
| **3** | `zod` | Schema validation | `z`, `ZodSchema` |
| **4** | `solid-js` | Frontend reactivity | `createSignal`, `createMemo` |
| **5** | `@solidjs/router` | Frontend routing | `Router`, `Route`, `useNavigate` |
| **6** | `yargs` | CLI argument parsing | `yargs` |
| **7** | `@modelcontextprotocol/sdk` | MCP server integration | `Client`, `Server` |
| **8** | `@ai-sdk/openai` | OpenAI provider | `openai()` |
| **9** | `@ai-sdk/anthropic` | Anthropic provider | `anthropic()` |
| **10** | `vite` | Frontend build tool | `createServer`, `build` |
| **11** | `bun-pty` | Terminal emulation | `spawn`, `resize` |
| **12** | ` @parcel/watcher` | File system watching | `subscribe` |
| **13** | `remeda` | Utility functions | `pipe`, `sortBy`,`filter` |
| **14** | `chokidar` | File watching | `watch` |
| **15** | `marked` | Markdown parsing | `marked.parse` |
| **16** | `shiki` | Syntax highlighting | `getHighlighter` |
| **17** | `diff` | Text diffing | `diffLines`, `diffChars` |
| **18** | `web-tree-sitter` | Code parsing | `Parser`, `Language` |
| **19** | `clipboardy` | Clipboard access | `read`, `write` |
| **20** | `fuzzysort` | Fuzzy search | `go`, `highlight` |

### Module Details

#### 1. **hono** - HTTP Server
**Path:** `node_modules/hono`  
**Why Critical:** Powers entire backend API  
**Key Functions:**
- `app.get()`, `app.post()` - Route registration
- `stream()`, `streamSSE()` - Streaming responses
- `cors()`, `basicAuth()` - Middleware

#### 2. **Vercel AI SDK** - LLM Abstraction
**Path:** `node_modules/ai`  
**Why Critical:** Handles all LLM interactions  
**Key Functions:**
- `generateText()` - Main agent loop
- `streamText()` - Streaming responses
- `generateObject()` - Structured output

#### 3. **zod** - Type Safety
**Path:** `node_modules/zod`  
**Why Critical:** API contract validation, prevents runtime errors  
**Key Functions:**
- `z.object()`, `z.string()` - Schema builders
- `.parse()` - Validation
- `zodToJsonSchema()` - LLM tool specs

#### 4. **solid-js** - Frontend Reactivity
**Path:** `node_modules/solid-js`  
**Why Critical:** UI rendering and state management  
**Key Functions:**
- `createSignal()` - Reactive state
- `createMemo()` - Derived state
- `createEffect()` - Side effects

#### 5. **@solidjs/router** - Routing
**Path:** `node_modules/@solidjs/router`  
**Why Critical:** Page navigation  
**Key Functions:**
- `<Router>`, `<Route>` - Route definition
- `useNavigate()`, `useParams()` - Navigation hooks

---

## 16) End-to-End Flow Diagram (Text-Based)

### Complete User Journey: Prompt → Response

```
┌─────────────────────────────────────────────────────────────────┐
│ USER ACTION: Types "Add a login page" in PromptInput            │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: PromptInput.tsx                                        │
│ • Captures input text + any file/context attachments            │
│ • Constructs parts array                                         │
│ • Calls: sdk.client.session.message({ sessionID, parts })       │
└────────────────┬────────────────────────────────────────────────┘
                 │ HTTP POST /session/:id/message
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND: server.ts (route handler)                              │
│ • Validates request with Zod schema                             │
│ • Extracts sessionID and message parts                          │
│ • Calls: SessionPrompt.prompt({ sessionID, parts })              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ SESSION: prompt.ts                                               │
│ • Creates new message ID                                         │
│ • Appends user message to session history (SQLite)              │
│ • Publishes event: Bus.publish("message.created", {...})        │
│ • Calls: Session.run({ sessionID, messageID })                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ SESSION: llm.ts (Agent execution)                                │
│ • Loads agent config (e.g., "build" agent)                      │
│ • Builds full prompt:                                            │
│   - System prompt (header + agent instructions)                 │
│   - Tool schemas (44+ tools converted to JSON Schema)           │
│   - Conversation history (last N messages)                      │
│   - User message ("Add a login page")                           │
│ • Calls: generateText() from Vercel AI SDK                      │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ LLM PROVIDER: OpenAI/Anthropic/etc (via AI SDK)                 │
│ • Sends prompt to model API                                      │
│ • Streams tokens back                                            │
│ • Returns tool calls when needed                                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
      ┌──────────┴──────────┬──────────────┐
      │                     │              │
      ▼                     ▼              ▼
┌──────────┐        ┌──────────────┐   ┌──────────────┐
│ STREAM   │        │ TOOL CALL    │   │ FINAL TEXT   │
│ TOKENS   │        │ EXECUTION    │   │ RESPONSE     │
└──────────┘        └──────────────┘   └──────────────┘
      │                     │              │
      │                     ▼              │
      │            ┌──────────────────────────────┐
      │            │ TOOL: ToolRegistry.execute() │
      │            │ • Permission check            │
      │            │ • Execute tool (e.g., write   │
      │            │   file, run command)          │
      │            │ • Return result to LLM        │
      │            └──────────────────────────────┘
      │                     │              │
      │                     ▼              │
      │            ┌──────────────────────────────┐
      │            │ LLM: Process tool result     │
      │            │ • Continues thinking          │
      │            │ • May call more tools         │
      │            │ • Eventually produces final   │
      │            │   text response               │
      │            └──────────────────────────────┘
      │                     │              │
      └──────────┬──────────┴──────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ BUS EVENTS: Each step publishes events                          │
│ • "message.delta" (tokens: "Creating", "login", "page...")     │
│ • "tool.start" (tool: "write_to_file")                          │
│ • "tool.end" (result: "File created")                           │
│ • "session.complete" (when done)                                 │
└────────────────┬────────────────────────────────────────────────┘
                 │ SSE streams to frontend
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: SyncContext (SSE listener)                             │
│ • Receives events from GET /session/:id/stream                  │
│ • Updates Solid signals:                                         │
│   setStore("message", sessionID, (msgs) => appendToken(...))    │
│ • Triggers reactive UI updates                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ UI RENDER: Session.tsx → SessionTurn component                  │
│ • Displays streamed message with typing effect                  │
│ • Shows tool executions in timeline                              │
│ • Renders final markdown/code blocks with syntax highlighting   │
│ • Auto-scrolls to bottom                                         │
└ ────────────────────────────────────────────────────────────────┘
                 │
                 ▼
        ✅ USER SEES RESPONSE!
```

### Intermediary Steps Detail

**Step 1: Input Capture**
- Component: `PromptInput.tsx`
- State: `prompt.parts` (array of text/file/image parts)

**Step 2: API Call**
- HTTP: `POST /session/:id/message`
- Body: `{ parts: [...] }`

**Step 3: Prompt Assembly**
- Module: `session/prompt.ts`
- Creates: Full prompt with system + user + tools

**Step 4: LLM Invocation**
- Module: `session/llm.ts`
- SDK: `ai.generateText()`

**Step 5: Streaming**
- Protocol: SSE
- Events: message.delta, tool.start, tool.end

**Step 6: UI Update**
- Context: `SyncContext`
- Reactivity: Solid signals trigger re-render

---

## 17) "If I Want to Modify It" — Practical Advice

### How to Add a New Tool

**1. Create tool file:**
```typescript
// packages/opencode/src/tool/my-new-tool.ts
import { Tool } from "./tool"
import z from "zod"

export const MyNewTool = Tool({
  id: "my_new_tool",
  description: "Does something useful",
  parameters: z.object({
    input: z.string().describe("The input parameter")
  }),
  handler: async ({ input, context }) => {
    // Your tool logic here
    const result = await doSomething(input)
    return { output: result }
  }
})
```

**2. Register in tool registry:**
```typescript
// packages/opencode/src/tool/registry.ts
import { MyNewTool } from "./my-new-tool"

export namespace ToolRegistry {
  const tools = [
    // ... existing tools
    MyNewTool,
  ]
}
```

**3. Test it:**
```bash
cd packages/opencode
bun test src/tool/my-new-tool.test.ts
```

### How to Add a New Agent Type

**1. Define agent in config:**
```typescript
// packages/opencode/src/agent/agent.ts
// In the state() function, add:

researcher: {
  name: "researcher",
  description: "Research agent specialized in gathering information",
  mode: "subagent",
  permission: PermissionNext.fromConfig({
    "*": "deny",
    "webfetch": "allow",
    "websearch": "allow",
    "read": "allow"
  }),
  prompt: PROMPT_RESEARCHER, // Create this file
  options: {},
  native: true
}
```

**2. Create system prompt:**
```
// packages/opencode/src/agent/prompt/researcher.txt
You are a research agent...
Your goal is to gather accurate information...
```

**3. Use the agent:**
```typescript
// In code or via API
sdk.client.session.message({
  sessionID,
  parts: [{ type: "text", text: "Research topic X" }],
  agent: "researcher"
})
```

### How to Change Routing Behavior

**Backend route modification:**
```typescript
// packages/opencode/src/server/server.ts
// Add a new route:

.get("/my-new-route", async (c) => {
  const data = await fetchMyData()
  return c.json(data)
})
```

**Frontend route modification:**
```tsx
// packages/app/src/app.tsx
<Router>
  <Route path="/:dir?" component={Layout}>
    <Route path="/" component={Home} />
    <Route path="/session/:id?" component={Session} />
    <Route path="/my-page" component={MyNewPage} /> {/* NEW */}
  </Route>
</Router>
```

### How to Change Prompt Format

**Modify system prompt:**
```typescript
// packages/opencode/src/session/system.ts
export namespace SystemPrompt {
  export function header(providerID: string): string[] {
    return [
      "You are OpenCode AI Assistant.", // Customize this
      `Current time: ${new Date().toISOString()}`,
      // Add more context here
    ]
  }
}
```

**Agent-specific prompt:**
```
// packages/opencode/src/agent/prompt/build.txt
You are a helpful software development agent.

# NEW INSTRUCTION
Always explain your reasoning before taking action.
```

### How to Change UI Message Rendering

**Customize message component:**
```tsx
// packages/ui/src/session-turn.tsx (or packages/app/src/components/)
export function SessionTurn(props: { message: Message }) {
  return (
    <div class="message">
      {/* Add custom styling */}
      <div class="avatar">🤖</div>
      <div class="content">
        {/* Modify markdown rendering */}
        <Markdown content={props.message.content} />
      </div>
    </div>
  )
}
```

**Change streaming animation:**
```tsx
// In SessionTurn or similar:
<Show when={isStreaming()}>
  <span class="typing-cursor animate-blink">▊</span>
</Show>
```

---

## 18) Key Insights & Gotchas

### Performance Considerations

1. **SSE Connection Limits:**
   - Browsers limit concurrent SSE connections (~6 per domain)
   - Solution: Use single global event stream + session-specific streams

2. **Large Message History:**
   - LLM context limits (~200k tokens)
   - Compaction automatically triggered when near limit
   - Older messages summarized to save tokens

3. **File Watching:**
   - `@parcel/watcher` is CPU-intensive on large repos
   - Configured to ignore `node_modules/`, `.git/`, etc.

### Common Pitfalls

1. **Permission Denials:**
   - Check `~/.opencode/config.json` for permission rules
   - Use `"*": "allow"` for dev, restrict for prod

2. **Model Selection:**
   - Not all providers support all features (e.g., vision, function calling)
   - Check provider capabilities in `src/provider/`

3. **SSE Disconnects:**
   - Mobile browsers aggressively close background connections
   - Heartbeat every 30s helps but not foolproof

### Extension Points

**Custom Tools:**
- Add to `src/tool/` with Zod schemas
- Auto-registered in `ToolRegistry`

**Custom Agents:**
- Define in config or `agent.ts`
- Can override model, permissions, prompts

**Custom UI Themes:**
- Modify Tailwind config in `packages/app/`
- Override CSS variables

**Plugin System:**
- `packages/plugin/` for extending functionality
- Can add custom commands, tools, UI components

---

## 19) Future Improvements & TODOs

### Identified Areas for Enhancement

1. **Streaming Protocol:**
   - Consider WebSocket instead of SSE for bidirectional
   - Add protocol versioning

2. **Agent Isolation:**
   - Better sandboxing for sub-agents
   - Resource limits (CPU, memory)

3. **Caching:**
   - Cache LLM responses for repeated prompts
   - Tool output caching

4. **Testing:**
   - E2E tests for agent workflows
   - UI component tests

5. **Observability:**
   - OpenTelemetry integration
   - Metrics dashboard

---

## 20) Quick Reference Card

### Essential Commands

```bash
# Start dev environment
./dev.sh                          # Both frontend + backend
cd packages/opencode && bun run dev  # Backend only
cd packages/app && npm run dev    # Frontend only

# Build for production
bun run build

# Run tests
bun test

# View logs
tail -f logs/opencode_*.log

# Access API docs
open http://localhost:4096/doc
```

### Key Files to Edit

| Task | File |
|------|------|
| Add API route | `packages/opencode/src/server/server.ts` |
| Add tool | `packages/opencode/src/tool/my-tool.ts` |
| Modify agent | `packages/opencode/src/agent/agent.ts` |
| Change UI | `packages/app/src/pages/session.tsx` |
| Add frontend page | `packages/app/src/app.tsx` |
| Modify system prompt | `packages/opencode/src/session/system.ts` |

### Debugging Commands

```bash
# Enable debug logs
bun run dev --log-level DEBUG --print-logs

# Check tool registry
curl http://localhost:4096/experimental/tool/ids

# View session status
curl http://localhost:4096/session/status

# Health check
curl http://localhost:4096/global/health
```

### Project Structure At-a-Glance

```
opencode/
├── packages/
│   ├── opencode/     # 🔥 Backend (Hono + AI SDK)
│   │   └── src/
│   │       ├── index.ts       # CLI entry
│   │       ├── server/        # HTTP server
│   │       ├── agent/         # Agent configs
│   │       ├── session/       # Execution engine
│   │       ├── tool/          # Tool implementations
│   │       └── provider/      # AI providers
│   │
│   ├── app/          # 🎨 Frontend (SolidJS + Vite)
│   │   └── src/
│   │       ├── pages/         # Routes
│   │       ├── components/    # UI components
│   │       └── context/       # State management
│   │
│   └── ui/           # Shared components
│
├── dev.sh            # Dev script
└── package.json      # Monorepo root
```

---

## Conclusion

This OpenCode system is a sophisticated AI-powered development tool that combines:

- **CLI-first design** with web UI
- **Streaming architecture** for real-time updates
- **Agent-based execution** with tool calling
- **Modular structure** for easy extension
- **Type-safe contracts** via Zod
- **Modern stack** (Bun, Hono, SolidJS, Vite)

The architecture is well-suited for:
- ✅ Conversational software development
- ✅ Multi-step task automation
- ✅ Code generation and modification
- ✅ Codebase exploration and analysis

**Total Lines Analyzed:** ~5,000+ lines of core code  
**Key Insights:** 12 major subsystems mapped  
**Documentation Created:** 2-part comprehensive guide

---

**End of Architecture Deep-Dive**  
**Generated:** 2026-01-16 00:44:00 IST  
**For:** Complete understanding and extension of OpenCode system
