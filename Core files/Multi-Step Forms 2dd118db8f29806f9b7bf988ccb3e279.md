# Multi-Step Forms

# MULTI-STEP FORMS PRD: GENERATIVE UI FOR DATA COLLECTION

*Status:* Tier 1 - Foundation (Ship First) | *Timeline:* 3 weeks | *Last Updated:* January 3, 2026

*Author:* Product Team

*Figma:* [https://www.figma.com/design/QXxYfdwkILA3s2eeeMtMCp/Spaces-V3?node-id=1039-198880](https://www.figma.com/design/QXxYfdwkILA3s2eeeMtMCp/Spaces-V3?node-id=1039-198880)

---

# 📋 SHAPE UP PITCH

## Problem

Every Space requires different inputs. Static forms don't scale and kill completion rates.

*Current broken state:*

```
User opens Space (e.g., "Product Image Generator")
  ↓
Faces form with 20+ fields all at once
  ↓
On mobile: Endless scrolling, tiny inputs, confusion
  ↓
User sees: "Brand name, product type, target audience, tone, style, colors, background, props, lighting, angle, composition, mood..."
  ↓
User abandons (60% drop-off)
```

*The problems:*

1. *Static forms don't scale* → Each Space has hardcoded forms, need dev changes
2. *Overwhelming cognitive load* → 20 fields at once = analysis paralysis
3. *Poor mobile UX* → Long forms are unusable on phones
4. *No learning* → Forms don't adapt based on Brand Memory
5. *Inconsistent experience* → Each Space feels different

*Real user pain:* "I started filling out the form for product images on my phone. After scrolling through 15 fields, I gave up. Too much. I'll do it later on desktop." (User never returns = 40% abandonment)

## Appetite

*3 weeks*

Forms are the gateway to every Space. If users can't complete forms, they can't use Spaces. This is existential.

We're investing 3 weeks because forms are complex: validation, auto-fill, responsive design, auto-save, progress tracking. But this unlocks all 57+ Spaces.

## Solution

*Multi-Step Forms = Generative UI That Adapts to Each Space*

Not hardcoded forms. *Dynamic forms generated from Space requirements + Brand Memory + user behavior.*

*The Experience:*

```
User opens Space
  ↓
Form breaks into 4 steps (3-5 fields each)
  ↓
Step 1: "Let's start with basics"
  - Brand name (auto-filled from Brand Memory ✓)
  - Product type (auto-filled ✓)
  - Target audience (auto-filled ✓)
  All fields pre-populated, user just confirms
  ↓
User clicks "Next" (2 seconds)
  ↓
Step 2: "Creative direction"
  - Tone (dropdown, previously used options surfaced)
  - Style (visual examples)
  - Colors (brand palette auto-loaded ✓)
  ↓
User selects, clicks "Next" (10 seconds)
  ↓
Step 3: "Details"
  - Background preference
  - Lighting
  - Composition
  ↓
User fills, clicks "Next" (15 seconds)
  ↓
Step 4: "Review & Generate"
  - All inputs shown (editable)
  - "Generate" button
  ↓
Total time: 45 seconds (vs 8-12 min static form)
Completion rate: 82% (vs 60%)
```

*Key Features:*

1. *Smart Auto-Fill:*
    - Brand Memory populates 60-80% of fields automatically
    - User confirms, doesn't type
    - "Edit" option if incorrect
2. *Progress Tracking:*
    - Visual progress bar ("Step 2 of 4")
    - Estimated time remaining ("~1 min left")
    - Clear navigation ("Back", "Next", "Skip")
3. *Auto-Save:*
    - Progress saved every 5 seconds to localStorage
    - User can close, return later, resume
    - "Draft saved" indicator
4. *Responsive Design:*
    - Mobile-first (touch-friendly, large inputs)
    - Desktop-optimized (keyboard shortcuts)
    - Tablet-aware (2-column layout)
5. *Smart Timers:*
    - Inactivity detection (30s no input → prompt: "Still there?")
    - Auto-advance (optional: some fields auto-submit after selection)
    - Estimated completion time updates dynamically
6. *Validation:*
    - Real-time on blur (field loses focus → validate)
    - Inline errors (red border, message below field)
    - Block "Next" if errors present
    - Show all errors at once (not one-by-one)

## Rabbit Holes

*Don't build:*

- *AI-suggested form fields.* Space defines required fields, not AI.
- *Custom form builder UI.* Spaces have fixed schemas, forms are generated.
- *Animated transitions.* Simple fade is fine, no fancy animations.
- *Conditional branching logic.* Keep steps linear, no if/then flows.
- *Form analytics dashboards.* Track metrics but no custom reporting UI.

*Reuse existing:*

- Brand Memory (auto-fill source)
- Form components (inputs, selects, checkboxes)
- Validation library (if exists)

*Watch out for:*

- Auto-fill accuracy (bad data = bad UX)
- Mobile keyboard issues (numeric inputs, date pickers)
- Auto-save conflicts (multiple tabs open)
- Progress tracking edge cases (user skips steps)

## No-Gos

*Explicitly NOT doing:*

- ✖ Custom form builder (users can't create forms)
- ✖ Conditional logic (if/then branching)
- ✖ Multi-language forms (English only for Phase 1)
- ✖ Form templates marketplace (no sharing forms)
- ✖ Advanced validation rules (regex patterns, custom validators)

---

# 🔧 ENGINEERING PRD

## 1. OBJECTIVE

*Purpose:*
Build a generative UI system that dynamically creates optimized multi-step forms for every Space, with smart auto-fill from Brand Memory, real-time validation, auto-save, and responsive design. Increase form completion rate from 60% to 80%.

*Goal:*

- *80% form completion rate* (vs 60% current)
- *<5 min time to complete* (vs 8-12 min current)
- *<10% drop-off per step* (vs 25%+ current)
- *95% auto-fill accuracy* (from Brand Memory)
- *<2 min for returning users* (Brand Memory pre-fills most fields)

*Context:*
Forms are the gateway to Spaces. Poor form UX = users can't access core product. Multi-step forms reduce cognitive load, improve mobile UX, and leverage Brand Memory for speed.

## 2. SCOPE

### In Scope

*Core Form System:*

- Multi-step form generator (break long forms into 3-5 steps)
- Step component (renders 3-5 fields per step)
- Progress bar (visual indicator, "Step 2 of 4")
- Navigation (Back, Next, Skip buttons)
- Form state management (track current step, completed steps)

*Auto-Fill Engine:*

- Brand Memory integration (pull user/brand data)
- Smart prefill (populate fields automatically)
- Confidence scoring (high confidence = auto-fill, low confidence = suggest)
- Edit capability (user can override auto-filled values)

*Validation:*

- Real-time validation (on blur, per field)
- Inline error messages (below field, red border)
- Block progression (can't advance with errors)
- Show all errors (not one-by-one reveal)

*Auto-Save:*

- localStorage persistence (save every 5 seconds)
- Draft recovery (resume if user closes/refreshes)
- "Draft saved" indicator (timestamp: "Saved 3 seconds ago")
- Clear drafts (after successful submission)

*Timers & Inactivity:*

- Inactivity detection (30s no input → prompt)
- Estimated time remaining (updates dynamically)
- Auto-advance (optional, for simple selections)

*Responsive Design:*

- Mobile-first (touch targets ≥44px, large inputs)
- Desktop-optimized (keyboard shortcuts, Enter to advance)
- Tablet-aware (2-column layout for wider screens)

*Integration Points:*

- All 57+ Spaces (form definitions from Space configs)
- Brand Memory (data source for auto-fill)
- Files library (image uploads in forms)

### Out of Scope (Phase 2)

- Custom form builder (user-created forms)
- Conditional logic (if/then branching)
- Multi-language support
- Form templates marketplace
- Advanced validation (regex, custom rules)
- Form analytics dashboard

*Phase:* Phase 1 (Foundation) - 3 weeks

## 3. INPUTS

*1. Space Configuration (Form Schema):*

```json
{
  "space_id": "product_image_generator",
  "form_schema": {
    "steps": [
      {
        "id": "basics",
        "title": "Let's start with basics",
        "fields": [
          {"id": "brand_name", "type": "text", "label": "Brand Name", "required": true, "autofill": "brand_[memory.name](http://memory.name)"},
          {"id": "product_type", "type": "select", "label": "Product Type", "options": ["Apparel", "Electronics", "Home"], "required": true},
          {"id": "target_audience", "type": "text", "label": "Target Audience", "autofill": "brand_[memory.target](http://memory.target)_audience"}
        ]
      },
      {
        "id": "creative",
        "title": "Creative direction",
        "fields": [
          {"id": "tone", "type": "select", "label": "Tone", "options": ["Professional", "Playful", "Bold"]},
          {"id": "colors", "type": "color_palette", "label": "Colors", "autofill": "brand_memory.colors"}
        ]
      }
    ]
  }
}
```

*2. Brand Memory Data:*

```json
{
  "brand_name": "Arctic Outfitters",
  "target_audience": "Outdoor enthusiasts, 25-40",
  "colors": ["#1a4d2e", "#f9f7f3", "#e8b923"],
  "tone": "Professional",
  "product_categories": ["Apparel", "Outdoor Gear"]
}
```

*3. User Actions:*

- Fill field (type, select, upload)
- Click "Next" (advance to next step)
- Click "Back" (return to previous step)
- Click "Skip" (skip optional fields)
- Edit auto-filled field (override default)
- Submit form (final step)

## 4. OUTPUTS

*1. Form State Object:*

```json
{
  "form_id": "uuid",
  "space_id": "product_image_generator",
  "current_step": 2,
  "total_steps": 4,
  "completed_steps": [1],
  "data": {
    "brand_name": "Arctic Outfitters",
    "product_type": "Apparel",
    "target_audience": "Outdoor enthusiasts, 25-40",
    "tone": "Professional"
  },
  "auto_filled_fields": ["brand_name", "target_audience", "colors"],
  "errors": {},
  "last_saved": "2025-01-15T10:32:15Z"
}
```

*2. Submitted Form Data:*

- All field values (validated)
- Metadata (submission time, auto-fill accuracy)
- Passed to Space execution engine

*3. Analytics Events:*

- `form_started` (space_id, user_id)
- `form_step_completed` (step_id, time_on_step)
- `form_step_abandoned` (step_id, fields_completed)
- `form_field_autofilled` (field_id, confidence_score)
- `form_field_edited` (field_id, was_autofilled)
- `form_submitted` (space_id, total_time, auto_fill_count)
- `form_draft_saved` (form_id, step_id)
- `form_draft_resumed` (form_id, step_id)

## 5. CORE REQUIREMENTS

### Multi-Step Form Generation

1. Form schema defined in Space config (JSON)
2. Generator breaks schema into 3-5 steps (3-5 fields each)
3. Progress bar shows: current step, total steps, % complete
4. Each step renders independently (lazy load next step)
5. Navigation: Back (previous step), Next (advance), Skip (optional fields only)

### Smart Auto-Fill

1. On form load, query Brand Memory for user/brand data
2. Match form fields to Brand Memory keys (via `autofill` mapping)
3. Confidence scoring:
    - High (≥90%): Auto-fill, show checkmark
    - Medium (70-89%): Suggest value, show "Confirm?"
    - Low (<70%): Leave empty, no suggestion
4. Auto-filled fields visually distinct (checkmark icon, light green background)
5. User can edit any auto-filled field (click field → edit → checkmark changes to pencil icon)
6. Track auto-fill accuracy (did user keep or change value)

### Real-Time Validation

1. Validate on blur (user leaves field)
2. Validation rules:
    - Required fields (can't be empty)
    - Type validation (email, URL, number)
    - Min/max length (text fields)
    - Min/max value (number fields)
    - Format validation (phone, date)
3. Show errors inline:
    - Red border on field
    - Error message below field ("This field is required")
    - Error icon next to label
4. Block "Next" button if current step has errors
5. Show error summary at top of step if multiple errors

### Auto-Save

1. Save form state to localStorage every 5 seconds
2. Save on field change (debounced 500ms)
3. Save on step change (before advancing)
4. "Draft saved" indicator updates timestamp: "Saved 3 seconds ago"
5. On page reload:
    - Check localStorage for draft
    - If found → Show modal: "Resume draft or start fresh?"
    - If resumed → Load form state, jump to last completed step
6. Clear draft on successful submission
7. Expire drafts after 7 days (auto-cleanup)

### Timers & Inactivity

1. *Estimated time remaining:*
    - Calculate based on avg time per step (from analytics)
    - Display above progress bar: "~2 min remaining"
    - Update after each step completion
2. *Inactivity detection:*
    - Track last user interaction
    - After 30s no input → Show toast: "Still there? We've saved your progress."
    - After 5 min → Auto-save, show: "We've saved your draft. Come back anytime!"
3. *Auto-advance (optional):*
    - For simple selections (radio, checkbox)
    - After selection → Wait 1 second → Auto-advance to next step
    - User can disable: "Don't auto-advance" toggle

### Responsive Design

1. *Mobile (≤768px):*
    - Single-column layout
    - Touch targets ≥44px
    - Large inputs (18px font, 48px height)
    - Sticky navigation (Back/Next always visible at bottom)
    - Hide keyboard on scroll (prevent layout shift)
2. *Tablet (769-1024px):*
    - 2-column layout for fields (where sensible)
    - Larger progress bar
    - Side-by-side navigation
3. *Desktop (>1024px):*
    - Max width 800px (prevent wide forms)
    - Keyboard shortcuts (Enter = Next, Esc = Back)
    - Hover states on inputs
    - Tab navigation optimized

## 6. BEHAVIORS & RULES

### Step Progression

- User cannot advance to next step if current step has validation errors
- User can go back to previous steps anytime (edit previous inputs)
- Editing previous step doesn't reset future steps (data preserved)
- "Skip" button only visible for optional fields (required fields can't be skipped)

### Auto-Fill Behavior

*High Confidence (≥90%):*

- Field auto-populated on form load
- Checkmark icon displayed
- Light green background (subtle)
- User can click to edit

*Medium Confidence (70-89%):*

- Field shows suggested value with "Confirm?" label
- User must actively confirm or change
- No auto-populate, requires user action

*Low Confidence (<70%):*

- Field left empty
- No suggestion shown
- User must fill manually

### Validation Timing

- *On blur:* Validate when user leaves field
- *On submit:* Validate all fields before form submission
- *Not on change:* Don't validate while user is typing (annoying)

*Special cases:*

- Email field: Validate on blur (check format)
- URL field: Validate on blur (check format + reachability, optional)
- Number field: Validate on blur (check range)

### Auto-Save Conflict Resolution

*Scenario: User has form open in 2 tabs*

- Tab 1 saves draft at 10:00:00
- Tab 2 saves draft at 10:00:05
- Solution: Last write wins (Tab 2 overwrites Tab 1)
- Warning shown: "Draft updated in another tab. Reload to see latest?"

### Draft Expiration

- Drafts saved with timestamp
- On form load, check draft age
- If >7 days old → Delete draft, start fresh
- If <7 days old → Offer resume

## 7. TECHNICAL CONSTRAINTS & EDGE CASES

### Performance Requirements

- Form load: <1 second (including Brand Memory query)
- Step transition: <200ms
- Auto-save: <100ms (localStorage write)
- Validation: <50ms per field

### Browser Compatibility

- Chrome/Edge/Safari/Firefox (last 2 versions)
- localStorage support required
- Touch events for mobile
- Keyboard events for desktop

### Auto-Fill Accuracy

- Target: 95% accuracy (user keeps auto-filled value)
- Measure: `(Auto-filled values kept) / (Total auto-filled fields)`
- If accuracy <90% for any field → Review Brand Memory mapping

### Error Handling

*1. Brand Memory Query Fails:*

- Retry 2x
- If still fails → Show form without auto-fill
- Toast: "Couldn't load saved info. Please fill manually."

*2. localStorage Full:*

- Clear old drafts (oldest first)
- If still full → Disable auto-save
- Toast: "Can't save draft (storage full). Submit form to clear space."

*3. Validation Service Down:*

- Client-side validation only (basic rules)
- Skip complex validation (email verification, URL reachability)
- Log error for monitoring

### Edge Cases

*1. User Skips All Optional Fields:*

- Form still valid (only required fields matter)
- Show warning: "Skipping optional fields may reduce output quality"
- Allow submission

*2. Auto-Fill Populates Incorrect Data:*

- User edits field
- Track: `form_field_edited` event with `was_autofilled: true`
- Use to improve Brand Memory accuracy

*3. User Navigates Away Mid-Form:*

- Auto-save triggers (form state saved)
- On return → Offer resume
- If user declines → Start fresh

*4. Multiple Users, Same Account:*

- Brand Memory is account-level (shared)
- Auto-fill works for all users
- Personal fields (e.g., name) not auto-filled

## 8. USER STORIES (SUCCESS CRITERIA)

### Story 1: Mobile User, First Time

*User:* Emma, fashion brand owner (iPhone, commuting)

```
Emma opens "Product Image Generator" Space on phone
  ↓
Form loads, shows Step 1 of 4
  ↓
Progress bar: "~2 min to complete"
  ↓
Step 1: "Let's start with basics"
  - Brand name: "Arctic Outfitters" ✓ (auto-filled from Brand Memory)
  - Product type: Dropdown, selects "Apparel"
  - Target audience: "Outdoor enthusiasts, 25-40" ✓ (auto-filled)
  ↓
Emma confirms auto-filled values, taps "Next" (10 seconds on step)
  ↓
Step 2: "Creative direction"
  - Tone: Selects "Professional"
  - Colors: Brand palette auto-loaded ✓
  ↓
Taps "Next" (8 seconds)
  ↓
Step 3: "Details"
  - Background: Selects "Outdoor"
  - Lighting: Selects "Natural"
  ↓
Taps "Next" (12 seconds)
  ↓
Step 4: "Review & Generate"
  - All inputs shown (editable)
  - "Generate" button
  ↓
Emma taps "Generate" (5 seconds to review)
  ↓
Total time: 45 seconds (vs 8-12 min on old form)
  ↓
Space executes, images generated
```

*Outcome:* Emma completes form in under 1 minute on mobile. Auto-fill eliminated typing. Multi-step reduced overwhelm.

---

### Story 2: Returning User, Desktop

*User:* Marcus, home decor brand (desktop, power user)

```
Marcus opens "Ad Creative Generator" Space
  ↓
Form loads
  ↓
Step 1 auto-filled completely:
  - Brand name ✓
  - Product type ✓
  - Target audience ✓
  - Tone ✓
  ↓
Marcus presses Enter (keyboard shortcut, advances immediately)
  ↓
Step 2 mostly auto-filled:
  - Colors ✓
  - Style: "Minimal" (previously used, surfaced first in dropdown)
  ↓
Marcus selects "Minimal", presses Enter (5 seconds)
  ↓
Step 3:
  - Channels: Checks "Meta" and "Instagram" (2 clicks)
  ↓
Presses Enter (3 seconds)
  ↓
Review step, presses Enter to submit
  ↓
Total time: 15 seconds (vs 4-5 min without auto-fill)
  ↓
Space executes
```

*Outcome:* Returning user with Brand Memory completes form in <20 seconds. Auto-fill + keyboard shortcuts = extreme speed.

---

### Story 3: Draft Recovery After Interruption

*User:* Lily, beauty brand (laptop, interrupted mid-form)

```
Lily opens "Email Campaign Generator" Space
  ↓
Completes Step 1 and Step 2
  ↓
Draft auto-saved (localStorage)
  ↓
Step 3: Phone rings, Lily closes laptop (emergency call)
  ↓
2 hours later
  ↓
Lily returns, opens ShopOS
  ↓
Modal appears: "Resume draft or start fresh?"
  ↓
Lily clicks "Resume"
  ↓
Form loads at Step 3 (where she left off)
  ↓
All previous data intact (Step 1, Step 2 filled)
  ↓
Lily completes Step 3 and Step 4 (2 min)
  ↓
Submits form
  ↓
Total time: 4 min (vs 15+ min if she had to start over)
```

*Outcome:* Draft recovery prevents abandonment. Lily didn't lose work despite interruption.

---

### Story 4: Validation Prevents Bad Submission

*User:* Alex, electronics brand (tablet, rushing)

```
Alex opens "Product Description Generator" Space
  ↓
Step 1: Fills fields quickly
  ↓
Email field: Types "alex@company" (missing .com)
  ↓
Clicks "Next"
  ↓
Validation blocks:
  - Red border on email field
  - Error: "Please enter a valid email address"
  - "Next" button disabled
  ↓
Alex corrects: "[alex@company.com](mailto:alex@company.com)"
  ↓
Error clears, "Next" button enabled
  ↓
Proceeds to Step 2
  ↓
Rest of form completes successfully
```

*Outcome:* Validation caught error before submission. Prevented failed Space execution due to invalid input.

---

## 9. DELIVERABLES

### Code

*1. Frontend Components:*

- MultiStepForm (orchestrator component)
- FormStep (renders current step)
- FormField (text, select, checkbox, color_palette, file_upload)
- ProgressBar (visual indicator)
- NavigationButtons (Back, Next, Skip)
- ValidationMessage (inline errors)
- AutoSaveIndicator ("Draft saved" timestamp)
- DraftResumeModal ("Resume or start fresh?")

*2. Core Services:*

- Form generator (schema → multi-step UI)
- Auto-fill engine (Brand Memory integration)
- Validation service (real-time, per-field)
- Auto-save service (localStorage management)
- Draft recovery service (load saved state)

*3. State Management:*

- Form state (current step, data, errors, auto-filled fields)
- localStorage persistence
- Draft expiration logic

*4. Integration Layer:*

- Brand Memory API (query user/brand data)
- Space configs (form schemas)
- Space execution engine (submit form → trigger workflow)

*5. Testing:*

- Unit tests (validation, auto-fill, auto-save) - 80% coverage
- Integration tests (full form flow, draft recovery)
- E2E tests (mobile, desktop, tablet)
- Accessibility tests (keyboard nav, screen readers)
- Performance tests (load time, step transitions)

### Documentation

*1. User Docs:*

- How multi-step forms work
- Understanding auto-fill
- Draft recovery
- Mobile vs desktop UX

*2. Developer Docs:*

- Form schema specification
- Adding new field types
- Validation rules reference
- Auto-fill mapping guide

---

# NOTES

*Phase 1 Priority:* Core multi-step flow, auto-fill, validation, auto-save. Prove completion rates improve.

*What NOT to Build:*

- ✖ Custom form builder
- ✖ Conditional logic
- ✖ Multi-language
- ✖ Advanced validation (regex, custom)
- ✖ Form templates

*Performance Critical:*

- Form load MUST be <1 second (including Brand Memory query)
- Step transitions MUST be <200ms (feel instant)
- Auto-fill accuracy MUST be >90% (bad auto-fill = worse than no auto-fill)
- Auto-save MUST not block UI (<100ms write)

*Integration Dependencies:*

- Brand Memory (must exist, must be accurate)
- Space configs (form schemas defined per Space)
- localStorage (browser support required)

*Testing Priorities:*

1. Auto-fill accuracy (95% target)
2. Mobile UX (touch, keyboard, responsiveness)
3. Draft recovery (localStorage, resume flow)
4. Validation (all field types, edge cases)
5. Performance (load time, transitions)

*Monitoring & Alerts:*

- Form completion rate (alert if <75%)
- Auto-fill accuracy (alert if <90%)
- Drop-off per step (alert if >15% any step)
- Auto-save failures (alert if >5%)
- Draft recovery usage (track weekly)

---

*END OF MULTI-STEP FORMS PRD*