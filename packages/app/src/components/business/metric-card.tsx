import { Icon } from "@opencode-ai/ui/icon"
import type { IconName } from "@opencode-ai/ui/icon"

export interface MetricCardProps {
    label: string
    value: string
    trend: "up" | "down" | "stable"
    comparison: string
    onClick?: () => void
}

export function MetricCard(props: MetricCardProps) {
    const trendIcon = (): IconName => {
        switch (props.trend) {
            case "up":
                return "arrow-up"
            case "down":
                return "arrow-down"
            default:
                return "minus"
        }
    }

    const trendColor = () => {
        switch (props.trend) {
            case "up":
                return "text-icon-success-base"
            case "down":
                return "text-icon-critical-base"
            default:
                return "text-icon-weak"
        }
    }

    return (
        <button
            type="button"
            onClick={props.onClick}
            class="bg-white rounded-lg border border-border-weak-base p-4 hover:border-border-base transition-colors text-left w-full"
        >
            <div class="text-12-regular text-text-weak mb-1">{props.label}</div>
            <div class="flex items-baseline gap-2 mb-2">
                <span class="text-20-semibold text-text-strong">{props.value}</span>
                <Icon name={trendIcon()} size="small" class={trendColor()} />
            </div>
            <div class="text-12-regular text-text-weak">{props.comparison}</div>
        </button>
    )
}
