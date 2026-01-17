# Task Checklist - Jan 14 - Productivity Action Dashboard

## Objective
Implement a clean, modern productivity dashboard UI matching the reference design.

## Execution Plan

### 1. Analysis & Preparation
- [x] **Review existing UI components**: Check `@opencode-ai/ui` for usable buttons, cards, and icons.
- [x] **Select Icons**: Map specific icons from the library to the 6 action cards.
- [x] **Define Design Tokens**: Identify Tailwind classes for "warm off-white", "subtle grid", and "serif" typography.

### 2. Component Implementation
- [x] **Create `ActionCard` component**:
  - Semantic HTML (button/link).
  - Hover/Focus states (subtle border/bg change).
  - Layout: Icon + Text (left aligned).
- [x] **Create `DashboardLayout` component**:
  - Background: Warm off-white + Grid pattern.
  - Header: Centered "Lightning" icon + Serif text.
  - Grid Container: 2x3 layout.

### 3. Integration
- [x] **Update `NewSessionView`**:
  - Replace generic "New Session" content with the new `DashboardLayout`.
  - Connect actions to `usePrompt` (pre-fill or submit).

### 4. Visual Polish
- [x] **Typography**: Ensure "Let's move your business..." uses a nice serif font.
- [x] **Spacing**: Verify generous vertical spacing and balanced whitespace.
- [x] **Responsiveness**: Ensure the grid adapts (e.g., 1 col on mobile, 2 on tablet, 3 on desktop).

### 5. Live Execution Progress Phase (Current)
- [x] **Create `ProgressTracker` component**:
    - Collapsible header.
    - Status states (Pending, In-Progress, Completed).
    - Smooth animations.
- [x] **Simulate Execution Logic**:
    - `setInterval` based task completion.
    - Integration with `ProgressTracker`.
- [x] **Refactor Dashboard Flow**:
    - [x] Separate `Preview` (Options List) from `Executing` (Progress Tracker).
    - [x] Add "Confirm Plan" mechanism (Clickable Card).
    - [x] Move "Skip" button to Preview.
    - [x] Ensure `ProgressTracker` only runs in `Executing` state.

### 6. Results Page & Final Polish (Completed)
- [x] **Implement `ResultsView`**:
    - Dynamic content rendering based on Action type.
    - Transitions from Execution state.
    - "Start Over" navigation.
- [x] **Loading State Redesign**:
    - Large central icon with "ecommerce satellite" icons.
    - "Apple-grade" animations and typography.
- [x] **UI Modernization**:
    - Removed borders across dashboard components.
    - Implemented glassmorphism & soft shadows.
    - Redesigned Preview state to "Apple-grade" inset list.
    - **Final Results Page**: Implemented 3-column layout (Summary/Chat, Main Output, Metadata).
- [x] **Prompt Input Polish**:
    - Fixed Enter key icon visibility (Black arrow).

### 7. Branding & Logo Update (Requested)
- [x] **Update Assets**: Replace favicons and app logo with new design.
- [x] **Update Title**: Update page title in HTML.
- [x] **Landing Page**: Update logo usage on the landing/home page.
- [x] **User Journey Integration**: Add subtle logo branding (e.g. loader or background).

### 8. Verification
- [ ] **Browser Check**: Verify UI against the description.
- [ ] **Interaction Check**: Click handlers work.
