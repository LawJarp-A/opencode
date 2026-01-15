import { z } from "zod"

/**
 * Comprehensive E-Commerce Data Schemas
 * For synthetic data generation and analysis
 */

// ============================================================================
// PRODUCT & CATALOG
// ============================================================================

export const ProductCategory = z.enum([
    "ethnic_wear",
    "casual_wear",
    "formal_wear",
    "accessories",
    "seasonal"
])
export type ProductCategory = z.infer<typeof ProductCategory>

export const ProductExtended = z.object({
    id: z.string(),
    sku: z.string(),
    name: z.string(),
    category: ProductCategory,
    subcategory: z.string(),
    brand: z.string(),
    basePrice: z.number(),
    costPrice: z.number(),
    inventoryCount: z.number(),
    inventoryThreshold: z.number().default(15),
    attributes: z.object({
        color: z.array(z.string()).optional(),
        size: z.array(z.string()).optional(),
        material: z.string().optional(),
        season: z.string().optional()
    }).optional(),
    weight: z.number().default(0.5),
    dimensions: z.object({
        length: z.number(),
        width: z.number(),
        height: z.number()
    }).optional(),
    createdAt: z.date(),
    updatedAt: z.date()
})
export type ProductExtended = z.infer<typeof ProductExtended>

// ============================================================================
// MARKETPLACE LISTINGS
// ============================================================================

export const MarketplaceType = z.enum([
    "amazon",
    "flipkart",
    "shopify",
    "myntra",
    "meesho"
])
export type MarketplaceType = z.infer<typeof MarketplaceType>

export const FulfillmentType = z.enum(["FBA", "FBF", "self"])
export type FulfillmentType = z.infer<typeof FulfillmentType>

export const ListingStatus = z.enum(["active", "paused", "out_of_stock"])
export type ListingStatus = z.infer<typeof ListingStatus>

export const MarketplaceListing = z.object({
    id: z.string(),
    productId: z.string(),
    marketplace: MarketplaceType,
    listingId: z.string(),
    price: z.number(),
    discount: z.number().default(0),
    status: ListingStatus,
    fulfillmentType: FulfillmentType,
    commission: z.number(),
    shippingCost: z.number(),
    lastUpdated: z.date()
})
export type MarketplaceListing = z.infer<typeof MarketplaceListing>

// ============================================================================
// ORDERS & SALES
// ============================================================================

export const OrderStatus = z.enum([
    "pending",
    "shipped",
    "delivered",
    "returned",
    "cancelled"
])
export type OrderStatus = z.infer<typeof OrderStatus>

export const Order = z.object({
    id: z.string(),
    orderId: z.string(),
    productId: z.string(),
    marketplace: MarketplaceType,
    orderDate: z.date(),
    quantity: z.number(),
    unitPrice: z.number(),
    discount: z.number().default(0),
    tax: z.number(),
    shippingCost: z.number(),
    totalRevenue: z.number(),
    totalCost: z.number(),
    netProfit: z.number(),
    status: OrderStatus,
    customerLocation: z.string(),
    paymentMethod: z.string()
})
export type Order = z.infer<typeof Order>

// ============================================================================
// ADVERTISING
// ============================================================================

export const AdPlatform = z.enum(["meta", "google", "amazon", "flipkart"])
export type AdPlatform = z.infer<typeof AdPlatform>

export const AdStatus = z.enum(["active", "paused", "completed"])
export type AdStatus = z.infer<typeof AdStatus>

export const AdType = z.enum(["carousel", "single_image", "video", "story", "reel"])
export type AdType = z.infer<typeof AdType>

export const AdCampaign = z.object({
    id: z.string(),
    platform: AdPlatform,
    campaignId: z.string(),
    name: z.string(),
    productIds: z.array(z.string()),
    startDate: z.date(),
    endDate: z.date().nullable(),
    budget: z.number(),
    spent: z.number(),
    impressions: z.number(),
    clicks: z.number(),
    conversions: z.number(),
    revenue: z.number(),
    ctr: z.number(), // Click-through rate
    cpc: z.number(), // Cost per click
    roas: z.number(), // Return on ad spend
    status: AdStatus,
    adType: AdType
})
export type AdCampaign = z.infer<typeof AdCampaign>

// ============================================================================
// INVENTORY MANAGEMENT
// ============================================================================

export const InventoryMovementType = z.enum([
    "purchase",
    "sale",
    "return",
    "damage",
    "adjustment"
])
export type InventoryMovementType = z.infer<typeof InventoryMovementType>

export const InventoryLog = z.object({
    id: z.string(),
    productId: z.string(),
    date: z.date(),
    type: InventoryMovementType,
    quantity: z.number(),
    remainingStock: z.number(),
    supplierId: z.string().optional(),
    orderId: z.string().optional(),
    cost: z.number().optional(),
    notes: z.string().optional()
})
export type InventoryLog = z.infer<typeof InventoryLog>

// ============================================================================
// COMPETITOR TRACKING
// ============================================================================

export const CompetitorPrice = z.object({
    id: z.string(),
    productId: z.string(),
    marketplace: MarketplaceType,
    competitorName: z.string(),
    competitorPrice: z.number(),
    ourPrice: z.number(),
    priceDifference: z.number(),
    scrapedAt: z.date(),
    inStock: z.boolean(),
    rating: z.number().min(0).max(5),
    reviewCount: z.number()
})
export type CompetitorPrice = z.infer<typeof CompetitorPrice>

// ============================================================================
// CUSTOMER ANALYTICS
// ============================================================================

export const CustomerSegment = z.object({
    segment: z.string(),
    count: z.number(),
    avgOrderValue: z.number(),
    repeatPurchaseRate: z.number(),
    topCategories: z.array(z.string()),
    preferredMarketplace: MarketplaceType,
    location: z.string()
})
export type CustomerSegment = z.infer<typeof CustomerSegment>

// ============================================================================
// SALES VELOCITY & TRENDS
// ============================================================================

export const SalesVelocity = z.object({
    productId: z.string(),
    marketplace: MarketplaceType,
    dailyAvg: z.number(),
    weeklyAvg: z.number(),
    monthlyAvg: z.number(),
    trend: z.enum(["increasing", "stable", "decreasing"]),
    seasonalityFactor: z.number(),
    lastCalculated: z.date()
})
export type SalesVelocity = z.infer<typeof SalesVelocity>

// ============================================================================
// BRAND PROFILE
// ============================================================================

export const BrandProfile = z.object({
    name: z.string(),
    category: z.enum(["fashion", "home", "electronics", "beauty"]),
    priceSegment: z.enum(["budget", "mid", "premium", "luxury"]),
    productCount: z.number(),
    marketplaces: z.array(MarketplaceType),
    monthlyRevenue: z.number(),
    establishedDate: z.date()
})
export type BrandProfile = z.infer<typeof BrandProfile>

// ============================================================================
// COMPREHENSIVE DATASET
// ============================================================================

export const CommerceDataset = z.object({
    timestamp: z.number(),
    brand: BrandProfile,
    products: z.array(ProductExtended),
    orders: z.array(Order),
    campaigns: z.array(AdCampaign),
    inventory: z.array(InventoryLog),
    competitors: z.array(CompetitorPrice),
    segments: z.array(CustomerSegment),
    velocity: z.array(SalesVelocity)
})
export type CommerceDataset = z.infer<typeof CommerceDataset>
