import { For, Show, createMemo } from "solid-js"
import { AssistantMessage, Part as PartType, TextPart } from "@opencode-ai/sdk/v2/client"
import { useData } from "../context"
import { Message } from "./message-part"
import { Icon } from "./icon"
import { Spinner } from "./spinner"
import { InlineAgentActivity } from "./inline-agent-activity"
import type { AgentFlowNode } from "./agent-flow-graph"
import "./agent-dialogue.tsx.css"

interface AgentDialogueProps {
    messages: AssistantMessage[]
    working?: boolean
    agentNodes?: AgentFlowNode[]
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
    // Debug logging
    console.log('AgentDialogue render:', {
        agentNodes: props.agentNodes,
        agentNodesLength: props.agentNodes?.length,
        messagesLength: props.messages.length,
        working: props.working
    })

    return (
        <div data-component="agent-dialogue" class={props.classes?.root}>
            {/* Agent Thinking - Collapsible, auto-collapses after completion */}
            <Show when={props.agentNodes || props.working}>
                <InlineAgentActivity nodes={props.agentNodes ?? []} working={props.working}>
                    {/* Agent Messages (Reasoning/Logs) - Now INSIDE collapsible section */}
                    <Show when={props.messages.length > 0}>
                        <div data-slot="agent-dialogue-content">
                            <For each={props.messages}>
                                {(message) => (
                                    <AssistantMessageItem
                                        message={message}
                                        hideReasoning={false}
                                    />
                                )}
                            </For>
                        </div>
                    </Show>
                </InlineAgentActivity>
            </Show>

            {/* Fallback: If no agent nodes (e.g. legacy/simple), just show messages */}
            <Show when={!props.agentNodes && props.messages.length > 0}>
                <div data-slot="agent-dialogue-content">
                    <For each={props.messages}>
                        {(message) => (
                            <AssistantMessageItem
                                message={message}
                                hideReasoning={false}
                            />
                        )}
                    </For>
                </div>
            </Show>
        </div>
    )
}
