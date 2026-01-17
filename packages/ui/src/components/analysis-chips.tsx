import { For } from "solid-js"
import { Icon } from "./icon"

export interface AnalysisChipsProps {
    chips: string[]
    onChipClick?: (chip: string) => void
    class?: string
}

export function AnalysisChips(props: AnalysisChipsProps) {
    return (
        <div class={`flex flex-wrap gap-2 ${props.class || ""}`}>
            <For each={props.chips}>
                {(chip) => (
                    <button
                        onClick={() => props.onChipClick?.(chip)}
                        class="
              inline-flex items-center gap-1.5 px-3 py-1.5 
              text-xs font-medium text-text-base 
              bg-surface-subtle border border-border-base rounded-full 
              hover:bg-surface-base hover:border-accent-blue/50 hover:text-accent-blue
              transition-colors cursor-pointer whitespace-nowrap
            "
                    >
                        <Icon name="branch" size="small" class="text-accent-blue" />
                        {chip}
                    </button>
                )}
            </For>
        </div>
    )
}
