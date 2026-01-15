# Frontend-Backend Connection Debugging Guide

## ❌ Current Blocker: Node.js Version

**Issue**: Frontend won't start due to Node.js 18.17.0 (Vite needs 20.19+ or 22.12+)

### Fix Node Version Issue

```bash
# Check if nvm is installed
command -v nvm

# If not installed, install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Reload shell
source ~/.zshrc  # or source ~/.bashrc

# Install Node 22
nvm install 22

# Set as default
nvm alias default 22

# Verify
node --version  # Should show v22.x.x
```

---

## 🔍 Known Integration Issues & Fixes

Based on the code analysis, here are the likely issues and solutions:

### Issue 1: Backend URL Configuration

**Problem**: Frontend might be trying to connect to wrong backend URL

**Check**:
```typescript
// In opencode-client.ts
const BACKEND_URL = import.meta.env.VITE_OPENCODE_URL || 'http://localhost:4096'
```

**Solution**: Create `.env` file in `packages/app/`:
```bash
cd /Users/gg/Documents/ShopOS/opencode/packages/app
cat > .env << EOF
VITE_OPENCODE_URL=http://localhost:4096
EOF
```

---

### Issue 2: Backend Not Running HTTP Server

**Problem**: OpenCode's `bun run dev` starts TUI mode, not HTTP server

**Current Architecture**: The ShopOS app (`packages/app`) is designed to work with the OpenCode SDK embedded, not as a separate HTTP server.

**Solution**: The frontend app embeds the OpenCode runtime. When you run `npm run dev` in `packages/app`, it should:
1. Start Vite frontend
2. Automatically include OpenCode runtime
3. No separate backend needed for basic operations

**However**, our integration added API endpoints that create a separate backend server. We need to modify the approach.

---

### Issue 3: API Endpoints Not Exposed

**Problem**: We created `session-api.ts` but OpenCode might not expose HTTP endpoints unless explicitly configured.

**Check if server module exists**:
```bash
ls -la /Users/gg/Documents/ShopOS/opencode/packages/opencode/src/server/
```

**Solution**: The OpenCode server needs to be started in a specific mode. Let me check the actual server setup.

---

## 🔧 Debugging Steps (Once Node 22 is Installed)

### Step 1: Start Frontend Only

```bash
cd /Users/gg/Documents/ShopOS/opencode/packages/app
npm run dev
```

**Expected**: Frontend starts on `http://localhost:3000`

**Check browser console** for:
- Any error messages
- Network requests failing
- WebSocket connection attempts

---

### Step 2: Test Without Backend Integration

**Temporary fix** to isolate the issue:

1. Comment out the real API call in `action-dashboard.tsx`:
```typescript
// In handleSubmit, temporarily comment out:
// const sessionID = await client.createSession(...)
// execution.setSessionID(sessionID)

// And add:
console.log("Would create session with:", {
  actionType: currentAction()?.title,
  prompt: prompt.text()
})
setFlowState("executing")
```

2. This will show if the UI flow works without backend

---

### Step 3: Check Network Tab

When you click submit:

1. Open DevTools → Network tab
2. Click action → enter prompt → submit
3. Look for:
   - `POST /api/session/create` request
   - Response status (200, 404, 500, etc.)
   - Any CORS errors
   - WebSocket upgrade request

**Expected**:
- `POST http://localhost:4096/api/session/create` 
- Status: 200 OK
- Response: `{ sessionID: "...", status: "created" }`

**Likely Issues**:
- ❌ `ERR_CONNECTION_REFUSED` → Backend not running
- ❌ `404 Not Found` → Route not registered
- ❌ `CORS error` → CORS not configured
- ❌ `Network timeout` → Wrong URL

---

### Step 4: Test API Endpoints Manually

```bash
# Health check
curl http://localhost:4096/global/health

# Session create
curl -X POST http://localhost:4096/api/session/create \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "Test",
    "prompt": "Test prompt",
    "context": {}
  }'
```

**Expected responses**:
```json
// Health
{"healthy":true,"version":"local"}

// Session create
{"sessionID":"session_...","status":"created"}
```

---

### Step 5: Check WebSocket Connection

In browser console:
```javascript
const ws = new WebSocket('ws://localhost:4096/api/session/test123/events')
ws.onopen = () => console.log('WS Connected')
ws.onerror = (e) => console.error('WS Error:', e)
ws.onmessage = (e) => console.log('WS Message:', e.data)
```

---

## 🎯 Most Likely Root Cause

**The OpenCode backend wasn't designed to run as a standalone HTTP server for this integration.**

### Architecture Mismatch

**What we built**:
- Frontend calls `POST /api/session/create`
- Expects separate backend server running
- WebSocket for events

**What OpenCode actually does**:
- Runs as embedded runtime in the app
- Or runs as TUI for CLI usage
- Doesn't expose HTTP endpoints by default

### Solution Approaches

**Option A: Embed OpenCode in Frontend (Recommended)**
- Run everything in the frontend process
- Use OpenCode SDK directly
- No HTTP calls needed
- Simpler architecture

**Option B: Create Separate Server Process**
- Extract HTTP server logic to standalone process
- Run `packages/opencode` as HTTP server
- Requires configuration changes

**Option C: Hybrid (What Frontend Does Now)**
- Frontend has embedded OpenCode
- Asks for server URL on startup
- Can work with local or remote OpenCode instance

---

## 📋 Action Plan

### Immediate (Once Node 22 Works)

1. **Test Frontend Alone**
   ```bash
   cd packages/app && npm run dev
   ```
   - Does it start?
   - What errors in console?

2. **Check Server Architecture**
   - Look at how existing OpenCode frontend works
   - Find where it initializes OpenCode runtime
   - See if HTTP server mode exists

3. **Verify Our Integration**
   - Check if `server.ts` changes broke anything
   - Test existing OpenCode functionality
   - Isolate our new code vs existing code

### Next Steps

1. If OpenCode isn't designed for HTTP mode:
   - Refactor to use embedded SDK
   - Remove HTTP client layer
   - Use direct function calls

2. If HTTP mode exists:
   - Find how to enable it
   - Configure proper startup
   - Test endpoints

---

## 📞 Need Help?

**Collect this info**:
1. Browser console errors (screenshot)
2. Network tab (failed requests)
3. Backend logs (if any)
4. Output of: `node --version`, `npm --version`
5. Tree structure of running processes: `ps aux | grep node`

**Logs locations**:
- Frontend: Browser DevTools Console
- Backend: Terminal where server runs
- Files: `./logs/` directory

---

**Status**: Node.js upgrade required before any testing can proceed.
