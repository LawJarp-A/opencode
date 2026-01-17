import { For } from "solid-js"
import { Icon } from "./icon"

export interface WorkflowAction {
    id: string
    label: string
    icon?: string
}

export interface WorkflowActionsProps {
    workflows: WorkflowAction[]
    onWorkflowClick?: (action: WorkflowAction) => void
    class?: string
}

export function WorkflowActions(props: WorkflowActionsProps) {
    return (
        <div class={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${props.class || ""}`}>
            <For each={props.workflows}>
                {(action) => (
                    <button
                        onClick={() => props.onWorkflowClick?.(action)}
                        class="
              flex items-center gap-3 p-3 text-left
              bg-surface-base border border-border-base rounded-lg
              hover:border-accent-blue hover:shadow-sm
              transition-all group
            "
                    >
                        <div class="
              flex items-center justify-center w-8 h-8 
              rounded-md bg-surface-subtle text-text-muted
              group-hover:bg-accent-blue/10 group-hover:text-accent-blue
              transition-colors
            ">
                            <Icon name="workflow" class="size-4" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-sm font-medium text-text-strong group-hover:text-accent-blue transition-colors">
                                {action.label}
                            </span>
                            <span class="text-xs text-text-muted">Trigger Workflow</span>
                        </div>
                        <Icon name="chevron-right" class="ml-auto size-4 text-text-muted group-hover:text-accent-blue" />
                    </button>
                )}
            </For>
        </div>
    )
}
