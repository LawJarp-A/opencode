import { For, Show, createMemo } from "solid-js"
import { AssistantMessage, Part as PartType, TextPart } from "@opencode-ai/sdk/v2/client"
import { useData } from "../context"
import { Message } from "./message-part"
import { Icon } from "./icon"
import { Spinner } from "./spinner"
import "./agent-dialogue.tsx.css"

interface AgentDialogueProps {
    messages: AssistantMessage[]
    working?: boolean
    classes?: {
        root?: string
    }
}

function AssistantMessageItem(props: {
    message: AssistantMessage
    hideReasoning: boolean
}) {
    const data = useData()
    const emptyParts: PartType[] = []

    // We want to show everything in the log: tools, reasoning, etc.
    // But strictly "text" parts that are the *final response* might be redundant if shown elsewhere.
    // However, for the "Dialogue" box, we usually want to see the "thought process". 
    // Often "TextPart" in assistant message IS the thinking if it's not the final answer.
    // For now, let's just render all parts, but maybe allow filtering if needed.

    const msgParts = createMemo(() => data.store.part[props.message.id] ?? emptyParts)

    const filteredParts = createMemo(() => {
        let parts = msgParts()
        if (props.hideReasoning) {
            parts = parts.filter(p => p.type !== "reasoning")
        }
        return parts
    })

    return <Message message={props.message} parts={filteredParts()} />
}

export function AgentDialogue(props: AgentDialogueProps) {
    return (
        <div data-component="agent-dialogue" class={props.classes?.root}>
            <div data-slot="agent-dialogue-header">
                <div data-slot="agent-dialogue-title">
                    <Icon name="console" size="small" />
                    <span>Agent Activity</span>
                </div>
                <Show when={props.working}>
                    <Spinner />
                </Show>
            </div>
            <div data-slot="agent-dialogue-content">
                <For each={props.messages}>
                    {(msg) => (
                        <AssistantMessageItem
                            message={msg}
                            hideReasoning={false}
                        />
                    )}
                </For>
                <Show when={props.messages.length === 0 && props.working}>
                    <div class="text-text-muted italic flex items-center gap-2">
                        <span>Initializing agent environment...</span>
                    </div>
                </Show>
            </div>
        </div>
    )
}
