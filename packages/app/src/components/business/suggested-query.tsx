import { Button } from "@opencode-ai/ui/button"

export interface SuggestedQueryProps {
    text: string
    onClick?: () => void
}

export function SuggestedQuery(props: SuggestedQueryProps) {
    return (
        <Button
            variant="ghost"
            size="small"
            onClick={props.onClick}
            class="text-12-regular"
        >
            {props.text}
        </Button>
    )
}
