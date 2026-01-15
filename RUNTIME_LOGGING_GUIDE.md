# Runtime Logging Guide

## 🚀 Quick Start

### Option 1: Use the Unified Dev Script (Recommended)

```bash
cd /Users/gg/Documents/ShopOS/opencode
./dev.sh
```

This will:
- Start both backend and frontend servers
- Save logs to `./logs/` directory
- Display both logs in the terminal with prefixes
- Auto-cleanup on exit (Ctrl+C)

### Option 2: Manual Start (Separate Terminals)

**Terminal 1 - Backend:**
```bash
cd /Users/gg/Documents/ShopOS/opencode/packages/opencode
bun run dev 2>&1 | tee ../../logs/backend.log
```

**Terminal 2 - Frontend:**
```bash
cd /Users/gg/Documents/ShopOS/opencode/packages/app
npm run dev 2>&1 | tee ../../logs/frontend.log
```

**Terminal 3 - Watch Logs:**
```bash
cd /Users/gg/Documents/ShopOS/opencode
tail -f logs/*.log
```

---

## 📊 Log Viewing Options

### 1. Browser Console (Frontend)
- Open DevTools (F12 or Cmd+Opt+I)
- Go to Console tab
- Logs are automatically enhanced with timestamps and context

### 2. In-App Log Viewer (Frontend)
- Click the floating terminal icon (bottom-right corner)
- Filter by log level (All, Info, Warn, Error)
- Auto-scrolls to show latest logs
- Persists last 100 entries

### 3. Terminal (Backend + Frontend)
- Use `./dev.sh` to see both in one terminal
- Or use separate terminals with `tail -f`

### 4. Log Files
All logs are saved to `./logs/` directory:
- `backend_YYYYMMDD_HHMMSS.log`
- `frontend_YYYYMMDD_HHMMSS.log`

---

## 📝 Log Format

### Enhanced Logger Format
```
[ISO_TIMESTAMP] [LEVEL] [COMPONENT] Message | {context}
```

**Example:**
```
[2026-01-15T13:30:45.123Z] [INFO] [ActionDashboard] User submitted prompt | {"actionType":"Create a marketing campaign"}
[2026-01-15 T13:30:45.234Z] [INFO] [OpenCodeClient] API POST /api/session/create | {"status":200}
[2026-01-15T13:30:45.345Z] [INFO] [ExecutionContext] WebSocket event: execution.step.started | {"sessionID":"session_abc123"}
```

---

## 🎨 Using the Enhanced Logger

### Frontend Components

```typescript
import { createLogger } from "@/utils/logger"

const log = createLogger("MyComponent")

// Basic logging
log.info("Component mounted")
log.warn("Potential issue detected")
log.error("Operation failed", error, { userId: "123" })

// Specialized loggers
log.apiCall("POST", "/api/session/create", 200)
log.wsEvent("execution.step.started", { step: stepData })
log.stateChange("loading", "executing", { sessionID: "abc" })
log.sessionEvent(sessionID, "created", { actionType: "marketing" })
```

### Backend Files

```typescript
import { createLogger } from "../utils/logger"

const log = createLogger("SessionAPI")

log.info("Session created", { sessionID, actionType })
log.error("Execution failed", error, { sessionID })
```

---

## 🔍 Debugging Tips

### Find All Logs for a Session
```bash
grep "session_abc123" logs/*.log
```

### Watch Only Errors
```bash
tail -f logs/*.log | grep ERROR
```

### Watch WebSocket Events
```bash
tail -f logs/frontend*.log | grep "WebSocket"
```

### Monitor API Calls
```bash
tail -f logs/frontend*.log | grep "API"
```

---

## 🎯 What to Look For

### Successful Execution Flow
```
1. [INFO] [ActionDashboard] User submitted prompt
2. [INFO] [OpenCodeClient] API POST /api/session/create
3. [INFO] [OpenCodeClient] WebSocket connected
4. [INFO] [ExecutionContext] Subscribing to session
5. [INFO] [ExecutionContext] Step started
6. [INFO] [ExecutionContext] Step completed
7. [INFO] [ExecutionContext] Execution completed
```

### Common Issues

**WebSocket Connection Failed:**
```
[ERROR] [OpenCodeClient] WebSocket error
```
→ Check backend is running on port 4096

**Session Creation Failed:**
```
[ERROR] [ActionDashboard] Failed to create session
```
→ Check backend API endpoint is accessible

**No Progress Updates:**
```
[INFO] [ExecutionContext] Subscribing to session
(then nothing)
```
→ Check WebSocket connection and event emission

---

## 🛠️ Customization

### Add More Loggers

```typescript
// In logger.ts
export const MyLogger = createLogger("MyFeature")

// In your component
import { MyLogger } from "@/utils/logger"
MyLogger.info("Custom log message")
```

### Change Log Retention

```typescript
// In log-viewer.tsx, line 60
setLogs(prev => [...prev, newLog].slice(-100)) // Change 100 to desired count
```

---

## 📦 Files

- `dev.sh` - Unified startup script
- `packages/app/src/components/log-viewer.tsx` - In-app log viewer
- `packages/app/src/utils/logger.ts` - Enhanced logging utility
- `logs/` - Log file directory (created automatically)

---

**Happy Debugging!** 🐛🔍
