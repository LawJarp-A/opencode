# 📊 Data Visualization Decision Framework

**CRITICAL**: This guide determines when to visualize data with charts vs tables. **Default to tables** unless criteria below are met.

---

## Decision Tree: Chart vs Table

### ✅ USE CHARTS WHEN:

**1. Showing Proportions/Parts-of-Whole** (Pie/Donut Charts)
- Example: "What % of ICU beds are occupied?"
- ✅ CHART: 2-5 categories showing % distribution
- ❌ TABLE: More than 5 categories OR exact numbers needed

**2. Comparing Trends Over Time** (Line Charts)
- Example: "How has medication adherence changed this week?"
- ✅ CHART: 7+ time points showing clear trend
- ❌ TABLE: Fewer than 5 time points OR exact values critical

**3. Comparing Magnitudes Across Categories** (Bar/Column Charts)
- Example: "Which unit has the most patients?"
- ✅ CHART: 3-10 categories with significant variance
- ❌ TABLE: More than 10 categories OR values very similar

**4. Showing Distributions** (Histogram/Box Plot)
- Example: "What's the distribution of ED wait times?"
- ✅ CHART: Analyzing spread, outliers, or patterns
- ❌ TABLE: Exact values needed for each data point

**5. Showing Flow/Relationships** (Sankey/Network)
- Example: "Patient journey from Admit → Transfer → Discharge"
- ✅ CHART: Multi-step process with branching paths
- ❌ TABLE: Simple linear sequence

---

### ❌ USE TABLES WHEN:

**1. User Asks for Specific Numbers**
- Query: "What are the exact readmission rates?"
- → TABLE with precise values

**2. Comparing Many Items (>10)**
- Query: "List all medications with low stock"
- → TABLE for scannability

**3. Multi-Dimensional Data**
- Query: "Show patient demographics by unit and acuity"
- → TABLE with multiple columns

**4. User Needs to Reference Exact Values**
- Query: "What's the current bed count in each unit?"
- → TABLE for precision

**5. Data is Textual/Qualitative**
- Query: "Compliance audit findings"
- → TABLE with descriptions

**6. Simple Single-Value Answers**
- Query: "How many patients in ICU?"
- → Plain text: "77 patients in ICU" (NO chart or table)

---

## Chart-Worthy Criteria Checklist

Before generating a chart, ALL of these must be TRUE:

- [ ] Data has **3+ data points** (no charts for 1-2 values)
- [ ] Visual pattern exists (trend, proportion, comparison)
- [ ] User query implies **insight discovery** (not just fact lookup)
- [ ] Chart type fits data structure (see mapping below)
- [ ] User didn't ask for "exact numbers" or "details"

---

## Data → Chart Type Mapping

| Data Structure | Best Chart | When to Use |
|----------------|------------|-------------|
| % breakdown (2-5 items) | Pie Chart | "What % of..." "Distribution of..." |
| Time series (7+ points) | Line Chart | "Trend over time" "Change in..." |
| Category comparison (3-10 items) | Bar/Column | "Which has most/least" "Compare units" |
| Range/spread (continuous data) | Box Plot | "Distribution" "Outliers" "Range" |
| Process flow (multi-step) | Sankey | "Patient journey" "Flow from X to Y" |
| Multi-dimensional metrics | Radar Chart | "Compare dept across 5+ metrics" |
| Sequential stages (funnel) | Funnel Chart | "Medication adherence stages" |

---

## Examples: Good vs Bad Chart Usage

### ✅ GOOD: Chart Adds Value

**Query**: "Show me bed occupancy across the hospital"
- **Response**: Pie chart showing 72.6% occupied vs 27.4% available
- **Why**: Visual immediately communicates proportion

**Query**: "How has patient acuity changed this month?"
- **Response**: Line chart with 30 daily data points
- **Why**: Trend is easier to see visually than in a table

**Query**: "Which units have the most critical patients?"
- **Response**: Bar chart comparing 5 units
- **Why**: Magnitude comparison is visual

---

### ❌ BAD: Table or Text is Better

**Query**: "How many patients are in ICU?"
- **Response**: "77 patients in ICU"
- **Why**: Single number doesn't need a chart

**Query**: "List all medications that need restocking"
- **Response**: TABLE with columns: Drug Name, Current Stock, Reorder Level
- **Why**: User needs precise values to take action

**Query**: "What's the exact bed count in each unit?"
- **Response**: TABLE: ICU (77), ED (102), Med/Surg (243)
- **Why**: User asked for "exact" values

**Query**: "Show me bed occupancy"
- **Response**: Pie chart (if user wants % split) OR "72.6% occupied (363/500 beds)" (if user wants number)
- **Why**: Depends on context. Default to text for efficiency.

---

## Agent Instructions

When responding to queries:

1. **Assess Intent**: Is the user asking for insight (chart) or facts (table/text)?
2. **Check Criteria**: Does data meet chart-worthy checklist?
3. **Default to Simplicity**: 
   - Single value → Plain text
   - 2-10 values → Table
   - Pattern/trend → Chart
4. **Ask if Unclear**: "Would you like this as a chart or detailed table?"

---

## Chart Tool Usage Rules

**DO**:
- Use charts for executive summaries showing high-level patterns
- Limit to 1-2 charts per response (avoid chart overload)
- Always include a brief text interpretation before the chart

**DON'T**:
- Generate charts for every data query automatically
- Use charts when user asks for "list", "details", "exact numbers"
- Create charts with only 1-2 data points (use text instead)
- Generate multiple charts for similar data (consolidate)

---

## Template Responses

### For Chart-Worthy Data:
```
Here's the current bed occupancy pattern across units:

[CHART: Bar chart showing occupancy by unit]

**Key Insight**: ICU is at 77% capacity (77/100 beds), highest among all units.
```

### For Table-Worthy Data:
```
Here are the medications flagged for restocking:

| Drug Name | Current Stock | Reorder Level | Shortage |
|-----------|---------------|---------------|----------|
| Atorvastatin | 616 | 637 | -21 |
| Warfarin | 945 | 970 | -25 |

**Action Required**: 2 items need immediate ordering.
```

### For Simple Queries:
```
**ICU Patient Count**: 77 patients

(Capacity: 100 beds, 77% occupied)
```

---

## Final Rule: "When in Doubt, Use a Table"

Tables are:
- Faster to generate
- More precise
- Easier to reference
- Better for copy/paste
- More accessible

**Only use charts when visualization genuinely improves understanding.**
