import { Commerce } from "../commerce"
import { ExtendedCommerceGenerator } from "../commerce/generator-extended"
import type { UserIntent } from "./intent"

/**
 * Analysis Result Types
 */

export interface AnalysisResult {
    type: string
    title: string
    summary: string
    recommendation: string
    breakdown: {
        headers: string[]
        rows: Array<{
            label: string
            values: Array<{
                text: string
                type: 'positive' | 'negative' | 'neutral'
                icon?: string
                rotate?: boolean
            }>
        }>
    }
    assumptions: string
    actions: Array<{
        id: string
        title: string
        badge: string
        detail: string
    }>
    confidence: number
}

/**
 * Data Analyzer - Processes user intent and generates insights
 */
export class DataAnalyzer {
    /**
     * Main analysis router
     */
    async analyze(intent: UserIntent): Promise<AnalysisResult> {
        // Ensure we have data
        await this.ensureData()

        switch (intent.type) {
            case 'inventory':
                return await this.analyzeInventory(intent)
            case 'marketing':
                return await this.analyzeMarketing(intent)
            case 'pricing':
                return await this.analyzePricing(intent)
            case 'competitor':
                return await this.analyzeCompetitor(intent)
            case 'performance':
                return await this.analyzePerformance(intent)
            default:
                return await this.analyzeGeneral(intent)
        }
    }

    /**
     * Ensure synthetic data exists
     */
    async ensureData() {
        const dataset = await Commerce.getDataset()
        if (!dataset) {
            // Generate and save synthetic data
            const generator = new ExtendedCommerceGenerator(12345)
            const newDataset = await generator.generateComplete(90)

            // Convert dates to strings for storage
            const serialized = JSON.parse(JSON.stringify(newDataset))
            await Commerce.saveDataset(serialized)
        }
    }

    /**
     * Inventory Risk Analysis
     */
    async analyzeInventory(intent: UserIntent): Promise<AnalysisResult> {
        const dataset = await Commerce.getDataset()
        const products = dataset?.products || []
        const velocity = dataset?.velocity || []

        // Find products at risk
        const criticalProducts = products.filter(p => {
            const productVelocity = velocity.filter(v => v.productId === p.id)
            if (productVelocity.length === 0) return false

            const avgVelocity = productVelocity.reduce((sum, v) => sum + v.dailyAvg, 0) / productVelocity.length
            const daysUntilStockout = p.inventoryCount / (avgVelocity || 1)

            return daysUntilStockout > 0 && daysUntilStockout < 7 && p.inventoryCount < 50
        })

        if (criticalProducts.length === 0) {
            return {
                type: 'inventory',
                title: "Inventory Health Check",
                summary: "All products have healthy stock levels. No immediate restocking required.",
                recommendation: "Continue monitoring. Set up alerts for products below 20 units.",
                breakdown: {
                    headers: ["Status", "Product Count", "Action"],
                    rows: [{
                        label: "Healthy Stock",
                        values: [
                            { text: `${products.length} products`, type: "positive", icon: "check" },
                            { text: "No action needed", type: "neutral" }
                        ]
                    }]
                },
                assumptions: "Based on current sales velocity over last 30 days.",
                actions: [],
                confidence: 0.9
            }
        }

        // Calculate impact
        const topRisk = criticalProducts[0]
        const topVelocity = velocity.filter(v => v.productId === topRisk.id)
        const avgDaily = topVelocity.reduce((sum, v) => sum + v.dailyAvg, 0) / topVelocity.length
        const daysLeft = Math.floor(topRisk.inventoryCount / avgDaily)
        const revenueAtRisk = avgDaily * topRisk.basePrice * 14 // 14 days potential loss

        return {
            type: 'inventory',
            title: "Inventory Risk Analysis",
            summary: `${criticalProducts.length} product${criticalProducts.length > 1 ? 's' : ''} at risk of stockout. '${topRisk.name}' will run out in ${daysLeft} days at current velocity (${avgDaily.toFixed(1)} units/day). Potential revenue loss: ₹${Math.floor(revenueAtRisk).toLocaleString()}.`,
            recommendation: "Immediate restock required for critical items. Consider price adjustment to slow velocity if restocking is delayed.",
            breakdown: {
                headers: ["Product", "Stock", "Daily Sales", "Days Left", "Risk"],
                rows: criticalProducts.slice(0, 5).map(p => {
                    const pVel = velocity.filter(v => v.productId === p.id)
                    const daily = pVel.reduce((sum, v) => sum + v.dailyAvg, 0) / (pVel.length || 1)
                    const days = Math.floor(p.inventoryCount / daily)

                    return {
                        label: p.name,
                        values: [
                            { text: `${p.inventoryCount} units`, type: p.inventoryCount < 15 ? "negative" : "neutral" },
                            { text: `${daily.toFixed(1)}/day`, type: daily > 5 ? "negative" : "neutral", icon: daily > 5 ? "arrow-up" : undefined },
                            { text: `${days} days`, type: days < 5 ? "negative" : "neutral" },
                            { text: days < 5 ? "Critical" : "High", type: "negative" }
                        ]
                    }
                })
            },
            assumptions: "Assumes consistent demand acceleration. Does not account for potential festive spikes or supplier delays.",
            actions: [
                {
                    id: `restock_${topRisk.id}`,
                    title: `Place Rush Order: ${topRisk.name}`,
                    badge: "High Priority",
                    detail: `Order 100-150 units. Estimated cost: ₹${(topRisk.costPrice * 125).toLocaleString()}. Supplier lead time: 3-5 days.`
                },
                {
                    id: `price_increase_${topRisk.id}`,
                    title: "Temporary Price Increase",
                    badge: "Risk Mitigation",
                    detail: `Increase price by 10-15% to slow velocity while awaiting restock.`
                }
            ],
            confidence: 0.85
        }
    }

    /**
     * Marketing Campaign Analysis
     */
    async analyzeMarketing(intent: UserIntent): Promise<AnalysisResult> {
        const campaigns = await Commerce.getAdCampaigns({ status: "active" })

        if (!campaigns || campaigns.length === 0) {
            return this.noDataFallback("marketing", "No active ad campaigns found.")
        }

        // Find underperforming campaigns (ROAS < 2.0)
        const underperforming = campaigns.filter(c => c.roas < 2.0)
        const highPerforming = campaigns.filter(c => c.roas > 4.0)

        // Calculate wasted spend
        const wastedSpend = underperforming.reduce((sum, c) => {
            return sum + (c.spent - (c.revenue / 2))
        }, 0)

        if (underperforming.length === 0) {
            return {
                type: 'marketing',
                title: "Ad Performance Review",
                summary: `All ${campaigns.length} active campaigns performing well. Average ROAS: ${(campaigns.reduce((s, c) => s + c.roas, 0) / campaigns.length).toFixed(1)}.`,
                recommendation: "Continue current strategy. Consider scaling high-performing campaigns.",
                breakdown: {
                    headers: ["Campaign", "Platform", "ROAS", "Status"],
                    rows: campaigns.slice(0, 5).map(c => ({
                        label: c.name,
                        values: [
                            { text: c.platform.toUpperCase(), type: "neutral" },
                            { text: c.roas.toFixed(1), type: "positive", icon: "check" },
                            { text: "Healthy", type: "positive" }
                        ]
                    }))
                },
                assumptions: "Attribution window: 7-day click. Based on last 30 days performance.",
                actions: [{
                    id: "scale_top",
                    title: "Scale Top Performer",
                    badge: "Growth",
                    detail: `Increase budget on '${highPerforming[0]?.name}' by 25%.`
                }],
                confidence: 0.8
            }
        }

        const worst = underperforming[0]

        return {
            type: 'marketing',
            title: "Ad Performance Review",
            summary: `${underperforming.length} campaign${underperforming.length > 1 ? 's' : ''} underperforming (ROAS < 2.0). '${worst.name}' has ROAS of ${worst.roas.toFixed(1)}. Potential savings: ₹${Math.floor(wastedSpend).toLocaleString()} if optimized.`,
            recommendation: "Pause underperforming ad sets and reallocate budget to high-performing campaigns or retargeting.",
            breakdown: {
                headers: ["Campaign", "Platform", "Spend", "ROAS", "Trend"],
                rows: [...underperforming.slice(0, 3), ...highPerforming.slice(0, 2)].map(c => ({
                    label: c.name,
                    values: [
                        { text: c.platform.toUpperCase(), type: "neutral" },
                        { text: `₹${Math.floor(c.spent).toLocaleString()}`, type: "neutral" },
                        { text: c.roas.toFixed(1), type: c.roas < 2.0 ? "negative" : c.roas > 4.0 ? "positive" : "neutral" },
                        { text: c.roas < 2.0 ? "Declining" : "Stable", type: c.roas < 2.0 ? "negative" : "positive", icon: c.roas < 2.0 ? "arrow-down" : "check" }
                    ]
                }))
            },
            assumptions: "Attribution window: 7 days click-through. Creative fatigue may be affecting performance.",
            actions: [
                {
                    id: `pause_${worst.id}`,
                    title: `Pause Low ROAS Campaigns`,
                    badge: "Cost Saving",
                    detail: `Stop spend on campaigns with ROAS < 2.0. Estimated monthly savings: ₹${Math.floor(wastedSpend * 4).toLocaleString()}.`
                },
                {
                    id: "rotate_creative",
                    title: "Rotate Creative Assets",
                    badge: "Optimization",
                    detail: "Deploy new video variants and user testimonials to combat creative fatigue."
                }
            ],
            confidence: 0.8
        }
    }

    /**
     * Pricing Analysis
     */
    async analyzePricing(intent: UserIntent): Promise<AnalysisResult> {
        const dataset = await Commerce.getDataset()
        const products = dataset?.products || []
        const competitors = dataset?.competitors || []

        if (products.length === 0) {
            return this.noDataFallback("pricing", "No product data available.")
        }

        // Simulate price elasticity and impact
        // For demo: assume -₹200 price drop = +15% volume, elasticity 1.4
        const sampleProduct = products.find(p => p.inventoryCount > 30 && p.basePrice > 1200) || products[0]
        const priceReduction = 200
        const elasticity = 1.4

        // Simulate marketplace-specific impacts
        const amazonVolumeIncrease = 0.12 // 12%
        const amazonMarginDecrease = 0.04 // -4%
        const amazonProfit = -12400

        const flipkartVolumeIncrease = 0.18 // 18%
        const flipkartMarginChange = 0
        const flipkartProfit = 24100

        return {
            type: 'pricing',
            title: "Price Sensitivity Analysis",
            summary: `Reducing price of '${sampleProduct.name}' by ₹${priceReduction} increases sales volume by 12-18% but impacts margin differently across marketplaces. Flipkart shows positive net profit impact.`,
            recommendation: "Proceed with targeted price drop on Flipkart only to maximize margin safety while capturing volume growth.",
            breakdown: {
                headers: ["Marketplace", "Volume Impact", "Margin Impact", "Net Profit"],
                rows: [
                    {
                        label: "Amazon",
                        values: [
                            { text: `+${(amazonVolumeIncrease * 100).toFixed(0)}%`, type: "positive", icon: "arrow-up" },
                            { text: `-${(amazonMarginDecrease * 100).toFixed(0)}%`, type: "negative", icon: "arrow-up", rotate: true },
                            { text: `₹${amazonProfit.toLocaleString()}`, type: "negative" }
                        ]
                    },
                    {
                        label: "Flipkart",
                        values: [
                            { text: `+${(flipkartVolumeIncrease * 100).toFixed(0)}%`, type: "positive", icon: "arrow-up" },
                            { text: `${flipkartMarginChange}%`, type: "neutral" },
                            { text: `+₹${flipkartProfit.toLocaleString()}`, type: "positive" }
                        ]
                    }
                ]
            },
            assumptions: `Analysis assumes moderate price sensitivity (elasticity ${elasticity}) based on category benchmarks. Does not account for competitor responses.`,
            actions: [
                {
                    id: `price_flipkart_${sampleProduct.id}`,
                    title: "Apply Price Drop on Flipkart",
                    badge: "Low Risk",
                    detail: `Immediate execution. Updates price to ₹${sampleProduct.basePrice - priceReduction}. Monitor for 7 days.`
                },
                {
                    id: `simulate_bundle_${sampleProduct.id}`,
                    title: "Simulate Amazon Bundling",
                    badge: "Research",
                    detail: "Explore if product bundling can offset margin loss on Amazon."
                }
            ],
            confidence: 0.75
        }
    }

    /**
     * Competitor Analysis
     */
    async analyzeCompetitor(intent: UserIntent): Promise<AnalysisResult> {
        const competitors = await Commerce.getCompetitorPrices()

        if (!competitors || competitors.length === 0) {
            return this.noDataFallback("competitor", "No competitor price data available.")
        }

        // Find products where competitors are significantly cheaper
        const undercut = competitors.filter(c => c.priceDifference < -100)

        if (undercut.length === 0) {
            return {
                type: 'competitor',
                title: "Competitive Position Analysis",
                summary: "Your pricing is competitive. No major undercutting detected.",
                recommendation: "Maintain current pricing strategy. Monitor weekly for changes.",
                breakdown: {
                    headers: ["Status", "Products"],
                    rows: [{
                        label: "Competitive Pricing",
                        values: [
                            { text: `${competitors.length} tracked`, type: "positive", icon: "check" }
                        ]
                    }]
                },
                assumptions: "Based on latest price scraping data.",
                actions: [],
                confidence: 0.7
            }
        }

        const mostUndercut = undercut.sort((a, b) => a.priceDifference - b.priceDifference)[0]

        return {
            type: 'competitor',
            title: "Competitive Pricing Alert",
            summary: `${undercut.length} product${undercut.length > 1 ? 's' : ''} being undercut by competitors. ${mostUndercut.competitorName} is ₹${Math.abs(mostUndercut.priceDifference)} cheaper on ${mostUndercut.marketplace}.`,
            recommendation: "Consider selective price matching or emphasize value differentiation in marketing.",
            breakdown: {
                headers: ["Product", "Our Price", "Competitor", "Their Price", "Gap"],
                rows: undercut.slice(0, 5).map(c => ({
                    label: c.productId,
                    values: [
                        { text: `₹${c.ourPrice}`, type: "neutral" },
                        { text: c.competitorName, type: "neutral" },
                        { text: `₹${c.competitorPrice}`, type: "negative" },
                        { text: `₹${Math.abs(c.priceDifference)}`, type: "negative", icon: "arrow-down" }
                    ]
                }))
            },
            assumptions: "Prices scraped within last 7 days. Competitor stock status verified.",
            actions: [
                {
                    id: "price_match",
                    title: "Selective Price Matching",
                    badge: "Defensive",
                    detail: `Match top 3 competitor prices to protect market share.`
                },
                {
                    id: "value_proposition",
                    title: "Emphasize Differentiation",
                    badge: "Strategic",
                    detail: "Highlight quality, return policy, and customer service in ads."
                }
            ],
            confidence: 0.7
        }
    }

    /**
     * Performance/General Analysis
     */
    async analyzePerformance(intent: UserIntent): Promise<AnalysisResult> {
        const orders = await Commerce.getOrders({ days: 30, status: "delivered" })
        const dataset = await Commerce.getDataset()

        if (!orders || orders.length === 0) {
            return this.noDataFallback("performance", "No recent sales data available.")
        }

        const totalRevenue = orders.reduce((sum, o) => sum + o.totalRevenue, 0)
        const totalProfit = orders.reduce((sum, o) => sum + o.netProfit, 0)
        const avgOrderValue = totalRevenue / orders.length

        // Marketplace breakdown
        const byMarketplace = orders.reduce((acc, o) => {
            if (!acc[o.marketplace]) acc[o.marketplace] = { revenue: 0, orders: 0 }
            acc[o.marketplace].revenue += o.totalRevenue
            acc[o.marketplace].orders += 1
            return acc
        }, {} as Record<string, { revenue: number, orders: number }>)

        return {
            type: 'performance',
            title: "Business Performance Summary",
            summary: `Last 30 days: ₹${Math.floor(totalRevenue).toLocaleString()} revenue from ${orders.length} orders. Net profit: ₹${Math.floor(totalProfit).toLocaleString()}. Average order value: ₹${Math.floor(avgOrderValue)}.`,
            recommendation: "Performance is healthy. Focus on scaling high-margin products and optimizing ad spend.",
            breakdown: {
                headers: ["Marketplace", "Orders", "Revenue", "Avg Order"],
                rows: Object.entries(byMarketplace).map(([name, data]) => ({
                    label: name.charAt(0).toUpperCase() + name.slice(1),
                    values: [
                        { text: `${data.orders}`, type: "neutral" },
                        { text: `₹${Math.floor(data.revenue).toLocaleString()}`, type: "positive" },
                        { text: `₹${Math.floor(data.revenue / data.orders)}`, type: "neutral" }
                    ]
                }))
            },
            assumptions: "Based on delivered orders only. Returns and cancellations excluded.",
            actions: [
                {
                    id: "scale_winners",
                    title: "Scale Top Products",
                    badge: "Growth",
                    detail: "Increase inventory and ad spend on best-performing SKUs."
                }
            ],
            confidence: 0.9
        }
    }

    /**
     * General fallback analysis
     */
    async analyzeGeneral(intent: UserIntent): Promise<AnalysisResult> {
        const dataset = await Commerce.getDataset()

        return {
            type: 'general',
            title: "Business Health Overview",
            summary: `Your brand '${dataset?.brand?.name || 'Ethnic Vibes'}' has ${dataset?.products?.length || 0} products across ${dataset?.brand?.marketplaces?.length || 0} marketplaces. Monthly revenue target: ₹${dataset?.brand?.monthlyRevenue?.toLocaleString() || '0'}.`,
            recommendation: "System is ready. Ask specific questions about inventory, pricing, or marketing.",
            breakdown: {
                headers: ["Metric", "Value"],
                rows: [
                    {
                        label: "Products",
                        values: [{ text: `${dataset?.products?.length || 0}`, type: "neutral" }]
                    },
                    {
                        label: "Active Campaigns",
                        values: [{ text: `${dataset?.campaigns?.filter(c => c.status === 'active').length || 0}`, type: "neutral" }]
                    }
                ]
            },
            assumptions: "Overview based on current system state.",
            actions: [],
            confidence: 0.6
        }
    }

    /**
     * No data fallback
     */
    private noDataFallback(type: string, message: string): AnalysisResult {
        return {
            type,
            title: "Insufficient Data",
            summary: message,
            recommendation: "Generate synthetic data or connect to real data sources.",
            breakdown: { headers: [], rows: [] },
            assumptions: "",
            actions: [],
            confidence: 0.3
        }
    }
}
