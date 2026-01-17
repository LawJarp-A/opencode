# Essentials

# ESSENTIALS PRD: 3-SPACE DIAGNOSTIC & SETUP SYSTEM

*Status:* Tier 1 - Foundation (Ship First) | *Timeline:* 4 weeks | *Last Updated:* January 3, 2026

---

# 📋 SHAPE UP PITCH

## Problem

Brands arrive at ShopOS with broken fundamentals they don't know about. No clear starting point, no unified view of reality, analysis paralysis about what to fix first.

*The pattern:*

```
Brand signs up for ShopOS
  ↓
Faces 57+ Spaces: "Where do I start?"
  ↓
Picks random Space: "Product Image Generator"
  ↓
Generates images, but:
  - No brand context loaded (generic outputs)
  - Site isn't AI-crawlable (AI can't find their products)
  - No agentic storefront (nowhere to deploy outputs)
  - No tracking (can't measure impact)
  ↓
Result: Outputs are mediocre, impact is zero, brand churns
```

*Real user pain:* "I generated 50 product images with ShopOS. They're fine, but my site still isn't showing up when people ask ChatGPT for recommendations. I don't know what's broken or where to start fixing it."

*The root cause:* Brands need *foundation before features*. Without brand intelligence, technical readiness, and deployment infrastructure, all the AI generation in the world is wasted.

## Appetite

*4 weeks*

Essentials is the default onboarding. Every brand runs it before using Spaces. It's the foundation that makes everything else work.

We're investing 4 weeks because this unlocks retention. Brands with foundation = 3x higher engagement, 5x lower churn.

## Solution

*Essentials = 3-Space Diagnostic That Builds Your Foundation in 15 Minutes*

Not a tool. *The path* every brand takes before ShopOS can work for them.

*The Flow:*

```
Brand fills one form (5 min: website URL, industry, goals)
  ↓
System runs 3 diagnostic spaces automatically (10 min)
  ↓
Brand receives:
  1. Complete brand intelligence (stored in Brand Memory)
  2. Agentic storefront deployed (WhatsApp, ChatGPT, Claude, Instagram)
  3. Prioritized 90-day action plan (what to fix, in order)
  ↓
All insights → Brand Memory
  ↓
Every future Space has full context
  ↓
Brand is ready to use ShopOS effectively
```

*The 3 Spaces:*

**Space 1: Research & Memory**

- Deep brand research (AI mentions, reviews, sentiment, competitive analysis)
- Perception gaps (what AI says vs what brand says)
- Store everything in Brand Memory (permanent context)
- Set up tracking (monthly re-scans, alerts)

**Space 2: Agentic Store Setup**

- Deploy adaptive storefronts across platforms:
    - WhatsApp Business (conversational commerce)
    - ChatGPT Store (AI shopping assistant)
    - Claude integration (chat-based browsing)
    - Instagram Messenger (DM shopping)
- Unified order management dashboard
- Dynamic layouts per visitor (personalized experiences)

**Space 3: GEO & Action Plan**

- AI readiness check (technical audit: schema, crawlability, speed)
- GEO recommendations (product titles, descriptions, schema markup, FAQs)
- Prioritized 30-60-90 day roadmap (impact × effort matrix)
- Ready-to-deploy fixes (code included)

*Why This Works:*

- *Speed:* 15 minutes, not weeks of consulting
- *Completeness:* Intelligence + infrastructure + roadmap
- *Actionability:* Not analysis, prioritized fixes with code
- *Modern commerce:* Agentic storefronts, not just traditional e-commerce
- *Permanent value:* Brand Memory powers all future work

## Rabbit Holes

*Don't build:*

- *Manual research.* Automate scraping (AI mentions, reviews, social).
- *Custom agentic store builders.* Pre-configured templates for each platform.
- *Deep technical audits.* Focus on top 20% of issues that create 80% of impact.
- *Strategy consulting.* Give actionable roadmap, not strategic advice (that's Refine™).
- *Custom dashboards.* Simple tracking, not complex analytics.

*Reuse existing:*

- Brand Memory (storage layer)
- Multi-step forms (data collection)
- Files library (store outputs)

*Watch out for:*

- Scraping rate limits (AI platforms, review sites)
- Platform API changes (WhatsApp, ChatGPT, Instagram)
- Brand Memory accuracy (bad data = bad context)
- Roadmap overwhelm (keep it focused, not exhaustive)

## No-Gos

*Explicitly NOT doing:*

- ✖ Manual consulting (automated diagnostics only)
- ✖ Custom strategy (roadmap is templated, that's Refine™)
- ✖ Deep analytics (simple tracking only)
- ✖ White-label agentic stores (pre-configured templates)
- ✖ Email marketing setup (focus on commerce)

---

# 🔧 ENGINEERING PRD

## 1. OBJECTIVE

*Purpose:*
Build a 3-space diagnostic system that runs automatically on brand signup, analyzes their online presence, deploys agentic storefronts, stores intelligence in Brand Memory, and delivers a prioritized action plan. Transform brand uncertainty into executable strategy in 15 minutes.

*Goal:*

- *95% completion rate* (brands who start, finish all 3 spaces)
- *<15 min total time* (form + diagnostics + review)
- *80% action rate* (brands implement at least 1 recommendation in 30 days)
- *Brand Memory accuracy >90%* (stored intelligence is correct)
- *3x engagement increase* (brands with Essentials vs without)

*Context:*
Essentials is the default onboarding. Without it, brands generate mediocre outputs and churn. With it, they have foundation + context + infrastructure for success.

## 2. SCOPE

### In Scope

**Space 1: Research & Memory**

- Scrape AI platforms (ChatGPT, Claude, Perplexity) for brand mentions
- Analyze reviews (Amazon, Trustpilot, Google, Reddit, forums)
- Sentiment analysis (positive/negative/neutral with examples)
- Competitive analysis (mentions vs competitors, positioning)
- Perception gap detection (what they say ≠ what brand says)
- Store everything in Brand Memory (permanent context)
- Set up monthly re-scans (automated tracking)
- Alerts for critical issues (negative sentiment spike, AI visibility drop)

**Space 2: Agentic Store Setup**

- Platform deployment:
    - WhatsApp Business API integration
    - ChatGPT Store listing creation
    - Claude MCP integration
    - Instagram Messenger shopping
- Conversational commerce agents (product recommendations, Q&A, checkout)
- Dynamic layouts (personalize per visitor intent, source, behavior)
- Unified order management dashboard (all platforms in one view)
- Product catalog API (sync across all platforms)

**Space 3: GEO & Action Plan**

- AI readiness audit:
    - Schema markup completeness (Product, Organization, BreadcrumbList)
    - Crawlability check (robots.txt, sitemap.xml, broken links)
    - Speed & mobile performance (Core Web Vitals)
    - Content quality signals (E-E-A-T indicators)
- GEO recommendations:
    - Product titles & descriptions (AI-optimized)
    - Schema markup code (ready to paste)
    - FAQ generation (AI-optimized answers)
    - Alt text for images
    - Technical fixes (with code)
- 30-60-90 day roadmap:
    - Prioritized tasks (impact × effort matrix)
    - Clear owners (DIY, ShopOS, Refine™)
    - Time estimates (5min, 30min, 2hrs, Strategic)

**Integration Points:**

- Brand Memory (storage + retrieval)
- Files library (store reports, outputs)
- Refine™ (escalation for strategic work)
- Multi-step forms (data collection)

### Out of Scope (Phase 2)

- Manual consulting/strategy
- Custom agentic store designs
- Email marketing setup
- SEO keyword research (focus on GEO, not SEO)
- Deep analytics dashboards

*Phase:* Phase 1 (Foundation) - 4 weeks

## 3. INPUTS

*1. Brand Setup Form:*

```json
{
  "website_url": "[https://arcticoutfitters.com](https://arcticoutfitters.com)",
  "industry": "Apparel - Outdoor",
  "primary_products": ["Winter Jackets", "Hiking Boots", "Backpacks"],
  "target_audience": "Outdoor enthusiasts, 25-40",
  "competitors": ["Patagonia", "The North Face", "Arc'teryx"],
  "goals": ["Increase AI visibility", "Launch WhatsApp store", "Improve conversions"]
}
```

*2. Website Data (Scraped):*

- Homepage content
- Product pages (titles, descriptions, images)
- Schema markup (existing)
- robots.txt, sitemap.xml
- Page speed metrics

*3. External Data (Scraped):*

- AI platform mentions (ChatGPT, Claude, Perplexity search results)
- Reviews (Amazon, Trustpilot, Google)
- Social sentiment (Reddit, Twitter/X, Instagram)
- Competitor data (for comparison)

## 4. OUTPUTS

*1. Research & Memory Report:*

```
AI Visibility Score: 42/100
  - ChatGPT mentions: 3/month (vs Patagonia: 87/month)
  - Claude mentions: 1/month
  - Perplexity mentions: 0/month
  
Sentiment Analysis:
  - Positive: 68% ("Great quality, warm jackets")
  - Neutral: 24%
  - Negative: 8% ("Sizing runs small")
  
Perception Gaps:
  1. Brand says "affordable" → Reviews say "premium pricing"
  2. Brand says "trendy" → AI describes as "classic outdoor"
  3. Missing: No mentions of sustainability (competitor strength)
  
Competitive Position:
  - AI visibility: #4 of 5 (behind Patagonia, North Face, Arc'teryx)
  - Sentiment: #2 of 5 (higher than competitors)
  - Price perception: Mid-tier
  
Stored in Brand Memory: ✓
Monthly tracking enabled: ✓
```

*2. Agentic Store Deployment Summary:*

```
Deployed Platforms:
  ✓ WhatsApp Business: +1-555-ARCTIC (conversational shopping live)
  ✓ ChatGPT Store: "Arctic Outfitters Shopping Assistant" (approved, live)
  ✓ Claude Integration: Chat-based browsing enabled
  ✓ Instagram Messenger: DM shopping active
  
Unified Dashboard: [https://shopos.com/arctic/orders](https://shopos.com/arctic/orders)
  - Real-time order sync across all platforms
  - Inventory management
  - Customer conversations (all channels)
  
Product Catalog API: Live
  - 47 products synced
  - Auto-updates on inventory changes
```

*3. GEO & Action Plan:*

```
AI Readiness Score: 58/100
  
Critical Issues (Fix Now):
  1. Missing Product schema on 89% of pages (High impact, 30min fix)
  2. robots.txt blocking /products directory (High impact, 5min fix)
  3. 12 broken links in sitemap (Medium impact, 15min fix)
  
GEO Recommendations:
  Product Title: "Winter Parka" → "Men's Insulated Winter Parka for Hiking & Outdoor Adventures"
  Description: +3 paragraphs optimized for AI (included below)
  Schema: <script type="application/ld+json">...</script> (ready to paste)
  FAQ: 5 AI-optimized Q&As generated
  
30-60-90 Day Roadmap:
  
  Week 1 (High Impact, Low Effort):
    - Fix robots.txt (5min, DIY)
    - Deploy Product schema on top 10 products (30min, ShopOS)
    - Launch WhatsApp store promotion (15min, DIY)
    
  Month 1 (High Impact, Medium Effort):
    - Optimize all product titles & descriptions (2hrs, ShopOS)
    - Deploy full Product schema (2hrs, ShopOS)
    - Create AI-optimized FAQs (1hr, ShopOS)
    
  Quarter 1 (Strategic):
    - Reposition brand messaging (perception gaps) (Refine™)
    - Launch sustainability content strategy (Refine™)
    - Expand agentic store features (auto-recommendations)
```

*4. Analytics Events:*

- `essentials_started` (user_id)
- `essentials_space_completed` (space_id, duration)
- `essentials_completed` (total_time, all_spaces)
- `brand_memory_populated` (fields_stored, confidence_scores)
- `agentic_store_deployed` (platforms, products_synced)
- `action_plan_viewed` (roadmap_shown)
- `recommendation_implemented` (task_id, days_to_implementation)

## 5. CORE REQUIREMENTS

### Space 1: Research & Memory

**Data Collection:**

1. Scrape AI platforms:
    - ChatGPT: Search for brand name, count mentions, analyze context
    - Claude: Search conversations (if accessible), count mentions
    - Perplexity: Search results, featured snippets
2. Scrape review platforms:
    - Amazon (if products listed)
    - Trustpilot (if profile exists)
    - Google Reviews
    - Reddit (search brand mentions)
3. Social sentiment:
    - Twitter/X mentions
    - Instagram hashtags
    - TikTok (if applicable)

**Analysis:**

1. AI visibility:
    - Count mentions per platform per month
    - Compare to competitors (benchmark)
    - Calculate AI Visibility Score (0-100)
2. Sentiment analysis:
    - NLP on reviews/mentions (positive/negative/neutral)
    - Extract common themes ("quality", "pricing", "customer service")
    - Flag perception gaps (brand messaging ≠ customer feedback)
3. Competitive positioning:
    - Mentions vs competitors
    - Sentiment vs competitors
    - Feature comparisons (if available)

**Brand Memory Storage:**

1. Store structured data:
    - Brand name, industry, products
    - Target audience
    - Competitors
    - AI visibility score
    - Sentiment summary
    - Perception gaps
    - Competitive position
2. Tag with confidence scores (high/medium/low)
3. Enable retrieval for future Spaces

**Tracking Setup:**

1. Schedule monthly re-scans (automated)
2. Set alerts:
    - AI visibility drops >20%
    - Negative sentiment spike (>15% increase)
    - New competitor emerges (mentions surge)
3. Email summary to user (monthly)

### Space 2: Agentic Store Setup

**Platform Deployment:**

1. *WhatsApp Business:*
    - Create business account (or link existing)
    - Set up conversational agent (product catalog, Q&A, checkout)
    - Configure auto-responses (business hours, FAQs)
    - Enable order notifications
    - Provide phone number to user
2. *ChatGPT Store:*
    - Create GPT listing ("[Brand Name] Shopping Assistant")
    - Configure instructions (product recommendations, search, Q&A)
    - Link to product catalog API
    - Submit for approval (auto-submit)
    - Notify user when live
3. *Claude Integration:*
    - Set up MCP server (product catalog, order management)
    - Enable chat-based browsing
    - Configure conversational commerce
    - Test integration
4. *Instagram Messenger:*
    - Connect Instagram Business account
    - Enable shopping in DMs
    - Configure product catalog sync
    - Set up auto-responses

**Unified Dashboard:**

1. Order management:
    - Real-time sync from all platforms
    - Unified order view (status, customer, platform)
    - Inventory management (cross-platform)
2. Customer conversations:
    - All channels in one inbox
    - AI-suggested responses
    - Conversation history
3. Analytics:
    - Orders by platform
    - Conversion rates
    - Top products

**Product Catalog API:**

1. Sync products from website
2. Normalize data (titles, descriptions, images, prices)
3. Push to all platforms
4. Auto-update on inventory changes
5. Handle platform-specific requirements (image sizes, field limits)

### Space 3: GEO & Action Plan

**AI Readiness Audit:**

1. *Schema markup check:*
    - Product schema (name, description, price, availability, image, brand)
    - Organization schema (name, logo, contact, social profiles)
    - BreadcrumbList schema (navigation)
    - Calculate completeness (0-100%)
2. *Crawlability check:*
    - robots.txt analysis (any blocks?)
    - sitemap.xml analysis (valid, complete, up-to-date?)
    - Broken links (404s in sitemap)
    - Redirect chains (>2 redirects)
3. *Speed & mobile:*
    - Core Web Vitals (LCP, FID, CLS)
    - Mobile-friendly test
    - HTTPS check
4. *Content quality:*
    - Product description length (>100 words?)
    - Image alt text (present?)
    - Unique content (not duplicate)

**GEO Recommendations:**

1. *Product optimization:*
    - Generate AI-optimized titles (descriptive, keyword-rich)
    - Generate AI-optimized descriptions (3 paragraphs, benefits + features + use cases)
    - Include schema markup code (ready to paste)
2. *FAQ generation:*
    - Generate 5-10 FAQs per product category
    - Optimize answers for AI (direct, concise, factual)
    - Include schema markup (FAQPage)
3. *Alt text:*
    - Generate alt text for all product images
    - Descriptive, keyword-aware
4. *Technical fixes:*
    - Provide code for robots.txt fixes
    - Provide code for schema markup
    - List broken links to fix
    - Suggest speed optimizations (image compression, caching)

**Action Plan Generation:**

1. *Prioritization matrix:*
    - Impact: High/Medium/Low (based on AI readiness impact)
    - Effort: 5min / 30min / 2hrs / Strategic
    - Owner: DIY (brand does it) / ShopOS (automated) / Refine™ (expert needed)
2. *30-60-90 day roadmap:*
    - Week 1: Top 3 high-impact, low-effort tasks
    - Month 1: 5-10 medium-effort tasks
    - Quarter 1: 2-3 strategic initiatives
3. *Output format:*
    - Timeline view (Gantt-style)
    - Checklist view (to-do list)
    - Each task includes:
        - Description
        - Impact rating
        - Effort estimate
        - Owner
        - Implementation steps (if DIY)
        - Code/copy (if applicable)

## 6. BEHAVIORS & RULES

### Automatic Execution

- All 3 spaces run automatically after form submission
- User sees progress: "Running diagnostics... (Step 1 of 3)"
- No manual intervention required
- Total execution time: 5-10 minutes

### Brand Memory Confidence Scoring

- *High confidence (≥90%):* Auto-store, use in future Spaces
- *Medium confidence (70-89%):* Store with flag, prompt user to confirm
- *Low confidence (<70%):* Don't store, flag for manual review

Example:

- Brand name from website: High confidence ✓
- Target audience from social mentions: Medium confidence (confirm with user)
- Pricing strategy inferred from reviews: Low confidence (don't store)

### Agentic Store Deployment Order

1. Product catalog sync (required first)
2. WhatsApp (fastest deployment, highest ROI)
3. ChatGPT Store (requires approval, submit early)
4. Claude Integration (technical setup)
5. Instagram Messenger (depends on account status)

### Action Plan Overload Prevention

- Max 20 tasks per roadmap
- Collapse low-priority tasks into "Nice to have" section
- Focus on top 10 highest-impact items
- Don't overwhelm user with 100-item list

## 7. TECHNICAL CONSTRAINTS & EDGE CASES

### Performance Requirements

- Total execution time: 5-10 minutes (all 3 spaces)
- Brand Memory query: <2 seconds
- Agentic store deployment: <3 minutes per platform
- Action plan generation: <1 minute

### Scraping Rate Limits

- AI platforms: Max 10 queries per minute
- Review sites: Max 5 pages per minute
- Social: Max 20 API calls per minute
- If rate limited → Queue requests, resume after delay

### Platform API Changes

- WhatsApp Business API: Monitor for breaking changes
- ChatGPT Store: Monitor approval process changes
- Instagram: Monitor API deprecations
- Fallback: Manual setup instructions if API unavailable

### Error Handling

*1. Website Unreachable:*

- Retry 3x
- If fails → Prompt user: "Can't access website. Is it live?"
- Offer manual data entry

*2. No AI Mentions Found:*

- Don't fail, report score: 0/100
- Recommend: "Your brand has low AI visibility. Here's how to improve..."

*3. Platform Deployment Fails:*

- Continue with other platforms
- Flag failure in report: "WhatsApp deployment pending (requires manual approval)"
- Provide manual setup guide

*4. Schema Parsing Errors:*

- Continue with audit
- Flag: "Couldn't parse schema. Manual review recommended."
- Provide schema template

### Edge Cases

*1. Brand Has No Website:*

- Skip technical audit
- Focus on AI visibility + social sentiment
- Deploy agentic stores as primary commerce channel

*2. Brand Has Multiple Domains:*

- Prompt user to select primary domain
- Run diagnostics on primary only (for Phase 1)

*3. Competitor Data Unavailable:*

- Skip competitive analysis
- Focus on absolute metrics (not relative)

*4. Brand Already Has Agentic Stores:*

- Detect existing integrations
- Offer to optimize or skip

## 8. USER STORIES (SUCCESS CRITERIA)

### Story 1: New Brand, Zero Foundation

*User:* Sarah, new outdoor apparel brand (just launched Shopify store)

```
Sarah signs up for ShopOS
  ↓
Prompted: "Let's build your foundation (15 min)"
  ↓
Fills form:
  - Website: [arcticoutfitters.com](http://arcticoutfitters.com)
  - Industry: Apparel - Outdoor
  - Products: Winter jackets, hiking boots
  - Competitors: Patagonia, North Face
  ↓
Clicks "Start Diagnostics"
  ↓
Progress bar: "Running diagnostics... (Step 1 of 3)"
  ↓
10 minutes later
  ↓
Report appears:
  
  SPACE 1: Research & Memory
  - AI Visibility: 12/100 (very low, brand new)
  - Sentiment: N/A (no reviews yet)
  - Stored in Brand Memory: Name, products, audience, competitors
  
  SPACE 2: Agentic Store Setup
  - WhatsApp: Live (+1-555-ARCTIC)
  - ChatGPT Store: Pending approval (submitted)
  - Claude: Live
  - Instagram: Live
  - Dashboard: [https://shopos.com/arctic/orders](https://shopos.com/arctic/orders)
  
  SPACE 3: GEO & Action Plan
  - AI Readiness: 35/100 (needs work)
  - Critical issues:
    1. No Product schema (30min fix, code included)
    2. Product descriptions too short (2hrs, ShopOS can optimize)
    3. Missing FAQ section (1hr, ShopOS can generate)
  
  30-Day Plan:
    Week 1: Deploy schema, promote WhatsApp store
    Month 1: Optimize all products, launch FAQ page
  ↓
Sarah clicks "Start Week 1 Tasks"
  ↓
ShopOS guides her through fixes (schema code, WhatsApp promo)
  ↓
30 days later: AI Readiness 68/100 (+33 points)
  ↓
Monthly re-scan shows improvement, tracks progress
```

*Outcome:* Sarah went from zero foundation to AI-ready in 15 min. Agentic stores deployed, roadmap clear, tracking active.

---

### Story 2: Established Brand, Broken Fundamentals

*User:* Marcus, 5-year-old home decor brand (Shopify, 500 products, $2M/year)

```
Marcus signs up for ShopOS
  ↓
"We've been in business 5 years but ChatGPT never recommends us."
  ↓
Runs Essentials
  ↓
Report reveals:
  
  SPACE 1: Research & Memory
  - AI Visibility: 28/100 (low for established brand)
  - Sentiment: 72% positive ("Great quality, slow shipping")
  - Perception gap: Brand says "modern" → Reviews say "traditional"
  - Competitor position: #5 of 6 (behind West Elm, CB2, Article, Burrow)
  
  SPACE 2: Agentic Store
  - Deployed across all platforms (first time using conversational commerce)
  - 500 products synced
  
  SPACE 3: GEO & Action Plan
  - AI Readiness: 41/100 (broken fundamentals)
  - Critical issues:
    1. robots.txt blocking /collections (High impact, 5min fix)
    2. No schema on any products (High impact, 2hrs fix)
    3. Product titles not optimized ("Chair" vs "Mid-Century Modern Velvet Accent Chair")
  
  90-Day Plan:
    Week 1: Fix robots.txt, deploy top 50 product schemas
    Month 1: Optimize all product titles/descriptions
    Quarter 1: Reposition messaging ("modern" perception gap) → Refine™
  ↓
Marcus implements Week 1 fixes (30 min total)
  ↓
30 days later: AI Visibility 52/100 (+24 points)
  ↓
ChatGPT starts recommending products
  ↓
90 days later: AI Visibility 71/100, revenue from AI referrals +$40K/month
```

*Outcome:* Essentials diagnosed broken fundamentals Marcus didn't know about. Quick fixes = immediate AI visibility improvement.

---

### Story 3: Refine™ Escalation

*User:* Lily, sustainable beauty brand (perception gap identified)

```
Lily runs Essentials
  ↓
Report shows perception gap:
  - Brand says: "Affordable luxury"
  - Reviews say: "Premium pricing"
  - AI describes: "High-end organic skincare"
  ↓
Action Plan recommends:
  - Quarter 1: Reposition brand messaging (Strategic, Refine™)
  ↓
Lily clicks "Send to Refine™"
  ↓
Packaged data sent to expert:
  - Essentials report (AI visibility, sentiment, perception gaps)
  - Brand Memory (all context)
  - Competitor analysis
  ↓
Expert receives full brief (no re-explaining needed)
  ↓
Expert delivers:
  - Repositioned messaging ("Conscious luxury at honest prices")
  - Website copy updates
  - Campaign strategy
  ↓
30 days later: Perception gap closing (reviews align with messaging)
```

*Outcome:* Essentials identified strategic work, seamlessly escalated to Refine™ with full context.

---

## 9. DELIVERABLES

### Code

*1. Frontend Components:*

- EssentialsOnboarding (form + progress tracker)
- ResearchReport (AI visibility, sentiment, competitive position)
- AgenticStoreDashboard (unified order management)
- GEOReport (readiness score, recommendations)
- ActionPlanTimeline (30-60-90 day roadmap)
- MonthlyReportEmail (automated summaries)

*2. Backend Services:*

- Scraping service (AI platforms, reviews, social)
- Sentiment analysis service (NLP on reviews/mentions)
- Schema audit service (parse website, check completeness)
- Agentic store deployment service (platform APIs)
- Roadmap generator (prioritization matrix)
- Brand Memory writer (store intelligence)

*3. Integration Layer:*

- WhatsApp Business API
- ChatGPT Store API
- Claude MCP
- Instagram Graph API
- Brand Memory API
- Refine™ escalation API

*4. Testing:*

- Unit tests (scraping, analysis, deployment) - 80% coverage
- Integration tests (full Essentials flow)
- E2E tests (form → diagnostics → reports → action plan)
- Platform tests (WhatsApp, ChatGPT, Claude, Instagram)
- Performance tests (execution time <10 min)

### Documentation

*1. User Docs:*

- How Essentials works
- Understanding your reports
- Implementing recommendations
- Using agentic stores
- Monthly tracking

*2. Developer Docs:*

- Scraping architecture
- Platform deployment guides
- Brand Memory schema
- Action plan prioritization logic

---

# NOTES

*Phase 1 Priority:* Core 3-space flow working. Prove brands get foundation + infrastructure + roadmap in 15 min.

*What NOT to Build:*

- ✖ Manual consulting
- ✖ Custom strategy
- ✖ Deep analytics dashboards
- ✖ Email marketing
- ✖ SEO keyword research

*Performance Critical:*

- Total execution MUST be <15 minutes (including form)
- Brand Memory accuracy MUST be >90% (bad data = bad context forever)
- Agentic store deployment MUST work (core value prop)
- Action plan MUST be actionable (not theoretical)

*Integration Dependencies:*

- Brand Memory (must exist)
- Platform APIs (WhatsApp, ChatGPT, Instagram)
- Scraping infrastructure (rate limits, proxies)
- Refine™ (escalation path)

*Testing Priorities:*

1. Full Essentials flow (form → reports → action plan)
2. Brand Memory accuracy (stored data correct?)
3. Agentic store deployment (all platforms)
4. Scraping reliability (handle rate limits, failures)
5. Action plan quality (recommendations make sense?)

*Monitoring & Alerts:*

- Completion rate (alert if <90%)
- Execution time (alert if >20 min)
- Platform deployment failures (alert if >10%)
- Scraping failures (alert if >5%)
- Brand Memory confidence scores (review monthly)

---

*END OF ESSENTIALS PRD*