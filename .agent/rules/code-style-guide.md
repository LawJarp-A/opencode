---
trigger: always_on
---

# ShopOS / OpenCode — Global UI Rules (Agent-Enforced)

These rules apply to the **entire application UI**.  
Any UI work must comply with this guide **by default** unless explicitly overridden.

---

## 1) Typography (Mandatory)

### Primary Font
- **Segoe UI** must be the global UI font.

### Required Font Stack
Use this font stack everywhere:
`"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`

### Type Scale (Baseline)
- Page Titles: **20–24px**, font-weight **600**
- Section Titles: **14–16px**, font-weight **600**
- Body Text: **13–14px**, font-weight **400–500**
- Helper Text: **12–13px**, font-weight **400**
- Labels / Chips: **12px**, font-weight **500**

### Rendering
- Crisp UI typography only
- No decorative fonts unless explicitly asked

---

## 2) Background & Surfaces (Mandatory)

### App Background
- The global background must be a **beige / matte white**
- It must feel soft and calm, **not bright white**

### Surfaces
- Default container/card surface: **White**
- Secondary surface: **Warm off-white** (slightly darker than white)

---

## 3) Text Color Rules (Mandatory)

### On Light Backgrounds (White / Beige / Off-White)
✅ Primary text must be **near-black**  
✅ Secondary text must be **soft muted gray**  
❌ Never use low-contrast gray for primary content

**Hard rule:**
> If the background is white or light → text must be black / near-black.

---

## 4) Color Style Guide (Design Tokens)

### Neutrals
- **App Background (Beige Matte):** `#F6F1E8`
- **Surface White:** `#FFFFFF`
- **Surface Alt (Warm Off-White):** `#FBF7F0`
- **Border Subtle:** `#E6E0D8`

### Text
- **Primary Text (Near Black):** `#141414`
- **Secondary Text (Muted Gray):** `#5C5C5C`
- **Tertiary / Hint Text:** `#8A8A8A`

### Accents (Restrained Only)
- **Primary Accent (Blue):** `#2563EB`
- **Success (Green):** `#16A34A`
- **Warning (Amber):** `#D97706`
- **Error (Red):** `#DC2626`

### Optional Warm Accent (Use Sparingly)
- **Warm Highlight (Peach/Sand):** `#E7B68C`

---

## 5) Component Styling Rules (Mandatory)

### Borders
- Default border: **1px** using `#E6E0D8`
- Borders must be subtle and soft
- Avoid heavy outlines

### Shadows
- Soft, minimal shadows only
- No harsh elevation stacks
- Avoid “floating card” heavy shadow patterns

### Corner Radius
- Panels / Cards: **14–18px**
- Buttons: **12–16px**
- Chips: **fully rounded (pill)**

---

## 6) Interaction States (Mandatory)

### Hover
- Subtle only:
  - slight background lift OR
  - slight border emphasis
- No dramatic scaling or loud color changes

### Focus
- Must be visible and accessible
- Use **Primary Accent Blue** for focus ring
- Focus should feel intentional, not flashy

### Disabled
- Clear disabled state
- Do not make disabled states confusingly close to enabled

---

## 7) Status Color Rules (Strict)

✅ Green = Success / Completed only  
✅ Blue = Active / In-progress only  
✅ Amber = Warning only  
✅ Red = Error only  

❌ Do not use status colors as decoration.

---

## 8) Progress Tracker Requirements

### Completed
- Green check icon
- Muted label text
- Strikethrough permitted
- No motion once completed

### In Progress
- Blue indicator
- Gentle, calm animation allowed
- No fast spinners

### Pending
- Neutral gray
- No animation

---

## 9) Results Page Hierarchy Rules

The results screen must always follow this hierarchy:
1. **Primary Result (Hero)**
2. **Summary / Highlights**
3. **Artifacts / Context / Metadata**
4. **Continuation Chat**

Avoid “dashboard syndrome” (too many equally loud cards).

---

## 10) Agent Enforcement (Non-Negotiable)

If any UI change violates:
- Segoe UI font
- Beige matte background
- Black/near-black text on light surfaces
- restrained palette discipline

Then the agent must:
1. STOP
2. Fix the styles/tokens
3. Proceed only after compliance

---

## 11) Final Quality Bar

The UI must feel:
- Calm
- Premium
- Restrained
- Readable
- Consistent

If it resembles a generic admin dashboard → it is incorrect.
