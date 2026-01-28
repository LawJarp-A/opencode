// Query categories based on business user flow document
export type QueryCategory =
    | "performance" // "How are my sales?"
    | "comparison" // "How does this week compare to last week?"
    | "planning" // "What should I focus on?"
    | "explanation" // "Why did my conversion rate drop?"
    | "recommendation" // "What should I do to improve ROAS?"
    | "campaign" // "Create a campaign for..."
    | "unknown"

export interface ParsedQuery {
    category: QueryCategory
    intent: string
    entities: {
        metric?: string // revenue, sales, ROAS, conversion, etc.
        timeframe?: string // this week, last month, Q4, etc.
        product?: string
        channel?: string // Facebook, Google, email, etc.
        comparison?: string // vs last week, compared to last month
    }
    originalQuery: string
}

// Simple pattern matching for query parsing
const QUERY_PATTERNS = {
    performance: [
        /how (are|is|am|was|were) (my|our|the)? ?(sales|revenue|orders|performance|business|roas|conversion)/i,
        /what('s| is) (my|our|the)? ?(sales|revenue|orders|performance|roas|conversion)/i,
        /show (me )?(my|our|the)? ?(sales|revenue|orders|performance)/i,
    ],
    comparison: [
        /how does .+ compare (to|with|against)/i,
        /compare .+ (to|with|vs)/i,
        /(vs|versus|compared to) (last|this|previous)/i,
        /difference between/i,
    ],
    planning: [
        /what should (i|we) (do|focus on|prioritize)/i,
        /where should (i|we) (invest|spend|focus)/i,
        /what (are|is) (my|our|the) (priorities|next steps)/i,
    ],
    explanation: [
        /why (did|is|are|was|were)/i,
        /what (caused|drove|is driving)/i,
        /explain (why|the)/i,
    ],
    recommendation: [
        /what should (i|we) do (to|about)/i,
        /how (can|do) (i|we) (improve|increase|decrease|optimize)/i,
        /recommend/i,
        /suggest/i,
    ],
    campaign: [
        /create (a )?campaign/i,
        /launch (a )?(campaign|promotion|sale)/i,
        /run (a )?(campaign|promotion|ad)/i,
        /start (a )?(campaign|marketing)/i,
    ],
}

const METRIC_PATTERNS = {
    revenue: /revenue|sales|income/i,
    orders: /orders|purchases|transactions/i,
    roas: /roas|return on ad spend/i,
    conversion: /conversion|convert/i,
    cac: /cac|customer acquisition cost|acquisition cost/i,
    aov: /aov|average order value|order value/i,
}

const TIMEFRAME_PATTERNS = {
    "this week": /this week|current week/i,
    "last week": /last week|previous week/i,
    "this month": /this month|current month/i,
    "last month": /last month|previous month/i,
    "today": /today|this day/i,
    "yesterday": /yesterday/i,
    "Q4": /q4|fourth quarter|4th quarter/i,
}

export function parseQuery(query: string): ParsedQuery {
    const lowerQuery = query.toLowerCase()

    // Determine category
    let category: QueryCategory = "unknown"
    for (const [cat, patterns] of Object.entries(QUERY_PATTERNS)) {
        if (patterns.some((pattern) => pattern.test(query))) {
            category = cat as QueryCategory
            break
        }
    }

    // Extract entities
    const entities: ParsedQuery["entities"] = {}

    // Extract metric
    for (const [metric, pattern] of Object.entries(METRIC_PATTERNS)) {
        if (pattern.test(query)) {
            entities.metric = metric
            break
        }
    }

    // Extract timeframe
    for (const [timeframe, pattern] of Object.entries(TIMEFRAME_PATTERNS)) {
        if (pattern.test(query)) {
            entities.timeframe = timeframe
            break
        }
    }

    // Extract comparison
    if (/vs|versus|compared to|compare/.test(lowerQuery)) {
        const comparisonMatch = query.match(/(vs|versus|compared to|compare.*) (last|this|previous) (\w+)/i)
        if (comparisonMatch) {
            entities.comparison = comparisonMatch[0]
        }
    }

    return {
        category,
        intent: generateIntent(category, entities),
        entities,
        originalQuery: query,
    }
}

function generateIntent(category: QueryCategory, entities: ParsedQuery["entities"]): string {
    const metric = entities.metric || "business"
    const timeframe = entities.timeframe || "current period"

    switch (category) {
        case "performance":
            return `Get ${metric} performance for ${timeframe}`
        case "comparison":
            return `Compare ${metric} ${entities.comparison || "across periods"}`
        case "planning":
            return `Provide strategic recommendations`
        case "explanation":
            return `Explain ${metric} changes`
        case "recommendation":
            return `Recommend actions to improve ${metric}`
        case "campaign":
            return `Create marketing campaign`
        default:
            return "General business query"
    }
}
