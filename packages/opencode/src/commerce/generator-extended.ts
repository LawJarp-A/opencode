import type {
    ProductExtended,
    Order,
    AdCampaign,
    InventoryLog,
    CompetitorPrice,
    CustomerSegment,
    SalesVelocity,
    BrandProfile,
    CommerceDataset,
    MarketplaceType
} from "./schema"

/**
 * Extended Commerce Data Generator
 * Generates realistic synthetic e-commerce data with correlations and patterns
 */

// Seedable random number generator for deterministic output
class SeededRandom {
    private seed: number
    constructor(seed: number) {
        this.seed = seed
    }

    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280
        return this.seed / 233280
    }

    range(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1) + min)
    }

    float(min: number, max: number): number {
        return this.next() * (max - min) + min
    }

    choice<T>(array: T[]): T {
        return array[this.range(0, array.length - 1)]
    }

    boolean(probability: number = 0.5): boolean {
        return this.next() < probability
    }
}

export class ExtendedCommerceGenerator {
    private rng: SeededRandom
    private brand: BrandProfile

    constructor(seed: number = 12345, brand?: BrandProfile) {
        this.rng = new SeededRandom(seed)
        this.brand = brand || this.generateDefaultBrand()
    }

    private generateDefaultBrand(): BrandProfile {
        return {
            name: "Ethnic Vibes",
            category: "fashion",
            priceSegment: "mid",
            productCount: 45,
            marketplaces: ["amazon", "flipkart", "shopify", "myntra"],
            monthlyRevenue: 420000,
            establishedDate: new Date("2022-01-01")
        }
    }

    /**
     * Generate complete dataset
     */
    async generateComplete(days: number = 90): Promise<CommerceDataset> {
        // 1. Generate products
        const products = this.generateProducts(this.brand.productCount)

        // 2. Generate orders based on products
        const orders = this.generateOrders(products, days)

        // 3. Generate ad campaigns
        const campaigns = this.generateAdCampaigns(products, days)

        // 4. Generate inventory logs
        const inventory = this.generateInventoryLogs(products, orders, days)

        // 5. Generate competitor prices
        const competitors = this.generateCompetitorPrices(products)

        // 6. Generate customer segments
        const segments = this.generateCustomerSegments(orders)

        // 7. Calculate sales velocity
        const velocity = this.calculateSalesVelocity(products, orders)

        return {
            timestamp: Date.now(),
            brand: this.brand,
            products,
            orders,
            campaigns,
            inventory,
            competitors,
            segments,
            velocity
        }
    }

    /**
     * Generate 45 fashion products with realistic distribution
     */
    private generateProducts(count: number): ProductExtended[] {
        const products: ProductExtended[] = []
        const now = new Date()

        // Product templates for Indian fashion brand
        const templates = [
            // Kurtas (15 products)
            ...Array(15).fill(null).map((_, i) => ({
                category: "ethnic_wear" as const,
                subcategory: "kurta",
                material: this.rng.choice(["Cotton", "Linen", "Silk", "Khadi"]),
                priceRange: [899, 2999]
            })),
            // Shirts (10 products)
            ...Array(10).fill(null).map((_, i) => ({
                category: "casual_wear" as const,
                subcategory: "shirt",
                material: this.rng.choice(["Cotton", "Linen", "Poly-Cotton"]),
                priceRange: [799, 1999]
            })),
            // Bottoms (8 products)
            ...Array(8).fill(null).map((_, i) => ({
                category: i < 4 ? "formal_wear" as const : "casual_wear" as const,
                subcategory: this.rng.choice(["pants", "churidar", "pajama"]),
                material: this.rng.choice(["Cotton", "Polyester"]),
                priceRange: [699, 1799]
            })),
            // Accessories (7 products)
            ...Array(7).fill(null).map((_, i) => ({
                category: "accessories" as const,
                subcategory: this.rng.choice(["stole", "scarf", "bag"]),
                material: this.rng.choice(["Cotton", "Silk", "Canvas"]),
                priceRange: [299, 1299]
            })),
            // Seasonal (5 products)
            ...Array(5).fill(null).map((_, i) => ({
                category: "seasonal" as const,
                subcategory: "winter_wear",
                material: "Wool Blend",
                priceRange: [1999, 4999]
            }))
        ]

        const colors = ["Blue", "White", "Black", "Olive", "Beige", "Maroon", "Navy", "Grey"]
        const sizes = ["S", "M", "L", "XL", "XXL"]

        templates.forEach((template, i) => {
            const color = this.rng.choice(colors)
            const material = template.material
            const [minPrice, maxPrice] = template.priceRange
            const basePrice = this.rng.range(minPrice, maxPrice)
            const costPrice = Math.floor(basePrice * this.rng.float(0.4, 0.6)) // 40-60% of base price

            // Inventory distribution: 10% critical, 25% low, 50% healthy, 15% overstocked
            let inventoryCount: number
            const stockRoll = this.rng.next()
            if (stockRoll < 0.10) {
                inventoryCount = this.rng.range(3, 9) // Critical
            } else if (stockRoll < 0.35) {
                inventoryCount = this.rng.range(10, 29) // Low
            } else if (stockRoll < 0.85) {
                inventoryCount = this.rng.range(30, 100) // Healthy
            } else {
                inventoryCount = this.rng.range(101, 250) // Overstocked
            }

            products.push({
                id: `prod_${String(i + 1).padStart(3, "0")}`,
                sku: `EV-${template.subcategory.substring(0, 4).toUpperCase()}-${material.substring(0, 3).toUpperCase()}-${color.substring(0, 3).toUpperCase()}-${this.rng.choice(sizes)}`,
                name: `${color} ${material} ${template.subcategory.charAt(0).toUpperCase() + template.subcategory.slice(1)}`,
                category: template.category,
                subcategory: template.subcategory,
                brand: this.brand.name,
                basePrice,
                costPrice,
                inventoryCount,
                inventoryThreshold: 15,
                attributes: {
                    color: [color],
                    size: sizes,
                    material,
                    season: template.category === "seasonal" ? "winter" : undefined
                },
                weight: this.rng.float(0.3, 0.8),
                dimensions: {
                    length: this.rng.range(25, 40),
                    width: this.rng.range(20, 35),
                    height: this.rng.range(2, 5)
                },
                createdAt: new Date(now.getTime() - this.rng.range(30, 730) * 24 * 60 * 60 * 1000),
                updatedAt: now
            })
        })

        return products
    }

    /**
     * Generate orders with realistic patterns
     */
    private generateOrders(products: ProductExtended[], days: number): Order[] {
        const orders: Order[] = []
        const now = new Date()
        const marketplaces: MarketplaceType[] = ["amazon", "flipkart", "shopify", "myntra"]

        // Total orders: 850-1200 over period
        const totalOrders = this.rng.range(850, 1200)

        for (let i = 0; i < totalOrders; i++) {
            // Date distribution with seasonal patterns
            const daysAgo = this.generateSeasonalDate(days)
            const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

            // Marketplace distribution: Amazon 40%, Flipkart 30%, Shopify 20%, Myntra 10%
            const roll = this.rng.next()
            let marketplace: MarketplaceType
            if (roll < 0.40) marketplace = "amazon"
            else if (roll < 0.70) marketplace = "flipkart"
            else if (roll < 0.90) marketplace = "shopify"
            else marketplace = "myntra"

            const product = this.rng.choice(products)
            const quantity = this.rng.range(1, 3)
            const unitPrice = product.basePrice
            const discount = this.rng.range(0, 15) / 100 * unitPrice
            const tax = (unitPrice - discount) * 0.18 // GST
            const shippingCost = marketplace === "shopify" ? 80 : 0 // Free shipping on marketplaces
            const totalRevenue = quantity * (unitPrice - discount)
            const totalCost = quantity * product.costPrice
            const netProfit = totalRevenue - totalCost - tax - shippingCost

            // Order status distribution
            const statusRoll = this.rng.next()
            let status: Order["status"]
            if (daysAgo < 2) status = "pending"
            else if (daysAgo < 5) status = "shipped"
            else if (statusRoll < 0.85) status = "delivered"
            else if (statusRoll < 0.95) status = "returned"
            else status = "cancelled"

            orders.push({
                id: `ord_${String(i + 1).padStart(6, "0")}`,
                orderId: `${marketplace.toUpperCase()}-${Date.now()}-${i}`,
                productId: product.id,
                marketplace,
                orderDate,
                quantity,
                unitPrice,
                discount,
                tax,
                shippingCost,
                totalRevenue,
                totalCost,
                netProfit,
                status,
                customerLocation: this.rng.choice(["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai"]),
                paymentMethod: this.rng.choice(["UPI", "Card", "COD", "NetBanking"])
            })
        }

        return orders
    }

    /**
     * Generate ad campaigns
     */
    private generateAdCampaigns(products: ProductExtended[], days: number): AdCampaign[] {
        const campaigns: AdCampaign[] = []
        const now = new Date()
        const campaignCount = this.rng.range(5, 8)

        for (let i = 0; i < campaignCount; i++) {
            const platform = this.rng.choice(["meta", "google", "amazon"] as const)
            const daysRunning = this.rng.range(15, days)
            const startDate = new Date(now.getTime() - daysRunning * 24 * 60 * 60 * 1000)
            const isActive = this.rng.boolean(0.7)

            // Select 2-5 products for campaign
            const selectedProducts = this.rng.range(2, 5)
            const productIds = Array(selectedProducts).fill(null).map(() => this.rng.choice(products).id)

            const budget = this.rng.range(10000, 30000)
            const spent = Math.floor(budget * this.rng.float(0.6, 1.0))
            const impressions = this.rng.range(50000, 200000)
            const clicks = Math.floor(impressions * this.rng.float(0.01, 0.05)) // CTR 1-5%
            const conversions = Math.floor(clicks * this.rng.float(0.02, 0.10)) // CVR 2-10%
            const avgOrderValue = this.rng.range(1200, 2500)
            const revenue = conversions * avgOrderValue

            const ctr = clicks / impressions
            const cpc = spent / clicks
            const roas = revenue / spent

            // Determine performance tier
            const adType = this.rng.choice(["carousel", "single_image", "video", "story", "reel"] as const)

            campaigns.push({
                id: `camp_${platform}_${String(i + 1).padStart(2, "0")}`,
                platform,
                campaignId: `${platform.toUpperCase()}-CAMP-${Date.now()}-${i}`,
                name: this.generateCampaignName(platform, products[0].subcategory),
                productIds,
                startDate,
                endDate: isActive ? null : new Date(now.getTime() - this.rng.range(1, 5) * 24 * 60 * 60 * 1000),
                budget,
                spent,
                impressions,
                clicks,
                conversions,
                revenue,
                ctr,
                cpc,
                roas,
                status: isActive ? "active" : "completed",
                adType
            })
        }

        return campaigns
    }

    /**
     * Generate inventory logs
     */
    private generateInventoryLogs(products: ProductExtended[], orders: Order[], days: number): InventoryLog[] {
        const logs: InventoryLog[] = []
        let logId = 1

        products.forEach(product => {
            let currentStock = product.inventoryCount
            const now = new Date()

            // Initial purchase
            logs.push({
                id: `inv_${String(logId++).padStart(6, "0")}`,
                productId: product.id,
                date: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
                type: "purchase",
                quantity: currentStock + this.rng.range(50, 150),
                remainingStock: currentStock,
                supplierId: `SUP_${this.rng.range(1, 5)}`,
                cost: product.costPrice
            })

            // Sales from orders
            const productOrders = orders.filter(o => o.productId === product.id && o.status === "delivered")
            productOrders.forEach(order => {
                logs.push({
                    id: `inv_${String(logId++).padStart(6, "0")}`,
                    productId: product.id,
                    date: order.orderDate,
                    type: "sale",
                    quantity: -order.quantity,
                    remainingStock: currentStock,
                    orderId: order.id
                })
            })

            // Returns
            const returns = orders.filter(o => o.productId === product.id && o.status === "returned")
            returns.forEach(ret => {
                logs.push({
                    id: `inv_${String(logId++).padStart(6, "0")}`,
                    productId: product.id,
                    date: new Date(ret.orderDate.getTime() + 7 * 24 * 60 * 60 * 1000),
                    type: "return",
                    quantity: ret.quantity,
                    remainingStock: currentStock,
                    orderId: ret.id
                })
            })
        })

        return logs.sort((a, b) => a.date.getTime() - b.date.getTime())
    }

    /**
     * Generate competitor prices
     */
    private generateCompetitorPrices(products: ProductExtended[]): CompetitorPrice[] {
        const prices: CompetitorPrice[] = []
        const competitors = ["FabIndia", "Manyavar", "Biba", "W for Woman"]
        const now = new Date()

        // 30% of products have competitor tracking
        const trackedProducts = products.filter(() => this.rng.boolean(0.3))

        trackedProducts.forEach(product => {
            const competitorCount = this.rng.range(1, 3)
            for (let i = 0; i < competitorCount; i++) {
                const competitor = this.rng.choice(competitors)
                const ourPrice = product.basePrice
                const variation = this.rng.float(-0.20, 0.15) // Competitors can be -20% to +15%
                const competitorPrice = Math.floor(ourPrice * (1 + variation))
                const priceDifference = competitorPrice - ourPrice

                prices.push({
                    id: `comp_${product.id}_${competitor.replace(/\s+/g, "_")}`,
                    productId: product.id,
                    marketplace: this.rng.choice(["amazon", "flipkart"]),
                    competitorName: competitor,
                    competitorPrice,
                    ourPrice,
                    priceDifference,
                    scrapedAt: new Date(now.getTime() - this.rng.range(0, 7) * 24 * 60 * 60 * 1000),
                    inStock: this.rng.boolean(0.85),
                    rating: this.rng.float(3.5, 4.8),
                    reviewCount: this.rng.range(50, 5000)
                })
            }
        })

        return prices
    }

    /**
     * Generate customer segments
     */
    private generateCustomerSegments(orders: Order[]): CustomerSegment[] {
        const segments: CustomerSegment[] = [
            {
                segment: "High Value Repeat",
                count: 145,
                avgOrderValue: 2890,
                repeatPurchaseRate: 0.68,
                topCategories: ["ethnic_wear", "accessories"],
                preferredMarketplace: "shopify",
                location: "Mumbai"
            },
            {
                segment: "Festive Shoppers",
                count: 312,
                avgOrderValue: 1950,
                repeatPurchaseRate: 0.23,
                topCategories: ["ethnic_wear", "seasonal"],
                preferredMarketplace: "amazon",
                location: "Delhi"
            },
            {
                segment: "Casual Buyers",
                count: 187,
                avgOrderValue: 1350,
                repeatPurchaseRate: 0.41,
                topCategories: ["casual_wear", "accessories"],
                preferredMarketplace: "flipkart",
                location: "Bangalore"
            },
            {
                segment: "Price Sensitive",
                count: 256,
                avgOrderValue: 980,
                repeatPurchaseRate: 0.15,
                topCategories: ["casual_wear"],
                preferredMarketplace: "myntra",
                location: "Pune"
            }
        ]

        return segments
    }

    /**
     * Calculate sales velocity from orders
     */
    private calculateSalesVelocity(products: ProductExtended[], orders: Order[]): SalesVelocity[] {
        const velocity: SalesVelocity[] = []
        const now = new Date()
        const marketplaces: MarketplaceType[] = ["amazon", "flipkart", "shopify", "myntra"]

        products.forEach(product => {
            marketplaces.forEach(marketplace => {
                const productOrders = orders.filter(o =>
                    o.productId === product.id &&
                    o.marketplace === marketplace &&
                    o.status === "delivered"
                )

                if (productOrders.length === 0) return

                const totalQuantity = productOrders.reduce((sum, o) => sum + o.quantity, 0)
                const daySpan = 90
                const dailyAvg = totalQuantity / daySpan
                const weeklyAvg = dailyAvg * 7
                const monthlyAvg = dailyAvg * 30

                // Calculate trend
                const recentOrders = productOrders.filter(o =>
                    (now.getTime() - o.orderDate.getTime()) / (24 * 60 * 60 * 1000) < 30
                )
                const oldOrders = productOrders.filter(o =>
                    (now.getTime() - o.orderDate.getTime()) / (24 * 60 * 60 * 1000) >= 30
                )

                const recentAvg = recentOrders.length / 30
                const oldAvg = oldOrders.length / 60
                let trend: SalesVelocity["trend"] = "stable"
                if (recentAvg > oldAvg * 1.2) trend = "increasing"
                else if (recentAvg < oldAvg * 0.8) trend = "decreasing"

                velocity.push({
                    productId: product.id,
                    marketplace,
                    dailyAvg,
                    weeklyAvg,
                    monthlyAvg,
                    trend,
                    seasonalityFactor: 1.0,
                    lastCalculated: now
                })
            })
        })

        return velocity
    }

    /**
     * Helper: Generate seasonal date (more recent = festive spike)
     */
    private generateSeasonalDate(maxDays: number): number {
        const roll = this.rng.next()
        // Recent 30 days get 40% of orders (festive season)
        if (roll < 0.40) {
            return this.rng.range(0, 30)
        }
        // Rest distributed evenly
        return this.rng.range(31, maxDays)
    }

    /**
     * Helper: Generate campaign name
     */
    private generateCampaignName(platform: string, category: string): string {
        const themes = ["Summer Collection", "Festive Special", "New Arrivals", "Bestsellers", "Weekend Sale"]
        const formats = ["Reels", "Stories", "Carousel", "Video", "Static"]
        return `${this.rng.choice(themes)} - ${this.rng.choice(formats)}`
    }
}
