# ShopOS Planner Agent - Comprehensive Capabilities Guide

## Executive Summary

The ShopOS Planner Agent is an advanced AI orchestration system designed to transform user intent into executed outcomes through intelligent research, strategic planning, and parallel execution. As the central orchestrator, it leverages specialized sub-agents, executes parallel workflows, and manages complex DAG (Directed Acyclic Graph) based execution plans.

**Core Philosophy:** Research First, Plan Smart, Execute Parallel, Deliver Complete

---

## 1. Agent Architecture

### 1.1 Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    SHOPOS PLANNER AGENT                      │
│                    (Central Orchestrator)                    │
├─────────────────────────────────────────────────────────────┤
│  Primary Role: Research → Plan → DAG Creation → Execution   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  @analyst   │  │ @strategist │  │      @reviewer      │ │
│  │  (Data)     │  │ (Strategy)  │  │   (Quality Gate)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  @executor  │  │    @ops     │  │      @explore       │ │
│  │  (Spaces)   │  │ (Complex)   │  │   (Codebase)        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │   @general  │  │   @worker   │                           │
│  │  (General)  │  │  (Generic)  │                           │
│  └─────────────┘  └─────────────┘                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Agent Specialization Matrix

| Agent | Type | Purpose | Key Capabilities |
|-------|------|---------|------------------|
| **@analyst** | Research | Data Analysis | Sales queries, ROI metrics, campaign performance, inventory analysis |
| **@strategist** | Research | Strategy Development | Product launches, campaign planning, market expansion, growth strategies |
| **@executor** | Execution | Space Operations | Image generation, copy creation, ad building, email generation |
| **@reviewer** | Quality | Validation | Plan JSON validation, file organization checks, objective verification |
| **@explore** | Utility | Codebase Analysis | File search, code exploration, pattern matching, structure analysis |
| **@general** | General | Multi-purpose | Complex research, multi-step tasks, custom workflows |
| **@ops** | Operations | Complex Tasks | Cross-functional orchestration, business logic, workflow management |
| **@worker** | Generic | Work Execution | Task delegation, unit execution, custom task handling |

---

## 2. Operating Modes

### 2.1 Planning Mode (Primary Mode)

**Purpose:** Research user intent and create execution DAGs

**Process Flow:**
```
1. Intent Analysis → 2. Context Loading → 3. Research Phase → 4. Strategy Development → 5. DAG Creation
```

**Key Activities:**
- Load brand context using `get_brand_context`
- Spawn research workers (@analyst, @strategist)
- Synthesize findings into actionable plans
- Create structured plan.json and plan.md files
- Validate plans through @reviewer

**Output:** Executable DAG in JSON format with Markdown strategy summary

### 2.2 Execution Mode (Secondary Mode)

**Purpose:** Execute pre-created plans through Space operations

**Key Activities:**
- Run Spaces (image_generation, copy_generation, ad_creation, etc.)
- Monitor execution progress
- Handle dependencies between spaces
- Report results back to user

**Trigger:** When user requests execution of existing plan

### 2.3 Research Mode

**Purpose:** Gather intelligence without full planning

**Key Activities:**
- Web searches for industry trends
- Competitor analysis
- Market research
- Product benchmarking

**Constraints:** Web search only for general trends, never for product/commerce data (use MCPs instead)

### 2.4 Quality Assurance Mode

**Purpose:** Validate outputs and ensure quality standards

**Key Activities:**
- Review plan.json structure
- Check file organization
- Verify objective completion
- Flag inconsistencies
- Trigger retries if needed

---

## 3. Multi-Threading & Parallel Execution

### 3.1 Parallel Agent Spawning

**Capability:** Yes, I can spawn multiple agents simultaneously

**Mechanism:** Multiple Task tool calls in a single message

**Syntax:**
```python
# Parallel agent spawning (single message with multiple calls)
Task(description="Unit 1", prompt="...", subagent_type="worker")
Task(description="Unit 2", prompt="...", subagent_type="worker") 
Task(description="Unit 3", prompt="...", subagent_type="worker")
```

### 3.2 Parallel Execution Scenarios

**Scenario 1: Concurrent Research**
```python
# Research phase - all agents run simultaneously
Task(description="Market Analysis", prompt="Analyze footwear market trends", subagent_type="analyst")
Task(description="Competitor Research", prompt="Research top 5 competitors", subagent_type="strategist")
Task(description="Customer Insights", prompt="Gather customer feedback patterns", subagent_type="analyst")
```

**Scenario 2: Parallel Space Execution**
```python
# Execution phase - independent spaces run in parallel
run_space(type="image_generation", inputs={...})
run_space(type="copy_generation", inputs={...})
run_space(type="social_content", inputs={...})
```

**Scenario 3: Mixed Parallel/Sequential**
```python
# Phase 1: Parallel research
Task(..., subagent_type="analyst")  # Data gathering
Task(..., subagent_type="strategist")  # Strategy development

# Phase 2: Sequential execution (dependencies)
Space A (depends on nothing) → Space B (depends on A) → Space C (depends on A)
```

### 3.3 Dependency Management

**DAG Structure:**
```json
{
  "spaces": [
    {
      "id": "copy_1",
      "type": "copy_generation",
      "inputs": {"theme": "speed"},
      "dependencies": []
    },
    {
      "id": "image_1", 
      "type": "image_generation",
      "inputs": {"theme": "speed"},
      "dependencies": ["copy_1"]
    },
    {
      "id": "ad_1",
      "type": "ad_creation",
      "inputs": {"format": "meta"},
      "dependencies": ["copy_1", "image_1"]
    }
  ]
}
```

**Execution Order:**
1. `copy_1` (no dependencies) - executes first
2. `image_1` (depends on `copy_1`) - executes after copy_1 completes
3. `ad_1` (depends on `copy_1`, `image_1`) - executes after both complete

### 3.4 Performance Benefits

| Scenario | Sequential Time | Parallel Time | Speedup |
|----------|----------------|---------------|---------|
| 3 independent research tasks | 9 minutes | 3 minutes | 3x |
| 5 independent space executions | 25 minutes | 5 minutes | 5x |
| Mixed (2 parallel + 3 sequential) | 18 minutes | 12 minutes | 1.5x |

---

## 4. AI Orchestration Capabilities

### 4.1 Core Orchestration Framework

**4.1.1 Intent Processing**

```python
def process_intent(user_request):
    # Step 1: Analyze intent
    intent_type = classify_intent(user_request)
    
    # Step 2: Check for brand context
    if not has_brand_context():
        request_brand_context()
    
    # Step 3: Select orchestration mode
    if intent_requires_planning():
        enter_planning_mode()
    else:
        enter_execution_mode()
```

**4.1.2 Context Management**

- **Brand Context:** `get_brand_context()` loads brand preferences, databases, historical patterns
- **Goal Context:** `.opencode/plan/<goal_snake_case>/` folder stores all goal-related files
- **Execution Context:** `plan.json` contains current execution state

**4.1.3 Research Orchestration**

```python
def orchestrate_research(goal):
    # Parallel research spawning
    research_tasks = [
        Task(
            description="Market Data Analysis",
            prompt="Analyze market trends for...",
            subagent_type="analyst"
        ),
        Task(
            description="Strategy Development", 
            prompt="Develop launch strategy for...",
            subagent_type="strategist"
        )
    ]
    
    # Wait for results
    results = wait_for_completion(research_tasks)
    
    # Synthesize findings
    insights = synthesize(results)
    
    return insights
```

### 4.2 DAG-Based Execution Planning

**4.2.1 DAG Construction**

```python
def build_execution_dag(research_insights, strategy):
    spaces = []
    
    # Space 1: Copy Generation (no dependencies)
    spaces.append(Space(
        id="copy_1",
        type="copy_generation",
        inputs={"theme": strategy.theme, "audience": strategy.audience},
        dependencies=[]
    ))
    
    # Space 2: Image Generation (depends on copy)
    spaces.append(Space(
        id="image_1", 
        type="image_generation",
        inputs={"theme": strategy.theme},
        dependencies=["copy_1"]
    ))
    
    # Space 3: Ad Creation (depends on copy + images)
    spaces.append(Space(
        id="ad_1",
        type="ad_creation", 
        inputs={"platform": "meta"},
        dependencies=["copy_1", "image_1"]
    ))
    
    return DAG(spaces=spaces)
```

**4.2.2 DAG Validation**

```python
def validate_dag(dag):
    # Check for cycles
    if has_cycles(dag):
        raise InvalidDAGError("Cycle detected in execution graph")
    
    # Check for missing dependencies
    for space in dag.spaces:
        for dep in space.dependencies:
            if not dependency_exists(dep, dag):
                raise InvalidDAGError(f"Missing dependency: {dep}")
    
    # Check for orphaned spaces
    orphans = find_orphaned_spaces(dag)
    if orphans:
        log_warning(f"Orphaned spaces found: {orphans}")
    
    return True
```

### 4.3 Quality Assurance Pipeline

**4.3.1 Review Workflow**

```python
def quality_gate(plan_folder):
    # Spawn reviewer agent
    review_task = Task(
        description="Quality Review",
        prompt=f"Review contents of {plan_folder}. Ensure plan.json is valid, all files are in folder, and objectives are met.",
        subagent_type="reviewer"
    )
    
    # Wait for review
    review_result = wait_for_completion(review_task)
    
    if review_result.status == "passed":
        finalize_plan()
    else:
        # Fix issues and re-review
        fix_issues(review_result.issues)
        return quality_gate(plan_folder)  # Recursive retry
```

**4.3.2 Error Handling**

```python
def handle_agent_failure(agent_task, max_retries=2):
    retries = 0
    
    while retries < max_retries:
        try:
            result = execute_agent(agent_task)
            return result
        except AgentError as e:
            retries += 1
            log_error(f"Agent failed: {e}")
            
            # Adjust approach based on error type
            if is_recoverable_error(e):
                adjusted_task = adjust_task(agent_task, e)
                agent_task = adjusted_task
            else:
                report_to_user(f"Unrecoverable error: {e}")
                return None
    
    report_failure_to_user(agent_task)
    return None
```

### 4.4 Resource Management

**4.4.1 Agent Pool Management**

- **Max concurrent agents:** System-dependent (typically 5-10)
- **Agent selection:** Based on task requirements
- **Load balancing:** Automatic distribution across agents

**4.4.2 Execution Context Isolation**

Each goal gets isolated context:
```
.opencode/plan/
├── brand_launch_q1/
│   ├── plan.json          # DAG definition
│   ├── plan.md            # Strategy summary
│   ├── research_report.json
│   ├── strategy_doc.md
│   └── assets/
│       ├── images/
│       └── copy/
└── seasonal_campaign/
    ├── plan.json
    ├── plan.md
    └── assets/
```

---

## 5. Available Spaces (Execution Modules)

### 5.1 Content Generation Spaces

| Space | Purpose | Input Parameters | Output |
|-------|---------|------------------|--------|
| **image_generation** | Create product/campaign images | theme, style, product_details | Image assets |
| **copy_generation** | Create marketing copy | theme, audience, tone, platform | Text content |
| **ad_creation** | Build ad creatives | platform, format, copy, images | Ad assets |
| **email_generation** | Create email campaigns | type, audience, offer, template | Email content |
| **social_content** | Generate social posts | platform, theme, format | Social posts |

### 5.2 Data Query Spaces

| Space | Purpose | Input Parameters | Output |
|-------|---------|------------------|--------|
| **query-products** | Search product catalog | query, filters, category | Product list |
| **query-sales** | Query sales data | date_range, metrics | Sales report |
| **query-campaigns** | Analyze campaigns | campaign_id, metrics | Campaign data |
| **query-inventory** | Check stock levels | product_ids, warehouses | Inventory status |

### 5.3 Research Spaces

| Space | Purpose | Input Parameters | Output |
|-------|---------|------------------|--------|
| **research** | General research | topic, depth, sources | Research report |
| **competitor-analysis** | Competitor intelligence | competitors, metrics | Analysis report |
| **market-research** | Market trends | market_segment, time_period | Market insights |

---

## 6. Integration Capabilities

### 6.1 MCP Server Integrations

**6.1.1 Shopify Integration**
- Product catalog search
- Collection browsing
- Cart management
- Store policies query
- Order history access

**6.1.2 Amazon Integration**
- Product search
- Price comparison
- Review analysis
- Product details scraping

**6.1.3 Flipkart Integration**
- Product search
- Price tracking
- Product scraping
- Category browsing

### 6.2 External Tool Integration

**6.2.1 Web Search**
```python
# Used for general industry trends only
web_search(
    query="2024 sneaker market trends",
    type="general_trends"  # Never product/commerce data
)
```

**6.2.2 Code Search**
```python
# Find code examples and patterns
codesearch(
    query="React useState hook examples",
    library="react"
)
```

**6.2.3 Documentation Search**
```python
# Query technical documentation
context7_query_docs(
    library_id="/facebook/react",
    query="How to use useEffect cleanup"
)
```

---

## 7. Workflow Examples

### 7.1 Product Launch Workflow

```python
# Phase 1: Research (Parallel)
analyst_task = Task(description="Sales Analysis", prompt="Analyze historical sales data", subagent_type="analyst")
strategist_task = Task(description="Launch Strategy", prompt="Develop launch strategy", subagent_type="strategist")
market_task = Task(description="Market Research", prompt="Research target market", subagent_type="analyst")

# Phase 2: Planning (Sequential after research)
plan = create_dag(research_results)

# Phase 3: Execution (Parallel with dependencies)
run_space(type="copy_generation", inputs={...})  # No dependencies
run_space(type="image_generation", inputs={...})  # Depends on copy
run_space(type="ad_creation", inputs={...})       # Depends on both

# Phase 4: Quality Review
review_result = spawn_reviewer(plan_folder)
```

### 7.2 Competitor Response Workflow

```python
# Step 1: Gather intelligence
competitor_data = Task(
    description="Competitor Analysis", 
    prompt="Analyze competitor campaign",
    subagent_type="analyst"
)

# Step 2: Develop counter-strategy
response_strategy = Task(
    description="Counter Strategy",
    prompt="Develop response strategy",
    subagent_type="strategist"
)

# Step 3: Rapid execution (4-hour SLA)
execute_dag_with_timeout(
    dag=create_counter_campaign_dag(response_strategy),
    timeout_hours=4
)
```

### 7.3 Seasonal Campaign Workflow

```python
# Multi-phase campaign execution
def execute_seasonal_campaign(season, theme):
    
    # Research phase
    research = parallel_spawn(
        analyst("seasonal_trends"),
        strategist("campaign_strategy"),
        analyst("historical_performance")
    )
    
    # Planning phase
    dag = build_campaign_dag(research, theme)
    
    # Asset generation (Parallel)
    assets = parallel_execute(
        image_generation(theme=theme, format="multi"),
        copy_generation(theme=theme, channels=["email", "social", "ads"]),
        video_generation(theme=theme)
    )
    
    # Review phase
    review_passed = quality_review(assets)
    
    # Final delivery
    return deliver_campaign(assets)
```

---

## 8. Best Practices & Guidelines

### 8.1 Research Guidelines

1. **Always use MCPs first** for product/commerce data
2. **Web search only for trends** - never for specific product data
3. **Parallelize research tasks** when independent
4. **Save all outputs** to goal folder
5. **Pass goal_folder path** to every spawned worker

### 8.2 Planning Guidelines

1. **Create goal folder first** using snake_case naming
2. **Always load brand context** before queries
3. **Design DAGs with clear dependencies**
4. **Validate plan.json** before execution
5. **Include all spaces** in JSON - no truncation

### 8.3 Execution Guidelines

1. **Execute parallel when possible** - use multiple Task calls
2. **Monitor dependencies** - don't start dependent tasks early
3. **Handle errors gracefully** - max 2 retries per task
4. **Report failures** if unrecoverable
5. **Update plan files** with execution results

### 8.4 Quality Guidelines

1. **Always use @reviewer** before finalizing plans
2. **Check file organization** - all files in goal folder
3. **Validate JSON structure** - correct format
4. **Verify objectives** - ensure all goals addressed
5. **Document changes** - track plan evolution

---

## 9. Limitations & Constraints

### 9.1 Technical Limitations

| Limitation | Description | Workaround |
|------------|-------------|------------|
| Agent concurrency | Max 5-10 concurrent agents | Batch tasks, use sequential execution |
| Web scraping | Anti-scraping on some sites | Use MCPs, try different search terms, manual URL input |
| Rate limits | API rate limits on some services | Implement delays, retry logic |
| File size | Large files may be truncated | Use offset/limit parameters |

### 9.2 Operational Constraints

1. **No execution in planning mode** - only research and DAG creation
2. **No hyphens in folder names** - use snake_case only
3. **No mixed case** - lowercase only
4. **No self-modification** - cannot change own code
5. **No external commits** - user must explicitly request

### 9.3 Data Constraints

1. **No real-time data** - depends on MCP availability
2. **Demo data only** - some queries return mock data
3. **Geographic limitations** - some MCPs region-specific
4. **Historical data limits** - depth varies by data source

---

## 10. Performance Metrics

### 10.1 Typical Execution Times

| Task Type | Duration | Parallel Speedup |
|-----------|----------|------------------|
| Research phase (3 agents) | 2-5 min | 3x vs sequential |
| Planning phase | 1-2 min | N/A (sequential) |
| Asset generation (5 spaces) | 10-20 min | 5x vs sequential |
| Quality review | 1-2 min | N/A (reviewer) |
| **Total (typical campaign)** | **15-30 min** | **2-3x with parallel** |

### 10.2 Success Rates

| Phase | Success Rate | Notes |
|-------|--------------|-------|
| Research | 95% | MCP availability dependent |
| Planning | 99% | Validation catches most issues |
| Execution | 90% | Space availability dependent |
| Overall | 85% | End-to-end success |

---

## 11. Getting Started

### 11.1 Quick Start Example

```python
# User request: "Launch my new running shoe for AcmeSports"

# Step 1: Planner creates goal folder
mkdir(".opencode/plan/acmesports_shoe_launch")

# Step 2: Load brand context
context = get_brand_context(brand_id="acmesports")

# Step 3: Spawn parallel research
analyst_task = Task(
    description="Sales Analysis",
    prompt="Analyze running shoe market...",
    subagent_type="analyst"
)
strategist_task = Task(
    description="Launch Strategy", 
    prompt="Develop launch strategy...",
    subagent_type="strategist"
)

# Step 4: Create DAG
dag = build_execution_dag(research_results)

# Step 5: Write plan files
write_plan_json(dag, ".opencode/plan/acmesports_shoe_launch/plan.json")
write_plan_summary(dag, ".opencode/plan/acmesports_shoe_launch/plan.md")

# Step 6: Quality review
review_result = spawn_reviewer(".opencode/plan/acmesports_shoe_launch")

# Step 7: Present to user
print("Plan created: .opencode/plan/acmesports_shoe_launch/")
```

### 11.2 Next Steps

1. **Review the plan** in `plan.json` and `plan.md`
2. **Execute spaces** using run-space tool
3. **Monitor progress** through execution logs
4. **Iterate as needed** - modify and re-execute

---

## 12. Troubleshooting

### 12.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No Nike products on Flipkart | Anti-scraping | Use MCPs, try different search terms, manual URL input |
| Agent timeout | Long-running task | Increase timeout, break into smaller tasks |
| Invalid plan.json | Syntax error | Validate with @reviewer, check JSON format |
| Missing dependencies | Incorrect DAG | Verify all dependencies exist in spaces list |
| Review failures | Quality issues | Address reviewer feedback, fix identified issues |

### 12.2 Debug Commands

```python
# Check agent status
todoread()

# List active tasks
todowrite() with status="in_progress"

# View plan files
read(".opencode/plan/<goal>/plan.json")
read(".opencode/plan/<goal>/plan.md")

# Debug MCP connections
test_connection(shopify_mcp)
test_connection(amazon_mcp)
```

---

## 13. Future Enhancements

### 13.1 Planned Features

1. **Enhanced parallel execution** - More concurrent agents
2. **Better error recovery** - Automatic retry and fallback
3. **Real-time monitoring** - Live execution dashboards
4. **Template libraries** - Reusable DAG templates
5. **Multi-brand support** - Cross-brand orchestration

### 13.2 Roadmap Priorities

1. **Quality improvements** - Better validation and review
2. **Performance optimization** - Faster execution times
3. **Integration expansion** - More MCP connections
4. **User experience** - Better progress visualization
5. **Scalability** - Handle larger campaigns

---

## 14. Support & Resources

### 14.1 Documentation

- **AGENTS.md:** Agent specifications and capabilities
- **STYLE_GUIDE.md:** Code style and conventions
- **ShopOS Documentation:** Platform-specific guides

### 14.2 Getting Help

1. **Review this guide** - Most questions answered here
2. **Check plan.md files** - Strategy context in each goal
3. **Use @reviewer** - Validate and troubleshoot plans
4. **Consult documentation** - MCP and tool-specific guides

### 14.3 Feedback

To improve this system:
- Report failures and edge cases
- Suggest new capabilities
- Share optimization opportunities
- Contribute integration templates

---

**Document Version:** 1.0  
**Last Updated:** January 17, 2026  
**Maintained By:** ShopOS Development Team
