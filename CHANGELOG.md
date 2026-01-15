# Changelog - ShopOS + OpenCode Integration

## [Unreleased] - 2026-01-15

### Phase 0: Critical Path Integration - COMPLETE ✅

#### Added
- **Backend API Layer** (`packages/opencode/src/server/session-api.ts`)
  - `createSessionEndpoint()` - HTTP endpoint for session creation from UI
  - `streamSessionEvents()` - WebSocket event streaming with Bus.subscribeAll()
  - Proper Bus event subscription and filtering by sessionID
  - Event format conversion from Bus to frontend format

- **Execution Handler** (`packages/opencode/src/session/execute.ts`)
  - `executeSession()` - Step-by-step LLM execution orchestrator
  - BusEvent.define() definitions for all execution events
  - Step templates for all 6 action types
  - Real-time event emission via Bus.publish()
  - LLM invocation via SessionPrompt.prompt()

- **Frontend API Client** (`packages/app/src/services/opencode-client.ts`)
  - `OpenCodeClient` class for backend communication
  - HTTP session creation with fetch()
  - WebSocket event subscription
  - Enhanced logging with createLogger()

- **Execution Context** (`packages/app/src/context/execution-context.tsx`)
  - `ExecutionProvider` for global state management
  - Real-time event handling from WebSocket
  - Step state management (pending/in-progress/completed/failed)
  - `useExecution()` hook for component access

- **Runtime Logging** (`packages/app/src/utils/logger.ts` & `packages/app/src/components/log-viewer.tsx`)
  - Structured logging with timestamps and context
  - Browser-based log viewer component
  - Level-based filtering (info/warn/error)
  - Real-time log capture and display

#### Changed
- **Server Routes** (`packages/opencode/src/server/server.ts`)
  - Added POST `/api/session/create` endpoint
  - Added GET `/api/session/:sessionID/events` WebSocket endpoint
  
- **Action Dashboard** (`packages/app/src/components/dashboard/action-dashboard.tsx`)
  - Replaced mock data with real OpenCodeClient calls
  - Connected ProgressTracker to `execution.steps()` (2 instances)
  - Removed setTimeout simulations
  - Added real session creation flow

- **Progress Tracker** (`packages/app/src/components/dashboard/progress-tracker.tsx`)
  - Added 'failed' status to Task type
  
- **App Layout** (`packages/app/src/app.tsx`)
  - Wrapped router with ExecutionProvider
  - Added LogViewer component for debugging

#### Fixed
- **Import Path Bug** - session-api.ts import of execute.ts (`./execute` → `../session/execute`)
- **LLM API Bug** - SessionPrompt.command() → SessionPrompt.prompt() with correct signature
- **Bus API Bug** - Proper BusEvent.define() usage and Bus.publish(definition, properties) calls
- **Event Subscription Bug** - Bus.subscribe() → Bus.subscribeAll() to receive all events
- **Event Format Bug** - Extract event.properties.sessionID and restructure for frontend
- **Data Flow Bug** - ProgressTracker connected to execution.steps() instead of empty local state
- **Node.js Version** - Upgraded from 18.17.0 to 22.22.0 for Vite 7 compatibility

### Verified Working ✅
- Backend executes all 3 steps successfully
- Bus events published and received correctly
- WebSocket streams events to frontend
- Frontend receives and processes events
- ExecutionContext updates state
- ProgressTracker displays real-time step updates
- Complete end-to-end flow functional

### Known Limitations
- UI doesn't transition to results state after execution completes (Phase 1)
- No follow-up prompt capability yet (Phase 1)
- No error handling UI (Phase 1)

---

## Files Modified

### New Files
1. `/packages/opencode/src/server/session-api.ts` - Backend API endpoints
2. `/packages/opencode/src/session/execute.ts` - Execution orchestration
3. `/packages/app/src/services/opencode-client.ts` - Frontend API client
4. `/packages/app/src/context/execution-context.tsx` - State management
5. `/packages/app/src/components/log-viewer.tsx` - Runtime logging UI
6. `/packages/app/src/utils/logger.ts` - Enhanced logger

### Modified Files
1. `/packages/opencode/src/server/server.ts` - Added HTTP + WebSocket routes
2. `/packages/app/src/components/dashboard/action-dashboard.tsx` - Real API integration
3. `/packages/app/src/components/dashboard/progress-tracker.tsx` - Added failed status
4. `/packages/app/src/app.tsx` - ExecutionProvider + LogViewer

---

## Next Release (Phase 1)

### Planned Features
- Results display after execution completion
- Continuation loop for follow-up prompts
- Error handling UI with retry functionality
- Session artifact retrieval and display
- All 6 action types tested and working

---

## Breaking Changes
None - New functionality only

## Upgrade Notes
- Requires Node.js 22.22.0+
- Backend server must be started on port 4096
- Frontend expects backend at `http://localhost:4096`
