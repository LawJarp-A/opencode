# Edit Mode

# EDIT MODE PRD: ITERATIVE IMAGE EDITING THROUGH VISUAL ANNOTATIONS

*Status:* Tier 2 - Differentiation (Ship Next) | *Timeline:* 4 weeks | *Last Updated:* January 3, 2026

*Owner:* Product Team

*Figma:*

- Main Design: [https://www.figma.com/design/qEERjwgAcNUDXnSAQ4sp30/Editing-Enhancements?node-id=28-12821&p=f&t=DQW7iHv6huqWfCBK-0](https://www.figma.com/design/qEERjwgAcNUDXnSAQ4sp30/Editing-Enhancements?node-id=28-12821&p=f&t=DQW7iHv6huqWfCBK-0)
- Enhanced Flow: [https://www.figma.com/design/qEERjwgAcNUDXnSAQ4sp30/Editing-Enhancements?node-id=229-37851&t=EAfU69OL5KM6bBJY-1](https://www.figma.com/design/qEERjwgAcNUDXnSAQ4sp30/Editing-Enhancements?node-id=229-37851&t=EAfU69OL5KM6bBJY-1)

---

# 📋 SHAPE UP PITCH

## Problem

When ShopOS generates images (product shots, lifestyle scenes, ad creatives), they're rarely perfect on the first try. Users need to iterate, but the current workflow is broken.

*The Re-Prompting Hell:*

```
User: "Generate a product image of my blue jacket on a model at the beach"
AI: [Generates image]
User: "The model's hand looks weird"
AI: [Regenerates ENTIRE image from scratch]
User: "Now the beach is wrong, and the jacket color changed"
AI: [Regenerates again]
User: "The hand is back to being weird..."
[Repeat 5-10 times, 2-3 minutes per generation]
```

*Problems with Re-Prompting:*

1. *Entire image regenerates* → Loses what was working
2. *No precision* → Can't target specific areas
3. *Expensive* → Every iteration costs credits/compute
4. *Slow* → 2-3 minutes per full regeneration
5. *Frustrating* → Users give up after 3-4 attempts
6. *No memory* → AI doesn't learn from previous attempts

*Real user pain:* "I spent 45 minutes trying to get the product lighting right. Every time I asked to fix the lighting, the background changed. Every time I asked to fix the background, the lighting reverted. I ended up using a mediocre image because I couldn't afford to keep regenerating."

*Current metrics:*

- 6.2 iterations to final image (too many)
- 18-25 minutes to acceptable result (too slow)
- 62% acceptance rate (38% of images abandoned)
- 3.2/5 satisfaction rating (mediocre quality)
- 15% Refine™ attach rate (users escalating to human experts)

## Appetite

*4 weeks*

Edit Mode is critical for user satisfaction. Without it, users burn credits regenerating entire images just to fix small details. This is the difference between "AI is frustrating" and "AI gets me."

We're willing to invest 4 weeks because precision editing is table stakes for creative tools. Photoshop has layers, Figma has components, ShopOS needs comment-based editing.

## Solution

*Edit Mode = Figma-Style Comment Pins for Images*

Not "regenerate entire image." Not "separate edit mode." Just: click image → drop comment pin → type instruction → AI applies targeted edit.

*The Flow:*

```
User generates jacket image
  ↓
Image has weird hand pose
  ↓
User clicks on hand area
  ↓
Comment pin appears
  ↓
User types: "Fix the hand, make it look natural"
  ↓
User clicks "Apply" (or hits Enter)
  ↓
[10-20 seconds later]
  ↓
AI edits ONLY the hand region
Rest of image unchanged (beach, jacket, lighting all preserved)
  ↓
User sees result
  ↓
If not perfect: Add another comment pin
If perfect: Done!

Total time: 30 seconds (vs 15 minutes of re-prompting)
Total iterations: 1-2 (vs 6+)
```

*Key Interactions:*

1. *Single Comment:* Click → Type → Apply → Done
2. *Multiple Comments (Batch):* Add 3 pins → Apply all at once → Review
3. *Iterative Refinement:* Apply edit → Review → Add another comment → Repeat

*Why This Works:*

- *Familiar UX:* Users already know Figma comments
- *Precision:* Target specific areas, not entire image
- *Efficient:* Change only what needs changing
- *Fast:* Regional edits in 10-20 seconds
- *Cheap:* Only compute for changed regions
- *Memory:* Version history + RL learns from edits
- *No Mode Switching:* Comments work on ANY image (generated, uploaded, edited)

*Smart Region Detection:*

**Auto-Detect (Default):**

- User clicks pin → AI detects object at that point
- Fast, no extra interaction needed
- Works for 80% of cases
- Example: Click on hand → AI segments hand region automatically

**Manual Selection (Advanced):**

- User draws bounding box around area to edit
- For complex regions (e.g., "just the left side of the jacket")
- Hold Shift + Click-and-Drag to draw box
- Example: Glass objects, transparent materials, overlapping elements

## Rabbit Holes

*Don't build:*

- *Advanced masking tools (lasso, magic wand).* Auto-detect + bounding box is enough. Don't try to be Photoshop.
- *Layer system.* No separate layers. Single image with edit history.
- *Undo/redo via keyboard shortcuts.* Use version history instead. Don't build complex state management.
- *Real-time collaborative editing.* Single user only. Collaboration in Phase 2.
- *Custom brush tools.* No painting/drawing. Text instructions only.
- *Parametric controls (sliders for brightness, saturation).* Keep it text-based. Sliders add complexity.
- *AI-suggested edits.* Don't auto-suggest "You might want to fix X." User-initiated only.

*Reuse existing:*

- In-painting model (already used in some Spaces)
- Image segmentation (object detection)
- Version control system (if exists)
- Comment UI components (if used elsewhere)

*Watch out for:*

- *Region detection failures.* Some objects hard to segment (e.g., glass, hair, transparent fabrics).
- *Edit boundaries.* Seams between edited and original regions must be seamless.
- *Processing time.* 10-20 seconds is max. Longer = user assumes it failed.
- *Version history bloat.* 20 versions of same image = storage costs.
- *Conflicting edits.* Multiple comment pins in overlapping regions.

## No-Gos

*Explicitly NOT doing:*

- ✖ Separate "Edit Mode" button (comments work on all images, always)
- ✖ Advanced masking tools (lasso, magic wand, polygonal select)
- ✖ Layer system (Photoshop-style)
- ✖ Undo/redo with Ctrl+Z (use version history)
- ✖ Collaborative editing (Phase 2)
- ✖ Brush/paint tools (Phase 2)
- ✖ Parametric sliders (brightness, saturation, contrast)
- ✖ AI-suggested edits ("Fix this for me?")
- ✖ Video editing (images only for Phase 1)
- ✖ Bulk editing across multiple images (Files integration Phase 2)

---

# 🔧 ENGINEERING PRD

## 1. OBJECTIVE

*Purpose:*
Build a unified comment-based image editing system that allows users to make precise, iterative improvements to AI-generated images without regenerating the entire image. Reduce iteration time from 18-25 minutes to under 10 minutes, and reduce iterations from 6.2 to under 3.

*Goal:*

- *<3 iterations to final image* (vs 6.2 current)
- *<10 minutes to final image* (vs 18-25 min current)
- *85% acceptance rate* (vs 62% current)
- *4.5/5 satisfaction rating* (vs 3.2/5 current)
- *80% adoption of Edit Mode* (vs regenerate)
- *10% Refine™ attach rate* (reduced from 15%)

*Context:*
Edit Mode is the difference between "AI is frustrating" and "AI is collaborative." Without precision editing, users burn credits and time on full regenerations. This is a core UX improvement that makes ShopOS feel professional, not toy-like.

This is a *unified system* - not separate "Edit Mode" vs "Refine Mode." One comment system powers everything: single edits, batch edits, escalation to Refine™.

*System Architecture:*

```
User clicks image → Comment pin appears
  ↓
User types instruction → AI analyzes intent
  ↓
Region detection (auto or manual)
  ↓
In-painting model edits region
  ↓
Blending/compositing (seamless edges)
  ↓
New version created (stored in version history)
  ↓
User sees result → Accepts or adds another comment
```

## 2. SCOPE

### In Scope

*Core Comment System:*

- Click-to-comment interaction (click image → pin drops)
- Comment pin UI (visual pin + text input field)
- Text instruction input (free-form text, 500 char max)
- Comment pin placement (click position stored as x,y coordinates)
- Comment pin editing (edit text after placement)
- Comment pin deletion (click X to remove)
- Comment status indicators (pending, processing, applied, failed)

*Region Detection:*

- *Auto-detect (default):* AI detects object at click point using segmentation model
- *Manual selection (advanced):* User draws bounding box (Shift + Click-and-Drag)
- Region preview (show detected/selected area before applying edit)
- Region adjustment (resize/reposition bounding box before applying)

*In-Painting Execution:*

- Text-to-instruction parsing (understand user intent: "fix hand," "darken background," "remove shadow")
- Masked in-painting (edit only selected region, preserve rest)
- Seamless blending (smooth transitions at region boundaries)
- Multiple edit types:
    - Object modification ("make hand natural," "change jacket color to red")
    - Addition ("add sunglasses," "add palm tree in background")
    - Removal ("remove reflection," "delete watermark")
    - Enhancement ("sharpen product," "brighten lighting")

*Version History:*

- Auto-save every edit as new version
- Version timeline UI (horizontal filmstrip of thumbnails)
- Version comparison (side-by-side view of two versions)
- Revert to previous version (one-click restore)
- Version metadata (timestamp, edit instruction, who made it)
- Version limit (max 20 versions per image, auto-prune oldest)

*Batch Editing:*

- Multiple comment pins on one image (add 3-5 pins before applying)
- Batch apply (all comments processed in sequence or parallel)
- Batch preview (show all affected regions before applying)
- Batch progress (show "Processing edit 2 of 5...")

*Integration Points:*

- Works on any image source (AI-generated, uploaded, Files library)
- Accessible from: image detail view, Files library, Space outputs
- Edits saved back to source (Files library auto-updates)
- Refine™ escalation ("Send to Refine™" button visible after 3+ edits)

### Out of Scope (Future Phases)

- Advanced masking (lasso, magic wand, polygonal select)
- Layer system (Photoshop-style layers)
- Collaborative editing (multiple users editing same image)
- Brush/paint tools (manual drawing)
- Parametric controls (sliders for brightness, saturation, etc.)
- AI-suggested edits ("We noticed the hand looks off, fix it?")
- Video editing (images only)
- Bulk editing across multiple images (Files integration Phase 2)
- Custom keyboard shortcuts (Ctrl+Z undo)
- Comment threads/replies (single instruction per pin)

*Phase:* Phase 1 (Foundation) - 4 weeks

## 3. INPUTS

### Data Sources

*1. Source Image:*

- *What:* Any image (AI-generated from Space, uploaded by user, stored in Files)
- *Format:* JPG, PNG, WEBP (up to 10MB)
- *Dimensions:* 512px - 4096px (width or height)
- *Metadata:* Image ID, source (space/upload/files), original prompt (if AI-generated)

*2. Comment Pin Data:*

```json
{
  "pin_id": "uuid",
  "image_id": "image_uuid",
  "position": {"x": 450, "y": 320},
  "instruction": "Fix the hand, make it look natural",
  "region": {
    "type": "auto_detect",
    "bbox": {"x1": 400, "y1": 280, "x2": 520, "y2": 380},
    "mask": "base64_encoded_mask"
  },
  "status": "pending",
  "created_at": "2025-01-15T10:30:00Z"
}
```

*3. User Actions:*

- Click image (x,y coordinates)
- Type instruction (text, 500 char max)
- Select region type (auto-detect or manual)
- Draw bounding box (start x,y, end x,y)
- Apply edit (trigger processing)
- Delete comment pin
- Revert to version (version ID)
- Send to Refine™ (escalate to human expert)

*4. Region Detection Input:*

- Click point coordinates (x, y)
- Image (for segmentation model)
- Instruction text (hints for detection: "hand" → focus on hand-like region)

*5. In-Painting Model Input:*

- Original image
- Masked region (binary mask or bounding box)
- Instruction text (parsed into model prompt)
- Surrounding context (pixels around masked region for blending)

## 4. OUTPUTS

### UI Components

*1. Comment Pin (on image):*

- *Visual:* Small circular pin with number (1, 2, 3...)
- *Color:*
    - Pending: Yellow
    - Processing: Blue (with spinner)
    - Applied: Green (with checkmark)
    - Failed: Red (with X)
- *Position:* Placed at click coordinates
- *Hover:* Shows instruction text in tooltip
- *Click:* Opens text input field for editing

*2. Comment Input Field:*

- *Trigger:* Appears when pin is clicked/placed
- *Layout:* Floating text input, positioned near pin
- *Placeholder:* "Describe the change you want..."
- *Character limit:* 500 chars (with counter)
- *Actions:*
    - "Apply" button (or Enter key)
    - "Cancel" button (or Esc key)
    - "Delete Pin" icon (X)

*3. Region Preview Overlay:*

- *When:* After pin placed, before edit applied
- *Visual:* Semi-transparent colored overlay on detected region
- *Auto-detect:* Shows segmented object area (blue overlay)
- *Manual:* Shows bounding box (orange overlay)
- *Actions:*
    - "Adjust Region" button (resize/reposition)
    - "Use Manual Selection" toggle

*4. Version History Timeline:*

- *Location:* Bottom of image detail view (or side panel)
- *Layout:* Horizontal scrollable filmstrip
- *Each thumbnail:*
    - Image preview (150px wide)
    - Version number (v1, v2, v3...)
    - Timestamp ("2 minutes ago")
    - Edit instruction (if available)
- *Interactions:*
    - Click thumbnail → View that version
    - "Revert to This" button
    - "Compare with Current" button

*5. Processing Indicator:*

- *During edit:* Progress bar or spinner
- *Text:* "Applying edit to [region]..." (e.g., "Applying edit to hand...")
- *Time estimate:* "~15 seconds remaining"
- *Cancellable:* "Cancel" button (stops processing)

*6. Batch Edit Summary:*

- *When:* User adds multiple pins before applying
- *Shows:* List of pending edits
    - Pin 1: "Fix the hand"
    - Pin 2: "Darken background"
    - Pin 3: "Brighten product"
- *Actions:*
    - "Apply All" button
    - "Apply One by One" toggle
    - Delete individual pins

*7. Send to Refine™ Button:*

- *Appears:* After 3+ edits
- *Location:* Subtle placement after version 3, more prominent after version 5+
- *Copy:* "Still not perfect? Get expert help ($50-200)"
- *Action:* Packages all versions + comments, sends to Refine™

*8. Success/Failure Notifications:*

- *Success:* Toast notification: "Edit applied successfully. Version 4 created."
- *Failure:* Toast notification: "Edit failed. [Reason: Region too small / Instruction unclear]"
- *Partial success (batch):* "2 of 3 edits applied. 1 failed: [reason]"

### Data Returns

*1. Edited Image:*

- New image file (same format as original)
- Stored in same location as original (Files library, Space output)
- Linked to version history

*2. Version Object:*

```json
{
  "version_id": "uuid",
  "image_id": "original_image_uuid",
  "version_number": 4,
  "created_at": "2025-01-15T10:32:15Z",
  "edit_instruction": "Fix the hand, make it look natural",
  "region": {"x1": 400, "y1": 280, "x2": 520, "y2": 380},
  "image_url": "[https://cdn.shopos.ai/](https://cdn.shopos.ai/)...",
  "parent_version_id": "v3_uuid"
}
```

*3. Analytics Events:*

- `edit_mode_pin_placed` (image_id, position, instruction_length)
- `edit_mode_region_detected` (detection_type, confidence, bbox_size)
- `edit_mode_applied` (image_id, instruction, processing_time, success)
- `edit_mode_failed` (image_id, instruction, failure_reason)
- `edit_mode_version_reverted` (image_id, from_version, to_version)
- `edit_mode_batch_applied` (image_id, num_edits, success_count)
- `edit_mode_sent_to_refine` (image_id, num_edits_attempted)

## 5. CORE REQUIREMENTS

### Comment Pin System

1. User can click anywhere on image to place comment pin
2. Pin appears at exact click coordinates
3. Text input field appears immediately (no delay)
4. User can type instruction (free-form text, 500 char max)
5. Pin is numbered sequentially (1, 2, 3...)
6. Multiple pins can exist simultaneously (max 10 per image)
7. User can edit instruction after placement (click pin to reopen input)
8. User can delete pin (click X icon on pin)
9. Pin color indicates status (pending, processing, applied, failed)

### Region Detection

1. *Auto-detect (default):*
    - AI analyzes image at click point
    - Segments object using semantic segmentation model
    - Returns bounding box + binary mask
    - Shows preview overlay before applying edit
    - Confidence threshold: 75% (below threshold → prompt for manual selection)
2. *Manual selection (advanced):*
    - User holds Shift key + Click-and-Drag
    - Draws rectangular bounding box
    - Box is resizable/repositionable before applying
    - No AI detection needed (user-defined region)
3. Region preview:
    - Semi-transparent overlay (30% opacity)
    - Color-coded: Blue for auto-detect, Orange for manual
    - Shows before edit is applied
    - User can approve or adjust

### In-Painting Execution

1. System parses instruction text to understand intent
2. Instruction types supported:
    - *Modification:* "fix," "change," "adjust," "improve"
    - *Addition:* "add," "include," "insert"
    - *Removal:* "remove," "delete," "erase"
    - *Enhancement:* "brighten," "darken," "sharpen," "soften"
3. In-painting model runs on masked region only
4. Blending applied at region boundaries (feathered edges, 10-20px transition)
5. Processing time: <20 seconds for 95% of edits
6. If processing exceeds 30 seconds → timeout, show error
7. Failed edits return original image + error message

### Version History

1. Every edit creates new version (auto-saved)
2. Original image is version 1 (immutable)
3. Each edit increments version number (v1, v2, v3...)
4. Version timeline displayed as horizontal filmstrip
5. User can click thumbnail to view full-size version
6. User can revert to any previous version (one-click)
7. Reverting creates new version (doesn't delete forward history)
8. Version limit: 20 versions max (oldest auto-pruned when exceeded)
9. Version metadata stored: timestamp, instruction, region, parent version

### Batch Editing

1. User can place multiple comment pins before applying (max 10)
2. "Apply All" button processes all pending pins
3. Processing modes:
    - *Sequential:* Process one by one, show progress ("2 of 5 complete...")
    - *Parallel:* Process simultaneously (faster but riskier)
4. Each edit creates separate version (v2, v3, v4...)
5. If one edit fails → others still proceed
6. Final result shows success/failure summary
7. Failed edits remain as pending pins (user can retry)

### Integration with Files

1. Edit Mode accessible from Files library (click image → "Edit" button)
2. Edits auto-save back to Files (updates existing asset)
3. Version history stored in Files metadata
4. Original image always preserved (version 1)
5. Files library shows "Edited" badge on modified images

### Integration with Refine™

1. After 3+ edits, "Send to Refine™" button appears
2. Button sends to human expert:
    - Original image (v1)
    - All versions (v2, v3, v4...)
    - All instructions ("Fix hand," "Darken background")
    - Current version (what user ended with)
3. Expert sees full context of user's intent
4. Expert delivers polished final version
5. System learns from expert edits (RL training data)

## 6. BEHAVIORS & RULES

### Comment Pin Placement

- *Click behavior:*
    - Single click → Place pin
    - Click existing pin → Open text input for editing
    - Click outside pin/input → Close input (no save)
    - Enter key → Save instruction, keep input open (for edits)
    - Esc key → Cancel, delete pin
- *Pin numbering:*
    - First pin = #1, second = #2, etc.
    - If pin #2 deleted → next pin is still #3 (numbers don't reorder)
    - Applied pins change to checkmarks (numbers removed)
- *Pin limits:*
    - Max 10 pins per image (prevent overwhelm)
    - After 10, show toast: "Maximum 10 edits per batch. Apply current edits first."

### Region Detection Behavior

- *Auto-detect triggers when:*
    - User places pin (default mode)
    - System analyzes image at click point (x,y)
    - Segmentation model returns region + confidence score
- *Auto-detect success:*
    - Confidence ≥75% → Show region preview, allow user to apply
    - Confidence 50-74% → Show preview + warning: "Detection uncertain. Adjust region or use manual selection."
    - Confidence <50% → Auto-switch to manual mode: "Couldn't detect object. Please draw bounding box."
- *Manual selection:*
    - Triggered by: Shift + Click-and-Drag OR auto-detect failure
    - User draws rectangle → Preview shows in real-time
    - User can resize corners, reposition box
    - Minimum box size: 50x50px (prevent tiny regions)
    - Maximum box size: entire image (if user wants)
- *Region preview overlay:*
    - Color: Blue (auto-detect) or Orange (manual)
    - Opacity: 30%
    - Shows immediately after detection/selection
    - User can adjust region before applying
    - "Looks good" button → Proceed to in-painting
    - "Adjust" button → Resize/reposition
    - "Switch to Manual" → Disable auto-detect, draw box

### In-Painting Execution Behavior

- *Instruction parsing:*
    - Extract action keyword: "fix," "add," "remove," "brighten," etc.
    - Extract target object: "hand," "background," "jacket," "shadow," etc.
    - Extract parameters: "darker," "brighter," "natural," "red" (color), "larger," etc.
    - Example: "Fix the hand, make it look natural"
        - Action: fix/improve
        - Target: hand
        - Parameter: natural (realistic, not pose-y)
- *In-painting process:*
    - Masked in-painting model (ControlNet or similar)
    - Input: original image + binary mask + instruction prompt
    - Output: edited region only (composited back into original)
    - Blending: Feathered edges (10-20px Gaussian blur at boundaries)
    - Color matching: Adjust edited region to match surrounding color temperature
- *Processing time:*
    - Target: <15 seconds for 90% of edits
    - Maximum: 30 seconds (timeout after this)
    - Progress indicator updates every 3 seconds
    - User can cancel mid-process (returns to pre-edit state)
- *Failure handling:*
    - Timeout (>30s) → Show error: "Edit took too long. Try a smaller region."
    - Model failure → Show error: "Couldn't apply edit. Try rephrasing instruction."
    - Region too small (<50x50px) → Show error: "Region too small to edit."
    - Region too large (>80% of image) → Warning: "Large region. This may take 30+ seconds."

### Version History Behavior

- *Version creation:*
    - Every successful edit → New version
    - Failed edits → No new version
    - Original image = v1 (never changes)
    - Linear history (no branching for Phase 1)
- *Version display:*
    - Horizontal filmstrip (newest on right)
    - Scroll if >10 versions
    - Current version highlighted with border
    - Hover thumbnail → Show full instruction + timestamp
- *Revert behavior:*
    - Click old version → "Revert to v3?" confirmation
    - Reverting creates new version (e.g., v8 = copy of v3)
    - Doesn't delete forward history (v4, v5, v6, v7 still exist)
    - User can navigate forward again if needed
- *Auto-pruning:*
    - After 20 versions → Oldest version (v2) deleted
    - v1 (original) never deleted
    - Current version never deleted
    - Intermediate versions pruned (oldest first)

### Batch Editing Behavior

- *Adding multiple pins:*
    - User places pin #1, types instruction (doesn't apply yet)
    - User places pin #2, types instruction
    - User places pin #3, types instruction
    - User clicks "Apply All"
- *Batch processing (Sequential mode):*
    - Apply pin #1 → Wait for completion → Create v2
    - Apply pin #2 → Wait for completion → Create v3
    - Apply pin #3 → Wait for completion → Create v4
    - Progress bar: "Processing edit 2 of 3... (15 seconds remaining)"
    - If pin #2 fails → Pin #3 still processes (doesn't block)
- *Batch processing (Parallel mode - advanced):*
    - Apply all 3 pins simultaneously
    - Faster (all complete in ~20 seconds total vs 60 seconds sequential)
    - Riskier (if regions overlap, results unpredictable)
    - Only enabled if regions don't overlap (system checks)
- *Overlapping regions:*
    - System detects if two pins target overlapping areas
    - Warning: "Pin #2 and #3 overlap. Edits will be applied sequentially."
    - Forces sequential mode for those pins

### Refine™ Escalation Behavior

- *Escalation triggers:*
    - After 3 edits: Subtle "Send to Refine™" button appears
    - After 5 edits: Button more prominent: "Still not perfect? Get expert help."
    - After 7 edits: Modal: "You've made 7 edits. An expert can finish this faster."
    - User can always decline
- *Data sent to Refine™:*
    - Original image (v1)
    - All intermediate versions (v2, v3, v4, v5...)
    - All comment instructions ("Fix hand," "Darken sky," etc.)
    - Current version (what user ended with)
    - User's brand context (from Brand Memory)
- *Expert workflow:*
    - Expert sees version timeline + all comments
    - Expert understands user's intent from edit history
    - Expert delivers polished final version
    - Turnaround: 6-24 hours (based on urgency)
- *Learning loop:*
    - System compares user's v5 to expert's final version
    - Extracts patterns ("Expert darkened shadows 20% more than user")
    - Stores in RL training data
    - Future edits incorporate expert techniques

### Integration Behaviors

- *Files integration:*
    - User opens image from Files → "Edit" button visible
    - Edits auto-save to Files (replaces current version)
    - Version history stored in Files metadata
    - Files library shows "Edited" badge + version count
- *Brand Memory learning:*
    - System tracks common edit patterns ("user always darkens backgrounds")
    - After 5+ similar edits, suggest: "Apply 'darken background' by default?"
    - If user accepts → Future generations pre-apply this edit

## 7. TECHNICAL CONSTRAINTS & EDGE CASES

### Performance Requirements

- *In-painting speed:* <20 seconds for 95% of edits
- *Region detection:* <2 seconds to segment object
- *UI responsiveness:* Pin placement <100ms after click
- *Version switching:* <1 second to load previous version
- *Batch processing:* 3 edits in <60 seconds (sequential) or <25 seconds (parallel)

### Scalability Constraints

- *Max image size:* 10MB file size, 4096px max dimension
- *Max pins per image:* 10 (prevent overwhelm)
- *Max versions per image:* 20 (auto-prune beyond)
- *Max instruction length:* 500 characters
- *Min region size:* 50x50px (prevent tiny edits)

### Model Constraints

- *In-painting model:* ControlNet or similar (masked generation)
- *Segmentation model:* SAM (Segment Anything Model) or equivalent
- *Supported edits:*
    - Object modification (change appearance)
    - Object addition (add new elements)
    - Object removal (delete elements)
    - Enhancement (brightness, sharpness, color)
- *Unsupported edits (Phase 1):*
    - Complex transformations (3D rotation, perspective shift)
    - Style transfer ("make it look like Van Gogh")
    - Multi-object replacement ("swap all trees with buildings")

### Error Handling

*1. Region Detection Errors:*

- *Glass/transparent objects:* Hard to segment → Fall back to manual selection
- *Hair/fur:* Fuzzy boundaries → Expand region by 20px, aggressive feathering
- *Overlapping objects:* Ambiguous → Ask user: "Did you mean [object A] or [object B]?"
- *Low confidence (<50%):* Auto-switch to manual mode

*2. In-Painting Errors:*

- *Timeout (>30s):* Cancel, return to previous version, show error
- *Model failure:* Retry once, if fails again → Error: "Couldn't apply edit. Try rephrasing."
- *Instruction unclear:* Attempt best interpretation, show warning: "Edit applied, but result may not match intent. Adjust if needed."
- *Region too complex:* Error: "Region too detailed. Try manual selection with smaller area."

*3. Batch Processing Errors:*

- *One edit fails:* Others proceed, show summary: "2 of 3 edits applied. Pin #2 failed: [reason]"
- *Overlapping regions:* Force sequential mode, warn user
- *All edits fail:* Revert to pre-batch state, show error

*4. Version History Errors:*

- *Corrupted version:* Skip, load previous available version
- *Storage full:* Delete oldest versions beyond v1 until space available

### Edge Cases

*1. Ambiguous Instructions:*

- "Fix it" → Too vague, prompt user: "What should I fix? (e.g., 'fix the hand,' 'fix the lighting')"
- "Make it better" → Interpret as general enhancement (sharpen, color correct)
- "Remove background" → Common pattern, assume user wants transparent background

*2. Conflicting Edits:*

- Pin #1: "Darken background"
- Pin #2: "Brighten background"
- System detects conflict → Warn: "Pin #1 and #2 have conflicting instructions. Apply one at a time?"

*3. Entire Image Edits:*

- User clicks center, instruction: "Make everything brighter"
- Region detection → Entire image
- Warning: "This will edit the entire image. Consider regenerating instead for better results."

*4. Tiny Regions:*

- User clicks small detail (30x30px region)
- Error: "Region too small to edit accurately. Try manual selection with larger area."

*5. Off-Canvas Clicks:*

- User clicks outside image bounds → No pin placed, show toast: "Click on the image to place edit."

*6. Rapid Clicking:*

- User clicks 5 times rapidly → Place 5 pins (allow, up to max 10)
- Don't debounce (user may intentionally want multiple pins)

### Browser Compatibility

- Desktop: Chrome/Edge/Safari/Firefox (last 2 versions)
- Mobile: Touch-friendly (tap to place pin, pinch to zoom)
- Tablet: iPad/Android tablet optimized
- No IE11 support

### Accessibility

- Keyboard navigation: Tab to pins, Enter to edit, Esc to cancel
- Screen readers: All pins have ARIA labels ("Edit pin 1: Fix the hand")
- High contrast mode: Pin colors adjust for visibility
- Zoom: UI scales with browser zoom (up to 200%)

## 8. EXAMPLES

### Example 1: Single Edit - Fix Weird Hand

*Input:*

- User generates product image: jacket on model at beach
- Model's hand pose looks unnatural

*Flow:*

```
User views image
  ↓
Clicks on hand area
  ↓
Comment pin #1 appears at click point
Text input opens: "Describe the change..."
  ↓
User types: "Fix the hand, make it look natural"
  ↓
User presses Enter (or clicks "Apply")
  ↓
Region detection:
  AI detects hand (bounding box 400,280 to 520,380)
  Confidence: 89%
  Preview overlay shows hand region in blue
  ↓
User sees preview → Clicks "Looks good"
  ↓
In-painting process starts:
  Pin #1 changes to blue (processing) with spinner
  Progress indicator: "Applying edit to hand... ~15 seconds"
  ↓
[12 seconds later]
  ↓
New version created (v2)
  Pin #1 changes to green checkmark
  Image updates: Hand now looks natural
  Version timeline shows v1 (original) and v2 (current)
  ↓
User reviews → Satisfied → Downloads v2
```

*Result:*

- Total time: 30 seconds (vs 6+ minutes re-prompting)
- Total iterations: 1 (vs 4-6 re-prompts)
- User satisfaction: High (precise fix, fast)

---

### Example 2: Batch Edit - Multiple Issues

*Input:*

- User generates lifestyle product shot: sunglasses on table, outdoor café
- Issues:
    1. Sunglasses reflection shows camera
    2. Background too bright
    3. Table surface has scratch

*Flow:*

```
User places Pin #1 on sunglasses
  Types: "Remove camera reflection from lenses"
  (Doesn't apply yet)
  ↓
User places Pin #2 on background
  Types: "Darken background by 30%"
  ↓
User places Pin #3 on table
  Types: "Remove scratch from table surface"
  ↓
User clicks "Apply All" button
  ↓
Batch processing (Sequential mode):
  Pin #1 → Processing... (15 seconds)
    Result: v2 created (reflection removed)
  Pin #2 → Processing... (12 seconds)
    Result: v3 created (background darkened)
  Pin #3 → Processing... (14 seconds)
    Result: v4 created (scratch removed)
  ↓
Success notification: "All 3 edits applied. Version 4 created."
  All pins change to green checkmarks
  Version timeline shows v1, v2, v3, v4
  ↓
User reviews v4 → Perfect → Downloads
```

*Result:*

- Total time: 2 minutes (vs 20+ minutes re-prompting 3 separate issues)
- Total iterations: 1 batch (vs 10+ individual re-prompts)
- Efficiency: 3 precise fixes in one go

---

### Example 3: Iterative Refinement with Version History

*Input:*

- User generates ad creative: product on gradient background
- User wants to perfect the lighting

*Flow:*

```
Generation 1 (v1): Background too dark
  ↓
User places pin: "Brighten background"
  Applies → v2 created
  ↓
v2: Background now too bright (overdid it)
  ↓
User clicks v1 thumbnail in version history
  Reviews v1 → Still too dark
  Clicks v2 thumbnail → Still too bright
  ↓
User places new pin on v2: "Darken background slightly, just 15%"
  Applies → v3 created
  ↓
v3: Background perfect!
  ↓
User downloads v3
```

*Result:*

- Version history allowed comparison
- User could reference v1 while editing v2
- Total time: 90 seconds for 2 refinements
- No re-prompting needed

---

### Example 4: Auto-Detect Failure → Manual Selection

*Input:*

- User generates image: glass vase with flowers
- User wants to remove water droplets on glass

*Flow:*

```
User clicks on droplets
  ↓
Auto-detect runs:
  Segmentation model attempts to detect glass
  Confidence: 42% (too low, glass is transparent)
  ↓
System auto-switches to manual mode:
  Notification: "Couldn't detect object clearly. Please draw a box around the area to edit."
  ↓
User holds Shift + Click-and-Drag
  Draws bounding box around droplet area (200x150px)
  Orange preview overlay appears
  ↓
User types instruction: "Remove water droplets"
  ↓
User clicks "Apply"
  ↓
In-painting processes manual region
  Result: Droplets removed, glass looks clean
  ↓
v2 created → User satisfied
```

*Result:*

- Graceful fallback when auto-detect fails
- User maintains control with manual selection
- Edit still succeeds despite detection challenge

---

### Example 5: Refine™ Escalation After Multiple Edits

*Input:*

- User generates fashion editorial image
- User makes 4 edits but still not satisfied

*Flow:*

```
Edit 1: "Fix model's hair"
  → v2 created (hair improved but not perfect)
Edit 2: "Adjust dress drape"
  → v3 created (drape better)
Edit 3: "Enhance makeup"
  → v4 created (makeup sharper)
Edit 4: "Soften background blur"
  → v5 created (blur adjusted)
  ↓
User still not 100% satisfied (subtle issues remain)
  ↓
"Send to Refine™" button appears:
  "Still not perfect? Get expert help. ($50-200 based on urgency)"
  ↓
User clicks "Send to Refine™"
  ↓
Expert receives:
  - v1 (original)
  - v2, v3, v4, v5 (all intermediate versions)
  - Instructions: "Fix hair," "Adjust drape," etc.
  - Current version (v5)
  ↓
Expert understands user's intent from version history
  Delivers polished v6 (professional-grade)
  ↓
User receives v6 → Perfect → Downloads
  ↓
System learns:
  "When user asks for 'hair fix' like this, apply [expert's technique]"
  Future hair fixes improve automatically
```

*Result:*

- Seamless escalation to human expert
- Expert has full context (versions + instructions)
- System learns from expert edits
- User satisfaction: Very high (professional result)

---

## 9. CREATIVE FREEDOM

*Where developers/designers can be creative:*

1. *Comment Pin Design:*
    - Pin icon style (circle, square, custom shape)
    - Pin color palette (yellow/blue/green/red for states)
    - Pin animation (drop-in, fade-in, bounce)
    - Numbering style (inside pin, outside, badge)
2. *Region Preview Overlay:*
    - Overlay color (blue, orange, custom brand color)
    - Overlay pattern (solid, dotted, animated border)
    - Transition animation (fade-in, expand from click point)
3. *Text Input Field:*
    - Position (near pin, floating, bottom panel)
    - Style (minimal, card, speech bubble)
    - Auto-complete suggestions ("fix," "remove," "add")
4. *Version History Timeline:*
    - Layout (horizontal filmstrip, vertical list, grid)
    - Thumbnail size (100px, 150px, 200px)
    - Comparison mode (side-by-side, slider, overlay)
5. *Processing Indicator:*
    - Animation (spinner, progress bar, percentage)
    - Style (minimal, playful, technical)
    - Position (on pin, center screen, bottom toast)
6. *Batch Edit Summary:*
    - Layout (modal, side panel, inline)
    - Progress visualization (checklist, progress bar, timeline)

*Constraints:*

- Follow ShopOS design system (Tailwind + ShadCN)
- Accessibility: WCAG 2.1 AA, keyboard nav, screen readers
- Mobile-friendly: Touch targets ≥44px, pinch-to-zoom
- Performance: Animations at 60 FPS

---

## 10. SUCCESS CRITERIA

### Primary Metrics (from Product Brief)

| Metric | Current | Target | Measurement |
| --- | --- | --- | --- |
| *Iterations to Final Image* | 6.2 attempts | <3 attempts | Avg iterations per accepted image |
| *Time to Final Image* | 18-25 min | <10 min | From first generation to final download |
| *Image Acceptance Rate* | 62% | 85% | % of images marked as "final" vs. abandoned |
| *User Satisfaction (Image Quality)* | 3.2/5 | 4.5/5 | Post-generation survey rating |
| *Refine™ Attach Rate* | 15% | 10% | % of users who escalate to human expert |

### Secondary Metrics (from Product Brief)

| Metric | Target | Measurement |
| --- | --- | --- |
| *Edit Mode Adoption* | 80% | % of users who use Edit Mode vs. Regenerate |
| *Comments per Image* | 2-3 avg | Avg number of comment pins used |
| *Regional Edit Success Rate* | 90% | % of edits that achieve user's intent |
| *Version History Usage* | 30% | % of users who revert to previous version |
| *Processing Time (Regional)* | <20 sec | Time to apply single comment edit |

### Functional Requirements

1. ✅ User can place comment pin in <100ms after click
2. ✅ Text input appears immediately (no delay)
3. ✅ Auto-detect completes in <2 seconds
4. ✅ Manual selection works with Shift + Drag
5. ✅ Region preview shows before applying edit
6. ✅ In-painting completes in <20 seconds for 95% of edits
7. ✅ New version created after every successful edit
8. ✅ Version history displays all versions (up to 20)
9. ✅ User can revert to any previous version
10. ✅ Batch editing processes multiple pins (up to 10)
11. ✅ Failed edits show clear error messages
12. ✅ Edits integrate with Files library (auto-save)
13. ✅ Refine™ button appears after 3+ edits
14. ✅ All UI elements keyboard-navigable

### Performance Benchmarks

1. ✅ Pin placement: <100ms
2. ✅ Region detection: <2 seconds
3. ✅ In-painting: <20 seconds (95% of edits)
4. ✅ Version switching: <1 second
5. ✅ Batch processing (3 edits): <60 seconds sequential, <25 seconds parallel
6. ✅ UI animations: 60 FPS

### User Experience

1. ✅ 5 test users place first pin without guidance
2. ✅ 5 test users understand region preview
3. ✅ 5 test users apply edit successfully
4. ✅ 5 test users navigate version history
5. ✅ 5 test users perform batch edit (3+ pins)
6. ✅ Zero users confused by manual selection mode
7. ✅ 90%+ satisfaction with edit results

### Edge Case Handling

1. ✅ Auto-detect failure → Graceful fallback to manual
2. ✅ Timeout (>30s) → Cancel, return to previous version
3. ✅ Ambiguous instruction → Prompt for clarification
4. ✅ Overlapping regions → Force sequential batch mode
5. ✅ Tiny region (<50px) → Show error, suggest larger area
6. ✅ Entire image edit → Warn, suggest regenerate instead
7. ✅ Version limit (20) → Auto-prune oldest versions

---

## 11. ASSUMPTIONS

*We assume:*

1. In-painting model (ControlNet or similar) is production-ready
2. Segmentation model (SAM or equivalent) is accurate for common objects (80%+ success rate)
3. Users familiar with Figma comment pattern (or can learn quickly through onboarding)
4. Images are reasonably high quality (≥512px, not heavily compressed)
5. Users have stable internet (in-painting requires server round-trip)
6. Users understand basic editing concepts ("region," "mask," "blend")
7. Storage supports version history (S3/GCS with versioning enabled)
8. Browser supports modern JavaScript (ES6+, Canvas API)
9. Refine™ service exists and can accept escalations
10. Brand Memory system exists and can store learned patterns

*We do NOT assume:*

1. Users are professional designers (UI must be beginner-friendly)
2. Users have fast internet (show progress indicators, allow cancellation)
3. All objects are easy to segment (glass, hair, fur are hard)
4. Instructions are always clear (handle ambiguity gracefully)
5. Users want to edit entire image (most edits are regional)
6. Users will read documentation (UI must be self-explanatory)

---

## 12. DELIVERABLES

### Code

*1. Frontend Components:*

- CommentPin component (visual pin, stateful)
- CommentInput component (text field, actions)
- RegionPreview component (overlay, adjustable)
- VersionHistory component (timeline, thumbnails)
- BatchEditSummary component (list, progress)
- ProcessingIndicator component (spinner, progress bar)
- ManualSelection component (bounding box drawer)
- RefineEscalation component (button, modal)

*2. Backend Services:*

- Region detection service (segmentation API)
- In-painting service (masked generation API)
- Blending service (compositing, feathering)
- Version control service (storage, retrieval)
- Instruction parser (NLP, intent extraction)
- Refine™ escalation service (package context, send to experts)

*3. Database Schema:*

- `image_versions` table (version_id, image_id, version_number, image_url, created_at, parent_version_id)
- `edit_pins` table (pin_id, image_id, position_x, position_y, instruction, region_bbox, region_mask, status, created_at)
- `edit_history` table (edit_id, image_id, version_from, version_to, instruction, processing_time, success)
- `refine_escalations` table (escalation_id, image_id, all_versions, all_instructions, status, expert_assigned)

*4. Integration Layer:*

- Files API integration (auto-save edits)
- Refine™ API integration (escalation workflow)
- Brand Memory API integration (learn edit patterns)

*5. Testing:*

- Unit tests (components, services) - 80% coverage
- Integration tests (API endpoints, DB operations)
- E2E tests (place pin → apply edit → new version)
- E2E test (batch edit flow)
- E2E test (Refine™ escalation flow)
- Performance tests (in-painting speed, batch processing)
- Mobile tests (touch interactions, pinch-to-zoom)
- Accessibility tests (keyboard nav, screen readers)

### Documentation

*1. Developer Docs:*

- System architecture diagram
- API documentation (all endpoints)
- Database schema documentation
- In-painting model integration guide
- Version control implementation guide
- Refine™ escalation workflow

*2. User Docs:*

- How to use Edit Mode (tutorial)
- Understanding region detection
- Using manual selection
- Navigating version history
- Batch editing best practices
- When to escalate to Refine™
- Troubleshooting guide

*3. Analytics Spec:*

- Event definitions (all 7+ events)
- Event properties
- Dashboards to create
- Success metric calculations
- A/B test plan (Edit Mode vs Regenerate adoption)

### Assets

1. Comment pin icons (pending, processing, applied, failed)
2. Region overlay graphics
3. Version history thumbnails
4. Processing animations
5. Manual selection cursor/icons
6. Refine™ escalation button designs

### Migrations

1. Database migrations (create tables, indexes)
2. Storage setup (versioning enabled on S3/GCS)
3. Backfill scripts (add version history to existing images)

---

# 🔄 FUTURE SCOPE: INTEGRATIONS

*These integrations are out of scope for Phase 1 but planned for future phases.*

## Integration 1: Files (Smart Asset Library)

*Use Case:* User has 50 product images in Files, wants to batch-edit all

*Flow:*

```
1. User selects 10 images in Files
2. Clicks "Batch Edit Mode"
3. System asks: "Apply same edit to all?"
4. User adds comment: "Remove background, make pure white"
5. System applies to all 10 images in parallel
6. 2 minutes later → All 10 images edited ✅
7. Saved back to Files with version history
```

*Why This Matters:*

- Consistency across product catalog
- Massive time savings (10 images in 2 min vs 30+ min manually)
- Files becomes even more powerful

*Phase:* Phase 2 - Bulk Operations (Q2 2026)

---

## Integration 2: Loops (Performance-Driven Edits)

*Use Case:* Loop detects that "images with darker backgrounds perform 40% better"

*Flow:*

```
1. Loop analyzes 100 ad creatives
2. Pattern detected: "Dark backgrounds = higher CTR"
3. Loop generates next batch with darker backgrounds
4. User still wants to tweak individual images
5. User adds comment: "Darken background even more"
6. Loop learns: "This user prefers very dark backgrounds"
7. Next generation incorporates preference automatically
```

*Why This Matters:*

- Comments inform Loop learning (user preferences → AI training data)
- Loops + Edit Mode = compounding improvement
- User preferences override general patterns

*Phase:* Phase 2 - Loop Integration (Q2 2026)

---

## Integration 3: Brand Memory (Consistent Edits)

*Use Case:* User always makes same edits ("darken shadows", "saturate colors")

*Flow:*

```
1. User generates 5 images over 2 weeks
2. Every time, adds comments:
   - "Darken the shadows"
   - "Increase color saturation by 20%"
3. System detects pattern, saves to Brand Memory
4. Next generation: Automatically applies "darken shadows + saturate colors" by default
5. User no longer needs to add those comments
```

*Why This Matters:*

- Brand Memory learns from editing patterns
- Zero-touch consistency (AI knows your style)
- Reduces manual work over time

*Phase:* Phase 1.5 - Basic pattern learning (Q1 2026)

*Note:* This is partial integration in Phase 1 (system tracks patterns), full automation in Phase 2

---

## Integration 4: Plans (Multi-Image Workflows)

*Use Case:* User runs "New Product Launch" Plan, generates 30 images

*Flow:*

```
1. Plan generates 30 product images
2. User reviews batch, notices common issue: "Backgrounds too bright in 20/30 images"
3. User selects those 20 images
4. Adds single comment: "Darken background by 30%"
5. Batch edit applied to all 20 in 45 seconds
6. User downloads final set
```

*Why This Matters:*

- Plans generate volume (Edit Mode handles consistency)
- Batch editing = scalable workflows
- One edit fixes 20 images

*Phase:* Phase 2 - Plans Integration (Q3 2026)

---

## Integration 5: Refine™ Deep Learning

*Current State (Phase 1):*

- User escalates to Refine™
- Expert sees version history + comments
- Expert delivers polished version
- Basic learning: system notes what expert changed

*Future State (Phase 2):*

- RL model trained on 1000+ expert edits
- AI predicts: "This user wants [expert-level fix]"
- AI auto-applies expert techniques
- 50% fewer Refine™ escalations (users succeed with AI alone)

*Why This Matters:*

- System learns from expert edits (compound intelligence)
- AI gets better at understanding user intent
- Reduces reliance on human experts
- Users get expert-quality results from AI

*Phase:* Phase 3 - Advanced RL Learning (Q4 2026)

---

# NOTES

*Phase 1 Priority:* Core comment system, auto-detect + manual selection, single edits working perfectly. Batch editing is important but secondary. Refine™ escalation must work seamlessly.

*Existing Patterns to Reference:*

- Figma comments (UI inspiration)
- Files version control (if exists)
- In-painting models (already used in some Spaces)
- Refine™ service (escalation workflow)

*What NOT to Build (Phase 1):*

- ✖ Advanced masking tools (Phase 2)
- ✖ Layer system (Phase 2)
- ✖ Collaborative editing (Phase 2)
- ✖ Brush/paint tools (Phase 2)
- ✖ Parametric sliders (Phase 2)
- ✖ Video editing (Phase 2)
- ✖ Bulk editing across multiple images (Phase 2)
- ✖ Deep RL learning from expert edits (Phase 3)

*Performance Critical:*

- In-painting MUST complete in <20 seconds
- Pin placement MUST feel instant (<100ms)
- Region detection MUST be accurate (>75% confidence)
- Blending MUST be seamless (no visible seams)
- Refine™ escalation MUST package all context correctly

*Integration Dependencies:*

- In-painting model (ControlNet or similar)
- Segmentation model (SAM or equivalent)
- Files library API (for auto-save)
- Refine™ escalation API (must exist)
- Version control storage (S3/GCS)
- Brand Memory API (for pattern storage)

*Testing Priorities:*

1. Core edit flow (pin → apply → new version)
2. Region detection accuracy (80%+ auto-detect success)
3. In-painting quality and speed (<20 sec)
4. Batch editing reliability
5. Version history functionality
6. Refine™ escalation workflow
7. Mobile touch interactions
8. Edge case handling (failures, ambiguity)

*Monitoring & Alerts:*

- In-painting success rate (alert if <85%)
- Processing time (alert if >30s for >10% of edits)
- Region detection confidence (track weekly)
- Version history storage usage
- Edit Mode adoption rate (track weekly vs regenerate)
- Refine™ attach rate (track weekly, target 10%)
- Comments per image (track weekly, target 2-3 avg)

---