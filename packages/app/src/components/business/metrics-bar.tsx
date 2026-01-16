import { MetricCard, type MetricCardProps } from "./metric-card"

export interface MetricsBarProps {
    metrics: {
        revenue: MetricCardProps
        orders: MetricCardProps
        aov: MetricCardProps
        conversion: MetricCardProps
        cac: MetricCardProps
    }
}

export function MetricsBar(props: MetricsBarProps) {
    return (
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <MetricCard {...props.metrics.revenue} />
            <MetricCard {...props.metrics.orders} />
            <MetricCard {...props.metrics.aov} />
            <MetricCard {...props.metrics.conversion} />
            <MetricCard {...props.metrics.cac} />
        </div>
    )
}
