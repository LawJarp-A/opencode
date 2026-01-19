import type { ParsedQuery } from "./query-parser"

export interface QueryResponse {
    answer: string
    visualization?: {
        type: "line" | "bar" | "pie" | "metric"
        data: any
    }
    context?: string
    recommendations?: string[]
    followUpQueries?: string[]
}

// Mock data for responses (will be replaced with real data later)
const mockData = {
    revenue: {
        thisWeek: 12450,
        lastWeek: 10826,
        growth: 15,
    },
    orders: {
        today: 342,
        yesterday: 316,
        growth: 8,
    },
    roas: {
        current: 3.2,
        target: 3.0,
        trend: "up",
    },
    conversion: {
        current: 2.8,
        lastWeek: 3.1,
        change: -0.3,
    },
}

export function generateResponse(parsedQuery: ParsedQuery): QueryResponse {
    const { category, entities } = parsedQuery

    switch (category) {
        case "performance":
            return generatePerformanceResponse(entities)
        case "comparison":
            return generateComparisonResponse(entities)
        case "planning":
            return generatePlanningResponse()
        case "explanation":
            return generateExplanationResponse(entities)
        case "recommendation":
            return generateRecommendationResponse(entities)
        case "campaign":
            return generateCampaignResponse()
        default:
            return generateDefaultResponse(parsedQuery.originalQuery)
    }
}

function generatePerformanceResponse(entities: ParsedQuery["entities"]): QueryResponse {
    const metric = entities.metric || "revenue"
    const timeframe = entities.timeframe || "this week"

    if (metric === "revenue") {
        return {
            answer: `Your revenue is $${mockData.revenue.thisWeek.toLocaleString()} ${timeframe}.`,
            visualization: {
                type: "metric",
                data: {
                    value: `$${mockData.revenue.thisWeek.toLocaleString()}`,
                    trend: "up",
                    change: `+${mockData.revenue.growth}%`,
                },
            },
            context: `This is ${mockData.revenue.growth}% higher than last week ($${mockData.revenue.lastWeek.toLocaleString()}). This is your best week in Q1 so far.`,
            recommendations: [
                "Increase ad spend on spring products while momentum is high",
                "Consider launching a retargeting campaign for cart abandoners",
            ],
            followUpQueries: [
                "Which products are driving this growth?",
                "How does this compare to last year?",
                "What's my profit margin this week?",
            ],
        }
    }

    if (metric === "orders") {
        return {
            answer: `You have ${mockData.orders.today} orders today.`,
            visualization: {
                type: "metric",
                data: {
                    value: mockData.orders.today,
                    trend: "up",
                    change: `+${mockData.orders.growth}%`,
                },
            },
            context: `This is ${mockData.orders.growth}% higher than yesterday (${mockData.orders.yesterday} orders).`,
            followUpQueries: ["What's my average order value?", "Which products are selling best?"],
        }
    }

    if (metric === "roas") {
        return {
            answer: `Your ROAS is ${mockData.roas.current}x.`,
            visualization: {
                type: "metric",
                data: {
                    value: `${mockData.roas.current}x`,
                    trend: mockData.roas.trend,
                    change: "Above target",
                },
            },
            context: `This is above your target of ${mockData.roas.target}x and above the industry benchmark of 2.5x.`,
            recommendations: ["Consider increasing budget on high-performing campaigns"],
            followUpQueries: ["Which ad campaigns are performing best?", "How can I improve ROAS further?"],
        }
    }

    return {
        answer: `Your ${metric} performance for ${timeframe} is looking good.`,
        followUpQueries: ["Show me more details", "Compare to last period"],
    }
}

function generateComparisonResponse(entities: ParsedQuery["entities"]): QueryResponse {
    return {
        answer: "Your sales are up 15% compared to last week.",
        visualization: {
            type: "bar",
            data: {
                labels: ["Last Week", "This Week"],
                values: [mockData.revenue.lastWeek, mockData.revenue.thisWeek],
            },
        },
        context: `Last week: $${mockData.revenue.lastWeek.toLocaleString()}. This week: $${mockData.revenue.thisWeek.toLocaleString()}. The growth is driven by your spring collection launch.`,
        followUpQueries: ["What's driving this growth?", "How does this compare to last year?"],
    }
}

function generatePlanningResponse(): QueryResponse {
    return {
        answer: "Based on your current performance, here are your top 3 priorities:",
        recommendations: [
            "Reorder inventory for your best-selling product (85% stocked, risk of $2,300 in lost sales)",
            "Apply your winning Facebook creative to Google Ads (potential 15% ROAS improvement)",
            "Launch a retargeting campaign for the 2,300 cart abandoners from last week",
        ],
        context: "These priorities are ranked by potential business impact and urgency.",
        followUpQueries: ["Create a campaign for cart abandoners", "Show me inventory status"],
    }
}

function generateExplanationResponse(entities: ParsedQuery["entities"]): QueryResponse {
    const metric = entities.metric || "conversion rate"

    if (metric === "conversion") {
        return {
            answer: "Your conversion rate dropped 0.3% this week.",
            context:
                "The drop is concentrated in mobile traffic (down 12%). This typically indicates a mobile usability issue. Desktop conversion remained stable at 3.2%.",
            recommendations: [
                "Review your mobile checkout flow for friction points",
                "Test a simplified mobile checkout process",
                "Check page load times on mobile devices",
            ],
            followUpQueries: [
                "How can I improve mobile conversion?",
                "Show me mobile vs desktop performance",
            ],
        }
    }

    return {
        answer: `Let me explain the changes in your ${metric}.`,
        context: "I'll need to analyze your data to provide specific insights.",
        followUpQueries: ["Show me the data", "What should I do about it?"],
    }
}

function generateRecommendationResponse(entities: ParsedQuery["entities"]): QueryResponse {
    const metric = entities.metric || "performance"

    return {
        answer: `Here are my recommendations to improve your ${metric}:`,
        recommendations: [
            "Increase ad spend on your best-performing campaigns (currently 3.2x ROAS)",
            "Launch a retargeting campaign for cart abandoners (estimated 4.5x ROAS)",
            "Test new creative variations based on your winning ads",
        ],
        context: "These recommendations are based on your historical performance and current market conditions.",
        followUpQueries: ["Create a retargeting campaign", "Show me my best-performing ads"],
    }
}

function generateCampaignResponse(): QueryResponse {
    return {
        answer: "I can help you create a campaign! Let me ask a few questions:",
        recommendations: [
            "What's your goal? (increase sales, generate leads, promote a product)",
            "What's your budget?",
            "Which channels? (Facebook, Instagram, Google, email)",
            "When do you want to launch?",
        ],
        context: "I'll create a comprehensive campaign plan based on your answers.",
        followUpQueries: ["I want to increase sales for my spring collection"],
    }
}

function generateDefaultResponse(query: string): QueryResponse {
    return {
        answer: "I'm not sure I understood that question. Could you rephrase it?",
        context: "I can help you with questions about sales, revenue, campaigns, and business performance.",
        followUpQueries: [
            "How are my sales this week?",
            "What should I focus on?",
            "Create a campaign",
        ],
    }
}
