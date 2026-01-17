# Call Creative Director (Voice) PRD

## What It Is

**Creative Director (Voice)** is a voice-first interface for creating creative briefs through natural conversation.

Not a chatbot with voice input. A **conversational creative partner** you talk to like a real creative director.

User speaks brief → AI asks clarifying questions → Generates structured brief → One-click workflow execution.

## Figma:

---

## The Problem

**Some users prefer talking over typing.**

Current reality:

- Creative briefs require filling forms
- Forms assume you know exactly what you need
- Typing interrupts creative flow
- Users often don't have language for what they want visually

**The insight:** Voice briefs feel more natural for creative direction. You can describe vibe, reference examples, iterate in real-time—just like talking to a human creative director.

---

## The Solution

Voice interface powered by conversational AI with real-time feedback.

**Core Experience:**

1. User clicks "Talk to Creative Director"
2. Orb interface appears (Eleven Labs visualization)
3. Natural conversation happens
4. AI generates structured brief
5. User reviews/edits/approves
6. Workflow executes

**Key principle:** Voice is for **input**, not output management. Once brief is generated, we shift to visual UI for review and execution.

**Flow:**

```
User clicks "Talk to Creative Director"
        │
        ▼
┌─────────────────────────┐
│   Orb UI (Eleven Labs)  │
│   Connecting...         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Orb: Listening        │
│   User speaks brief     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Orb: Talking          │
│   AI responds           │
└───────────┬─────────────┘
            │ User ends call
            ▼
┌─────────────────────────┐
│   "Generating brief..." │
│   (shimmer text)        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Brief Form Component  │
│   [Work on this brief]  │
└─────────────────────────┘

```

**Post-Call:**

- Show “Generating…” shimmer
- Display brief as form component (readable/editable)
- “Work on this brief” button at bottom
- Clicking shows: “Shop OS is now working on it”

---

## Acceptance Criteria

### Must-Have (V2 Launch)

- [ ]  **Eleven Labs orb renders correctly**
    - Three states animate smoothly
    - No visual artifacts or lag
    - Works on Chrome, Safari, Firefox
- [ ]  **Voice input works cross-browser**
    - Audio captures in all supported browsers
    - Background noise handling (basic)
    - Mute/unmute works
- [ ]  **Brief generates after call ends**
    - Structured form appears <3s after call
    - All conversation context captured
    - Fields correctly populated
- [ ]  **"Work on this brief" triggers workflow**
    - Clicking starts execution
    - Progress tracker displays
    - Same UX as Plan execution
- [ ]  **Conversation quality**
    - AI asks clarifying questions
    - Confirms understanding
    - Handles common edge cases (interruptions, restarts)

### Nice-to-Have (V3)

- [ ]  Multi-language support (Spanish, French, etc.)
- [ ]  Call replay feature
- [ ]  Export transcript option
- [ ]  Voice commands ("start over", "finalize brief")
- [ ]  Ambient noise cancellation (advanced)

---

## Success Metrics

### Adoption

- % of users who try voice vs. text input
- Voice brief completion rate (start → brief generated)
- Repeat usage rate (users who voice brief 2+ times)

### Quality

- Brief accuracy (user edits required post-generation)
- Average call duration
- Conversation turns (fewer = better clarity)

### Value

- Time to brief completion (voice vs. text)
- User satisfaction rating (post-call survey)
- Workflow execution rate (briefs that convert to action)