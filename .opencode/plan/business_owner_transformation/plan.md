# Plan Summary: OpenCode Business Owner Transformation

**Goal**: Transform OpenCode from developer-focused AI coding agent to business owner-focused commerce assistant  
**Focus**: User Flow Redesign  
**DAG File**: `plan.json`

---

## Executive Summary

OpenCode currently has **80% of the technical infrastructure** needed to serve business owners (7 agents, 12 commerce tools, 8 pre-built skills, 6 execution Spaces) but is **100% inaccessible** to non-technical users due to:

- Technical-only positioning ("AI coding agent")
- Terminal/TUI interface (inaccessible to business users)
- 100% technical terminology (zero business language)
- Developer-first documentation (no use cases or ROI examples)
- Command-line interaction model (vs. natural business questions)

This transformation focuses on **user flow redesign** - converting the existing powerful infrastructure into a business owner-friendly experience through terminology overhaul, visual dashboard, natural language interface, and business-focused workflows.

---

## Research Insights

### 1. Current State Analysis

- **Positioning**: "AI coding agent" immediately excludes non-coders
- **Interface**: Terminal/TUI requires technical knowledge to navigate
- **Terminology**: Agents called "planner/executor/analyst" instead of business roles; Spaces called "image_generation/copy_generation" instead of "creative production"
- **Documentation**: No business use cases, ROI examples, or getting started guides
- **First Experience**: Blinking cursor with no guidance = immediate confusion

### 2. Business Owner Requirements

From persona research, business owners need:

- **Outcome-focused language**: "How are my sales?" not technical queries
- **Dashboard experience**: Visual overview of business health
- **Proactive insights**: Alerts when metrics change, not just answers to questions
- **Decision support**: Recommendations with reasoning, not raw data dumps
- **Trust through transparency**: Explain why, show data sources, express confidence
- **Quick value delivery**: Aha moment within first 5 minutes

### 3. Key User Flows Identified

1. **Onboarding Flow**: Discovery → Store Connection → First Value → Goal Setting → Aha Moment
2. **Daily Operations Flow**: Morning Dashboard → Proactive Alerts → Quick Actions → Weekly Review
3. **Campaign Flow**: Initiate → Plan Review → Approve → Execute → Optimize → Results
4. **Decision Flow**: Question → Analysis → Options → Recommendation → Risk → Decision
5. **Reporting Flow**: Daily Pulse → Weekly Review → Monthly Analysis → Quarterly Planning

### 4. UX Patterns for Non-Technical Users

- **Progressive Disclosure**: Simple view by default, complexity on demand
- **Confidence Indicators**: Show uncertainty, don't hide it
- **Explanation Mode**: "Why" behind every recommendation
- **Feedback Loops**: Easy correction without technical knowledge
- **Time-Respecting**: Quick answers by default, depth available on request

---

## Transformation Strategy

### Phase 1: Foundation (Spaces 1-4)

Transform core terminology and create initial interfaces:

| Space                        | Transformation                | Business Impact              |
| ---------------------------- | ----------------------------- | ---------------------------- |
| `terminology_overhaul`       | Technical → Business language | Makes platform accessible    |
| `onboarding_flow_design`     | First-time user journey       | Creates aha moment in <5 min |
| `dashboard_interface`        | Terminal → Visual dashboard   | Enables non-technical use    |
| `natural_language_interface` | Commands → Natural questions  | "How are my sales?"          |

### Phase 2: Core Experience (Spaces 5-8)

Build operational and campaign workflows:

| Space                   | Transformation                        | Business Impact           |
| ----------------------- | ------------------------------------- | ------------------------- |
| `daily_ops_flow`        | Task execution → Business operations  | Daily value delivery      |
| `campaign_project_flow` | Technical tasks → Campaign management | Business outcome focus    |
| `decision_support_flow` | Data queries → Decision support       | Better business decisions |
| `reporting_system`      | Manual reports → Automated insights   | Time savings              |

### Phase 3: Trust & Collaboration (Spaces 9-13)

Build trust and enable team use:

| Space                   | Transformation                       | Business Impact       |
| ----------------------- | ------------------------------------ | --------------------- |
| `feedback_loop_system`  | One-way AI → Collaborative assistant | Improves with use     |
| `trust_transparency`    | Black box → Transparent reasoning    | Builds confidence     |
| `documentation_rewrite` | Technical docs → Business guides     | Self-service adoption |
| `mobile_experience`     | Desktop-only → Mobile + Desktop      | Access anywhere       |
| `team_collaboration`    | Solo use → Team adoption             | Organizational scale  |

### Phase 4: Scale (Spaces 14-15)

Expand platform and validate with users:

| Space                   | Transformation                          | Business Impact     |
| ----------------------- | --------------------------------------- | ------------------- |
| `integration_expansion` | E-commerce only → Business ecosystem    | Broader value       |
| `beta_testing`          | Assumption-based → Validated with users | Real-world feedback |

---

## User Flow Details

### 1. Onboarding Flow (New User Journey)

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS OWNER ONBOARDING                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │DISCOVERY │───▶│  SETUP   │───▶│CONNECT   │───▶│  FIRST   │  │
│  │          │    │          │    │  DATA    │    │  VALUE   │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │               │               │               │          │
│       ▼               ▼               ▼               ▼          │
│  "What can    "Welcome    "Connect    "Your business  │          │
│   this do?"     to [Name]!" Shopify"  looks healthy"  │          │
│                                                  │          │
│                                                  ▼          │
│                                            ┌──────────┐      │
│                                            │   GOAL   │      │
│                                            │  SETTING │      │
│                                            └──────────┘      │
│                                                 │             │
│                                                 ▼             │
│                                           ┌──────────┐       │
│                                           │   AHA    │       │
│                                           │  MOMENT  │       │
│                                           └──────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Points**:

- No technical setup required
- Connect existing stores in minutes
- Immediate business health snapshot
- Set goals (revenue, ROAS, etc.) in natural language
- Aha moment: "I can ask business questions and get answers"

### 2. Daily Operations Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DAILY OPERATIONS FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MORNING REVIEW          DAYTIME ACTIONS          WEEKLY REVIEW  │
│  ┌──────────┐           ┌──────────┐             ┌──────────┐   │
│  │Dashboard │───▶ Alert │  Quick   │───▶ Execute │  Deep   │   │
│  │ Overview │           │  Action  │             │  Review  │   │
│  └──────────┘           └──────────┘             └──────────┘   │
│       │                     │                        │           │
│       ▼                     ▼                        ▼           │
│  "Good morning!         "I notice [X].          "Here's your    │
│   Sales up 12%          Should I handle?"        weekly report" │
│   vs last week."                                                  │
│                                    │                            │
│                                    ▼                            │
│                              ┌──────────┐                       │
│                              │   Auto   │                       │
│                              │  Execute │                       │
│                              └──────────┘                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Points**:

- Morning dashboard shows business health at a glance
- Proactive alerts for important changes
- Quick actions for common tasks
- Auto-execution for routine operations (with approval)
- Weekly deep review for strategic planning

### 3. Campaign Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      CAMPAIGN MANAGEMENT FLOW                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ INITIATE │───▶│   PLAN   │───▶│  APPROVE │───▶│ EXECUTE  │  │
│  │          │    │  REVIEW  │    │          │    │          │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │               │               │               │          │
│       ▼               ▼               ▼               ▼          │
│  "I want to       "Here's your      "Looks        "Campaign     │
│   launch a        campaign plan     good.         launched!"    │
│   summer sale"    with budget,      Approve!"                    │
│                   channels,                                         │
│                   timeline                                          │
│                                                     │             │
│                                                     ▼             │
│                                              ┌──────────┐        │
│                                              │OPTIMIZE  │        │
│                                              │& RESULTS │        │
│                                              └──────────┘        │
│                                                       │          │
│                                                       ▼          │
│                                              "Campaign ROAS:     │
│                                               4.2x (Target: 4x)" │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Points**:

- Natural language campaign creation
- AI-generated plans with budget, timeline, channels
- Visual approval workflow
- Execution with real-time updates
- Performance optimization and results review

### 4. Decision Support Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     DECISION SUPPORT FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  QUESTION          ANALYSIS          OPTIONS        DECISION    │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐   ┌──────────┐ │
│  │ "Should  │────▶│  Gather  │────▶│ Present  │──▶│   Make   │ │
│  │  I raise │     │  data    │     │ options  │   │ Decision │ │
│  │  prices?"│     │          │     │ + risks  │   │          │ │
│  └──────────┘     └──────────┘     └──────────┘   └──────────┘ │
│       │               │               │               │          │
│       ▼               ▼               ▼               ▼          │
│  "Pricing         "Competitors      "Option A:      "I'll go    │
│   decision"       at $X, your       Raise 5%        with A"     │
│                   cost at $Y"       Option B:                    │
│                                    Keep same"                    │
│                                                               │
│  OUTCOME TRACKING                                              │
│  ┌──────────┐                                                 │
│  │  Track   │◀────────────────────────────────────────────────│
│  │  result  │                                                 │
│  └──────────┘                                                 │
│       │                                                       │
│       ▼                                                       │
│  "After raising prices, conversion dropped 8% in Week 1"       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Points**:

- Understand business intent behind questions
- Gather relevant data automatically
- Present options with pros/cons and risks
- Track decision outcomes for learning

---

## Terminology Mapping (Sample)

| Current (Technical) | New (Business)          |
| ------------------- | ----------------------- |
| Planner Agent       | Business Strategist     |
| Executor Agent      | Action Assistant        |
| Analyst Agent       | Insights Analyst        |
| Strategist Agent    | Planning Expert         |
| Worker Agent        | Task Manager            |
| Spaces              | Capabilities / Features |
| Image Generation    | Product Photography     |
| Copy Generation     | Marketing Copy          |
| Ad Creation         | Campaign Ads            |
| Research            | Market Intelligence     |
| Email Generation    | Email Campaigns         |
| Social Content      | Social Media Posts      |
| DAG                 | Project Plan            |
| Execution           | Getting Things Done     |
| MCP Servers         | Data Connections        |

---

## Success Metrics

### Adoption Metrics

- **Time to First Value**: Target <5 minutes (currently undefined)
- **Feature Discovery**: Target 70% awareness (currently <10%)
- **Task Completion Rate**: Target 85% (currently unknown)
- **User Retention**: Target 60% weekly active (currently unknown)

### Experience Metrics

- **User Satisfaction (CSAT)**: Target 4.5/5
- **Task Ease (SUS)**: Target 80+ score
- **Recommendation Trust**: Target 75% acceptance rate
- **Support Tickets**: Target 50% reduction

### Business Outcomes

- **Business Owner Activation**: Target 1000+ active business owners
- **ROI Demonstrated**: 80% of users can show business value
- **NPS Score**: Target 50+ (promoter range)

---

## Next Steps

To execute this transformation, run the spaces defined in `plan.json` in order:

1. **Start with `terminology_overhaul`** - Foundation for all other changes
2. **Build the `onboarding_flow_design`** - Critical for first impressions
3. **Create `dashboard_interface`** - Makes the platform accessible
4. **Implement `natural_language_interface`** - Enables business questions

**Estimated Timeline**: 12-16 weeks for full transformation  
**Resource Requirements**: Product, UX, Engineering, Documentation teams  
**Risk Level**: Medium - Existing functionality preserved, interface transformed

---

## Files in This Plan

| File                               | Purpose                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| `plan.json`                        | Detailed execution DAG with all spaces and dependencies |
| `plan.md`                          | This summary document                                   |
| `current_architecture_analysis.md` | Technical architecture assessment                       |
| `business_requirements.md`         | Business owner personas and needs                       |
| `business_user_flow.md`            | Detailed user flow blueprint                            |
| `user_experience_patterns.md`      | UX patterns for non-technical users                     |
| `current_user_flow_analysis.md`    | Gap analysis between current and desired state          |
| `competitor_analysis.md`           | Competitive landscape and best practices                |

---

_Plan generated by ShopOS Planner Agent_  
_Transformation Focus: User Flow Redesign_  
_Status: Ready for Execution_
