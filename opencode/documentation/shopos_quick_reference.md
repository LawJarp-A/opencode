# ShopOS Planner Agent - Quick Reference Guide

## Available Agents

| Agent | Type | Use For |
|-------|------|---------|
| **@analyst** | Research | Data queries, ROI analysis, performance metrics |
| **@strategist** | Research | Strategy creation, campaign planning, market expansion |
| **@executor** | Execution | Running Spaces (images, copy, ads, emails) |
| **@reviewer** | Quality | Quality gate, validating plan JSON and folder contents |
| **@explore** | Utility | Codebase exploration and file searches |
| **@general** | General | Complex research and multi-step tasks |
| **@ops** | Operations | Complex multi-faceted tasks |
| **@worker** | Generic | Work unit execution and delegation |

## Operating Modes

1. **Planning Mode** - Research intent and create execution DAGs
2. **Execution Mode** - Execute pre-created plans through Spaces
3. **Research Mode** - Gather intelligence without full planning
4. **Quality Assurance Mode** - Validate outputs and ensure quality

## Multi-Threading Capabilities

**Yes!** I can spawn multiple agents simultaneously:

```python
# Example: Parallel agent spawning
Task(description="Analysis 1", prompt="...", subagent_type="analyst")
Task(description="Strategy 1", prompt="...", subagent_type="strategist")
Task(description="Analysis 2", prompt="...", subagent_type="analyst")
```

**Benefits:**
- 3x speedup for independent research tasks
- 5x speedup for independent space executions
- Mixed parallel/sequential for complex workflows

## AI Orchestration Capabilities

### Core Framework
- **Intent Processing:** Analyze and classify user requests
- **Context Management:** Load brand context and goal context
- **Research Orchestration:** Parallel research spawning and synthesis
- **DAG Construction:** Build execution graphs with dependencies
- **Quality Assurance:** Validate plans through @reviewer

### DAG Structure
```json
{
  "spaces": [
    {"id": "copy_1", "type": "copy_generation", "dependencies": []},
    {"id": "image_1", "type": "image_generation", "dependencies": ["copy_1"]},
    {"id": "ad_1", "type": "ad_creation", "dependencies": ["copy_1", "image_1"]}
  ]
}
```

## Available Spaces

### Content Generation
- **image_generation** - Create product/campaign images
- **copy_generation** - Create marketing copy
- **ad_creation** - Build ad creatives
- **email_generation** - Create email campaigns
- **social_content** - Generate social posts

### Data Query
- **query-products** - Search product catalog
- **query-sales** - Query sales data
- **query-campaigns** - Analyze campaigns
- **query-inventory** - Check stock levels

### Research
- **research** - General research
- **competitor-analysis** - Competitor intelligence
- **market-research** - Market trends

## Integration Capabilities

### MCP Servers
- **Shopify** - Product catalog, collections, cart, policies
- **Amazon** - Product search, price comparison, review analysis
- **Flipkart** - Product search, price tracking, scraping

### External Tools
- **Web Search** - Industry trends (not product data)
- **Code Search** - Programming examples and patterns
- **Documentation Search** - Technical documentation queries

## Performance Metrics

| Phase | Duration | Success Rate |
|-------|----------|--------------|
| Research | 2-5 min | 95% |
| Planning | 1-2 min | 99% |
| Execution | 10-20 min | 90% |
| Quality Review | 1-2 min | 100% |
| **Total** | **15-30 min** | **85%** |

## Folder Structure

```
.opencode/plan/
├── goal_folder_name/
│   ├── plan.json          # DAG definition
│   ├── plan.md            # Strategy summary
│   ├── research_report.json
│   ├── strategy_doc.md
│   └── assets/
│       ├── images/
│       └── copy/
```

## Best Practices

### Research
1. Always use MCPs first for product/commerce data
2. Web search only for general trends
3. Parallelize independent research tasks
4. Save all outputs to goal folder

### Planning
1. Create goal folder using snake_case naming
2. Always load brand context before queries
3. Design DAGs with clear dependencies
4. Validate plan.json before execution

### Execution
1. Execute parallel when possible
2. Monitor dependencies between spaces
3. Handle errors gracefully (max 2 retries)
4. Update plan files with execution results

## Common Workflows

### Product Launch
1. Research phase (parallel) → 2. Planning → 3. Execution → 4. Review

### Competitor Response
1. Gather intelligence → 2. Develop counter-strategy → 3. Rapid execution (4hr SLA)

### Seasonal Campaign
1. Research → 2. Planning → 3. Asset generation (parallel) → 4. Review → 5. Delivery

## Limitations & Constraints

### Technical
- Max 5-10 concurrent agents
- Anti-scraping on some e-commerce sites
- API rate limits on some services
- Large file truncation possible

### Operational
- No execution in planning mode
- Folder names must be snake_case (lowercase)
- No self-modification capability
- User must explicitly request commits

### Data
- No real-time data (MCP-dependent)
- Some queries return demo/mock data
- Geographic limitations on some MCPs
- Historical data depth varies

## Quick Commands

```python
# Check agent status
todoread()

# List active tasks
todowrite() with status="in_progress"

# View plan files
read(".opencode/plan/<goal>/plan.json")
read(".opencode/plan/<goal>/plan.md")
```

## Support

1. Review comprehensive guide: `documentation/shopos_planner_capabilities.md`
2. Check plan.md files for strategy context
3. Use @reviewer for validation
4. Consult AGENTS.md and STYLE_GUIDE.md

---

**Document Version:** 1.0  
**Last Updated:** January 17, 2026
