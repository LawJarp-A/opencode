# ShopOS + OpenCode Integration — Master Task List

## Overview
This document contains every task required to integrate ShopOS with the `.opencode` execution engine, transforming it into a Claude Cowork-style agent-driven system.

**Integration Path**: `/Users/gg/Documents/ShopOS/opencode/.opencode`

**Status Legend**:
- `[ ]` Not started
- `[/]` In progress  
- `[x]` Completed

---

## PHASE 1 — SYSTEM ALIGNMENT & CONTRACT DEFINITION

**Goal**: Establish a clear system contract between frontend, backend, and runtime.

### 1.1 Codebase Analysis
- [ ] Map existing OpenCode session lifecycle (create → messages → update → events)
- [ ] Document existing agent system architecture (`packages/opencode/src/agent/`)
- [ ] Document existing event bus system (`packages/opencode/src/bus/`)
- [ ] Document existing tool execution framework (`packages/opencode/src/tool/`)
- [ ] Identify SolidJS context providers in `packages/app/src/context/`
- [ ] Map current UI state flow in `action-dashboard.tsx`

### 1.2 Schema Definition
- [ ] Define **Intent Object** schema using Zod
  - [ ] Intent ID (unique identifier)
  - [ ] Action type (from action cards)
  - [ ] Prompt text (user input)
  - [ ] Context data (files, attachments, previous results)
  - [ ] Timestamp
  - [ ] Session ID (link to OpenCode session)
- [ ] Define **Execution Plan** schema using Zod
  - [ ] Plan ID
  - [ ] Intent ID reference
  - [ ] Array of execution steps
  - [ ] Step dependencies
  - [ ] Estimated duration
  - [ ] Required agent capabilities
- [ ] Define **Execution Step** schema
  - [ ] Step ID
  - [ ] Step description (human-readable)
  - [ ] Agent/tool reference
  - [ ] Status (pending/in-progress/completed/failed)
  - [ ] Dependencies (array of step IDs)
  - [ ] Input parameters
  - [ ] Output artifacts
  - [ ] Timestamps (started/completed)
- [ ] Define **Execution Event** schema
  - [ ] Event type (step_started/step_completed/step_failed/plan_completed)
  - [ ] Session ID
  - [ ] Plan ID  
  - [ ] Step ID
  - [ ] Timestamp
  - [ ] Payload (step-specific data)
  - [ ] Error details (if failed)

### 1.3 Responsibility Mapping
- [ ] Document **Frontend Responsibilities**
  - [ ] Intent capture and normalization
  - [ ] UI state management (input/loading/executing/result)
  - [ ] Event subscription and UI updates
  - [ ] Results rendering
  - [ ] Continuation context management
- [ ] Document **Orchestrator Responsibilities**
  - [ ] Intent classification
  - [ ] Plan generation
  - [ ] Agent selection and invocation
  - [ ] Execution sequencing
  - [ ] Event emission
  - [ ] Artifact collection
- [ ] Document **Agent/Tool Responsibilities**
  - [ ] Tool execution
  - [ ] File system operations
  - [ ] API calls
  - [ ] Data processing
  - [ ] Artifact generation

### 1.4 Boundary Definition
- [ ] Define clear API contract between UI and orchestrator
  - [ ] Request format (Intent → Plan generation)
  - [ ] Response format (Plan → UI)
  - [ ] Event streaming protocol
  - [ ] Error handling conventions
- [ ] Define data flow ownership
  - [ ] Who owns session state?
  - [ ] Who owns execution state?
  - [ ] Who owns artifact storage?
- [ ] Define error boundary responsibilities
  - [ ] Frontend error handling (network, UI)
  - [ ] Backend error handling (execution, agents)
  - [ ] User-facing error messages

### 1.5 Contract Documentation
- [ ] Create `SYSTEM_CONTRACT.md` document
  - [ ] Include all schemas with code examples
  - [ ] Include sequence diagrams (text-based)
  - [ ] Include failure scenarios
  - [ ] Include versioning strategy
- [ ] Review and validate contract against existing OpenCode patterns
- [ ] Update `APPLICATION_ARCHITECTURE_MAP.md` with new components

---

## PHASE 2 — ORCHESTRATION LAYER (INTENT → PLAN)

**Goal**: Build the planning engine that converts intent into executable steps.

### 2.1 Intent Classification System
- [ ] Create `packages/opencode/src/orchestrator/` directory
- [ ] Create `packages/opencode/src/orchestrator/intent-classifier.ts`
  - [ ] Implement action type mapping (from ACTIONS constant)
  - [ ] Add natural language intent detection
  - [ ] Add context extraction (files, data references)
  - [ ] Add ambiguity detection
  - [ ] Add confidence scoring
- [ ] Create unit tests for intent classification
  - [ ] Test each action type
  - [ ] Test ambiguous inputs
  - [ ] Test context extraction

### 2.2 Agent Capability Registry
- [ ] Create `packages/opencode/src/orchestrator/agent-registry.ts`
  - [ ] Map action types to agent capabilities
  - [ ] Define agent metadata (inputs, outputs, dependencies)
  - [ ] Add dynamic agent discovery from `.opencode`
- [ ] Document available agents and their capabilities
  - [ ] For each action: Campaign, Analysis, Simulation, Prep, Products, Call
  - [ ] Map to existing OpenCode agents/tools
- [ ] Create capability matching algorithm
  - [ ] Match intent requirements to agent capabilities
  - [ ] Handle missing capabilities gracefully

### 2.3 Plan Generator
- [ ] Create `packages/opencode/src/orchestrator/plan-generator.ts`  
  - [ ] Implement step decomposition algorithm
  - [ ] Add dependency graph builder
  - [ ] Add step ordering logic
  - [ ] Add plan validation
  - [ ] Add plan optimization (remove redundant steps)
- [ ] Create plan templates for each action type
  - [ ] Template for "Create marketing campaign"
  - [ ] Template for "Do some analysis"
  - [ ] Template for "Simulate business scenario"
  - [ ] Template for "Prep for the day"
  - [ ] Template for "Manage products"
  - [ ] Template for "Get on a call with us"
- [ ] Add dynamic plan generation (beyond templates)
  - [ ] Use LLM to generate steps for novel intents
  - [ ] Validate generated plans against schemas

### 2.4 Orchestration Service
- [ ] Create `packages/opencode/src/orchestrator/orchestrator.ts`
  - [ ] Implement `generatePlan(intent: Intent): Promise<ExecutionPlan>`
  - [ ] Add caching for similar intents
  - [ ] Add plan persistence to storage
  - [ ] Add plan retrieval by ID
- [ ] Integrate with OpenCode session system
  - [ ] Create session on intent submission
  - [ ] Link plan to session
  - [ ] Store plan in session storage
- [ ] Add error handling
  - [ ] Handle invalid intents
  - [ ] Handle agent capability mismatches
  - [ ] Return user-friendly error messages

### 2.5 Testing & Validation
- [ ] Create `packages/opencode/test/orchestrator/` directory
- [ ] Write unit tests for plan generator
  - [ ] Test each action type template
  - [ ] Test dependency resolution
  - [ ] Test plan validation
- [ ] Write integration tests
  - [ ] Test intent → plan flow end-to-end
  - [ ] Test error scenarios
- [ ] Create example intent → plan transformations document
  - [ ] 10+ real-world examples
  - [ ] Show input intent and output plan side-by-side

---

## PHASE 3 — AGENT EXECUTION & EVENT STREAMING

**Goal**: Execute plans using real agents and stream progress to UI.

### 3.1 Execution Engine Design
- [ ] Create `packages/opencode/src/orchestrator/executor.ts`
- [ ] Implement sequential step execution
  - [ ] Execute one step at a time
  - [ ] Wait for completion before next step
  - [ ] Respect dependency chains
- [ ] Implement parallel execution for independent steps
  - [ ] Identify parallelizable steps
  - [ ] Execute in parallel where possible
  - [ ] Aggregate results

### 3.2 Agent Integration
- [ ] Create agent invocation wrapper
  - [ ] Map step → agent/tool
  - [ ] Prepare agent input from step parameters
  - [ ] Invoke agent via OpenCode agent system
  - [ ] Collect agent output as artifacts
- [ ] Integrate with existing OpenCode agents
  - [ ] Use `packages/opencode/src/agent/agent.ts`
  - [ ] Follow existing agent patterns
  - [ ] Reuse session context
- [ ] Test agent invocation
  - [ ] Verify each action type can invoke agents
  - [ ] Test error propagation from agents

### 3.3 Event Streaming Implementation
- [ ] Integrate with OpenCode event bus (`packages/opencode/src/bus/`)
- [ ] Define orchestration events
  - [ ] `orchestrator.plan.created`
  - [ ] `orchestrator.step.started`
  - [ ] `orchestrator.step.completed`
  - [ ] `orchestrator.step.failed`
  - [ ] `orchestrator.plan.completed`
  - [ ] `orchestrator.plan.failed`
- [ ] Implement event emission
  - [ ] Emit events at each execution milestone
  - [ ] Include full event payload (step details, timestamps, artifacts)
  - [ ] Ensure events are atomic and ordered
- [ ] Add event persistence
  - [ ] Store events in session storage
  - [ ] Enable event replay for debugging

### 3.4 Artifact Management
- [ ] Create artifact collection system
  - [ ] Collect outputs from each step
  - [ ] Categorize artifacts (files, data, summaries)
  - [ ] Link artifacts to steps and plan
- [ ] Implement artifact storage
  - [ ] Store in OpenCode storage system
  - [ ] Associate with session ID
  - [ ] Enable artifact retrieval by ID
- [ ] Create artifact metadata schema
  - [ ] Artifact type
  - [ ] File path / data reference
  - [ ] Creation timestamp
  - [ ] Associated step ID

### 3.5 Failure Handling & Retry
- [ ] Implement retry logic
  - [ ] Configurable retry count per step
  - [ ] Exponential backoff
  - [ ] Retry only idempotent operations
- [ ] Implement failure recovery
  - [ ] Mark step as failed
  - [ ] Stop dependent steps
  - [ ] Allow manual retry from UI
  - [ ] Provide failure diagnostics
- [ ] Add rollback capability
  - [ ] Undo side effects where possible
  - [ ] Mark plan as rolled back
- [ ] Create failure event schema
  - [ ] Error type and message
  - [ ] Stack trace
  - [ ] Retry attempts
  - [ ] Suggested user actions

### 3.6 Testing
- [ ] Write execution engine tests
  - [ ] Test sequential execution
  - [ ] Test parallel execution
  - [ ] Test dependency resolution
- [ ] Write error handling tests
  - [ ] Test step failure scenarios
  - [ ] Test retry logic
  - [ ] Test rollback logic
- [ ] Integration test: Full plan execution
  - [ ] Execute a real plan end-to-end
  - [ ] Verify all events emitted
  - [ ] Verify artifacts collected

---

## PHASE 4 — UI INTEGRATION (PROGRESS → RESULTS)

**Goal**: Connect real execution to the UI, replacing all simulations.

### 4.1 State Machine Implementation
- [ ] Document UI state machine
  - [ ] States: input → loading → executing → result
  - [ ] Transitions and triggers
  - [ ] State invariants
- [ ] Create state machine diagram (text-based Mermaid or ASCII)
- [ ] Implement state machine in `action-dashboard.tsx`
  - [ ] Replace current flowState logic
  - [ ] Add state guards and validations

### 4.2 Event Subscription Layer
- [ ] Create WebSocket/EventSource connection to backend
  - [ ] Connect to OpenCode event bus
  - [ ] Subscribe to orchestration events
  - [ ] Handle connection failures and reconnection
- [ ] Create SolidJS context for execution events
  - [ ] `packages/app/src/context/execution-context.tsx`
  - [ ] Subscribe to events from backend
  - [ ] Provide event stream to components
  - [ ] Manage subscription lifecycle
- [ ] Implement event handlers
  - [ ] `onPlanCreated` → Store plan, transition to executing state
  - [ ] `onStepStarted` → Update progress tracker
  - [ ] `onStepCompleted` → Update progress tracker, collect artifacts
  - [ ] `onStepFailed` → Show error, allow retry
  - [ ] `onPlanCompleted` → Transition to result state, render results

### 4.3 Progress Tracker Integration
- [ ] Update `packages/app/src/components/dashboard/progress-tracker.tsx`
  - [ ] Remove simulation logic
  - [ ] Subscribe to real execution events
  - [ ] Update task states based on events
  - [ ] Display real-time progress
- [ ] Add progress indicators
  - [ ] Show current step
  - [ ] Show completed steps count
  - [ ] Show estimated time remaining (if available)
- [ ] Add error display in progress tracker
  - [ ] Show failed steps with error messages
  - [ ] Provide retry button for failed steps

### 4.4 Results View Integration
- [ ] Update `packages/app/src/components/dashboard/results-view.tsx`
  - [ ] Remove hardcoded mock data
  - [ ] Dynamically render based on execution artifacts
  - [ ] Support multiple result types (documents, charts, lists, etc.)
- [ ] Create result renderers for each action type
  - [ ] Campaign → Marketing plan document + assets
  - [ ] Analysis → Charts + data tables + insights
  - [ ] Simulation → Scenario comparison + outcomes
  - [ ] Prep → Daily schedule + priorities
  - [ ] Products → Product catalog + recommendations
  - [ ] Call → Meeting summary + next steps
- [ ] Add artifact download/export functionality
  - [ ] Download files generated by execution
  - [ ] Export results as PDF/JSON

### 4.5 Continuation Context Management
- [ ] Update `packages/app/src/components/prompt-input.tsx`
  - [ ] Include execution artifacts in context
  - [ ] Include previous plan in continuation intent
  - [ ] Preserve session ID across iterations
- [ ] Implement context chaining
  - [ ] On continuation submit, create new intent with previous context
  - [ ] Link to previous plan/session
  - [ ] Allow modifications to previous results
- [ ] Add context display
  - [ ] Show what context is being used
  - [ ] Allow user to remove/modify context

### 4.6 State Transition Cleanup
- [ ] Remove all `setTimeout` simulations
  - [ ] In `action-dashboard.tsx`
  - [ ] In `progress-tracker.tsx`
- [ ] Remove all fake data
  - [ ] Remove mock tasks
  - [ ] Remove hardcoded results
- [ ] Implement real state transitions
  - [ ] Trigger by backend events only
  - [ ] No client-side time-based transitions

### 4.7 Testing
- [ ] Manual UI testing
  - [ ] Submit each action type
  - [ ] Verify progress tracker updates in real-time
  - [ ] Verify results render correctly
  - [ ] Verify continuation works
- [ ] Integration testing
  - [ ] Test full flow: Intent → Execution → Results → Continuation
  - [ ] Test failure scenarios in UI
  - [ ] Test reconnection after network failure

---

## PHASE 5 — CLAUDE COWORK PARITY & HARDENING

**Goal**: Polish the system to match professional-grade AI tools.

### 5.1 Iterative Refinement
- [ ] Test multi-turn refinement workflows
  - [ ] Generate → Review → Refine → Finalize
  - [ ] Ensure each iteration builds on previous
- [ ] Add inline editing capabilities
  - [ ] Allow editing results in-place
  - [ ] Generate new plan from edits
- [ ] Add branching support
  - [ ] Fork sessions to explore alternatives
  - [ ] Compare different execution paths

### 5.2 Context Persistence
- [ ] Implement long-running session support
  - [ ] Sessions survive browser refresh
  - [ ] Sessions survive app restart
- [ ] Add session history
  - [ ] View all previous intents in session
  - [ ] Jump back to any previous state
- [ ] Add session recovery
  - [ ] Resume interrupted executions
  - [ ] Restore UI state from session data

### 5.3 Observability & Debugging
- [ ] Create debug panel for developers
  - [ ] Show raw execution events
  - [ ] Show current plan structure
  - [ ] Show agent invocations and responses
- [ ] Add execution logging
  - [ ] Log all steps and decisions
  - [ ] Structured logs for analysis
  - [ ] Export logs for debugging
- [ ] Add performance metrics
  - [ ] Track execution time per step
  - [ ] Track total plan execution time
  - [ ] Identify slow steps
- [ ] Create admin dashboard (optional)
  - [ ] View all active sessions
  - [ ] View system health
  - [ ] View agent utilization

### 5.4 Safety & Validation
- [ ] Add input validation
  - [ ] Sanitize user prompts
  - [ ] Validate context data
  - [ ] Check for malicious inputs
- [ ] Add permission system integration
  - [ ] Use OpenCode permission system
  - [ ] Enforce permissions on tool execution
  - [ ] Show permission requests to user
- [ ] Add rate limiting
  - [ ] Limit execution frequency per user
  - [ ] Prevent resource exhaustion
- [ ] Add audit logging
  - [ ] Log all user actions
  - [ ] Log all plan executions
  - [ ] Comply with data retention policies

### 5.5 UX Polish
- [ ] Add loading states and skeletons
  - [ ] During plan generation
  - [ ] During agent execution
- [ ] Add animations and transitions
  - [ ] Smooth state transitions
  - [ ] Progress animations
  - [ ] Result reveals
- [ ] Add keyboard shortcuts
  - [ ] Submit with Cmd+Enter
  - [ ] Navigate results
  - [ ] Quick actions
- [ ] Add mobile responsiveness
  - [ ] Test on different screen sizes
  - [ ] Optimize for touch interfaces
- [ ] Add accessibility
  - [ ] ARIA labels
  - [ ] Keyboard navigation
  - [ ] Screen reader support

### 5.6 Comparison & Validation
- [ ] Create comparison table vs Claude Cowork
  - [ ] Features comparison
  - [ ] Performance comparison
  - [ ] UX comparison
- [ ] Identify gaps and improvements
  - [ ] Missing features
  - [ ] Performance bottlenecks
  - [ ] UX rough edges
- [ ] Create validation checklist
  - [ ] All action types work end-to-end
  - [ ] Continuation works reliably
  - [ ] Errors are handled gracefully
  - [ ] Performance is acceptable
  - [ ] UI is intuitive

### 5.7 Documentation
- [ ] Update `SYSTEM_CONTRACT.md` with final implementation details
- [ ] Create `ORCHESTRATION_GUIDE.md`
  - [ ] How the orchestrator works
  - [ ] How to add new action types
  - [ ] How to debug issues
- [ ] Update `APPLICATION_ARCHITECTURE_MAP.md`
  - [ ] Add orchestration layer
  - [ ] Add execution flow diagrams
- [ ] Create user documentation
  - [ ] How to use the system
  - [ ] How to interpret results
  - [ ] Troubleshooting guide

### 5.8 Final Testing
- [ ] End-to-end testing for all action types
  - [ ] Test each action type with real data
  - [ ] Verify results are correct and useful
- [ ] Load testing
  - [ ] Test with multiple concurrent sessions
  - [ ] Test with large data sets
  - [ ] Identify performance limits
- [ ] User acceptance testing
  - [ ] Get feedback from real users
  - [ ] Iterate based on feedback

---

## Post-Integration Tasks

### Infrastructure
- [ ] Set up monitoring and alerting
  - [ ] Track execution failures
  - [ ] Track performance degradation
  - [ ] Alert on system issues
- [ ] Set up CI/CD for orchestration layer
  - [ ] Automated tests
  - [ ] Deployment pipeline

### Optimization
- [ ] Profile and optimize slow operations
  - [ ] Optimize plan generation
  - [ ] Optimize agent invocations
  - [ ] Optimize event streaming
- [ ] Add caching where appropriate
  - [ ] Cache plan templates
  - [ ] Cache agent responses (if deterministic)

### Maintenance
- [ ] Create maintenance schedule
  - [ ] Regular log cleanup
  - [ ] Session archive strategy
  - [ ] Artifact cleanup policy

---

## Task Statistics

**Phase 1**: 17 tasks  
**Phase 2**: 18 tasks  
**Phase 3**: 19 tasks  
**Phase 4**: 23 tasks  
**Phase 5**: 28 tasks  
**Post-Integration**: 7 tasks  

**Total**: 112 tasks

---

## Notes

- Each phase builds on the previous phase
- Do NOT skip phases or tasks
- Update this checklist as tasks are completed
- Add new tasks as they are discovered
- Link to created files and PRs for tracking

**Last Updated**: 2026-01-15  
**Status**: Planning Complete — Ready for Phase 1 Execution
