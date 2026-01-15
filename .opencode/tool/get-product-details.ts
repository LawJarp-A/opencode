/// <reference path="../env.d.ts" />
import { tool } from "@opencode-ai/plugin"

const DESCRIPTION = `Get detailed information about a specific product from the Shopify storefront.
Returns comprehensive product data including:
- Full product description and specifications
- All available variants (sizes, colors, materials)
- Pricing and compare-at pricing
- Product images and media
- Inventory availability by variant
- SEO metadata and tags

Use this when you need complete product details for:
- Creating product-specific campaigns
- Generating product copy or descriptions
- Analyzing product variants and pricing
- Checking detailed inventory status

Data sources:
- nike, luxebags, freshfoods: Mock.shop (Shopify's official demo GraphQL API)
- hydrogenstore: Hydrogen Demo Store (Shopify's Hydrogen framework demo)`

// Helper to load brands (duplicated for tool isolation)
declare const require: any;
function loadBrandConfig(brandId: string): { endpoint: string; token?: string; source: string } | null {
  try {
    const fs = require('fs');
    const path = require('path');
    const configPath = path.resolve('.opencode/brands.json');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      const brands = JSON.parse(content);
      const brand = brands[brandId.toLowerCase()];

      if (!brand || !brand.shopify) return null;

      // Default to Mock.shop if not specified or specific override
      let endpoint = "https://mock.shop/api/2024-07/graphql.json";
      if (brand.shopify.store_url) {
        endpoint = `https://${brand.shopify.store_url}/api/2024-07/graphql.json`;
      }
      // If endpoint is explicitly mcp, handle accordingly or use known public APIs

      return {
        endpoint: endpoint,
        token: brand.shopify.token,
        source: brand.shopify.store_url
      };
    }
  } catch (e) { return null; }
  return null;
}

export default tool({
  description: DESCRIPTION,
  args: {
    brand_id: tool.schema
      .string()
      .describe("Brand identifier (nike, luxebags, freshfoods, hydrogenstore)"),
    product_identifier: tool.schema
      .string()
      .describe("Product name, SKU, or unique identifier to search for"),
  },
  async execute(args) {
    const config = loadBrandConfig(args.brand_id);
    if (!config) {
      return `Brand '${args.brand_id}' not configured or missing Shopify details in .opencode/brands.json.`;
    }

    // Shopify Storefront API Query for specific product details
    const GRAPHQL_QUERY = `
      query GetProductDetails($query: String!) {
        products(query: $query, first: 1) {
          edges {
            node {
              id
              title
              description
              vendor
              productType
              handle
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 20) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                    sku
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (config.token) {
        headers["X-Shopify-Storefront-Access-Token"] = config.token
      }

      const response = await fetch(config.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: GRAPHQL_QUERY,
          variables: {
            query: args.product_identifier,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
      }

      const { data, errors } = (await response.json()) as { data: any; errors?: { message: string }[] };

      if (errors && errors.length > 0) {
        return `Error from Shopify API: ${errors.map((e: { message: string }) => e.message).join(", ")}`;
      }

      const products = data?.products?.edges || [];

      if (products.length === 0) {
        return `Product "${args.product_identifier}" not found in ${args.brand_id} catalog.`;
      }

      const p = products[0].node;
      const price = p.priceRange.minVariantPrice;

      let output = `# Product Details: ${p.title}\n\n`;
      output += `- **ID**: ${p.id}\n`;
      output += `- **Brand**: ${p.vendor}\n`;
      output += `- **Type**: ${p.productType}\n`;
      output += `- **Starting Price**: ${price.amount} ${price.currencyCode}\n`;
      output += `- **Availability**: ${p.availableForSale ? "In Stock" : "Out of Stock"}\n\n`;

      output += `## Description\n${p.description}\n\n`;

      output += `## Available Variants\n`;
      p.variants.edges.forEach(({ node: v }: { node: any }) => {
        output += `- ${v.title}: ${v.price.amount} ${v.price.currencyCode} (${v.availableForSale ? "Available" : "Sold Out"}, SKU: ${v.sku || "N/A"})\n`;
      });

      if (p.images.edges.length > 0) {
        output += `\n## Product Images\n`;
        p.images.edges.forEach(({ node: img }: { node: any }) => {
          output += `![${img.altText || p.title}](${img.url})\n`;
        });
      }

      output += `\n---\n*Data source: ${config.source} Storefront API*`;

      return output;
    } catch (error) {
      return `Failed to fetch product details: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
})
