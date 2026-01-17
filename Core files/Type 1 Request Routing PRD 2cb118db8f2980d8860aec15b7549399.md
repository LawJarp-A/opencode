# Type 1 Request Routing PRD

> One-line takeaway: If user intent is obvious, ShopOS should act immediately - not think out loud.
> 

## 1. Overview

A large majority of user requests (~80%) do not require:

1. Planning
2. Explicit space selection
3. Multi-step workflows

Implement intelligent **Type 1 (Reflex) vs. Type 2 (Reasoning)** routing at the Orchestrator level.

This product note defines **Type 1 Request Routing** - a fast-path where the Orchestrator instantly recognizes direct execution requests and routes them to the appropriate model or API **without showing a plan, stepper or intermediate UI**.

Figma reference: https://www.figma.com/design/QXxYfdwkILA3s2eeeMtMCp/Spaces-V3?node-id=1688-5737&t=tQXFdnBJ3U5VVcd1-1

## 2. Problem Statement

Currently, the Orchestrator treats many simple requests as if they require planning or workflow execution. This results in:

- Extra cognitive load (plans, steppers, forms) to the user
- Slower time-to-first-output
- Misalignment with user intent

For e.g., “Put this dress on an african female model in front of the beach” → should immediately generate an image - not trigger Space exploration

![image.png](Type%201%20Request%20Routing%20PRD/image.png)

## 3. Goals & Non-goals

Goals:

- Instantly execute simple direct requests
- Minimize UI friction for obvious intents
- Improve perceived performance and responsiveness
- Preserve model attribution and transparency

Non-goals:

- Replacing Type 2 (planned) workflows
- Removing Spaces or structured workflows
- Optimizing for ambiguous or multi-step tasks

## 4. Request Types and Routing Logic

The Orchestrator must evaluate user input **in the following order**:

```
User Input
    │
    ▼
┌─────────────────────────────┐
│     ORCHESTRATOR CHECK      │
│─────────────────────────────│
│ 1. Does input match Space?  │──Yes──▶ Open Space Form (Type 1)
│ 2. Is it image + prompt?    │──Yes──▶ Direct API Call (Type 1)
│ 3. Requires retrieval/plan? │──Yes──▶ Show Plan (Type 2)
└─────────────────────────────┘

```

Important: If checks (1) or (2), do not attempt planning

## 5. User Stories/Use Cases

**5.1 Fast Direct Generation:** As a user, when I provide a simple, direct instruction (e.g., "Put this coat on a model at the beach"), I expect an immediate image generation without having to navigate through planning or configuration steps, so I can get my desired output quickly.

**5.2 Intuitive Interaction:** As a user, I want the system to intelligently understand whether my request is simple or complex, and automatically provide the most streamlined experience possible, so I don't feel burdened by unnecessary interfaces for straightforward tasks.

**5.3 Clear Output Attribution:** As a user, I want to easily see which AI model was responsible for the output, even in a fast, direct generation flow, so I understand the source and characteristics of the result.

**5.4 Efficient Workflow:** As a power user, I want to be confident that simple, repetitive tasks like background removal or caption generation are handled instantly and directly by the appropriate underlying APIs, optimizing my workflow.

## 6. Functional Requirements

### 6.1 Type 1 Direct API Patterns

The orchestrator will specifically identify and route the following common patterns for Type 1 Direct API calls:

- **Image + Simple Instruction:** Direct routing to an image model.
    - Example: "Put this coat on a model at the beach."
    - Default Model: Nano Banana Pro, or other appropriate model based on the "[Image and Video Model Selection](https://www.notion.so/Image-and-Video-Model-Selection-2ca118db8f2980d39449d89b84bedf53?pvs=21)" feature's recommendations/user defaults.
- **Text Processing:** Direct routing to a text model.
    - Example: "Write a caption for this product: [image of product]."
- **Specific API Endpoint:**
    - Example: "Remove background from this image."
- **Language Translation:** Direct routing to an LLM
    - Example: "Translate this to French: 'High-quality silk scarf'."

### 6.2 Architecture Guardrails

**6.2.1 Type detection must live in the Orchestrator, not UI** 

- UI sends raw intent + context (text, form input, trigger)
- The **Orchestrator owns classification** (e.g. Type 1 / Type 2)
- Why:
    - Single source of truth
    - Prevents drift across surfaces (chat, API, dashboard)
    - Allows models + logic to evolve without UI changes

**6.2.2 Routing logic should be stateless**

- No memory of past requests required to route the current one
- Same input → same routing outcome
- No session-based branching, no hidden state

**6.2.3 Easily extendable for new Type 1 patterns**

- Adding a new Type 1 case should be:
    - Config change or small matcher addition
    - Not a refactor
    - Not UI work
    - Not branching hell

### 6.3 Assumed Parameters Disclosure

**6.3.1 Space Attribution**

- When a Space is auto-selected:
    - Show which Space was used
    - Display it in chat (not hidden)
- Applies even when the Space form is skipped

**6.3.2 Assumptions made**

When routing skips a form, the system must:

- Explicitly disclose assumptions made during execution
- Surface them inline in chat before or during generation

Examples of assumptions to display: 

- Selected Space (if any)
- Image Type (product / model / lifestyle)
- Number of outputs
- Chosen model
- Any inferred attributes specific to the space

**6.3.3 Add “Related Spaces” Post-Generation Discovery**

After generation completes, 

- Show 2-3 related spaces as lightweight suggestions
- Shown **after** output (non-blocking)

This helps to nudge further explorations

*Tara to add more functional requirements*

## 7. Response and UI Contract

### 7.1 What must NOT be shown

- Plan, Stepper, Intermediate confirmations

### 7.2 What must be shown

- Direct output only
- Output rended in **Rich Gallery component**
- Streaming begins as soon as model responds

### 7.3 Model Attribution (Mandatory)

- Model attribution must be visible (on hover)
- Display format: Icon + model name; No shadow scrim
- Applies to both Image and Video outputs

## 8. Acceptance Criteria

1. **Accuracy:** Orchestrator correctly routes 95%+ of simple prompts as Type 1.
2. **Performance:** Streamin response begins within 2s
3. **Experience:** No stepper UI, forms or plans appear for direct calls
4. **Visuals:** Model attribution is correctly implemented (hover state)
5. **Fallback:** No regression in Type 2 routing accuracy
6. When form is skipped, system-disclosed assumptions are visible in chat
7. Auto-selected space is explicitly shown to user