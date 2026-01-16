# Plan Summary: Business Owner UI Transformation

**Brand:** OpenCode  
**DAG File:** `plan.json`  
**Status:** Ready for Execution

## Executive Summary

Transform the OpenCode web application from a developer-centric tool to a business-owner-friendly platform. This transformation will restructure the entire user journey from a complex, technical interface to a streamlined 5-page flow that focuses on business outcomes rather than code execution.

---

## User Flow Diagram

```mermaid
flowchart TD

%% =========================
%% SHOPOS — END TO END USERFLOW
%% =========================

U([User opens Web App]) --> L[Page 1: Business Owner Home\nSTATE=IDLE\n- Action Grid (2x3)\n- Prompt Input\n- Context Chips]

%% -------------------------
%% PAGE 1: Intent Selection + Prompt Entry
%% -------------------------
L --> A1{User selects an action?}
A1 -- No --> L
A1 -- Yes --> A2[UI: Highlight selected card\nUI: Update context chips\nintent.actionType set]

A2 --> A3{User types in prompt?}
A3 -- No --> A2
A3 -- Yes --> A4[UI: Prompt input multiline typing\nUI: Submit button becomes active\n(Enter enabled when non-empty)]

A4 --> A5{User adds attachments/context?}
A5 -- Optional --> A6[UI: Select folder / attach file / add agenda\nintent.context updated]
A5 -- Skip --> A7[Intent ready]

A6 --> A7

A7 --> A8{User submits? (Enter / Let's go)}
A8 -- No --> A4
A8 -- Yes --> P1[UI: Lock input + lock selection\nSTATE=SUBMITTED]

%% -------------------------
%% Backend Session + Message Submission
%% -------------------------
P1 --> B1[API: POST /api/sessions\nCreate OpenCode session\nReturn sessionId]
B1 --> B2[API: POST /api/sessions/:sessionId/messages\nSend prompt into CLI-equivalent pipeline\naccepted=true]

B2 --> C1[Page 2: Loading / Planning\nSTATE=PLANNING\n- Calm animation\n- Intent-aware loading copy]

%% -------------------------
%% PAGE 2: Planning / Loading
%% -------------------------
C1 --> C2{Backend planning started?}
C2 -- SSE: PLANNING_STARTED --> C3[UI: Continue loading\nNo fake timers]
C2 -- Poll fallback --> C3

C3 --> C4{Plan ready?}
C4 -- SSE: PLAN_READY --> C5[API: GET /api/sessions/:sessionId/plan]
C4 -- Poll fallback --> C5

C5 --> D1[Page 3: Plan Preview\nSTATE=PLAN_READY\n- Headline by action\n- Show 4+ next steps\n- Confirm intent]

%% -------------------------
%% PAGE 3: Plan Preview
%% -------------------------
D1 --> D2{User continues?}
D2 -- No --> D1
D2 -- Yes --> E1[API: POST /api/sessions/:sessionId/execute\nStart execution loop]

%% -------------------------
%% PAGE 4: Execution Progress Tracker
%% -------------------------
E1 --> F1[Page 4: Progress Tracker\nSTATE=EXECUTING\n- Step list\n- Pending/InProgress/Done states\n- Apple-level completion animation]

F1 --> F2{Execution events stream}
F2 -->|SSE: STEP_STARTED| F3[UI: Mark step as In Progress\nGentle motion indicator]
F2 -->|SSE: STEP_COMPLETED| F4[UI: Mark step as Done\nGreen check + subtle completion animation]
F2 -->|SSE: STEP_FAILED| F5[UI: Show failure state\nRetry or fallback suggestion]

F4 --> F6{More steps added dynamically?}
F6 -- Yes --> F7[UI: Inject new steps as Pending\nMaintain visual stability]
F6 -- No --> F8[Continue execution]

F7 --> F8
F8 --> F2

F5 --> F9{Retry allowed?}
F9 -- Yes --> F10[API: POST /api/sessions/:sessionId/retryStep\nRetry failed step]
F9 -- No --> ERR[Page: Error / Recovery\nShow failure + required user input]
F10 --> F2

%% -------------------------
%% Completion → Results Transition
%% -------------------------
F2 -->|SSE: RUN_COMPLETED| G1[STATE=COMPLETE\nUI: Progress settles\nAuto transition]

G1 --> H1[API: GET /api/sessions/:sessionId/result\nFetch ResultObject]

%% -------------------------
%% PAGE 5: Final Results (3-column Cowork Layout)
%% -------------------------
H1 --> I1[Page 5: Results Page\nSTATE=RESULTS_VIEW\nLeft: Summary + Continuation Chat\nCenter: Result Hero Output\nRight: Progress (completed) + Artifacts + Context]

%% -------------------------
%% RESULTS PAGE INTERACTIONS
%% -------------------------
I1 --> I2{User reviews result?}
I2 -- Yes --> I3[UI: Expand/collapse sections\nOpen/Download artifact\nInspect context used]
I2 -- No --> I4[Continue]

I3 --> I4

I4 --> I5{User sends follow-up prompt in chat?}
I5 -- No --> I1
I5 -- Yes --> J1[Continuation Chat\nNew intent built using prior result context]

%% -------------------------
%% CONTINUATION LOOP (Cowork Behavior)
%% -------------------------
J1 --> J2[API: POST /api/sessions/:sessionId/messages\nSend new prompt with context]
J2 --> C1

%% -------------------------
%% Optional: Start New Task from Results
%% -------------------------
I1 --> K1{User wants a new action type?}
K1 -- Yes --> L
K1 -- No --> I1
```

---

## Phase 1: Foundation Layer

### 1.1 New Type Definitions
**File:** `packages/app/src/types/business.ts`

Create comprehensive TypeScript types for the business flow:

```typescript
// Page States
type BusinessPageState = 
  | "IDLE"
  | "SUBMITTED"
  | "PLANNING"
  | "PLAN_READY"
  | "EXECUTING"
  | "COMPLETE"
  | "RESULTS_VIEW"
  | "ERROR";

// Intent Structure
interface BusinessIntent {
  actionType: BusinessActionType | null;
  prompt: string;
  context: ContextItem[];
  attachments: Attachment[];
  sessionId?: string;
}

// Action Types
type BusinessActionType = 
  | "analyze"
  | "report"
  | "plan"
  | "create"
  | "optimize"
  | "research";

// Step Types
type StepStatus = "PENDING" | "IN_PROGRESS" | "DONE" | "FAILED";

interface ExecutionStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  progress?: number;
  error?: string;
  retryable?: boolean;
}

// Result Structure
interface BusinessResult {
  sessionId: string;
  summary: string;
  heroOutput: HeroOutput;
  artifacts: Artifact[];
  contextUsed: ContextItem[];
  nextSteps?: string[];
}

interface HeroOutput {
  type: "report" | "dashboard" | "document" | "analysis";
  content: string | object;
  preview?: string;
}

interface Artifact {
  id: string;
  name: string;
  type: "pdf" | "csv" | "json" | "image" | "document";
  url: string;
  size?: number;
}

// Context & Attachments
interface ContextItem {
  id: string;
  type: "folder" | "file" | "database" | "api";
  name: string;
  path: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string | File;
}

// Event Types for SSE
type BusinessEventType =
  | "PLANNING_STARTED"
  | "PLAN_READY"
  | "STEP_STARTED"
  | "STEP_PROGRESS"
  | "STEP_COMPLETED"
  | "STEP_FAILED"
  | "RUN_COMPLETED"
  | "ERROR";
```

### 1.2 Business Context Provider
**File:** `packages/app/src/context/business.tsx`

Create a new context provider that manages the entire business flow state:

```typescript
// Key responsibilities:
- Manage BusinessPageState across all 5 pages
- Handle BusinessIntent composition
- Manage ExecutionStep list with real-time updates
- Handle SSE subscriptions for all events
- Manage ResultObject after completion
- Handle retry logic for failed steps
- Manage continuation chat context
```

### 1.3 Update Existing Layout Provider
**File:** `packages/app/src/context/layout.tsx`

Extend to support business flow:

```typescript
// Add to layout store:
interface BusinessFlowState {
  pageState: BusinessPageState;
  intent: BusinessIntent;
  steps: ExecutionStep[];
  currentResult: BusinessResult | null;
  sessionId: string | null;
}
```

---

## Phase 2: Page 1 - Business Owner Home

### 2.1 Components to Create

#### Action Grid Component
**File:** `packages/app/src/components/business/action-grid.tsx`

```typescript
interface ActionGridProps {
  onActionSelect: (actionType: BusinessActionType) => void;
  selectedAction: BusinessActionType | null;
}

// 2x3 Grid of action cards:
const ACTIONS: BusinessActionType[] = [
  "analyze",   // Analyze business data
  "report",    // Generate reports
  "plan",      // Strategic planning
  "create",    // Create content/assets
  "optimize",  // Optimization recommendations
  "research"   // Market/research analysis
];

// Each card shows:
// - Icon (business-appropriate)
// - Action name
// - Brief description
// - Visual highlight when selected
```

#### Context Chips Component
**File:** `packages/app/src/components/business/context-chips.tsx`

```typescript
interface ContextChipsProps {
  selectedContexts: ContextItem[];
  onContextToggle: (context: ContextItem) => void;
  onAddContext: () => void;
}

// Chips display:
// - Folder icon for directories
// - Database icon for data sources
// - API icon for integrations
// - Plus button to add more
// - Visual selection state
```

#### Business Prompt Input
**File:** `packages/app/src/components/business/prompt-input.tsx`

```typescript
interface BusinessPromptInputProps {
  intent: BusinessIntent;
  onIntentUpdate: (updates: Partial<BusinessIntent>) => void;
  onSubmit: () => void;
  disabled: boolean;
}

// Features:
// - Multiline textarea (not code editor)
// - Auto-expanding
// - Submit button (enabled when prompt non-empty)
// - Enter key support
// - Attachment button
```

#### Business Header
**File:** `packages/app/src/components/business/header.tsx`

```typescript
interface BusinessHeaderProps {
  actionType: BusinessActionType | null;
  onNewTask: () => void;
}
```

#### Business Sidebar
**File:** `packages/app/src/components/business/sidebar.tsx`

Simplified sidebar showing:
- Recent tasks
- Saved templates
- User profile
- Settings

### 2.2 Page Creation
**File:** `packages/app/src/pages/business-home.tsx`

Assembles Page 1 with:
- Header (action type display)
- Main content area with:
  - Action Grid (top)
  - Prompt Input (bottom)
- Context Chips (integrated with prompt)
- Sidebar (collapsed/expandable)

---

## Phase 3: Page 2 - Loading/Planning

### 3.1 Components to Create

#### Calm Animation Component
**File:** `packages/app/src/components/business/animations.tsx`

```typescript
interface CalmAnimationProps {
  actionType: BusinessActionType;
  message: string;
}

// Intent-aware loading messages:
// - "Analyzing your business data..."
// - "Generating your report..."
// - "Planning your strategy..."
// - "Creating your content..."

// Animation style:
// - Subtle, not frantic
// - No fake progress bars
// - Breathing/morphing shapes
// - Professional, calm aesthetic
```

### 3.2 Page Creation
**File:** `packages/app/src/pages/loading-planning.tsx`

Displays:
- Large calm animation
- Intent-aware loading message
- Cancel button (returns to Page 1)
- Progress indicator (optional, subtle)

---

## Phase 4: Page 3 - Plan Preview

### 4.1 Components to Create

#### Plan Preview Component
**File:** `packages/app/src/components/business/plan-preview.tsx`

```typescript
interface PlanPreviewProps {
  headline: string;
  steps: ExecutionStep[];
  onConfirm: () => void;
  onModify: () => void;
}

// Display elements:
// - Dynamic headline based on action type
// - List of 4+ steps with descriptions
// - Estimated time per step
// - Total estimated duration
// - Confirm button
// - Modify button (go back to Page 1)
```

### 4.2 Page Creation
**File:** `packages/app/src/pages/plan-preview.tsx`

Shows:
- Action-specific headline
- Detailed step list (expandable)
- Confirmation action bar
- Back navigation

---

## Phase 5: Page 4 - Execution Progress Tracker

### 5.1 Components to Create

#### Step Card Component
**File:** `packages/app/src/components/business/step-card.tsx`

```typescript
interface StepCardProps {
  step: ExecutionStep;
  index: number;
  isActive: boolean;
  onRetry?: () => void;
}

// States:
// - PENDING: Grayed, non-interactive
// - IN_PROGRESS: Animated border, gentle motion indicator
// - DONE: Green check, subtle completion animation
// - FAILED: Red state, retry button (if retryable)

// Animation details:
// - Apple-level polish
// - Smooth state transitions
// - No jarring changes
```

#### Progress Animation Component
**File:** `packages/app/src/components/business/progress-animation.tsx`

```typescript
interface ProgressAnimationProps {
  steps: ExecutionStep[];
  currentStepId: string;
}

// Features:
// - List of all steps
// - Visual flow from top to bottom
// - Active step has motion indicator
// - Completed steps fade to green check
// - Failed steps show error state
// - New steps can be injected dynamically
```

### 5.2 Page Creation
**File:** `packages/app/src/pages/execution-tracker.tsx`

Displays:
- Execution timeline
- All steps with states
- Active step details
- Retry button (if applicable)
- Error recovery UI (if needed)
- Auto-transition to Page 5 on completion

---

## Phase 6: Page 5 - Final Results (3-Column Layout)

### 6.1 Components to Create

#### Results Left Panel
**File:** `packages/app/src/components/business/results-left.tsx`

```typescript
interface ResultsLeftPanelProps {
  summary: string;
  onContinueChat: () => void;
  continuationMessages: Message[];
}

// Left column (25% width):
// - Summary card (expandable)
// - Continuation chat interface
// - Quick action buttons
// - Related suggestions
```

#### Results Center Panel
**File:** `packages/app/src/components/business/results-center.tsx`

```typescript
interface ResultsCenterPanelProps {
  heroOutput: HeroOutput;
  onExpand: () => void;
  onDownload: () => void;
}

// Center column (50% width):
// - Hero output display
// - Report viewer
// - Dashboard view
// - Expand/collapse sections
// - Zoom controls
// - Full-screen mode
```

#### Results Right Panel
**File:** `packages/app/src/components/business/results-right.tsx`

```typescript
interface ResultsRightPanelProps {
  completedSteps: ExecutionStep[];
  artifacts: Artifact[];
  contextUsed: ContextItem[];
  onOpenArtifact: (artifact: Artifact) => void;
  onInspectContext: (context: ContextItem) => void;
}

// Right column (25% width):
// - Progress summary (all steps completed)
// - Artifacts list (downloadable)
// - Context used panel
// - Timestamp
// - Export options
```

#### Continuation Chat
**File:** `packages/app/src/components/business/continuation-chat.tsx`

```typescript
interface ContinuationChatProps {
  sessionId: string;
  context: BusinessResult;
  onMessage: (message: string) => void;
}

// Features:
// - Same chat interface as prompt
// - Pre-populated with result context
// - Quick suggestion chips
// - Full chat history
```

### 6.2 Page Creation
**File:** `packages/app/src/pages/results.tsx`

3-column layout:
```css
.results-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 24px;
  height: 100vh;
  padding: 24px;
}
```

Displays:
- Left: Summary + Continuation Chat
- Center: Hero Output (Result)
- Right: Progress + Artifacts + Context

---

## Phase 7: Service Layer

### 7.1 Business API Service
**File:** `packages/app/src/services/business-api.ts`

```typescript
class BusinessAPIService {
  // Session Management
  async createSession(intent: BusinessIntent): Promise<{ sessionId: string }>;
  
  // Message Submission
  async submitPrompt(sessionId: string, intent: BusinessIntent): Promise<void>;
  
  // Plan Retrieval
  async getPlan(sessionId: string): Promise<{ headline: string; steps: ExecutionStep[] }>;
  
  // Execution Control
  async startExecution(sessionId: string): Promise<void>;
  async retryStep(sessionId: string, stepId: string): Promise<void>;
  
  // Result Retrieval
  async getResult(sessionId: string): Promise<BusinessResult>;
  
  // Continuation
  async sendContinuation(sessionId: string, message: string): Promise<void>;
}
```

### 7.2 SSE Client Service
**File:** `packages/app/src/services/business-sse.ts`

```typescript
class BusinessSSEClient {
  // Event subscriptions
  onPlanningStarted(callback: () => void): Unsubscribe;
  onPlanReady(callback: (plan: { headline: string; steps: ExecutionStep[] }) => void): Unsubscribe;
  onStepStarted(callback: (stepId: string) => void): Unsubscribe;
  onStepCompleted(callback: (stepId: string) => void): Unsubscribe;
  onStepFailed(callback: (stepId: string, error: string, retryable: boolean) => void): Unsubscribe;
  onRunCompleted(callback: () => void): Unsubscribe;
  onError(callback: (error: string) => void): Unsubscribe;
  
  // Connection management
  connect(sessionId: string): void;
  disconnect(): void;
}
```

### 7.3 Retry Service
**File:** `packages/app/src/services/retry.ts`

```typescript
class RetryService {
  async retryFailedStep(
    sessionId: string, 
    stepId: string, 
    maxAttempts?: number
  ): Promise<{ success: boolean; error?: string }>;
  
  shouldShowRetry(error: string): boolean;
  getRetryMessage(error: string): string;
}
```

### 7.4 Artifact Service
**File:** `packages/app/src/services/artifact.ts`

```typescript
class ArtifactService {
  async download(artifact: Artifact): Promise<void>;
  async preview(artifact: Artifact): Promise<string>;
  async getAll(sessionId: string): Promise<Artifact[]>;
}
```

---

## Phase 8: API Endpoints

### 8.1 Existing Endpoints to Leverage

```typescript
// POST /session/create
// - Already exists, will be used for business sessions

// POST /session/{sessionId}/message
// - Already exists, will send business intent

// GET /session/{sessionId}/messages
// - Already exists, for continuation chat

// SSE /session/{sessionId}/events
// - Already exists, will emit business events
```

### 8.2 New Endpoints Needed

```typescript
// POST /session/{sessionId}/execute
// Body: { intent: BusinessIntent }
// Response: { success: true }

// GET /session/{sessionId}/plan
// Response: { headline: string; steps: ExecutionStep[] }

// POST /session/{sessionId}/retryStep
// Body: { stepId: string }
// Response: { success: boolean; error?: string }

// GET /session/{sessionId}/result
// Response: BusinessResult
```

### 8.3 SSE Event Types to Add

```typescript
// Existing events to extend:
"session.status" → Include business page state transitions

// New events:
"business.planning_started" → Page 2: Begin planning
"business.plan_ready" → Page 3: Show plan preview
"business.step_started" → Page 4: Step begins
"business.step_progress" → Page 4: Step progress update
"business.step_completed" → Page 4: Step finishes
"business.step_failed" → Page 4: Step fails
"business.run_completed" → Transition to Page 5
"business.error" → Error state
```

---

## Phase 9: File Modifications Summary

### 9.1 New Files to Create

```
packages/app/src/
├── types/
│   └── business.ts                    # Type definitions
├── context/
│   └── business.tsx                   # Business context provider
├── services/
│   ├── business-api.ts                # API service layer
│   ├── business-sse.ts                # SSE client service
│   ├── retry.ts                       # Retry logic service
│   └── artifact.ts                    # Artifact management
├── components/
│   └── business/
│       ├── action-grid.tsx            # 2x3 action card grid
│       ├── context-chips.tsx          # Context selection chips
│       ├── prompt-input.tsx           # Simplified prompt input
│       ├── header.tsx                 # Action type header
│       ├── sidebar.tsx                # Simplified sidebar
│       ├── step-card.tsx              # Execution step card
│       ├── animations.tsx             # Calm/completion animations
│       ├── progress-animation.tsx     # Progress tracker animation
│       ├── file-folder-picker.tsx     # Context attachment picker
│       ├── results-left.tsx           # Results left panel
│       ├── results-center.tsx         # Results center panel
│       ├── results-right.tsx          # Results right panel
│       └── continuation-chat.tsx      # Continuation chat
└── pages/
    ├── business-home.tsx              # Page 1: Home
    ├── loading-planning.tsx           # Page 2: Loading
    ├── plan-preview.tsx               # Page 3: Plan Preview
    ├── execution-tracker.tsx          # Page 4: Progress Tracker
    └── results.tsx                    # Page 5: Results
```

### 9.2 Files to Modify

```
packages/app/src/
├── app.tsx                            # Add business routes
├── context/
│   ├── layout.tsx                     # Add business flow state
│   └── prompt.tsx                     # Extend for business intent
└── index.css                          # Add business theme/animation styles
```

---

## Phase 10: State Management Architecture

### 10.1 Business Context Store Structure

```typescript
interface BusinessStore {
  // Page State
  pageState: BusinessPageState;
  
  // Intent
  intent: BusinessIntent;
  
  // Execution
  steps: ExecutionStep[];
  currentStepId: string | null;
  
  // Result
  result: BusinessResult | null;
  
  // Session
  sessionId: string | null;
  
  // UI State
  selectedAction: BusinessActionType | null;
  isLoading: boolean;
  error: string | null;
}
```

### 10.2 State Transitions

```
IDLE → SUBMITTED → PLANNING → PLAN_READY → EXECUTING → COMPLETE → RESULTS_VIEW
              ↓                              ↓              ↓
          ERROR                         FAILED          ERROR
```

### 10.3 Persistence

- Intent state: Persist to localStorage (for session recovery)
- Session history: Store recent business sessions
- Templates: Save common action configurations

---

## Phase 11: Design System Updates

### 11.1 New Theme Variables

```css
:root {
  /* Business Theme Colors */
  --business-primary: #0066CC;
  --business-success: #34C759;
  --business-warning: #FF9500;
  --business-error: #FF3B30;
  --business-neutral: #8E8E93;
  
  /* Animation Timing */
  --animation-calm: 0.5s ease-in-out;
  --animation-subtle: 0.3s ease;
  
  /* Layout */
  --results-left-width: 25%;
  --results-center-width: 50%;
  --results-right-width: 25%;
}
```

### 11.2 Animation Keyframes

```css
@keyframes breathe {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes check-appear {
  0% { opacity: 0; transform: scale(0.5); }
  50% { transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes step-complete {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 0%; }
}
```

---

## Phase 12: Testing Strategy

### 12.1 Component Testing

```typescript
// Test files to create:
__tests__/
├── components/
│   ├── action-grid.test.tsx
│   ├── context-chips.test.tsx
│   ├── step-card.test.tsx
│   └── results-*.test.tsx
├── pages/
│   ├── business-home.test.tsx
│   ├── loading-planning.test.tsx
│   ├── plan-preview.test.tsx
│   ├── execution-tracker.test.tsx
│   └── results.test.tsx
└── services/
    ├── business-api.test.ts
    └── business-sse.test.ts
```

### 12.2 Integration Testing

- End-to-end flow testing (Page 1 → Page 5)
- SSE event handling
- Error/recovery scenarios
- Continuation chat functionality

---

## Execution Order

1. **Foundation Phase**
   - Create type definitions
   - Create BusinessContextProvider
   - Modify LayoutProvider

2. **Service Layer**
   - Create BusinessAPIService
   - Create BusinessSSEClient
   - Create RetryService
   - Create ArtifactService

3. **Page 1 Components**
   - ActionGrid
   - ContextChips
   - BusinessPromptInput
   - BusinessHeader
   - BusinessSidebar

4. **Page 1 Assembly**
   - Create BusinessHomePage
   - Modify app.tsx routing

5. **Page 2 Components**
   - CalmAnimation
   - Create LoadingPlanningPage

6. **Page 3 Components**
   - PlanPreview
   - Create PlanPreviewPage

7. **Page 4 Components**
   - StepCard
   - ProgressAnimation
   - Create ExecutionTrackerPage

8. **Page 5 Components**
   - ResultsLeftPanel
   - ResultsCenterPanel
   - ResultsRightPanel
   - ContinuationChat
   - Create ResultsPage

9. **Styling & Polish**
   - Update global styles
   - Add animations
   - Theme integration

10. **Testing & Validation**
    - Component tests
    - Integration tests
    - E2E flow tests

---

## Risk Mitigation

1. **Complexity**: Start with simple action types, expand later
2. **State Management**: Use existing patterns, don't overcomplicate
3. **Performance**: Lazy load pages, optimize SSE connections
4. **Accessibility**: Ensure all interactions work with keyboard/screen reader
5. **Error Handling**: Graceful degradation for network issues

---

## Next Steps

To execute this plan, run the spaces defined in `plan.json`. The spaces will create all necessary files and modifications in the correct order based on dependencies.

**Estimated Timeline:**
- Phase 1-3 (Foundation + Services): 2-3 days
- Phase 4-6 (Pages 1-3): 2-3 days
- Phase 7-8 (Pages 4-5 + API): 2-3 days
- Phase 9-12 (Polish + Testing): 2-3 days

**Total Estimated Time:** 8-12 days for full implementation
