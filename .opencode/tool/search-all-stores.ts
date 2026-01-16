/// <reference path="../env.d.ts" />
import { tool } from "@opencode-ai/plugin"

const DESCRIPTION = `Search for products across ALL connected stores simultaneously.
Orchestrates queries to multiple MCPs (Shopify Mock, Hydrogen Storefront, Amazon, Flipkart) to provide comprehensive product search results.

Use this when you need to:
- Compare products across different marketplaces
- Find the best deals across all stores
- Check product availability everywhere
- Get comprehensive product search results

Searches these stores in parallel:
- Shopify Mock Store (shopify-mock MCP)
- Hydrogen Demo Store (hydrogen-storefront MCP)
- Amazon Products (amazon-mcp MCP)
- Flipkart Products (flipkart-mcp MCP)
`

export default tool({
  description: DESCRIPTION,
  args: {
    query: tool.schema
      .string()
      .describe("Natural language search query (e.g., 'running shoes', 'snowboards', 'laptops')"),
    limit_per_store: tool.schema
      .number()
      .describe("Maximum number of products to return from each store")
      .default(5),
    context: tool.schema
      .string()
      .describe("Additional context like user location, preferences, budget")
      .optional(),
  },
  async execute(args) {
    const searchContext = args.context || `Searching for: ${args.query}`

    return `# Multi-Store Product Search Guide: "${args.query}"

This tool coordinates searching across ALL connected stores. To get comprehensive results, call these MCP tools IN PARALLEL:

## 1. Shopify Mock Store 🛍️
\`\`\`
Tool: shopify-mock_search_shop_catalog
Parameters: {
  "query": "${args.query}",
  "limit": ${args.limit_per_store},
  "context": "${searchContext}"
}
\`\`\`

## 2. Hydrogen Demo Store 🏂
\`\`\`
Tool: hydrogen-storefront_search_shop_catalog
Parameters: {
  "query": "${args.query}",
  "limit": ${args.limit_per_store},
  "context": "${searchContext}"
}
\`\`\`

## 3. Amazon Products 📦
\`\`\`
Tool: amazon-mcp_search_products
Parameters: {
  "query": "${args.query}",
  "max_results": ${args.limit_per_store}
}
\`\`\`

## 4. Flipkart Products 🛒
\`\`\`
Tool: flipkart-mcp_search_products
Parameters: {
  "query": "${args.query}",
  "max_results": ${args.limit_per_store}
}
\`\`\`

---

## Instructions for Agent

1. **Call all 4 tools in parallel** (single message with 4 tool calls)
2. **Aggregate results** into a unified format
3. **Compare across stores**: pricing, availability, features
4. **Provide recommendations** based on:
   - Best value (price vs features)
   - Fastest shipping
   - Highest quality/ratings
   - Stock availability
5. **Format output** with clear store labels and comparison table

## Output Template

\`\`\`markdown
# Multi-Store Search: "${args.query}"

## 🛍️ Shopify Mock Store
[Results from shopify-mock MCP]

## 🏂 Hydrogen Demo Store
[Results from hydrogen-storefront MCP]

## 📦 Amazon
[Results from amazon-mcp MCP]

## 🛒 Flipkart
[Results from flipkart-mcp MCP]

## 📊 Comparison Summary

| Product | Shopify Mock | Hydrogen | Amazon | Flipkart | Best Deal |
|---------|--------------|----------|--------|----------|-----------|
| [Product 1] | $X | $Y | $Z | ₹W | ⭐ Flipkart |
| [Product 2] | $X | $Y | $Z | ₹W | ⭐ Amazon |

## 🎯 Recommendations

1. **Best Value**: [Product] at [Store] ($[Price] / ₹[Price])
2. **Premium Option**: [Product] at [Store] ($[Price] / ₹[Price])
3. **Budget Pick**: [Product] at [Store] ($[Price] / ₹[Price])
\`\`\`

---

**IMPORTANT**: Make sure to call all MCP tools in parallel to maximize search speed and ensure comprehensive results across all marketplaces.`
  },
})
