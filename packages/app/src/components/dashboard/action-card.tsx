import { Icon, type IconProps } from "@opencode-ai/ui/icon"

interface ActionCardProps {
    title: string
    icon: IconProps["name"]
    onClick?: () => void
}

export function ActionCard(props: ActionCardProps) {
    return (
        <button
            type="button"
            onClick={props.onClick}
            class="group flex items-center gap-4 w-full p-4 md:p-5 bg-[var(--button-secondary-base)] border border-[var(--border-base)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised-base)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--border-focus)]"
        >
            <div class="text-[var(--icon-weak-base)] group-hover:text-[var(--icon-primary)] transition-colors shrink-0 p-2 rounded-lg bg-[var(--surface-base)] group-hover:bg-[var(--surface-raised-strong)]">
                <Icon name={props.icon} size="normal" />
            </div>
            <span class="text-[var(--text-base)] font-medium text-[15px] leading-snug font-sans group-hover:text-[var(--text-strong)] transition-colors">
                {props.title}
            </span>
        </button>
    )
}
