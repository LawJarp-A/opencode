/**
 * Intent Classification for User Queries
 * Pattern-based matching to understand what the user is asking about
 */

export interface UserIntent {
    type: 'inventory' | 'pricing' | 'marketing' | 'competitor' | 'performance' | 'general'
    subtype?: string
    entities: {
        products?: string[]
        marketplaces?: string[]
        dateRange?: { start: Date, end: Date }
        metrics?: string[]
        platforms?: string[]
    }
    urgency: 'high' | 'medium' | 'low'
    complexity: 'simple' | 'moderate' | 'complex'
    confidence: number // 0-1
}

export class IntentClassifier {
    /**
     * Classify user prompt into structured intent
     */
    static classify(prompt: string): UserIntent {
        const lower = prompt.toLowerCase()

        // Inventory patterns
        if (this.matchesPattern(lower, [
            'stock', 'inventory', 'restock', 'running out',
            'low stock', 'stock out', 'replenish', 'out of stock',
            'stockout', 'inventory level', 'supply'
        ])) {
            return {
                type: 'inventory',
                entities: this.extractEntities(prompt),
                urgency: this.detectUrgency(lower),
                complexity: 'simple',
                confidence: 0.9
            }
        }

        // Marketing/Advertising patterns
        if (this.matchesPattern(lower, [
            'ad', 'ads', 'advertising', 'marketing', 'roas', 'campaign',
            'instagram', 'meta', 'google', 'sponsored', 'facebook',
            'promotion', 'spend', 'cpc', 'ctr', 'conversion'
        ])) {
            return {
                type: 'marketing',
                subtype: this.detectPlatform(lower),
                entities: this.extractEntities(prompt),
                urgency: 'medium',
                complexity: 'moderate',
                confidence: 0.85
            }
        }

        // Pricing patterns
        if (this.matchesPattern(lower, [
            'price', 'pricing', 'margin', 'discount',
            'competition', 'competitor', 'undercut', 'cost',
            'profit', 'revenue', 'drop price', 'increase price'
        ])) {
            return {
                type: 'pricing',
                entities: this.extractEntities(prompt),
                urgency: 'medium',
                complexity: 'moderate',
                confidence: 0.8
            }
        }

        // Competitor patterns
        if (this.matchesPattern(lower, [
            'competitor', 'competition', 'market share',
            'beating', 'undercutting', 'rival'
        ])) {
            return {
                type: 'competitor',
                entities: this.extractEntities(prompt),
                urgency: 'medium',
                complexity: 'moderate',
                confidence: 0.75
            }
        }

        // Performance/Analytics patterns
        if (this.matchesPattern(lower, [
            'performance', 'sales', 'revenue', 'growth',
            'trend', 'analytics', 'bestseller', 'top product',
            'how did', 'how are', 'why', 'what happened'
        ])) {
            return {
                type: 'performance',
                entities: this.extractEntities(prompt),
                urgency: 'low',
                complexity: 'simple',
                confidence: 0.7
            }
        }

        // Default: general query
        return {
            type: 'general',
            entities: this.extractEntities(prompt),
            urgency: 'low',
            complexity: 'simple',
            confidence: 0.5
        }
    }

    /**
     * Check if prompt matches any pattern
     */
    private static matchesPattern(text: string, patterns: string[]): boolean {
        return patterns.some(pattern => text.includes(pattern))
    }

    /**
     * Detect urgency from language
     */
    private static detectUrgency(text: string): 'high' | 'medium' | 'low' {
        if (this.matchesPattern(text, ['urgent', 'critical', 'asap', 'immediately', 'emergency', 'crisis'])) {
            return 'high'
        }
        if (this.matchesPattern(text, ['soon', 'quickly', 'fast', 'important'])) {
            return 'medium'
        }
        return 'low'
    }

    /**
     * Detect advertising platform
     */
    private static detectPlatform(text: string): string | undefined {
        if (text.includes('instagram') || text.includes('insta') || text.includes('ig')) return 'instagram'
        if (text.includes('meta') || text.includes('facebook') || text.includes('fb')) return 'meta'
        if (text.includes('google') || text.includes('search')) return 'google'
        if (text.includes('amazon') && (text.includes('ad') || text.includes('sponsor'))) return 'amazon'
        return undefined
    }

    /**
     * Extract entities from prompt
     */
    private static extractEntities(prompt: string): UserIntent['entities'] {
        const entities: UserIntent['entities'] = {}
        const lower = prompt.toLowerCase()

        // Extract marketplaces
        const marketplaces: string[] = []
        if (lower.includes('amazon')) marketplaces.push('amazon')
        if (lower.includes('flipkart')) marketplaces.push('flipkart')
        if (lower.includes('shopify') || lower.includes('d2c') || lower.includes('website')) marketplaces.push('shopify')
        if (lower.includes('myntra')) marketplaces.push('myntra')
        if (marketplaces.length > 0) entities.marketplaces = marketplaces

        // Extract platforms
        const platforms: string[] = []
        if (lower.includes('instagram') || lower.includes('ig')) platforms.push('meta')
        if (lower.includes('google')) platforms.push('google')
        if (lower.includes('meta') || lower.includes('facebook')) platforms.push('meta')
        if (platforms.length > 0) entities.platforms = platforms

        // Extract time references
        const dateRange = this.extractDateRange(lower)
        if (dateRange) entities.dateRange = dateRange

        // Extract metrics
        const metrics: string[] = []
        if (lower.includes('roas')) metrics.push('roas')
        if (lower.includes('revenue')) metrics.push('revenue')
        if (lower.includes('margin')) metrics.push('margin')
        if (lower.includes('profit')) metrics.push('profit')
        if (metrics.length > 0) entities.metrics = metrics

        return entities
    }

    /**
     * Extract date range from text
     */
    private static extractDateRange(text: string): { start: Date, end: Date } | undefined {
        const now = new Date()

        // Last X days
        const lastDaysMatch = text.match(/last (\d+) days?/)
        if (lastDaysMatch) {
            const days = parseInt(lastDaysMatch[1])
            return {
                end: now,
                start: new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
            }
        }

        // This week
        if (text.includes('this week') || text.includes('week')) {
            return {
                end: now,
                start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            }
        }

        // This month
        if (text.includes('this month') || text.includes('month')) {
            return {
                end: now,
                start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            }
        }

        return undefined
    }
}
