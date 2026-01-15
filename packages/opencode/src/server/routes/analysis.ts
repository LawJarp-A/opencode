import { Hono } from "hono"
import { cors } from "hono/cors"
import { IntentClassifier } from "../../analysis/intent"
import { DataAnalyzer } from "../../analysis/analyzer"
import { Commerce } from "../../commerce"

const app = new Hono()

// CORS is handled by the main server instance

/**
 * POST /api/analysis/session
 * Main analysis endpoint
 */
app.post("/session", async (c) => {
    try {
        const body = await c.req.json()
        const { prompt, sessionId } = body

        if (!prompt) {
            return c.json({ error: "Prompt is required" }, 400)
        }

        // 1. Classify intent
        const intent = IntentClassifier.classify(prompt)

        // 2. Analyze
        const analyzer = new DataAnalyzer()
        const result = await analyzer.analyze(intent)

        // 3. Return response
        return c.json({
            sessionId: sessionId || "new",
            prompt,
            intent: {
                type: intent.type,
                confidence: intent.confidence,
                urgency: intent.urgency
            },
            analysis: {
                type: result.type,
                title: result.title,
                summary: result.summary,
                recommendation: result.recommendation,
                breakdown: result.breakdown,
                assumptions: result.assumptions,
                actions: result.actions
            },
            metadata: {
                generatedAt: new Date().toISOString(),
                confidence: result.confidence,
                dataSource: "synthetic"
            }
        })
    } catch (error) {
        console.error("Analysis error:", error)
        return c.json({
            error: "Analysis failed",
            message: error instanceof Error ? error.message : "Unknown error"
        }, 500)
    }
})

/**
 * GET /api/analysis/dashboard
 * Dashboard summary and metrics
 */
app.get("/dashboard", async (c) => {
    try {
        const analyzer = new DataAnalyzer()
        await analyzer.ensureData()

        const dataset = await Commerce.getDataset()

        // Return placeholder if still no data
        if (!dataset) {
            return c.json({
                weeklySummary: "System Initializing...",
                insights: "Waiting for first analysis run.",
                trend: "neutral",
                attention: [],
                decisions: []
            })
        }

        const orders = dataset.orders || []
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // Calculate weekly metrics
        const recentOrders = orders.filter((o: any) => new Date(o.orderDate) > oneWeekAgo)
        const weeklyRevenue = recentOrders.reduce((sum: number, o: any) => sum + o.totalRevenue, 0)

        // Determine trend (mock logic for now or compare to previous week)
        const trend = weeklyRevenue > 50000 ? "positive" : "neutral"

        // Generate critical attention items
        const products = dataset.products || []
        const lowStock = products.filter((p: any) => p.inventoryCount < 10).slice(0, 3)
        const attention = lowStock.map((p: any) => ({
            title: `Low Stock: ${p.name}`,
            impact: `${p.inventoryCount} units remaining. Stockout risk high.`,
            action: "Restock",
            urgency: "high"
        }))

        // Generate decisions
        const campaigns = dataset.campaigns || []
        const poorAds = campaigns.filter((c: any) => c.status === 'active' && c.roas < 2.0).slice(0, 2)
        const decisions = poorAds.map((c: any) => ({
            question: `Pause '${c.name}' campaign?`,
            impact: `ROAS is ${c.roas.toFixed(1)}. Saving budget could improve net margin.`
        }))

        // Add pricing decision if any
        decisions.push({
            question: "Review festive pricing strategy?",
            impact: "Competitor prices dropped by 5% avg this week."
        })

        return c.json({
            weeklySummary: `You made ₹${(weeklyRevenue / 100000).toFixed(2)}L this week.`,
            insights: `${recentOrders.length} new orders. Amazon volume is trending up.`,
            trend,
            attention,
            decisions
        })

    } catch (error) {
        console.error("Dashboard error:", error)
        return c.json({ error: "Failed to load dashboard" }, 500)
    }
})

/**
 * GET /api/analysis/health
 * Health check endpoint
 */
app.get("/health", (c) => {
    return c.json({
        status: "healthy",
        service: "analysis-engine",
        timestamp: new Date().toISOString()
    })
})

export const AnalysisRoute = app
