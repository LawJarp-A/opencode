/// <reference path="../env.d.ts" />
import { tool } from "@opencode-ai/plugin"
declare const require: any;

const DESCRIPTION = `Load brand context and configuration for ShopOS operations.
Returns available databases, enabled Spaces, brand preferences, and historical patterns.
ALWAYS call this first before running queries or Spaces to understand what's available.`

// Brand configuration is loaded from .opencode/brands.json
interface BrandContext {
  id: string
  name: string
  industry: string
  databases: string[]
  spaces: string[]
  regions: string[]
  preferences: {
    voice: string
    colors: string[]
    avoid: string[]
  }
  performance: {
    avg_roas: number
    top_region: string
    top_category: string
    yoy_growth: number
  }
  shopify?: {
    store_url: string
    mcp_endpoint: string
    mcp_type: "storefront" | "admin"
    auth_required: boolean
    note: string
    token?: string // Optional token for real API access
  }
}

async function loadBrands(): Promise<Record<string, BrandContext>> {
  try {
    // In a real environment, this would read from the filesystem
    // For this environment, we'll try to require it, or return empty if missing
    // Note: In tool execution context, we might need FS access. 
    // Since this is a specialized environment, we'll simulate reading the file we just created
    // if we could. However, 'tool' definition is TS.
    // We will assume the file exists relative to CWD or use a helper.
    // For simplicity in this refactor, we will try to use `fs` if available or import.

    // START TEMPORARY IMPLEMENTATION
    // Since I cannot easily import 'fs' inside the tool sandbox without knowing the env permissions,
    // I will use a direct relative import if possible, or fallback.
    // However, the best practice here for the user's codebase is to use 'fs'.

    const fs = require('fs');
    const path = require('path');
    const configPath = path.resolve('.opencode/brands.json');

    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(content);
    }
    return {};
  } catch (e) {
    console.error("Failed to load brands.json", e);
    return {};
  }
}


export default tool({
  description: DESCRIPTION,
  args: {
    brand_id: tool.schema
      .string()
      .describe("Brand identifier (must be configured in .opencode/brands.json)"),
  },
  async execute(args) {
    const brands = await loadBrands();

    if (!args.brand_id) {
      return "Error: brand_id argument is required. Please provide a valid brand identifier.";
    }

    const brand = brands[args.brand_id.toLowerCase()]

    if (!brand) {
      const available = Object.keys(brands).join(", ")
      return `Brand '${args.brand_id}' not found in configuration. 
Please ensure '.opencode/brands.json' exists and contains your brand definition.
Available brands: ${available || "None configured"}`
    }

    const shopifyInfo = brand.shopify
      ? `
## Shopify Storefront
- **Store URL**: ${brand.shopify.store_url}
- **MCP Server**: ${brand.shopify.mcp_endpoint}
- **API Type**: ${brand.shopify.mcp_type}
- **Authentication**: ${brand.shopify.auth_required ? "Required" : "Not required"}
- **Note**: ${brand.shopify.note}

### Available Shopify Tools
- \`query-products\` - Search and filter product catalog
- \`get-product-details\` - Get detailed product information
- \`query-collections\` - Browse product collections/categories
- \`get-store-policies\` - Retrieve policies, FAQs, shipping info

### MCP Direct Tools
- \`shopify-mock_search_shop_catalog\` - Direct MCP catalog search
- \`shopify-mock_search_shop_policies_and_faqs\` - Direct MCP policy search
- \`shopify-mock_get_cart\` - Retrieve cart contents
- \`shopify-mock_update_cart\` - Modify cart items
`
      : ""

    return `# Brand Context: ${brand.name}

## Basic Info
- **ID**: ${brand.id}
- **Industry**: ${brand.industry}
- **Regions**: ${brand.regions.join(", ")}

## Available Databases
${brand.databases.map(db => `- ${db}`).join("\n")}

## Enabled Spaces
${brand.spaces.map(s => `- ${s}`).join("\n")}

## Brand Preferences
- **Voice**: ${brand.preferences.voice}
- **Colors**: ${brand.preferences.colors.join(", ")}
- **Avoid**: ${brand.preferences.avoid.join(", ")}

## Historical Performance
- **Avg ROAS**: ${brand.performance.avg_roas}x
- **Top Region**: ${brand.performance.top_region}
- **Top Category**: ${brand.performance.top_category}
- **YoY Growth**: ${brand.performance.yoy_growth}%
${shopifyInfo}
---

**Next Steps**:
1. Use \`query-sales\`, \`query-campaigns\`, or \`query-inventory\` to analyze data
2. Use \`query-products\` or \`get-product-details\` to browse Shopify catalog
3. Use \`run-space\` to generate creative assets
4. Use available skills for complex workflows

Brand context loaded successfully. You can now operate ${brand.name}.`
  },
})
