# Loops – The Continuous Improvement Cycle PRD

## The Continuous Improvement Cycle

**Status:** Tier 1 - Foundation (Ship First)

**Owner:** Product Team

Figma: 

**Last Updated:** January 2, 2025

---

## Executive Summary

Loops transform ShopOS from a content generator into a self-improving commerce system. Every workflow becomes an experiment. Every result feeds the next generation. Week 1, AI generates content. Week 12, AI optimizes better than your team. Week 52, your store is fundamentally smarter than competitors.

**The Core Insight:** 95% of brands using AI generate content and forget it. They never learn what works. They stay in the casino, pulling the slot machine lever. Loops move brands from casino to science lab.

## Figma:

---

## Problem Statement

### Current State (The Casino)

Brands are stuck in a generate-and-forget cycle:

1. Generate 20 ad creatives with AI
2. Post them to Meta
3. Some perform well, most don't
4. Generate 20 more next week
5. No learning between cycles
6. Performance stays flat or declines

**The Cost:**

- Wasted ad spend on underperforming creatives
- No compounding advantage over competitors
- Manual analysis required to identify patterns
- Can't scale creative testing without scaling team

---

## Solution: Loops

### What Is a Loop?

A Loop is a closed-feedback workflow that:

1. **Generates** outputs (ads, copy, images, layouts)
2. **Deploys** them to production channels (Meta, Shopify, email)
3. **Measures** performance (CTR, ROAS, CVR, engagement)
4. **Learns** patterns (colors, hooks, CTAs, layouts that work)
5. **Improves** next generation using learned patterns
6. **Repeats** infinitely, compounding intelligence

**Key Difference from Competitors:** We don't just generate. We close the loop.

### Loop Types

| Type | What | Generates | Measures | Learns | Example |
| --- | --- | --- | --- | --- | --- |
| Creative | Ad creative testing and optimization | Image variations, video edits, layout tests | CTR, view rate, engagement time | Visual patterns (colors, composition, model types) | 20 product images → deploy to Meta → Week 8 performance +40% vs Week 1 |
| Copy | Headlines, descriptions, CTAs, subject lines | Text variations tuned to brand voice | Click rate, open rate, conversion rate | Hook patterns, length, emotional triggers | Email subject lines → open rate optimization → 25% improvement in 4 weeks |
| Store | Layout testing, personalization, merchandising | Homepage variations, product arrangements, CTAs | Time on site, bounce rate, add-to-cart rate | What layouts work for different visitor segments | Homepage hero variations → 15% CVR improvement for mobile traffic |
| Campaign | Multi-channel orchestration with budget optimization | Coordinated creative across Meta, Google, TikTok | ROAS, CAC, LTV by channel | Channel mix, budget allocation, cross-channel patterns | Holiday campaign → optimal budget split discovered by week 3 |

---

## How It Works

### User Flow

```
Step 1: User selects a Space
  └─ Example: "Product Image Generator"

Step 2: User clicks "Start Loop" button
  └─ Modal appears: "Turn this into a learning Loop?"

Step 3: User configures Loop
  ├─ Name: "Summer 2025 Product Images"
  ├─ Deployment target: Meta Ads Account
  ├─ Success metric: CTR
  ├─ Frequency: Weekly (every Monday)
  └─ Volume: 20 images per generation

Step 4: First Generation
  └─ Space runs normally, outputs 20 images
  └─ Images automatically pushed to Meta (draft campaigns)

Step 5: Loop Monitors Performance
  └─ Waits 7 days
  └─ Pulls CTR data from Meta API
  └─ Identifies top 5 performers (highest CTR)
  └─ Identifies bottom 5 performers (lowest CTR)

Step 6: Pattern Analysis (RL Model)
  └─ Compares visual features: colors, composition, model types, backgrounds
  └─ Identifies winning patterns: "Images with warm tones + close-ups outperformed by 35%"
  └─ Generates bias signals for next generation

Step 7: Next Generation (Week 2)
  └─ Space runs again with learned bias
  └─ 70% of new images incorporate winning patterns
  └─ 30% explore new directions (avoid local maxima)
  └─ Deploy, measure, learn, repeat

Step 8: Compounding Over Time
  Week 1: Baseline performance (1.2% CTR avg)
  Week 4: 15% improvement (1.38% CTR avg)
  Week 8: 40% improvement (1.68% CTR avg)
  Week 52: 100%+ improvement (2.4% CTR avg)

```

## Technical Architecture

### Core Components

1. **Loop Orchestration Engine**
    - Manages Loop lifecycle (Plan → Make → Test → Learn)
    - Triggers next steps based on results
    - Handles mode selection logic
2. **Variant Generator**
    - Integrates with existing Agent system
    - Generates 2-10 variants per Loop
    - Maintains brand consistency via Brand Brain
3. **SimGym Integration**
    - AI persona simulation system
    - Historical data calibration
    - Heatmap generation
    - Predictive scoring
4. **Trial Mode UI**
    - Story-style interface component
    - Mobile and desktop responsive
    - Survey system
    - Reward mechanism
5. **A/B Testing Engine**
    - Traffic splitting (50/50, 33/33/33, etc.)
    - Statistical significance tracking
    - Auto-promotion logic
    - Rollback capability
6. **RL Memory System**
    - Stores Loop results
    - Updates Brand Brain with learnings
    - Influences future generations
    - Provides "insights" dashboard
7. **Platform Integrations**
    - Shopify (Theme/Asset API)
    - Amazon (A+ Content API)
    - Headless commerce (Direct asset swap)

---

### Testing Modes

1. Mode 1: Simulate (Synthetic Testing)

AI agents calibrated to the store's historical data browse variants and predict performance. Outputs predictive heatmaps, CTR forecasts, friction point analysis, and navigation flow data.

**Use case:** Zero-risk validation before showing to real customers.

1. Mode 2: Trial (Interactive User Testing)

Presents variants in a swipeable 'story mode' interface. Users provide feedback in exchange for rewards (discount codes, early access, points).

**Output:** Qualitative preference data, reasoning behind choices, engagement metrics, sentiment analysis.

1. Mode 3: Test (Live A/B Testing)

Deploys variants to live traffic with statistical rigor. Two deployment options:

**Option A - Direct Mode:** Agent automatically swaps assets live on store with traffic split across variants and real-time performance monitoring.

**Option B - Opt-In Mode:** 'View with AI' toggle appears for shoppers. Only users who opt in see experimental variants, protecting baseline conversion rate.

---

## Success Metrics

### Product Metrics

- **Loops Created:** 100 in first 30 days post-launch
- **Active Loops (30-day):** 60% of created Loops still running
- **Generations per Loop:** Avg 4+ generations (indicates sustained engagement)
- **Loop Completion Rate:** 80% of Loops reach generation 5+

### Performance Metrics

- **Improvement Rate:** 15%+ performance gain by generation 3 (vs baseline)
- **Time to First Learning:** <14 days for 80% of Loops
- **Pattern Confidence:** 70%+ accuracy in predicting high performers

### User Engagement

- **Weekly Active Loopers:** 40% of users with at least 1 Loop check dashboard weekly
- **Loop Dashboard Sessions:** Avg 2 sessions/week per active Looper
- **Manual Overrides:** <10% of Loops paused or manually adjusted (indicates trust)

### Business Impact

- **Revenue Lift:** Brands using Loops see 20%+ revenue increase (beta benchmark)
- **Retention:** Loopers have 2x retention vs non-Loopers at 90 days
- **Upsell:** 30% of Loop users upgrade to Growth or Enterprise tier

---

## Key Features

### 1. One-Click Loop Start

- "Start Loop" button in every applicable Space
- Simple modal with 5 key questions
- No technical configuration required

### 2. Performance Tracking Integration

- Auto-connect to Meta Ads Manager, Shopify, GA4
- Real-time metric polling
- Time-series visualization

### 3. Pattern Analysis (RL Model)

- Visual feature extraction (colors, composition, elements)
- Text feature extraction (sentiment, structure, length)
- Statistical significance testing
- Confidence scoring

### 4. Intelligent Bias Generation

- 70/30 exploitation/exploration balance
- Avoid local maxima (don't over-optimize)
- Gradual learning (don't shock the system)

### 5. Manual Override Controls

- Pause Loop (stop generating, keep data)
- Force Regenerate (skip wait period)
- Kill Underperformer (remove specific outputs from testing)
- Adjust Targets (change success metric mid-Loop)

### 6. Loop Dashboard

- At-a-glance performance trends
- Active vs paused Loops
- Next generation countdown
- Top learned patterns surfaced

---

## Competitive Differentiation

| Feature | ShopOS Loops | Competitors |
| --- | --- | --- |
| **Learning** | Automatic, continuous | Manual analysis required |
| **Feedback Loop** | Closed (generate → measure → improve) | Open (generate and forget) |
| **Pattern Recognition** | RL models identify winning patterns | User must identify patterns |
| **Multi-Generation** | Infinite improvement cycles | Single generation |
| **Performance Tracking** | Built-in, automatic | Separate tool required |
| **Optimization** | Self-improving | Static |
| **Time to Value** | <14 days to first learning | N/A (no learning) |

**Positioning:**

- **Competitors:** "AI content generator" (casino)
- **ShopOS Loops:** "Self-improving commerce system" (science lab)

**Talking Points:**

- "They generate content. We generate intelligence."
- "Their AI stays dumb. Ours gets smarter every week."
- "They're a tool. We're a compounding advantage."

---

## Dependencies

### Technical Dependencies

1. **Space Infrastructure** (exists) — Loops build on existing Space execution
2. **Analytics Connectors** (partial) — Need Meta, Shopify, GA4 APIs
3. **RL Model Pipeline** (build) — Pattern recognition and bias generation
4. **Storage** (exists) — Time-series performance data

### Data Requirements

- **Minimum Data Threshold:** 5 outputs per generation, 7 days measurement
- **Statistical Significance:** Need 100+ impressions per output for reliable CTR
- **Attribution Window:** 7-day click, 1-day view (Meta standard)

### Integration Requirements

- **Meta Ads API:** Read campaign performance, write draft campaigns
- **Shopify API:** Read product performance, write product updates
- **Google Analytics API:** Read traffic and conversion data
- **Klaviyo API:** Read email performance

---

---

## Risks & Mitigation

### Risk 1: Learning Takes Too Long

**Risk:** Users expect immediate results, get frustrated waiting 2-4 weeks for meaningful patterns.

**Mitigation:**

- Set clear expectations in UI: "First results in 7-10 days"
- Show "learning in progress" indicators
- Provide interim insights: "Collecting data... 45% complete"
- Offer "Quick Win" mode: smaller sample, faster feedback, lower confidence

### Risk 2: Patterns Don't Generalize

**Risk:** What works for one product/audience doesn't work for another. Model learns false patterns.

**Mitigation:**

- Loop-specific learning (don't mix audiences)
- Statistical significance testing before surfacing patterns
- Confidence scores visible to users
- "Exploration" allocation prevents over-fitting

### Risk 3: API Rate Limits

**Risk:** Meta/Shopify APIs throttle us at scale. Can't poll performance frequently enough.

**Mitigation:**

- Batch API calls (poll all Loops in single request)
- Cache aggressively (update hourly, not real-time)
- Negotiate higher rate limits with platforms
- Fallback: manual CSV upload if API fails

### Risk 4: Broken Attribution

**Risk:** Performance data doesn't accurately reflect Loop output quality (e.g., external factors, seasonality).

**Mitigation:**

- Control groups (some non-Loop outputs for comparison)
- Seasonality detection and normalization
- Multi-metric validation (CTR + CVR + ROAS, not single metric)
- Outlier detection and filtering

---

---

## Open Questions

1. **Minimum viable data?** What's the smallest sample size where learning is reliable? (Current thinking: 5 outputs, 100 impressions each, 7 days)
2. **Exploration budget?** Should 70/30 split be user-configurable? Or adaptive based on confidence?
3. **Cross-Loop learning?** Should patterns from one Loop inform another? (e.g., "Warm tones work for Product A, try them for Product B")
4. **Human-in-the-loop?** Should we allow users to approve/reject patterns before applying them?
5. **Multi-metric optimization?** Should Loops optimize for multiple goals simultaneously (CTR + CVR), or single-objective only?

---

---