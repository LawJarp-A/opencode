import { Icon } from "@opencode-ai/ui/icon"
import { Button } from "@opencode-ai/ui/button"

export interface AlertCardProps {
    priority: "critical" | "important" | "info"
    title: string
    message: string
    impact?: string
    action?: string
    onAction?: () => void
    onDismiss?: () => void
}

export function AlertCard(props: AlertCardProps) {
    const priorityStyles = () => {
        switch (props.priority) {
            case "critical":
                return {
                    border: "border-icon-critical-base",
                    bg: "bg-surface-critical-subtle",
                    icon: "alert-circle" as const,
                    iconColor: "text-icon-critical-base",
                }
            case "important":
                return {
                    border: "border-icon-warning-base",
                    bg: "bg-surface-warning-subtle",
                    icon: "info" as const,
                    iconColor: "text-icon-warning-base",
                }
            default:
                return {
                    border: "border-icon-info-base",
                    bg: "bg-surface-info-subtle",
                    icon: "lightbulb" as const,
                    iconColor: "text-icon-info-base",
                }
        }
    }

    const styles = priorityStyles()

    return (
        <div
            class={`rounded-lg border ${styles.border} ${styles.bg} p-4`}
        >
            <div class="flex items-start gap-3">
                <Icon name={styles.icon} size="normal" class={`${styles.iconColor} shrink-0 mt-0.5`} />

                <div class="flex-1 min-w-0">
                    <div class="text-14-semibold text-text-strong mb-1">{props.title}</div>
                    <div class="text-13-regular text-text-base mb-2">{props.message}</div>

                    {props.impact && (
                        <div class="text-12-regular text-text-weak mb-3">
                            💡 {props.impact}
                        </div>
                    )}

                    {props.action && (
                        <div class="flex items-center gap-2">
                            <Button
                                size="small"
                                variant="primary"
                                onClick={props.onAction}
                            >
                                {props.action}
                            </Button>
                            {props.onDismiss && (
                                <Button
                                    size="small"
                                    variant="ghost"
                                    onClick={props.onDismiss}
                                >
                                    Dismiss
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
