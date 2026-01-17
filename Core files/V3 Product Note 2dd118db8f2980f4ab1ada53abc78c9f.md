# V3: Product Note

# ShopOS V3: January 2025 Product Note

*Ship Date: January 31, 2025*

---

## What Red Team Taught Us

**200+ hours of user sessions. Here's what breaks:**

### Engineering Problems (P0)

**File Handling**

- HD downloads fail silently
- JPEGs rejected without error messages
- 10MB+ files fail with no warning
- Users lose trust fast when basics break

**Server Stability**

- Peak load errors during critical moments (Christmas campaigns)
- "No Generations" errors kill conversion
- Zero graceful degradation

**Fix:** Regression testing on asset pipelines. Universal file ingestion. Visible error states. Fallback models.

---

### UX Confusion (P1)

**Chat vs UI Mode**

- Users type "create lifestyle shot" → forced into modal popup
- Context loss between intent and form
- "Background optional" confuses everyone

**No Refine State**

- Users want to tweak one detail ("remove toy")
- System regenerates 4 new variations instead
- Burns credits, loses original seed
- Feels like punishment for iteration

**Workflow Mismatch**

- User has 1 Pinterest reference
- We demand 5 angles they don't have
- "All or nothing" kills momentum

**Fix:** Type 1 routing (chat → action, no modal). Refine layer (edit without full regen). Inspiration Mode (1 image input).

---

### Model Physics (P1)

**Hard Surface Failures**

- Air fryer buttons "melt"
- Electronics look structurally wrong
- Shoe soles fuse to uppers in technical views
- We nail fabric/skin. We fail geometry.

**Video Consistency**

- Faces morph mid-turn ("scary glitch")
- Temporal consistency broken
- Users won't deploy video that looks broken

**Text Rendering**

- Logos warp
- Text becomes gibberish
- Packaging shots unusable

**Fix:** ControlNet for hardlines. IP-Adapter face lock for video. Vector overlay for text (don't generate, composite).

---

### Business Model

**Agency Pricing Confusion**

- Dubai agencies can't pitch without clear wholesale pricing
- Credit costs too vague to add margin
- No white-label option

**Credit Burn Pain**

- 100s of credits on bad outputs
- No refund mechanism
- Users beg Haider for credits

**Fix:** Agency rate card. White-label tier. Satisfaction guarantee (auto-refund flagged bad gens).

---

### Key Quotes

> "If the image looks like a cartoon, the separation doesn't matter." — The Zeppelin
> 

> "Her face changed... it looks a bit scary. Like a glitch." — Koskii
> 

> "The AI doesn't understand the functionality." — Nuuk
> 

> "Video is something that will sell more. Images are no longer a thing." — Sumi Homes
> 

> "Don't market it by ShopOS." — Sadath (Dubai agency)
> 

---

## V3: 10 Features to Ship

### 1. Brand Memory

**What:** Single source of truth for brand identity, visual style, compliance rules, performance patterns.

**Why First:** Without brand context, all outputs risk being generic or off-brand. This is infrastructure.

**How It Works:**

- Multiple memory files (Holiday 2024, Summer 2025)
- Template-based creation ("Fashion - Minimal")
- Optional during onboarding, mandatory during generation
- Reusable across all workflows
- Compounds over time (Refine feedback + Loop learnings → auto-update memory)

**Owner:** Tara (TPM)

**Ship Date:** Jan 15 (staging), Jan 31 (production)

**Success Metric:** 90% of workflows use memory. 80% reduction in "off-brand" feedback. <3 min to create memory.

---

### 2. Loops

**What:** Workflows that measure, learn, and improve autonomously.

**Why:** This is the core differentiator. Without Loops, we're just another content generator.

**How It Works:**

- Week 1: Generate 20 ad creatives → Deploy to Meta
- Week 2: Track CTR/ROAS → Identify patterns
- Week 3: Generate next 20 using learned patterns → 15% performance improvement
- Week 52: Your AI knows your brand better than you do

**Types:**

- Creative Loops (ad testing)
- Copy Loops (headlines, descriptions)
- Store Loops (layout, personalization)
- Campaign Loops (multi-channel)

**Owner:** Jay (PM)

**Ship Date:** First Loop type Jan 20, full system Jan 31

**Success Metric:** 10 brands running Loops. Average 15% improvement by Week 3.

---

### 3. Files

**What:** Not Google Drive. Active asset library that understands every image/video.

**How It Works:**

- Upload photo → AI auto-links to SKUs
- Quality scoring: "Lighting 9/10, Brand Fit 8/10"
- Performance tracking: "This image = 2.4% CTR in Meta ads"
- Auto-grouping: "Campaign Set: Summer 2025"
- Health states: Analyzing → Linked → High Performing → Deprioritized

**UI:**

- Pinterest-style masonry grid
- Mixed media (uploads + AI generations)
- "Where is this used?" (Shopify PDP, ChatGPT, Meta ads)
- Performance overlays

**Owner:** Shobit (PM)

**Ship Date:** Jan 15

**Success Metric:** 50 brands upload 100+ assets each. 95% auto-link to correct SKU.

---

### 4. Refine™

**What:** Push 90-95% AI work to experts for 100% excellence.

**Why:** Solves the "AI middle" problem. Critical for high-stakes work.

**Flow:**

- Brand generates campaign
- Review in Refine UI
- Flag 3 images for polish
- Routed to vetted designer ($50-200/image)
- Designer edits in 1-4 hours
- Approved version returns
- System learns from edits
- Next generation incorporates learnings

**Pricing:**

- Light Polish: $50-100
- Full Creative Direction: $200-500
- Strategy Sessions: $500-2000

**Owner:** Shobit (PM), Hrithwik (Engineering)

**Ship Date:** Jan 31

**Success Metric:** 50 brands use Refine. 90% satisfaction with expert work.

---

### 5. Brand Essentials

**What:** 6-space onboarding from "unknown" to "AI-ready" in 10-15 minutes.

**The 6 Spaces:**

1. **Foundation** — AI Readiness Check (schema, crawlability, performance)
2. **Intelligence** — Deep Brand Research (AI mentions, sentiment, competitive positioning)
3. **Agentic Store** — Stores that adapt to each visitor
4. **Optimization** — GEO Recommendations (specific fixes with code)
5. **Execution** — Priority Action Plan (30-60-90 day roadmap)
6. **Tracking** — Success Metrics & Monitoring (automated monthly re-scans)

**Output:** Complete strategic plan. All insights stored in MCP. Every future workflow has context.

**Owner:** Shobit (PM), Hrithwik (Engineering)

**Ship Date:** Jan 31

**Success Metric:** 100 plans generated Week 1. 60% execute Week 1 actions.

---

### 6. Plans

**What:** Pre-built planning paths for complete outcomes.

**Why:** Brands think in outcomes ("launch a product"), not tools ("run Space #42").

**Example Plans:**

**New Product Launch:**

- Catalog creation (20-30 assets)
- Marketplace adaptation
- Marketing assets
- Copy/metadata
- Ready in 45 min

**Seasonal Campaign Refresh:**

- Trend intelligence
- Creative generation
- Social content
- Ad copy
- Deployment

**Marketplace Expansion:**

- Asset adaptation
- Copy rewrite
- SEO/tags
- Listing creation

**Competitor Response Sprint:**

- Analysis
- Counter-positioning
- Rapid creative
- Speed deployment

**Owner:** Pranjal (Engineering)

**Ship Date:** Jan 31 (4 Plans shipped)

**Success Metric:** Plans reduce completion time 40%+.

---

### 7. Multi-Step Forms

**What:** Generative UI that builds custom forms for each space, on-demand.

**How It Works:**

- Space definition includes input schema
- Form generates dynamically
- Progressive disclosure
- Learns optimal question ordering from drop-off data
- Mobile-first, accessible

**Reference:** Google Labs GenTabs, Stacked Dialog patterns

**Owner:** Andrii (Frontend)

**Ship Date:** Jan 31

**Success Metric:** All spaces have dynamic forms. 85%+ completion rate.

---

### 8. Image Edit (Figma-Style Comments)

**What:** Figma-style comment mode for iterative editing.

**How It Works:**

- Click Refine button → Enter comment mode
- Click image area → Drop comment pin
- Type instruction: "Fix the hand", "Make background darker"
- Submit → AI processes regional edit
- Repeat → Tap Refine again for additional comments

**Key:** NO separate "Edit Mode" vs "Refine Mode". One unified flow.

**Owner:** Andrii (Frontend), Syed (AI)

**Ship Date:** Jan 31

**Success Metric:** 80% of image edits use comment mode vs. re-prompting.

---

### 9. Enterprise Tier

**What:** Curated onboarding, multi-brand management, white-label capabilities.

**Why:** 13+ brands can't onboard due to complexity.

**Features:**

- Custom spaces pre-configured per brand
- Multi-brand dashboard for agencies
- 4 overview types: audio, video, slide deck, report
- Advanced approval workflows (3-tier)
- Priority support & SLAs
- Dedicated success manager

**Pricing:**

- Base: $5K-10K/month
- Per brand seat: $200-500/month
- Revenue share: 2-3%
- Refine included: $5K credit/month

**Owner:** Pranjal (Engineering)

**Ship Date:** Jan 31

**Success Metric:** Onboard 5 enterprise clients. 90% retention after 6 months.

---

### 10. Type 1 Request Routing

**What:** 80% of requests don't need planning. Route them instantly.

**Pattern Recognition:**

- "Put this coat on a model at the beach" → Direct API call
- "Write a caption for..." → Text model
- "Remove background from..." → Specific endpoint
- "Translate this to..." → Direct LLM call

**Result:** No unnecessary forms. Direct output in <2 seconds.

**Owner:** Soham (Backend), Syed (AI)

**Ship Date:** Jan 31

**Success Metric:** 95% of simple requests routed correctly. <2s response time.

---

## Team Ownership

### Engineering

**Tapan (Lead)** — Engineering velocity, architecture decisions, team unblocking

**Manish (Manager)** — Sprint planning, resource allocation, QA process

**Andrii (Frontend)** — Loops UI, Files grid, Multi-Step Forms, Image Edit UI

**Soham (Backend)** — Brand Memory storage, Loop Orchestrator, API docs

**Nithin (Backend)** — Files upload pipeline, auto-SKU linking, performance tracking

**Syed (AI)** — Loop RL models, Vision AI for Files, model fine-tuning

**Pranjal (Full Stack)** — Plans orchestrator, Enterprise dashboard, 4 overview types

**Hrithwik (Full Stack)** — Brand Essentials 6 spaces, Refine UI

**Santhosh (Workflow Bridge)** — n8n integration, custom MCP, workflow productization

**Vikas (Full Stack + DevOps)** — Infrastructure, deployments, monitoring

**Sumaiya (QA)** — Test Loops, Files, Brand Memory, Refine

**Radhika (QA)** — Test Plans, Essentials, user acceptance testing

---

### Product

**Tara (TPM)** — Brand Memory (infrastructure, quality framework, cross-feature integration)

**Jay (PM)** — Loops (creative loop, trials MVP, loop templates)

**Shobit (PM)** — Files + Essentials (core Files, performance tracking, all 6 Essentials spaces)

---

### GTM/Sales

**Karan (Sales)** — Essentials as primary sales demo, waitlist outreach (840 brands), 30-60-90 roadmaps

**Haider (PLG)** — Session replay sharing, Reddit seeding, 200 US Red Team

**Shubham (India SLG)** — 100-brand pipeline, close 30 deals, localized case studies

**Pranav (POC)** — Enterprise POCs (run 5), POC framework, success metrics

**Titus (Website)** — Homepage redesign, feature pages, pricing refresh

**Ninad (Marketing Videos)** — 4 feature demos, 3 customer stories, video asset library

---

### Content/Social

**Uday (Social Media)** — Daily Twitter (3x/day), weekly LinkedIn + Substack, feature launch docs

**Vishal (Brand Videos)** — 10 video spaces, 10 video-heavy brands, performance benchmarking

**Arjun (Org Videos)** — 1 Saitec video/day minimum, 100-clip B-roll library, launch moment videos

**Tushar (Spacejams)** — Define format, run 10 sessions, productize top 3 patterns

---

### Design

**Vedant (UI/UX)** — Design-locked Figma + coded prototypes for Loops, Files, Refine

**Designer 2 (Marketing)** — Feature launch assets, video templates, homepage refresh

**Designer 3 (Forms)** — Essentials forms, Plan templates, multi-step form system

---

## January Scoreboard

| Person | P1 | P2 | P3 | M1 | M2 | M3 |
| --- | --- | --- | --- | --- | --- | --- |
| **Tara** | Memory infrastructure | Memory quality framework | Cross-feature integration | Staging Jan 15, prod Jan 31 | 80% coverage | <200ms latency |
| **Jay** | First Loop live | Trials MVP | Loop templates | First Loop Jan 20 | 10 brands running Loops | 15% improvement Week 3 |
| **Shobit** | Files core | Essentials 6 spaces | Health states + tracking | Files Jan 15, Essentials Jan 31 | 50 brands, 100+ assets | 80% actionable recs |
| **Karan** | Essentials demo | 100 plans | 30-60-90 roadmap | 40 demos | 25% demo-to-close | $15K MRR |
| **Haider** | Session replay | Reddit seeding | 200 US Red Team | 500 US sign-ups | 1.3 viral coefficient | 200 paid Red Team |
| **Shubham** | 100-brand pipeline | Close 30 | 3 India case studies | 100 leads Jan 15 | 30 closed | $8K MRR |
| **Tushar** | Spacejam format | Run 10 | Productize top 3 | 10 completed | 3 templated spaces | 80% retention |
| **Uday** | Daily Twitter | Weekly LI + Substack | Feature launch docs | 90 tweets, 4 LI, 4 Substack | 5% engagement | 50 sign-ups |
| **Vishal** | 10 video spaces | 10 video brands | Video benchmarking | 10 spaces Jan 31 | 10 brands, 50+ videos | 25% video lift |
| **Arjun** | 1 video/day | 100-clip B-roll | Launch videos | 30 videos January | 60% completion | 20% conversion lift |

---

## Red Team Structure

Every team member: **3 customer interviews per week**

**Interview Framework (30 min):**

1. Warm-up (5 min) — Who are you? What's your business? Current workflow?
2. Problem exploration (10 min) — Show me what breaks. What took longest?
3. Prototype test (10 min) — Try this. Talk out loud. Where stuck?
4. Wrap-up (5 min) — What makes this a no-brainer? What's missing?

**Documentation (15 min post-interview):**

- Record session (with permission)
- Write 1-pager: Name, company, key quote, top 3 insights, action items
- Share in Slack #red-team
- Tag relevant team members

**Weekly Synthesis (Every Friday):**

- Compile 3 interviews into trends doc
- Share with full team
- Highlight patterns

---

## What Success Looks Like

**By January 31:**

- 10 features shipped
- 200 brands actively using V3
- 100 Brand Essentials plans generated
- 10 brands running Loops with measurable improvement
- 50 brands with 100+ assets in Files
- $23K MRR from new sales motion
- 500 US sign-ups from PLG
- Zero breaking changes in production

**The Shift:**

From: "ShopOS generates content"

To: "ShopOS makes brands learn and sell better"

---