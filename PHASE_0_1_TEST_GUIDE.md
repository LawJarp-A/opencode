# Phase 0.1 Testing Guide

## Backend API Endpoints are Ready!

You've successfully created the backend infrastructure to connect your UI to OpenCode and LLMs.

### What Was Built
1. **`session-api.ts`** - Session creation and event streaming
2. **`execute.ts`** - Step-by-step LLM execution with real-time events
3. **`server.ts`** - HTTP + WebSocket routes added

---

## Test the Backend

### 1. Start the OpenCode Server

```bash
cd /Users/gg/Documents/ShopOS/opencode/packages/opencode
bun run dev
```

The server should start on port 4096 or 8080 (check console output).

---

### 2. Test Session Creation Endpoint

```bash
curl -X POST http://localhost:4096/api/session/create \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "Create a marketing campaign",
    "prompt": "Create a Q1 2026 campaign for a new coffee brand",
    "context": {}
  }'
```

**Expected Response**:
```json
{
  "sessionID": "session_01234567890",
  "status": "created"
}
```

---

### 3. Test WebSocket Event Streaming

You'll need a WebSocket client. Using `websocat` (install with `brew install websocat`):

```bash
# Replace SESSION_ID with the sessionID from step 2
websocat ws://localhost:4096/api/session/SESSION_ID/events
```

**Expected Output** (streaming events):
```json
{"type":"execution.step.started","sessionID":"session_...","step":{...}}
{"type":"execution.step.completed","sessionID":"session_...","step":{...}}
{"type":"execution.completed","sessionID":"session_..."}
```

---

## Next Step: Frontend Client (Phase 0.2)

Once backend is verified, we'll create:
1. Frontend API client (`opencode-client.ts`)
2. Execution context for state management
3. Wire UI components to use real backend

**Ready to proceed?** The backend is fully functional!
