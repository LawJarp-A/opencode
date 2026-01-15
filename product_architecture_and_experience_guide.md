# System Architecture & Experience Guide: The AI-First Execution Engine

## 1. Product Overview

This application is fundamentally different from a typical "AI chatbot" or a static "admin dashboard." It is a **Task-Oriented Execution Interface** designed to act as an operating system for getting work done.

In a traditional chatbot, the user converses with an AI to get text back. In this system, the user defines **intent**, and the system performs **orchestrated execution** to deliver a tangible **result**.

### Core Philosophy
The guiding principle is **"Humans Decide, Systems Execute."**

1.  **Intent Capture**: The user provides the "what" and "why" (Intent).
2.  **Orchestration**: The system determines the "how" (Plan).
3.  **Execution**: The system performs the work (Action).
4.  **Verification**: The system presents the outcome for review (Result).

This shift moves the user from a generic conversationalist to an **executive director** of AI agents.

---

## 2. High-Level System Architecture

The system operates as a directional pipeline, moving from unstructured human intent to structured machine execution.

```text
User
 │
 │ (1. Intent)
 ▼
Intent UI
[Action Cards + Context-Aware Prompt Input]
 │
 │ (2. Normalization)
 ▼
Intent Object
{ ActionType, PromptText, ContextData }
 │
 │ (3. Submission)
 ▼
OpenCode Orchestrator
[ The "Brain" / Planner ]
 │
 │ (4. Generation)
 ▼
Execution Plan
[ Ordered Sequence of Steps: Step 1 → Step 2 → Step N ]
 │
 │ (5. Execution Events)
 ▼
Progress Engine ──► UI Progress Tracker (Live Updates)
 │
 │ (6. Completion)
 ▼
Results Renderer
[ Summary | Hero Result | Metadata ]
 │
 │ (7. Continuation)
 ▼
Loop
```

Each stage of the architecture maps directly to a specific UI state, ensuring the user's mental model always aligns with the system's actual state.

---

## 3. UI Flow — Step by Step

### Step 1: Entry & Intent Selection
**State**: `Input`
*   **User Sees**: A curated grid of "Action Cards" (high-level capabilities) and a central, robust input field.
*   **User Thinking**: "I need to get X done. Which capability matches my goal?"
*   **System Action**: The system listens for interaction. Selecting a card primes the specialized agent context. Typing in the box adds free-form constraints.
*   **Why**: This reduces "blank page anxiety." Instead of asking "What can you do?", the system says "Here is what I can do. Choose one."

### Step 2: Submission & Loading
**State**: `Loading` -> `Planning`
*   **User Sees**: The interface locks. A subtle, sophisticated loading animation appears. Text changes to "Analyzing context..." or "Shaping campaign..."
*   **User Thinking**: "The system has accepted my request and is thinking."
*   **System Action**: The intent object is sent to the Orchestrator. The AI evaluates the request against available tools and data sources.
*   **Why**: Acknowledgment is crucial. The loading state acts as a "handshake," confirming transfer of responsibility from user to system.

### Step 3: Execution & Progress
**State**: `Executing`
*   **User Sees**: A live **Progress Tracker**. A list of steps appears. The active step pulses (`in-progress`). Completed steps turn green. Future steps are grey.
*   **User Thinking**: "It's working. I can see exactly what it's doing. I trust this process."
*   **System Action**: The Orchestrator sequentially triggers agents/tools. As each function completes, it emits a `STEP_COMPLETE` event, enabling the next step in the dependency graph.
*   **Why**: Transparency builds trust. Hiding execution in a "black box" creates anxiety. Showing the steps proves the system is deterministic and logical.

### Step 4: Completion & Transition
**State**: `Transition`
*   **User Sees**: The final step completes. The progress tracker settles (visual calm). The screen creates a soft transition to the Results Page.
*   **User Thinking**: "The work is finished. Now I see the output."
*   **System Action**: The Orchestrator aggregates all artifacts (files, data, summaries) into a final `ResultObject` and passes it to the renderer.
*   **Why**: Automated transition reinforces that the system *drives* the workflow. The user doesn't need to "click to see results"; the results are the destination.

### Step 5: The Results Page
**State**: `Result`
*   **User Sees**: A structured, 3-column layout. Left: "Mission Complete" summary. Center: The Work itself. Right: Evidence and logs.
*   **User Thinking**: "Okay, here is what I asked for. It looks correct. What next?"
*   **System Action**: The system renders the `ResultObject` using specialized components (charts, document previews, lists). It simultaneously prepares the chat context for follow-up.
*   **Why**: Clarity is paramount. The user typically has 3 immediate questions: "Did it work?", "Show me.", and "How do I tweak it?". The layout answers these spatially.

### Step 6: Continuation
**State**: `Loop`
*   **User Sees**: A chat input anchored to the bottom of the Left Column, labeled "What would you like to do next?".
*   **User Thinking**: "Actually, can you change X?" or "Great, now export this."
*   **System Action**: The input captures the *new* intent, but this time with the *result* as context. The cycle restarts at Step 2 (Loading/Planning).
*   **Why**: Work is rarely "one-shot." It is iterative. The continuation loop turns a linear task into a conversational workflow.

---

## 4. OpenCode / Orchestrator Deep Dive

The **OpenCode Orchestrator** is the logic core. It is not just an LLM wrapper; it is a **Chain-of-Thought Planner**.

### Responsibilities
1.  **Decomposition**: Breaking a high-level intent ("Launch a campaign") into atomic, executable units ("Research audience", "Draft copy", "Generate assets").
2.  **Dependency Management**: Ensuring Step B only starts after Step A provides the necessary output.
3.  **Tool Selection**: Mapping steps to specific software tools (e.g., Email API, Analytics DB, File System).
4.  **Error Handling**: If a step fails, the Orchestrator decides whether to retry, hallucinate a fallback, or ask the user for help.

### The Execution Plan
The output of the Orchestrator is a **Deterministic Execution Plan**:
```json
{
  "plan_id": "exec_123",
  "steps": [
    { "id": 1, "action": "scrape_url", "status": "pending" },
    { "id": 2, "action": "summarize_text", "status": "pending", "depends_on": [1] },
    { "id": 3, "action": "generate_report", "status": "pending", "depends_on": [2] }
  ]
}
```
This structured plan is what powers the UI. The UI is simply a *renderer* of this JSON state.

---

## 5. Progress & Transparency Model

The modern user is skeptical of "Magic AI." They fear hallucinations and hidden errors.

### The Transparency Contract
To solve this, we adhere to a strict model: **"Show your work."**

*   **State Machine**: Every task exists in one of three rigid states: `Pending` → `In-Progress` → `Completed`. No vague states allowed.
*   **Granularity**: Steps are granular enough to be meaningful (e.g., "Scanning database") but not technical noise (e.g., "TCP handshake").
*   **Subscription**: The UI acts as a subscriber. It does not guess progress; it reflects the truthful state of the backend.

by exposing the mechanics of execution, we convert the user's anxiety ("Is it working?") into anticipation ("I see it working").

---

## 6. Results Page Mental Model

The results page is the "Hero Moment." It must answer three questions instantly.

| Question | Column | Mental Role |
| :--- | :--- | :--- |
| **"What happened?"** | **Left Column** | **The Executive Summary.** Human-readable, calm, confirming success. Anchors the user. |
| **"What did I get?"** | **Center Column** | **The Hero.** The actual value delivered. This is the only thing that matters. It takes up 50%+ of the screen. |
| **"Is this real?"** | **Right Column** | **The Proof.** Metadata, logs, artifacts, and context. "Check my work" data for skepticism. |

This "Triptych Layout" (Left-Center-Right) forces a hierarchy of information that guides the eye from **Understanding** (Left) to **Value** (Center) to **Verification** (Right).

---

## 7. Continuation Loop (Critical)

In traditional software, a "Results Page" is a dead end. You export and leave.
In this system, the Results Page is a **new starting line**.

### The Infinite Context Chain
1.  **Result State**: The system holds the generated output in memory.
2.  **Prompt Interaction**: The user types a follow-up ("Change the tone to professional").
3.  **Context Re-injection**: The system packages `[Original Intent] + [Result] + [New Modification]` as a new Intent Bundle.
4.  **Re-Orchestration**: OpenCode generates a *new* plan (e.g., "Edit Document" → "Save Version").

This allows for **refinement**, **pivoting**, and **expansion** without losing context. The app feels like a continuous collaboration session, never a transaction.

---

## 8. Why This UX Works

### Cognitive Load Reduction
*   **Traditional AI**: "Here is a blank box. Prompt me perfectly." (High load)
*   **This System**: "Select an action. I'll handle the steps. Review the output." (Low load)

### Trust Building
*   **Traditional AI**: Spinners that last 30 seconds with no feedback.
*   **This System**: Step-by-step visibility keeps the user tethered to reality.

### Scale
*   **Traditional AI**: Chat interfaces collapse under complex, multi-file outputs.
*   **This System**: The specialized Results Page can handle complex UI (charts, grids, previews) without clogging a chat history.

---

## 9. Final Mental Model Summary

| Layer | System Component | User Psychology | Key Metric |
| :--- | :--- | :--- | :--- |
| **Intent** | Action Cards + Input | "I have a goal." | Selection Speed |
| **Plan** | Orchestrator | "Make a plan for me." | Confidence |
| **Action** | Progress Tracker | "Show me it's working." | Transparency |
| **Result** | Results View | "Give me value." | Clarity |
| **Loop** | Chat Context | "Let's refine this." | Flow |

**Conclusion**: This application is a machine for converting abstract human goals into concrete digital reality, using transparency and structure to bridge the gap between "Idea" and "Done."
