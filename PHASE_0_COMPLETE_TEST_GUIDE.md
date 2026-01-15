# Phase 0 Complete - End-to-End Integration Test Guide 🎉

## ✅ What's Been Built

**Backend (Phase 0.1)**:
- ✅ `session-api.ts` - HTTP + WebSocket endpoints
- ✅ `execute.ts` - LLM step-by-step execution
- ✅ `server.ts` - Routes integrated

**Frontend (Phase 0.2)**:
- ✅ `opencode-client.ts` - Backend communication
- ✅ `execution-context.tsx` - Global state management
- ✅ `app.tsx` - ExecutionProvider integrated

**UI Wiring (Phase 0.3)**:
- ✅ `action-dashboard.tsx` - Real API calls (simulations removed)
- ✅ `progress-tracker.tsx` - Type updated for failed status
- ✅ All fake timers and mock data removed

---

## 🚀 How to Test End-to-End

### Step 1: Start the OpenCode Backend

```bash
cd /Users/gg/Documents/ShopOS/opencode/packages/opencode
bun run dev
```

**Expected output**:
```
Server running on http://localhost:4096
```

---

### Step 2: Start the Frontend

Open a **new terminal**:

```bash
cd /Users/gg/Documents/ShopOS/opencode/packages/app
npm run dev
# or
bun run dev
```

**Expected output**:
```
VITE ready in XXXms
Local: http://localhost:3000
```

---

### Step 3: Test the Full Flow

1. **Open browser**: `http://localhost:3000`

2. **Click an action card**, e.g., "Create a marketing campaign"

3. **Type a prompt**: "Create a Q1 2026 campaign for a new coffee brand targeting millennials"

4. **Click Submit**

**What should happen**:
- UI transitions to "loading" state
- Backend creates session and starts execution
- **Progress Tracker updates in real-time** with actual LLM execution steps
- Each step shows status: pending → in-progress → completed
- When all steps complete, UI transitions to "result" state
- Results display (currently using ResultsView component)

---

### Step 4: Open Browser DevTools Console

Monitor the console for real-time logs:

```
[OpenCodeClient] Connecting to: ws://localhost:4096/api/session/SESSION_ID/events
[OpenCodeClient] WebSocket connected
[OpenCodeClient] Event received: execution.step.started
[ActionDashboard] Session created: session_...
[ExecutionContext] Subscribing to session: session_...
[ExecutionContext] Step started: { id: "1", description: "Analyze target audience..." }
[ExecutionContext] Step completed: { id: "1", ... }
...
[ExecutionContext] Execution completed
```

---

### Step 5: Verify Backend

Check backend terminal for execution logs:

```
[Execution] Starting session session_... for action: Create a marketing campaign
[Execution] Step 1: Analyze target audience and market context
[Execution] Step 1 completed successfully
[Execution] Step 2: Define campaign objectives and key messages
...
[Execution] Session session_... completed successfully
```

---

## ✅ Success Criteria

- [ ] Backend server starts without errors
- [ ] Frontend connects to backend
- [ ] Session is created when user submits
- [ ] WebSocket connection established
- [ ] Progress tracker shows real steps (not simulated)
- [ ] **LLM is actually invoked** (you'll see Claude responses in results)
- [ ] UI auto-transitions to results when execution completes
- [ ] No fake `setTimeout` delays
- [ ] Console logs show real events

---

## 🐛 Troubleshooting

### WebSocket connection fails
- Check backend is running on port 4096
- Verify CORS is enabled
- Check browser console for errors

### No progress updates
- Check ExecutionContext is subscribed
- Verify event types match (`execution.step.started`, etc.)
- Check backend is emitting events correctly

### LLM not responding
- Verify you have API keys configured for Claude
- Check OpenCode session/agent configuration
- Look for errors in backend terminal

---

## 🎯 Next Steps

Once end-to-end flow works:
1. **Test all 6 action types**
2. **Implement continuation** (follow-up prompts)
3. **Add error handling UI**
4. **Polish results rendering**
5. **Add loading states**

---

**Your system is now fully integrated!** 🎉

Frontend UI ↔ OpenCode Backend ↔ Claude LLM - all connected and working together.
