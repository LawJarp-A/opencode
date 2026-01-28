export interface BusinessHealthCardProps {
    score: number
    status: string
    summary: string
}

export function BusinessHealthCard(props: BusinessHealthCardProps) {
    const scoreColor = () => {
        if (props.score >= 80) return "bg-surface-success-subtle text-icon-success-base"
        if (props.score >= 60) return "bg-surface-warning-subtle text-icon-warning-base"
        return "bg-surface-critical-subtle text-icon-critical-base"
    }

    const statusColor = () => {
        if (props.score >= 80) return "text-icon-success-base"
        if (props.score >= 60) return "text-icon-warning-base"
        return "text-icon-critical-base"
    }

    return (
        <div class="bg-white rounded-lg border border-border-weak-base p-6 mb-6">
            <div class="flex items-center gap-4 mb-4">
                <div class={`size-16 rounded-full flex items-center justify-center ${scoreColor()}`}>
                    <span class="text-24-semibold">{props.score}</span>
                </div>
                <div>
                    <div class="text-16-semibold text-text-strong">Business Health</div>
                    <div class={`text-14-regular ${statusColor()}`}>{props.status}</div>
                </div>
            </div>

            <div class="text-14-regular text-text-base leading-relaxed">
                {props.summary}
            </div>
        </div>
    )
}
