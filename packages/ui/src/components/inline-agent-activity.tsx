import { Component, createEffect, createSignal, For, Show, JSX, createMemo } from "solid-js"
import { Icon } from "./icon"
import { Spinner } from "./spinner"
import type { AgentFlowNode } from "./agent-flow-graph"
import "./inline-agent-activity.css"

export interface InlineAgentActivityProps {
    nodes: AgentFlowNode[]
    onToggle?: () => void
    class?: string
    children?: JSX.Element
    working?: boolean
}

// Status badge helper
function AgentStatusBadge(props: { nodes: AgentFlowNode[] }) {
    const stats = createMemo(() => {
        const total = props.nodes.length
        const running = props.nodes.filter(n => n.status === "running").length
        const completed = props.nodes.filter(n => n.status === "complete").length
        const failed = props.nodes.filter(n => n.status === "failed").length

        return { total, running, completed, failed }
    })

    const statusText = createMemo(() => {
        const s = stats()
        if (s.running > 0) return `${s.running} running`
        if (s.failed > 0) return `${s.failed} failed`
        if (s.completed > 0) return `${s.completed}/${s.total} complete`
        return `${s.total} agents`
    })

    const statusType = createMemo(() => {
        const s = stats()
        if (s.running > 0) return "running"
        if (s.failed > 0) return "failed"
        return "complete"
    })

    return (
        <div data-slot="status-badge" data-status={statusType()}>
            <Show when={statusType() === "running"}>
                <Spinner class="mr-1.5 size-3" />
            </Show>
            <Show when={statusType() === "failed"}>
                <Icon name="circle-x" size="small" class="mr-1.5 text-red-500" />
            </Show>
            <Show when={statusType() === "complete"}>
                <Icon name="check-small" size="small" class="mr-1.5 text-green-500" />
            </Show>
            <span>{statusText()}</span>
        </div>
    )
}

function CompactTimelineCard(props: { node: AgentFlowNode }) {
    const duration = createMemo(() => {
        if (!props.node.startTime) return null
        const end = props.node.endTime ?? Date.now()
        const ms = end - props.node.startTime
        if (ms < 1000) return `${ms}ms`
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
        return `${Math.floor(ms / 60000)}m`
    })

    return (
        <div
            data-component="compact-timeline-card"
            data-status={props.node.status}
        >
            <div data-slot="marker">
                <Show when={props.node.status === "running"}>
                    <Spinner />
                </Show>
                <Show when={props.node.status === "complete"}>
                    <Icon name="check" />
                </Show>
                <Show when={props.node.status === "failed"}>
                    <Icon name="close" />
                </Show>
                <Show when={props.node.status === "pending"}>
                    <Icon name="dot-grid" />
                </Show>
            </div>

            <div data-slot="content">
                <div data-slot="agent-name">@{props.node.agent}</div>
                <div data-slot="description">{props.node.currentAction || props.node.description}</div>
            </div>

            <Show when={duration()}>
                <div data-slot="duration">{duration()}</div>
            </Show>
        </div>
    )
}

export function InlineAgentActivity(props: InlineAgentActivityProps) {
    const [localExpanded, setLocalExpanded] = createSignal(false) // Start collapsed
    const [hasAutoCollapsed, setHasAutoCollapsed] = createSignal(false)

    // Auto-expand when agents start running or working, auto-collapse when done
    createEffect(() => {
        const nodes = props.nodes
        const hasRunning = nodes.some(n => n.status === "running")
        const isWorking = props.working

        // Active state: either explicit working prop or active agent nodes
        const isActive = isWorking || hasRunning

        // Completion state: Not working AND (no nodes OR all nodes complete/failed)
        const allNodesDone = nodes.length === 0 || nodes.every(n =>
            n.status === "complete" || n.status === "failed"
        )
        const isFinished = !isWorking && allNodesDone

        if (isActive && !localExpanded()) {
            // Auto-expand when starting
            setLocalExpanded(true)
            setHasAutoCollapsed(false)
        } else if (isFinished && localExpanded() && !hasAutoCollapsed()) {
            // Auto-collapse when result published (work finished)
            // Use a short delay to allow user to see "complete" state briefly? 
            // User said "minimise when thew result gets published". 
            // So immediate collapse or small delay seems appropriate.
            setTimeout(() => {
                if (!hasAutoCollapsed() && !props.working) {
                    setLocalExpanded(false)
                    setHasAutoCollapsed(true)
                }
            }, 1000)
        }
    })

    const handleToggle = () => {
        setLocalExpanded(!localExpanded())
        // Don't reset hasAutoCollapsed - let user manually control after auto-collapse
    }

    // Strict render: Only show if there are nodes OR children (text).
    const shouldRender = createMemo(() => props.nodes.length > 0 || !!props.children)

    const thinkingMode = () => props.nodes.length === 0

    return (
        <Show when={shouldRender()}>
            <div
                data-component="inline-agent-activity"
                data-expanded={localExpanded()}
                class={props.class}
            >
                <button data-slot="header" onClick={handleToggle}>
                    <Icon name={localExpanded() ? "chevron-down" : "chevron-right"} data-slot="chevron" />
                    <Icon name="brain" data-slot="brain-icon" />

                    <span data-slot="title" style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                        <Show when={thinkingMode() && props.working} fallback={
                            <span>{thinkingMode() ? "Thought Process" : "Agent Activity"}</span>
                        }>
                            <span style={{ display: "flex", "align-items": "center", gap: "6px", opacity: 0.8 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 2s linear infinite", opacity: "0.6" }}>
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="20 80" stroke-linecap="round" />
                                </svg>
                                <span>Thinking</span>
                                <span style={{ display: "inline-flex", gap: "1px" }}>
                                    <span style={{ animation: "pulse 1.8s ease-in-out infinite", opacity: "0.6" }}>.</span>
                                    <span style={{ animation: "pulse 1.8s ease-in-out 0.3s infinite", opacity: "0.6" }}>.</span>
                                    <span style={{ animation: "pulse 1.8s ease-in-out 0.6s infinite", opacity: "0.6" }}>.</span>
                                </span>
                            </span>
                        </Show>
                    </span>

                    <Show when={!thinkingMode()}>
                        <AgentStatusBadge nodes={props.nodes} />
                    </Show>
                </button>

                <Show when={localExpanded()}>
                    <Show when={!thinkingMode() || props.children}>
                        <div data-slot="content">
                            <Show when={!thinkingMode()}>
                                <div data-slot="timeline">
                                    <For each={props.nodes}>
                                        {(node) => (
                                            <div data-slot="timeline-item">
                                                <CompactTimelineCard node={node} />
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </Show>

                            {/* Render any children (logs, messages) inside the collapsible area */}
                            <Show when={props.children}>
                                <div
                                    data-slot="activity-details"
                                    style={!thinkingMode() ? { "margin-top": "1rem", "padding-top": "1rem", "border-top": "1px solid var(--border-subtle)" } : undefined}
                                >
                                    {props.children}
                                </div>
                            </Show>
                        </div>
                    </Show>
                </Show>
            </div>
        </Show>
    )
}
