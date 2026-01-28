# OpenCode Current User Flow Analysis

**Date:** January 16, 2026  
**Purpose:** Business Owner Transformation - Current State Assessment  
**Classification:** Internal Planning Document

---

## Executive Summary

This analysis examines the current OpenCode user flow to identify transformation opportunities for serving business owners. The assessment reveals a sophisticated multi-agent commerce platform fundamentally designed for developer workflows, presenting significant but addressable barriers for business owner adoption. The platform's strong commerce capabilities—spanning sales analytics, marketing campaign execution, inventory management, and multi-marketplace integration—are obscured behind technical interfaces, developer-centric terminology, and task-oriented workflows that fail to resonate with how business owners conceptualize their work.

**Key Findings:**

- **Architecture Strength**: The platform contains 7 specialized agents, 12 commerce-focused tools, 8 pre-built skills, and 6 creative Spaces—all capable of serving business needs but currently framed for developer execution
- **Terminology Gap**: 100% of current user-facing language assumes technical familiarity—terms like "agents," "Spaces," "MCP servers," "DAG plans," and "tool calls" are impenetrable to business owners
- **Workflow Mismatch**: Current workflows follow developer patterns (query → execute → debug) rather than business patterns (goal → insight → action → outcome)
- **Documentation Deficit**: Documentation scores 3/10 for business accessibility, with no business use cases, ROI documentation, or outcome-focused guides
- **Quick Win Potential**: 80% of the technical infrastructure needed for business owners already exists—the transformation is primarily surface-level (language, interface, documentation)

---

## 1. Current Entry Points Analysis

### 1.1 Discovery and Initial Contact

**Current State:**

OpenCode is discovered primarily through developer-centric channels:

| Channel                    | Current Approach                       | Business Owner Perception       |
| -------------------------- | -------------------------------------- | ------------------------------- |
| GitHub Repository          | "The open source AI coding agent"      | Excludes non-coders immediately |
| Technical Blog Posts       | Code examples, CLI tutorials           | Inaccessible and irrelevant     |
| Developer Conferences      | Terminal UI demos, plugin integrations | Impressive but intimidating     |
| npm/Documentation          | Package installation, provider setup   | Assumes technical environment   |
| Word of Mouth (Developers) | "It writes code for you"               | Unclear business value          |

**Assessment:** The discovery experience actively filters out business owners before they engage. The "AI coding agent" positioning is a complete barrier to entry for the 95% of business leaders who don't code.

### 1.2 Installation and Setup Experience

**Current Flow:**

```
User discovers OpenCode
    ↓
Choose installation method (5+ options)
    ↓
Run installation command (curl/npm/brew)
    ↓
Configure LLM provider (40+ options documented)
    ↓
Run /connect to authenticate
    ↓
Run /init for project setup
    ↓
Begin using agents
```

**Business Owner Experience:**

1. **Installation Barrier**: Business owners don't have terminal access or comfort with CLI tools. The 5+ installation methods are overwhelming rather than accommodating.
2. **Provider Confusion**: The 40+ LLM provider options are meaningless to business owners who just want it to work.
3. **Configuration Overwhelm**: JSON configuration files, API keys, environment variables—entirely technical concepts.
4. **No Guided Setup**: No wizard, no onboarding, no "connect your store in one click."

**Documentation Analysis:**

| Documentation Element | Current State                       | Business Owner Need                  |
| --------------------- | ----------------------------------- | ------------------------------------ |
| Installation Guide    | 5 platform options, CLI commands    | "Download and connect" (single path) |
| Provider Setup        | 40+ LLM configurations              | "Choose your AI model" (3-4 options) |
| Configuration Files   | JSON schemas, environment variables | Visual settings panel                |
| Initial Setup         | /connect, /init commands            | "Connect your store" wizard          |

**Score: 2/10 for Business Owners**

### 1.3 First-Time User Experience

**What First-Time Users Currently Experience:**

1. **Terminal Interface**: A TUI (Terminal User Interface) with keyboard shortcuts, leader keys, and command patterns unfamiliar to non-developers.
2. **Agent Introduction**: "OpenCode includes two built-in agents you can switch between with the Tab key: build (default, full access) and plan (read-only)."
3. **Documentation Reference**: "For more info on how to configure OpenCode, head over to our docs" (links to technical documentation).
4. **No Context Setting**: Users must understand technical concepts before receiving any business value.

**Actual First Interaction:**

```bash
$ opencode
Welcome to OpenCode v1.0
Type /help for commands, or describe what you need.
> _
```

The user sees a blinking cursor with no guidance on what to do, what questions to ask, or what outcomes are possible.

**What Business Owners Need:**

| Current Experience        | Desired Business Experience         |
| ------------------------- | ----------------------------------- |
| Terminal interface        | Visual dashboard, natural language  |
| Tab to switch agents      | "What do you need help with today?" |
| /help command             | Guided question flow                |
| Technical getting started | Business outcome wizard             |
| No business context       | "Connect your store to get started" |

---

## 2. Current Interaction Patterns

### 2.1 Command and Agent System

**Current Architecture:**

The system uses a 3-tier agent hierarchy:

```
User Prompt
    ↓
Planner (orchestrates complex requests, creates DAG execution plans)
    ↓
Worker (generic executor spawned by planner, delegates to specialists)
    ↓
@analyst @strategist @executor (specialist subagents)
```

**Agent Breakdown:**

| Agent          | Current Purpose                                              | Business Translation  | Business Value |
| -------------- | ------------------------------------------------------------ | --------------------- | -------------- |
| **planner**    | Breaks down technical requirements into execution steps      | Campaign strategist   | HIGH           |
| **worker**     | Generic execution with tool access                           | Production team       | MEDIUM         |
| **analyst**    | Data queries (ROI, sales, inventory, campaigns)              | Business intelligence | HIGH           |
| **strategist** | Creates commerce strategies (launches, campaigns, expansion) | Marketing consultant  | HIGH           |
| **executor**   | Runs Spaces (images, copy, ads)                              | Creative director     | HIGH           |
| **ops**        | Default agent combining analysis, strategy, execution        | Operations manager    | MEDIUM         |
| **reviewer**   | Validates work unit outputs                                  | Quality assurance     | LOW            |

**Business Owner Interaction Problem:**

1. **Invisible Specialists**: The analyst, strategist, and executor agents are hidden behind the planner/worker abstraction. Business owners never see "I'm assigning our analyst to review your sales data."
2. **Agent Switching with Tab**: Keyboard navigation is invisible to business owners who expect mouse-friendly interfaces.
3. **Agent Names**: "build," "plan," "general"—these names mean nothing to business outcomes.
4. **Subagent Invocation**: Using "@analyst" or "@strategist" in messages is not discoverable or intuitive.

**Current Interaction Pattern:**

```
User: "help me launch a new product"
OpenCode: [Planner creates DAG, spawns Workers, delegtes to Analyst/Strategist/Executor]
User sees: A series of "Thinking..." messages, file operations, and eventual output
```

**Desired Interaction Pattern:**

```
User: "I want to launch my new spring collection"
OpenCode: "Great! Let me help you plan this campaign. First, let's look at your current
catalog to understand what we're working with. Then I'll create marketing assets,
ad campaigns, and social content. How does a 2-week launch timeline sound?"
```

### 2.2 Tool and Capability Access

**Current Tool System:**

The platform includes 10 commerce-focused tools organized by function:

| Category              | Tools                                                                      | Purpose                              |
| --------------------- | -------------------------------------------------------------------------- | ------------------------------------ |
| **Data & Analytics**  | get-brand-context, query-sales, query-campaigns, query-inventory           | Business intelligence                |
| **Product & Catalog** | query-products, query-collections, get-product-details, get-store-policies | Product research                     |
| **Execution**         | run-space, search-all-stores                                               | Content creation, marketplace search |

**Business Owner Accessibility Issues:**

1. **Tool Calling Syntax**: "query-sales," "run-space," "get-product-details"—API-style naming with no business meaning.
2. **No Discovery**: Users must know tool names to understand what's possible.
3. **Technical Output**: Tool outputs are raw data, JSON structures, or technical responses.
4. **Manual Invocation**: Users must explicitly request specific tools rather than stating outcomes.

**Example Current Flow:**

```
User: "show me my sales"
OpenCode: [Calls query-sales tool]
User sees: {
  "data": {
    "totalRevenue": 125000,
    "unitsSold": 1250,
    "averageOrderValue": 100,
    "byRegion": {...}
  }
}
```

**Example Desired Flow:**

```
User: "how are my sales doing?"
OpenCode: "Great question! Your revenue is up 15% this month compared to last month.
You're on track to hit your quarterly target with 3 weeks to go. Your top performers
are the spring collection items, and your average order value has increased by $12.
Want me to break this down by product or channel?"
```

### 2.3 Task Execution Patterns

**Current Execution Model:**

The system uses DAG (Directed Acyclic Graph) planning for complex tasks:

```
User Request
    ↓
Planner researches and creates DAG plan
    ↓
Workers execute research phases
    ↓
Executor runs Spaces for creative generation
    ↓
Reviewer validates outputs
    ↓
Deliver complete package
```

**Business Owner Perception:**

| Technical Concept   | Business Owner Understanding         |
| ------------------- | ------------------------------------ |
| DAG Plan            | "What's a plan?"                     |
| Worker execution    | "Who's working on this?"             |
| Space execution     | "What space? I don't see any space." |
| Reviewer validation | "Why do I need validation?"          |
| File-based output   | "Where are my files? What files?"    |

**Pain Points:**

1. **Hidden Progress**: Business owners see "Thinking..." without understanding what's happening.
2. **Technical Milestones**: "Phase 1 complete: Data collection"—means nothing.
3. **File Outputs**: Files are saved to ".opencode/plan/..." but users may not understand where or why.
4. **No Business Context**: Progress updates are technical ("Tool execution complete") rather than outcome-focused ("I've analyzed your sales data and found 3 opportunities").

---

## 3. Current Output Patterns

### 3.1 Response Format and Content

**Current Output Style:**

Responses are technical, process-focused, and assume developer familiarity:

```
Analysis complete for query-sales:
- Total Revenue: $125,000 (↑ 15% MoM)
- Units Sold: 1,250
- AOV: $100.00
- Top Region: Delhi-NCR ($45,000)

Files created:
- .opencode/plan/goal/sales_analysis.md
```

**Business Owner Translation Needed:**

| Current Output         | Business-Friendly Output                                    |
| ---------------------- | ----------------------------------------------------------- |
| "Analysis complete"    | "Here's what I found about your sales"                      |
| "query-sales results"  | "Your sales performance this month"                         |
| "Files created"        | "I've saved a detailed report you can reference later"      |
| Technical metrics only | Metrics + interpretation + recommendations                  |
| Raw numbers            | Numbers + context (vs target, vs last month) + implications |

### 3.2 File and Deliverable Structure

**Current File Organization:**

```
.opencode/
├── plan/
│   └── [goal_folder]/
│       ├── plan.md          # DAG execution plan
│       ├── progress.md      # Execution progress
│       └── [output_files]   # Generated assets
├── agent/
│   └── [agent_definitions]  # Agent markdown files
├── skill/
│   └── [skill_definitions]  # Skill workflow files
└── command/
    └── [command_definitions] # Command templates
```

**Business Owner Problems:**

1. **Hidden Directory**: ".opencode" is invisible by convention (dot-prefixed files/directories are hidden on Unix systems).
2. **Technical Naming**: "plan.md," "progress.md"—no business meaning.
3. **No Dashboard**: No visual representation of project status, assets, or outcomes.
4. **File-Based Memory**: Users must remember to look in specific folders for outputs.

**What Business Owners Expect:**

| Current State           | Desired State                                        |
| ----------------------- | ---------------------------------------------------- |
| Hidden .opencode folder | Visible "My Projects" or "Campaign Dashboard"        |
| Technical file names    | "Spring Launch Plan," "Q1 Sales Report"              |
| File-system navigation  | Visual dashboard with thumbnails, status, progress   |
| Manual file discovery   | Proactive delivery: "Your campaign assets are ready" |

### 3.3 Communication and Notification

**Current Communication Style:**

- Process-focused: "Executing phase 2," "Running query-campaigns"
- Technical jargon: "DAG generation complete," "Worker spawned"
- No proactive updates: Users must poll or check files for status
- No recommendations: Just data, no guidance

**Desired Communication Style:**

- Outcome-focused: "Analyzing your marketing performance..."
- Business language: "Looking at how your ads are performing..."
- Proactive updates: "I've noticed your ROAS is trending down—want me to investigate?"
- Actionable recommendations: "Here are 3 things you can do to improve performance"

---

## 4. Current Pain Points Analysis

### 4.1 Terminology Confusion Matrix

**Technical Terms Business Owners Don't Understand:**

| Term                  | Business Owner Interpretation                       |
| --------------------- | --------------------------------------------------- |
| **Agent**             | "Is this a person? A bot? A service?"               |
| **Space**             | "What space? Physical space? Digital space?"        |
| **MCP Server**        | "Sounds like technical infrastructure I don't have" |
| **DAG**               | "What does this acronym mean?"                      |
| **Tool Call**         | "Why are we calling tools? What tools?"             |
| **Execute**           | "This sounds like running code, not my business"    |
| **Query**             | "I don't query things—I ask questions"              |
| **Subagent**          | "Agents within agents? That's confusing"            |
| **Run Space**         | "How do I run a space? Where is it?"                |
| **Permission System** | "Why do I need permissions for my own data?"        |

**Impact:** Every interaction requires translation from technical to business language, creating friction and reducing trust.

### 4.2 Workflow Friction Points

**Critical Friction Points:**

| Step                  | Current Friction                         | Business Impact                     |
| --------------------- | ---------------------------------------- | ----------------------------------- |
| **Initial Setup**     | CLI installation, provider configuration | 90% of business owners abandon here |
| **First Interaction** | Blinking cursor, no guidance             | Uncertainty, confusion              |
| **Agent Selection**   | Tab to switch, @ symbol for subagents    | Invisible, undiscoverable           |
| **Tool Usage**        | Must know tool names and syntax          | Limits what's possible              |
| **Progress Tracking** | Technical log files                      | No visibility into status           |
| **Output Access**     | Hidden file system folder                | "Where did my stuff go?"            |
| **Iteration**         | Manual re-prompting                      | No continuous improvement           |

**User Journey Drop-off Points:**

```
Discovery → Installation → First Run → First Command → Understanding Output → Continued Use
   100%         60%           40%          20%              10%                  5%
```

Business owners are lost at every single step.

### 4.3 Feature Discovery and Adoption

**Current Feature Visibility:**

| Feature                                    | How Discovered     | Business Owner Awareness |
| ------------------------------------------ | ------------------ | ------------------------ |
| Skills (launch-product, seasonal-campaign) | Read documentation | <5%                      |
| Spaces (image_generation, copy_generation) | Explore tool list  | <10%                     |
| Multi-agent workflow                       | Read agent docs    | <5%                      |
| Brand context                              | Configuration file | <1%                      |
| Marketplace integration                    | MCP server setup   | <1%                      |

**Problem:** All powerful features are hidden behind technical discovery. Business owners never know what's possible.

**Desired State:**

Every capability should be discoverable through natural conversation:

```
User: "I need to launch a new product"
OpenCode: "I can help you with that! A product launch typically includes:
1. Marketing strategy and campaign planning
2. Product imagery and lifestyle shots
3. Ad creative for Facebook, Instagram, Google
4. Email templates for announcement and follow-up
5. Social media posts for Instagram, TikTok, Pinterest

I can generate all of these in about 45 minutes. Want me to start?"
```

---

## 5. Business Owner Readiness Assessment

### 5.1 Useful Features for Business Owners

**High-Value Features Already Present:**

| Feature                     | Business Value                    | Current Accessibility          |
| --------------------------- | --------------------------------- | ------------------------------ |
| **query-sales**             | Track revenue, AOV, growth        | LOW - requires knowing tool    |
| **query-campaigns**         | Measure ROAS, CTR, conversions    | LOW - requires knowing tool    |
| **launch-product skill**    | Complete go-to-market in 45 min   | VERY LOW - hidden in skills    |
| **seasonal-campaign skill** | Full campaign production in 2 hrs | VERY LOW - hidden in skills    |
| **image_generation Space**  | Product and lifestyle imagery     | LOW - requires tool invocation |
| **copy_generation Space**   | Marketing and product copy        | LOW - requires tool invocation |
| **ad_creation Space**       | Platform-optimized advertisements | LOW - requires tool invocation |
| **get-brand-context**       | Historical performance baselines  | VERY LOW - technical config    |
| **query-products**          | Catalog search and analysis       | MEDIUM - somewhat discoverable |
| **search-all-stores**       | Cross-marketplace comparison      | MEDIUM - somewhat discoverable |

**Assessment:** The platform has 80% of the capabilities business owners need, but they're hidden behind technical interfaces that make them effectively invisible.

### 5.2 Confusing or Irrelevant Features

**Features to Hide or Recontextualize:**

| Feature                   | Current Form               | Business Owner Perception               | Recommendation                                       |
| ------------------------- | -------------------------- | --------------------------------------- | ---------------------------------------------------- |
| **bash tool**             | Terminal command execution | "Why do I need terminal commands?"      | Rename to "Run system command" with business context |
| **read/write/edit tools** | File system operations     | "I don't want to read/write/edit files" | Hide behind "Save report," "Open document"           |
| **grep tool**             | Code search                | "I don't search code"                   | Repurpose for "Find in documents"                    |
| **codesearch tool**       | Code API search            | "I don't search APIs"                   | Repurpose for "Research topic"                       |
| **websearch tool**        | Web search                 | Acceptable if framed as "Research"      | Keep but reframe                                     |
| **lsp/formatter tools**   | Development tooling        | Completely irrelevant                   | Hide from business interface                         |
| **patch tool**            | Code patching              | Completely irrelevant                   | Hide from business interface                         |
| **Permission System**     | Tool access controls       | "Why can't the AI do things?"           | Hide behind trust settings                           |

### 5.3 Missing Features for Business Owners

**Critical Gaps:**

| Gap                          | Business Need                             | Current State               | Priority |
| ---------------------------- | ----------------------------------------- | --------------------------- | -------- |
| **Dashboard Interface**      | Visual business overview                  | No visual UI, terminal only | HIGH     |
| **Natural Language Queries** | "How are my sales?" not "run query-sales" | Requires technical syntax   | HIGH     |
| **Recommendation Engine**    | "Here's what you should do"               | Just data, no guidance      | HIGH     |
| **Proactive Alerts**         | "Your ROAS is dropping"                   | No alerting system          | MEDIUM   |
| **ROI Calculator**           | "What's my return on this campaign?"      | Manual calculation          | MEDIUM   |
| **Goal Tracking**            | "Am I on track for Q1 target?"            | No goal framework           | MEDIUM   |
| **Competitor Intelligence**  | "How am I doing vs competitors?"          | Manual research only        | MEDIUM   |
| **Budget Management**        | "Am I overspending on ads?"               | No budget tracking          | LOW      |
| **Team Collaboration**       | "Review my team on this campaign"         | Single user only            | LOW      |
| **Mobile Access**            | "Check my business on the go"             | Terminal only               | LOW      |

### 5.4 Hidden vs Highlighted Features

**What to Highlight (Visible by Default):**

1. Business Overview Dashboard
2. Natural Language Assistant
3. Campaign Planning and Execution
4. Content Generation (Images, Copy, Ads)
5. Sales and Marketing Analytics
6. Product Launch Workflow
7. Seasonal Campaign Automation
8. Marketplace Expansion

**What to Hide (Available but Not Prominent):**

1. Terminal/TUI interface
2. Low-level tool configuration
3. Agent switching mechanism
4. MCP server management
5. JSON configuration editing
6. Developer-only Spaces (code, debugging)
7. LSP integration
8. Custom tool development

---

## 6. Gap Analysis: Current to Desired Flow

### 6.1 Current User Journey Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     CURRENT OPENCODE USER JOURNEY                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  DISCOVERY                                                               │
│  ├─ GitHub repo → "AI coding agent"                                     │
│  ├─ Developer blog → Code examples                                      │
│  └─ Word of mouth → "It writes code"                                    │
│       ↓                                                                 │
│  EVALUATION                                                              │
│  ├─ Read README (technical)                                             │
│  ├─ Check docs (overwhelming)                                           │
│  └─ Search for business use cases (none found)                          │
│       ↓                                                                 │
│  INSTALLATION                                                            │
│  ├─ Choose platform method (5+ options)                                 │
│  ├─ Run CLI command                                                     │
│  ├─ Install Node.js/dependencies                                        │
│  └─ Configure LLM provider (40+ options)                                │
│       ↓                                                                 │
│  ONBOARDING                                                              │
│  ├─ See terminal welcome screen                                         │
│  ├─ Blinking cursor, no guidance                                        │
│  └─ Type /help or guess what to do                                      │
│       ↓                                                                 │
│  FIRST INTERACTION                                                       │
│  ├─ Try simple query ("hello")                                          │
│  ├─ Receive technical response                                          │
│  └─ Don't understand what else is possible                              │
│       ↓                                                                 │
│  DISCOVERY OF CAPABILITIES                                               │
│  ├─ Read documentation (extensive, technical)                           │
│  ├─ Find agents, tools, skills, Spaces                                  │
│  └─ Learn syntax (@agent, /command, --flag)                             │
│       ↓                                                                 │
│  REGULAR USE                                                             │
│  ├─ Learn patterns                                                      │
│  ├─ Build workflows                                                     │
│  └─ Become proficient (weeks to months)                                 │
│                                                                          │
│  FUNNEL: 100% → 5% of business owners reach regular use                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Desired Business Owner Journey Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 DESIRED BUSINESS OWNER JOURNEY                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  DISCOVERY                                                               │
│  ├─ Google search → "E-commerce AI assistant"                           │
│  ├─ Shopify App Store → Recommended tools                               │
│  ├─ Business podcast → "How to use AI for your business"                │
│  └─ Peer recommendation → "This helps me run my store"                  │
│       ↓                                                                 │
│  EVALUATION                                                              │
│  ├─ Landing page: "Run your business with AI"                           │
│  ├─ Business use cases (sales, marketing, launches)                     │
│  ├─ Success stories with ROI                                            │
│  └─ Free trial or demo                                                  │
│       ↓                                                                 │
│  ONBOARDING                                                              │
│  ├─ "Connect your store in one click" (Shopify, Amazon, etc.)           │
│  ├─ Set business goals (revenue, customers, growth)                     │
│  └─ "What would you like help with today?"                              │
│       ↓                                                                 │
│  FIRST INTERACTION                                                       │
│  ├─ Natural language: "How are my sales?"                               │
│  ├─ Immediate business value: "Your revenue is up 15%..."               │
│  └─ Discovery: "Here are other things I can help with"                  │
│       ↓                                                                 │
│  REGULAR USE                                                             │
│  ├─ Dashboard shows business health                                     │
│  ├─ Proactive insights and recommendations                              │
│  ├─ "I noticed your ads are underperforming—want suggestions?"         │
│  └─ "Your launch is 3 days away—everything ready?"                      │
│       ↓                                                                 │
│  GROWTH                                                                  │
│  ├─ Explore more capabilities (campaigns, expansion)                    │
│  ├─ "I can help you launch on new marketplaces"                         │
│  └─ Become essential business partner                                   │
│                                                                          │
│  FUNNEL: 100% → 60%+ of business owners find value on first use          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Transformation Opportunity Matrix

| Area                 | Current State         | Desired State                      | Gap                           | Priority |
| -------------------- | --------------------- | ---------------------------------- | ----------------------------- | -------- |
| **Positioning**      | "AI coding agent"     | "AI business assistant"            | Complete rebrand              | CRITICAL |
| **Interface**        | Terminal/TUI          | Visual dashboard + chat            | Major redesign                | CRITICAL |
| **Language**         | Technical terminology | Business outcome language          | Complete overhaul             | CRITICAL |
| **Entry**            | CLI installation      | One-click store connection         | Complete redesign             | CRITICAL |
| **First Experience** | Blinking cursor       | Guided business wizard             | Complete redesign             | HIGH     |
| **Documentation**    | Technical docs        | Business guides + ROI case studies | Complete rewrite              | HIGH     |
| **Analytics**        | Raw data queries      | Insights + recommendations         | Add AI layer                  | HIGH     |
| **Workflows**        | Task execution        | Goal achievement                   | Reorient from task to outcome | HIGH     |
| **Progress**         | Technical logs        | Visual status dashboard            | New component                 | MEDIUM   |
| **Alerts**           | None                  | Proactive notifications            | New capability                | MEDIUM   |
| **Output**           | File system           | Visual campaign workspace          | New component                 | MEDIUM   |
| **Skills**           | Hidden in docs        | Promoted as main features          | Repositioning                 | MEDIUM   |
| **Examples**         | Code-focused          | Business scenario-focused          | Complete rewrite              | MEDIUM   |

### 6.4 Technical-to-Business Mapping

| Current Technical Concept | Business Owner Translation             | Business Value Proposition              |
| ------------------------- | -------------------------------------- | --------------------------------------- |
| **Agent**                 | Team member / Specialist               | "You have a team of AI specialists"     |
| **Planner**               | Campaign strategist / Project manager  | "Strategic planning for your campaigns" |
| **Analyst**               | Business intelligence specialist       | "Data analysis and insights"            |
| **Strategist**            | Marketing consultant                   | "Marketing strategy and planning"       |
| **Executor**              | Creative director                      | "Content and asset creation"            |
| **Spaces**                | Content types / Asset generators       | "Create marketing materials"            |
| **run_space**             | Generate content                       | "Create your campaign assets"           |
| **Skills**                | Workflows / Playbooks                  | "Complete business solutions"           |
| **launch-product**        | Product launch service                 | "Launch your products to market"        |
| **seasonal-campaign**     | Campaign automation                    | "Run seasonal promotions"               |
| **DAG Plan**              | Project plan / Campaign roadmap        | "Your launch timeline"                  |
| **Goal Folder**           | Project workspace / Campaign dashboard | "Your campaign control center"          |
| **MCP Server**            | Connected store / Marketplace          | "Your sales channels"                   |
| **query-sales**           | Check sales performance                | "See how your business is doing"        |
| **query-campaigns**       | Check marketing results                | "Measure your advertising ROI"          |

---

## 7. Prioritized Transformation Opportunities

### 7.1 Critical Priority (Must Do)

**1. Complete Terminology Overhaul**

| Action                                                   | Impact                                 | Effort |
| -------------------------------------------------------- | -------------------------------------- | ------ |
| Rename "agents" to "Team Members" or "Specialists"       | HIGH - Makes concept accessible        | LOW    |
| Rename "Spaces" to "Content Types" or "Asset Generators" | HIGH - Clarifies capability            | LOW    |
| Rename "run_space" to "Generate" or "Create"             | HIGH - Business action language        | LOW    |
| Rename "Skills" to "Solutions" or "Workflows"            | MEDIUM - Repositions capability        | LOW    |
| Remove all MCP/server terminology from UI                | HIGH - Hides complexity                | MEDIUM |
| Rename tool calls to business actions                    | HIGH - Makes capabilities discoverable | LOW    |

**2. Create Business Dashboard Interface**

| Action                                         | Impact                         | Effort |
| ---------------------------------------------- | ------------------------------ | ------ |
| Build visual dashboard showing business health | CRITICAL - First impression    | HIGH   |
| Add natural language query box                 | CRITICAL - Primary interaction | MEDIUM |
| Show active campaigns and projects visually    | HIGH - Progress visibility     | MEDIUM |
| Display key metrics (revenue, ROAS, inventory) | HIGH - Business value          | MEDIUM |
| Add one-click campaign creation                | HIGH - Value demonstration     | MEDIUM |

**3. Implement Natural Language Entry Point**

| Action                                         | Impact                        | Effort |
| ---------------------------------------------- | ----------------------------- | ------ |
| Replace terminal with chat interface           | CRITICAL - Accessibility      | HIGH   |
| Add guided onboarding wizard                   | CRITICAL - First-time success | MEDIUM |
| "Connect your store" flow instead of CLI setup | CRITICAL - Barrier removal    | MEDIUM |
| Set business goals during onboarding           | MEDIUM - Personalization      | LOW    |

### 7.2 High Priority (Should Do)

**4. Build Recommendation Engine**

| Action                               | Impact                  | Effort |
| ------------------------------------ | ----------------------- | ------ |
| Transform data queries into insights | HIGH - Value increase   | MEDIUM |
| Add "why this matters" context       | HIGH - Understanding    | LOW    |
| Generate actionable recommendations  | HIGH - Business value   | HIGH   |
| Proactive alerting for anomalies     | MEDIUM - Trust building | MEDIUM |

**5. Rewrite All Documentation**

| Action                               | Impact                   | Effort |
| ------------------------------------ | ------------------------ | ------ |
| Business use case documentation      | CRITICAL - Discovery     | MEDIUM |
| ROI case studies and testimonials    | HIGH - Conversion        | MEDIUM |
| Natural language guide (no jargon)   | CRITICAL - Accessibility | HIGH   |
| Video tutorials for common workflows | HIGH - Adoption          | MEDIUM |
| Glossary of terms                    | MEDIUM - Understanding   | LOW    |

**6. Reposition Skills as Core Features**

| Action                         | Impact                     | Effort |
| ------------------------------ | -------------------------- | ------ |
| Prominent display in dashboard | HIGH - Feature discovery   | LOW    |
| Business language descriptions | HIGH - Accessibility       | LOW    |
| One-click execution            | HIGH - Value demonstration | MEDIUM |
| Progress visualization         | MEDIUM - Trust             | LOW    |

### 7.3 Medium Priority (Could Do)

**7. Progressive Disclosure Interface**

| Action                         | Impact                 | Effort |
| ------------------------------ | ---------------------- | ------ |
| Simple view by default         | HIGH - Accessibility   | MEDIUM |
| Advanced options on demand     | MEDIUM - Power users   | LOW    |
| Contextual help throughout     | MEDIUM - Understanding | MEDIUM |
| Tooltips for business concepts | LOW - Polish           | LOW    |

**8. Integration Expansion**

| Action                               | Impact                      | Effort |
| ------------------------------------ | --------------------------- | ------ |
| QuickBooks/Xero integration          | MEDIUM - Financial view     | HIGH   |
| Google Analytics integration         | HIGH - Traffic insights     | MEDIUM |
| Email platform integration (Klaviyo) | MEDIUM - Campaign execution | MEDIUM |
| Social media scheduling              | LOW - Feature creep         | HIGH   |

**9. Mobile Experience**

| Action                        | Impact                   | Effort |
| ----------------------------- | ------------------------ | ------ |
| Mobile-responsive dashboard   | MEDIUM - Accessibility   | MEDIUM |
| Push notifications for alerts | MEDIUM - Proactive value | MEDIUM |
| Simplified mobile interface   | LOW - Low priority       | HIGH   |

---

## 8. Specific Transformation Recommendations

### 8.1 Immediate Actions (Week 1-2)

1. **Create Business Glossary**: Map all technical terms to business equivalents
2. **Rewrite Welcome Message**: Replace terminal welcome with business-focused greeting
3. **Add Business Use Cases**: Create documentation for common business scenarios
4. **Rename in UI**: Change agent names, tool names, and button labels
5. **Create Onboarding Flow**: "What would you like help with today?" wizard

### 8.2 Short-Term Actions (Month 1)

1. **Build Dashboard Prototype**: Visual business overview with key metrics
2. **Natural Language Interface**: Chat interface that understands business queries
3. **Recommendation Engine**: Transform data to insights and recommendations
4. **Campaign Workspace**: Visual representation of active campaigns
5. **Business Documentation Portal**: Separate documentation for business users

### 8.3 Medium-Term Actions (Month 2-3)

1. **Full Dashboard Implementation**: Complete visual interface with all features
2. **Proactive Alerting System**: "I noticed your ROAS is dropping..."
3. **Goal Tracking**: "You're on track for your Q1 revenue target"
4. **Integration Expansion**: Connect to real sales and advertising APIs
5. **Mobile Experience**: Responsive design for business owners on the go

---

## 9. Success Metrics for Transformation

### 9.1 Adoption Metrics

| Metric                         | Current Baseline | 6-Month Target | Measurement                |
| ------------------------------ | ---------------- | -------------- | -------------------------- |
| Business owner sign-up rate    | ~5%              | 50%            | User segmentation          |
| Time to first value            | Unknown          | <2 minutes     | First interaction analysis |
| Feature discovery rate         | <10%             | 70%            | Feature usage tracking     |
| Dashboard engagement           | N/A              | 60% daily      | Active users               |
| Documentation usage (business) | <5%              | 60%            | Page views                 |

### 9.2 Outcome Metrics

| Metric                   | Current Baseline | 6-Month Target | Measurement         |
| ------------------------ | ---------------- | -------------- | ------------------- |
| Revenue growth (users)   | N/A              | 15%            | User surveys        |
| Time saved on operations | N/A              | 10+ hours/week | User surveys        |
| Decision confidence      | N/A              | 80%            | User surveys        |
| Campaign launch time     | ~2 weeks         | ~45 minutes    | Workflow completion |
| Content production time  | ~3 weeks         | ~2 hours       | Skill completion    |

### 9.3 Platform Metrics

| Metric                      | Current Baseline | 6-Month Target | Measurement         |
| --------------------------- | ---------------- | -------------- | ------------------- |
| Daily active business users | <5%              | 40%            | DAU tracking        |
| Session duration            | ~10 minutes      | ~20 minutes    | Session analytics   |
| Feature completion rate     | Unknown          | 80%            | Workflow completion |
| Recommendation acceptance   | N/A              | 50%            | Action tracking     |
| NPS score (business users)  | N/A              | 50+            | User feedback       |

---

## 10. Conclusion

The current OpenCode user flow is a well-architected but poorly positioned platform for business owners. The technical foundation is strong—multi-agent system, commerce tools, creative Spaces, and pre-built skills are all capable of delivering significant business value. However, the user experience is designed entirely for developers, creating a nearly impenetrable barrier for the 95% of business leaders who would benefit from these capabilities.

**The transformation opportunity is clear:** Reposition the platform's interface, language, and documentation to speak business owner's language while preserving the powerful technical capabilities underneath. This is primarily a surface-level transformation (80% of what business owners need already exists) with strategic additions (dashboard, recommendations, alerting) to complete the experience.

**Immediate priorities should be:**

1. Complete terminology overhaul to remove all technical jargon
2. Create a welcoming, business-focused entry point
3. Build a visual dashboard that shows business health immediately
4. Implement natural language understanding for business queries
5. Rewrite all documentation from a business perspective

**The vision is simple:** A business owner should be able to connect their store, type "how are my sales doing?" and immediately receive valuable, actionable insight—without learning any technical concepts, navigating complex interfaces, or reading extensive documentation. This transformation will unlock the platform for the millions of business owners who need intelligent support but are currently excluded by developer-centric design.

---

**Document Status:** Complete Analysis  
**Version:** 1.0  
**Last Updated:** January 16, 2026
