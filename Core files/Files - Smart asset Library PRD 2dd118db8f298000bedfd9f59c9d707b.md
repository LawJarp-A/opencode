# Files - Smart asset Library PRD

# Product Note: Files - Smart Asset Library

**Status:** Tier 1 - Foundation (Ship First)

**Owner:** Product Team

Figma: 

**Timeline:** 2 weeks

**Last Updated:** January 2, 2025

---

## Executive Summary

Files is not Google Drive. It's not a DAM. It's a **Living Asset Intelligence Layer** that understands every image and video, auto-links them to products, tracks their performance, and helps brands make smarter content decisions.

**The Core Insight:** Brands drown in assets. They upload photos to folders, tag them manually (or don't), and never know which images actually drive sales. Files makes every asset intelligent, connected, and performance-tracked.

## Figma:

---

## Problem Statement

### Current State (Asset Graveyards)

Brands use traditional DAMs (Digital Asset Management) or worse, Google Drive:

**The Pattern:**

1. Upload 500 product photos from photoshoot → Manually create folders: "FW25", "Lifestyle", "Studio" → Manually tag each photo: "SKU-12345", "Model-Sarah", "Blue-Jacket"
2. 6 hours later, organization complete
3. Never look at most photos again
4. No idea which images perform well
5. Repeat next season

**The Cost:**

- 6-10 hours/month on manual tagging
- Photos die in folders (uploaded but never used)
- No performance data (which images drive clicks/sales?)
- Can't find assets when needed (search is terrible)
- Duplicate work (reshoot because can't find existing photos)

---

## Solution: Files

### What Is Files?

Files is a smart asset library where every upload triggers:

1. **Vision AI Analysis** → Understands what's in the image
2. **Auto-SKU Linking** → Matches image to product catalog
3. **Quality Scoring** → Rates lighting, composition, brand fit
4. **Performance Tracking** → Monitors where used + how it performs
5. **Health States** → Assets evolve: Analyzing → Linked → High Performing → Deprioritized

**Key Difference from DAMs:** Files is active, not passive. It thinks about your assets.

### Core Behaviors

### 1. Upload → Auto-Analysis

`User uploads: jacket_photo_01.jpg

Files immediately:
├─ Extracts: "Blue winter jacket, model wearing, outdoor setting, cloudy day"
├─ Matches to SKU: "FW25-JACKET-NAVY-M"
├─ Scores quality:
│  ├─ Lighting: 9/10 (natural, well-exposed)
│  ├─ Composition: 8/10 (rule of thirds, good framing)
│  └─ Brand Fit: 8/10 (matches brand aesthetic)
└─ Tags: "jacket", "outerwear", "lifestyle", "winter", "model", "outdoor"

Total time: 3 seconds
Manual effort: Zero`

### 2. Performance Tracking

`Image used on:
├─ Shopify PDP (jacket product page)
├─ Meta Ad Campaign "Winter 2025"
└─ Email: "New Arrivals"

Performance:
├─ Shopify: 2.4% add-to-cart rate (above avg)
├─ Meta: 1.8% CTR (top 20% of creatives)
└─ Email: 3.2% click rate

Health State: High Performing ✓`

### 3. Auto-Grouping

`Files detects:
- 15 images from same photoshoot (similar lighting, location, date)
- Groups as: "Campaign Set: FW25 Outdoor Lifestyle"
- Suggests: "Use these together for cohesive feed"`

### 4. Search & Filter

`User searches: "high performing jacket images"

Files returns:
- All jacket images (auto-tagged)
- Sorted by CTR (performance-tracked)
- Shows: "Top 5 jacket images drove 40% of jacket sales"`

---

## User Stories + JTBD:

*To be updated*

## Success Metrics

### Product Metrics

- **Upload Volume:** 10,000+ images uploaded in first 30 days
- **Auto-Link Accuracy:** 85%+ correct SKU matches (user approval rate)
- **Search Usage:** 60% of users use search within first week
- **Performance View Rate:** 40% of users check "Where Used" at least once

### User Efficiency

- **Time Saved:** 80% reduction in manual tagging time (6 hours → 1 hour)
- **Asset Utilization:** 2x more uploaded assets actually used in production
- **Search Success:** 75% of searches result in asset selection

### Business Impact

- **High Performers Identified:** Users can identify top 10% performing assets
- **Content Reuse:** 30% increase in reusing existing assets vs reshoot
- **Performance-Driven Decisions:** 50% of users filter by performance when selecting assets

## Competitive Differentiation

| Feature | ShopOS Files | Traditional DAM | Google Drive |
| --- | --- | --- | --- |
| **Auto-Tagging** | Yes (AI-powered) | No (manual) | No |
| **SKU Linking** | Automatic | Manual | N/A |
| **Quality Scoring** | Yes | No | No |
| **Performance Tracking** | Yes (built-in) | No | No |
| **Health States** | Yes | No | No |
| **Visual Similarity Search** | Yes | Some | No |
| **Channel Integration** | Yes (Shopify, Meta, etc.) | Limited | No |
| **Time to Organize** | 3 seconds | 6 hours | 6 hours |

---

## Risks & Mitigation

### Risk 1: Vision AI Inaccuracy

**Risk:** Auto-tagging is wrong. Users lose trust.

**Mitigation:**

- Show confidence scores (transparent, not black box)
- Allow manual editing (user stays in control)
- Learn from corrections (improve model over time)
- Set expectations: "AI suggests, you decide"

### Risk 2: SKU Matching Failures

**Risk:** Images matched to wrong products. Causes confusion.

**Mitigation:**

- Conservative confidence threshold (85% for auto-match)
- Suggest mode (65-85%) requires user approval
- Clear visual confirmation (show matched product in UI)
- Easy undo (unlink and rematch)

### Risk 3: Performance Data Delays

**Risk:** Users expect real-time performance. Data lags by 24 hours.

**Mitigation:**

- Set expectations: "Performance updates daily"
- Show "last updated" timestamp
- Offer manual refresh button
- Provide interim signals: "Collecting data... 45% complete"

### Risk 4: Storage Costs

**Risk:** Unlimited uploads → exploding storage costs.

**Mitigation:**

- Image compression on upload (reduce size 30-50%)
- Tiered storage (hot vs cold)
- Archive old/unused assets automatically
- Usage limits per plan (SMB: 10GB, Growth: 100GB, Enterprise: 1TB)

### Risk 5: Slow Search

**Risk:** Search is slow with 10,000+ images. Users frustrated.

**Mitigation:**

- Vector DB optimized for speed (Pinecone, Weaviate)
- Pre-compute embeddings (not on-demand)
- Cache common searches
- Lazy load results (infinite scroll)

---

## GTM Strategy

### Positioning

**Headline:** "Not Google Drive. Not a DAM. A Living Asset Intelligence Layer." **Subhead:** "Every image analyzed, linked, and performance-tracked. Automatically."

### Target Segments

1. **Growth Brands ($500K-$5M ARR)** — Primary
    - Pain: Manual tagging takes forever, assets die in folders
    - Value prop: 80% time savings, 2x asset utilization
2. **Agencies (5-50 clients)** — Secondary
    - Pain: Managing assets across client portfolios
    - Value prop: Centralized, intelligent asset library per client
3. **Enterprise (> $5M ARR)** — Tertiary
    - Pain: Thousands of assets, no visibility into performance
    - Value prop: Performance-driven asset decisions at scale

[Info from Sai (1)](Files%20-%20Smart%20asset%20Library%20PRD/Info%20from%20Sai%20(1)%202dd118db8f2980fda9c0e173752615a2.md)

[V3: PIM Connector Flow & PIM Manual Upload (1)](Files%20-%20Smart%20asset%20Library%20PRD/V3%20PIM%20Connector%20Flow%20&%20PIM%20Manual%20Upload%20(1)%202dd118db8f29809093b2f56241ad521d.md)