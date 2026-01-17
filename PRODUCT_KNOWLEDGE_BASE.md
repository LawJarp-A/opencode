# Product Knowledge Base & Long Term Memory

This document serves as the central repository for all product details regarding the V3 ShopOS / OpenCode modification. It is aggregated from the source `.md` files in the `Core files/` directory.

## Source Files Status
- [x] Jan 05 2026 V3 Kickoff 2dd118db8f298064a372c03fad4eef40.md
- [x] V3 Product Note 2dd118db8f2980f4ab1ada53abc78c9f.md
- [x] Brand Essentials PRD 2dd118db8f298025acdbd70cdbf88137.md
- [x] Call 2dd118db8f2980788063d75728406b77.md
- [x] Call Creative Director (Voice) PRD 2dd118db8f29805f9f22ef24ad0403db.md
- [x] Edit Mode 2dd118db8f29801c9aa2e5d839e60dad.md
- [x] Essentials 2dd118db8f2980748d55c60fac0eaf08.md
- [x] Files - Smart asset Library PRD 2dd118db8f298000bedfd9f59c9d707b.md
- [x] Files 2dd118db8f298047b495c0175e7be911.md
- [x] Loops 2dd118db8f298026a541f977ee522286.md
- [x] Loops – The Continuous Improvement Cycle PRD 2dd118db8f29800aae37de9b3beffe37.md
- [x] Multi-Step Forms 2dd118db8f29806f9b7bf988ccb3e279.md
- [x] Multi-Step Forms PRD 2dd118db8f2980cb8c48d59fef0b2efc.md
- [x] Plans 2dd118db8f298007a33bc650a7cc7c1c.md
- [x] Plans PRD 2dd118db8f298054b44cda11751e7f75.md
- [x] Refine - Human Review PRD 2dd118db8f298077b763f8d5385d6669.md
- [x] Refine 2dd118db8f29809c9248cc136b0dd27e.md
- [x] Spaces 2dd118db8f298053b5e6ee3211af84e8.md
- [x] Spaces Main Page 2cf118db8f2980c990a6e237070981fa.md
- [x] Type 1 Request Routing PRD 2cb118db8f2980d8860aec15b7549399.md
- [x] Type-1 2dd118db8f298021a8cce97f495ff8cc.md
- [x] Your Battle Cards 2dd118db8f2980659b9de5ece6d36cbc.md

---

## High Level Overview (V3 Kickoff & Product Note)

**Goal:** Shift from "ShopOS generates content" to "ShopOS makes brands learn and sell better".
**Ship Date:** Jan 31, 2025

### Core Problems Solved
1.  **Engineering:** File handling failures, server stability, lack of graceful degradation.
2.  **UX:** Chat/UI mode confusion, no refine state (forced regen), workflow mismatch.
3.  **Model Physics:** Hard surface failures, video consistency, text rendering.
4.  **Business:** Agency pricing confusion, credit burn pain.

### The 10 Focus Features
1.  **Brand Memory:** Infrastructure for brand identity.
2.  **Loops:** Autonomous measurement and improvement cycles.
3.  **Files:** Smart asset library with performance tracking.
4.  **Refine™:** Expert human-in-the-loop review.
5.  **Brand Essentials:** 6-space onboarding.
6.  **Plans:** Outcome-based workflows.
7.  **Multi-Step Forms:** Dynamic AI-generated forms.
8.  **Image Edit:** Unified comment-based editing.
9.  **Enterprise Tier:** Multi-brand management.
10. **Type 1 Request Routing:** Fast path for simple requests.

## Feature Deep Dive

### 1. Brand Essentials (Onboarding)
*   **Update (Jan 3 PRD):** Refined to a **3-Space Diagnostic System** (Foundation, Intelligence, Infrastructure).
*   **Goal:** Transform brand uncertainty into executable strategy in 15 mins.
*   **The 3 Spaces:**
    1.  **Research & Memory:** Scrape/analyze AI mentions, reviews, sentiment. Store in **Brand Memory**.
    2.  **Agentic Store Setup:** Deploy storefronts to WhatsApp, ChatGPT, Claude, Instagram.
    3.  **GEO & Action Plan:** AI readiness audit (schema, crawlability) + 30-60-90 day roadmap.
*   **Output:** A complete strategic plan stored in **Brand Memory** to provide context for all future ShopOS workflows.

### 2. Files (Smart Asset Library)
*   **Core Promise:** Not just storage, but *intelligent ingestion*.
*   **Key Features:**
    *   **Auto-Tagging & Analysis:** Vision AI extracts objects, scene, colors, acts as a quality scorer (Lighting 9/10).
    *   **SKU Auto-Linking:** Automatically identifies and links products to uploaded images.
    *   **Performance Tracking:** Integration with Shopify/Meta to show CTR/ROAS overlays on assets.
    *   **Health States:** Analyzing -> Linked -> High Performing -> Deprioritized.
    *   **Smart Grouping:** Auto-groups photoshoot sets.
*   **Constraints:** No folders (use tags/search), no complex version control.

### 3. Loops (Continuous Improvement)
*   **Core Promise:** Generate -> Test -> Learn -> Improve.
*   **The Pipeline:**
    1.  **Simulate (SimGym):** AI agents predict performance (heatmaps, CTR) based on store history.
    2.  **Listen:** Interactive user testing (swipeable story format) for qualitative feedback.
    3.  **Test:** Live A/B testing on Shopify/Meta.
    4.  **Learn:** RL Model extracts patterns ("warm tones work better") to bias next generation.
*   **Goal:** 15%+ performance improvement by Generation 3.

### 4. Plans (Outcome Workflows)
*   **Concept:** Pre-built chains of 5-15 Spaces to deliver complete outcomes.
*   **The 4 Launch Plans:**
    1.  **New Product Launch:** 45 min. Catalog + Ads + Copy.
    2.  **Seasonal Campaign Refresh:** 2 hours. Trends + Creative + Social.
    3.  **Marketplace Expansion:** 3 hours. Resize/Adapt for Amazon/Etsy.
    4.  **Competitor Response Sprint:** 4 hours. Counter-positioning + Rapid creative.
*   **Architecture:** Unified input form -> Sequential/Parallel Execution -> organized deliverable pack.

### 5. Refine™ (Human Expert Layer)
*   **Promise:** 90% AI -> 100% Expert Polish.
*   **Workflow:** User flags asset -> Expert edits (24h standard / 4h rush) -> User Approves -> **RL Model learns preference**.
*   **Pricing:** Tiered ($50 Quick Polish - $500 Full Production).
*   **Key Value:** The feedback loop trains the AI to need less refinement over time.

### 6. Edit Mode (Precision AI Editing)
*   **UX:** Figma-style comment pins. Click -> Type "Fix the hand" -> Apply.
*   **Tech:** Region detection (auto or manual box) + In-painting model.
*   **Benefit:** 30s fix vs 15m re-prompting loop.
*   **Integration:** After 3+ edits, prompt "Send to Refine" appears.

### 7. Multi-Step Forms
*   **Problem:** Static forms are too long and don't scale.
*   **Solution:** Dynamic 3-4 step forms generated per Space.
*   **Features:**
    *   **Smart Auto-Fill:** Pulls from Brand Memory (95% target accuracy).
    *   **Real-time Validation:** No submission errors.
    *   **Auto-Save:** Draft recovery if interrupted.
    *   **Mobile First:** Large touch targets.

### 8. Type-1 Request Routing (Reflex AI)
*   **Concept:** "Reflex Execution" for obvious intents. No planning UI.
*   **Logic:**
    *   If Image + Simple Instruction ("Put on model") -> **Type 1** (Instant Execution).
    *   If Complex Request ("Launch campaign") -> **Type 2** (Planning UI).
*   **UX:** <2s to streaming start. Rich Gallery output.
*   **Tech:** Stateless pattern matching routing (not AI classification).

### 9. Spaces Directory
*   **Goal:** A dedicated App Store-like discovery page for all 57+ Spaces.
*   **Features:**
    *   Real-time search & multi-select filters (Image/Video/Text).
    *   **Status Badges:** Beta, Custom (Enterprise-only).
    *   **"Know More" Modal:** About, Best For, Templates.
*   **Enterprise:** Custom spaces only visible to specific orgs (e.g., Agilitas).

### 10. Operational Priorities (Battle Cards)
*   **Video Spaces:** 10 targeted spaces including Looping GIFs, TikTok Hook, Unboxing, 360 Spin.
*   **Spacejam:** Live 2-hour sessions to build custom workflows, then productize top patterns.
*   **Marketing:** "Session Replays" as viral loop contents.

### 11. Call (Voice-First Creative Director)
*   **Status:** Tier 3 - Delight (Ship Later).
*   **Concept:** Voice conversation to generate creative briefs. "Talk to ShopOS".
*   **Tech Stack:** Eleven Labs (Orb, TTS), Whisper (STT), Claude (Logic).
*   **Flow:** Talk -> AI Clarifies -> Structured Brief Generated -> Plan Execution.

