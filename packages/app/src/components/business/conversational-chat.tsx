import { createSignal, For, Show, onMount, createEffect, onCleanup } from "solid-js"
import { Icon } from "@opencode-ai/ui/icon"
import { Button } from "@opencode-ai/ui/button"
import { SuggestedQuery } from "./suggested-query"
import { useGlobalSync } from "@/context/global-sync"
import { SDKProvider, useSDK } from "@/context/sdk"
import { LocalProvider, useLocal } from "@/context/local"
import { SessionMcpIndicator } from "@/components/session-mcp-indicator"
import { SyncProvider } from "@/context/sync"
import { ModelSelectorPopover } from "@/components/dialog-select-model"
import { DialogSelectProvider } from "@/components/dialog-select-provider"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { ProviderIcon } from "@opencode-ai/ui/provider-icon"
import type { IconName } from "@opencode-ai/ui/icons/provider"

const INITIAL_SUGGESTED_QUERIES = [
    "What were my sales this week?",
    "Show me my top selling products",
    "What products are low on inventory?",
    "How many orders did I get today?",
]

interface ConversationMessage {
    id: string
    type: "user" | "assistant"
    content: string
    timestamp: Date
    isStreaming?: boolean
}

export interface ConversationalChatProps {
    onChatStart?: () => void
    onChatEnd?: () => void
}

function ConversationalChatContent(props: ConversationalChatProps) {
    const [query, setQuery] = createSignal("")
    const [conversation, setConversation] = createSignal<ConversationMessage[]>([])
    const [isProcessing, setIsProcessing] = createSignal(false)
    const [currentSessionId, setCurrentSessionId] = createSignal<string | null>(null)

    const sdk = useSDK()
    const globalSync = useGlobalSync()
    const local = useLocal()
    const dialog = useDialog()

    // Get the directory-specific store
    const directory = () => sdk.directory
    const [store, setStore] = globalSync.child(directory())

    // Notify parent when chat becomes active
    createEffect(() => {
        const hasConversation = conversation().length > 0
        if (hasConversation) {
            props.onChatStart?.()
        } else {
            props.onChatEnd?.()
        }
    })

    // Subscribe to events for real-time updates using sdk.event
    createEffect(() => {
        const sessionId = currentSessionId()
        if (!sessionId) return

        console.log("Subscribing to events for session:", sessionId)

        // sdk.event emits events specifically for this directory
        const unsubMessage = sdk.event.on("message.updated", (event) => {
            const info = event.properties.info
            if (info.sessionID !== sessionId) return

            console.log("[Message Updated]", info)

            // For assistant messages, wait for parts to be available
            if (info.role === "assistant") {
                const messageId = info.id

                // Check if we already have this message
                const existingIndex = conversation().findIndex((m) => m.id === messageId)
                if (existingIndex === -1) {
                    console.log("[Message Updated] Adding new assistant message placeholder", messageId)
                    // Add placeholder
                    setConversation((prev) => [
                        ...prev,
                        {
                            id: messageId,
                            type: "assistant" as const,
                            content: "",
                            timestamp: new Date(info.time.created),
                            isStreaming: true,
                        },
                    ])
                }

                setIsProcessing(false)

                setIsProcessing(false)
            }
        })

        const unsubPart = sdk.event.on("message.part.updated", (event) => {
            const part = event.properties.part
            const messageId = part.messageID

            // Only handle text parts
            if (part.type !== "text") return

            // Check if this message is in our conversation
            const message = conversation().find((m) => m.id === messageId)
            if (!message) return

            // Get all text parts for this message
            const parts = store.part[messageId] || []
            const textParts = parts.filter((p: any) => p.type === "text")
            const content = textParts.map((p: any) => p.text || "").join("\n")

            setConversation((prev) =>
                prev.map((m) =>
                    m.id === messageId ? { ...m, content, isStreaming: true } : m
                )
            )
        })

        const unsubStatus = sdk.event.on("session.status", (event) => {
            if (event.properties.sessionID !== sessionId) return

            console.log("[Session Status]", event.properties.status)

            if (event.properties.status.type === "idle") {
                // Mark all streaming messages as complete
                setConversation((prev) =>
                    prev.map((m) => ({ ...m, isStreaming: false }))
                )
                setIsProcessing(false)
            }
        })

        onCleanup(() => {
            unsubMessage()
            unsubPart()
            unsubStatus()
        })
    })

    // Initialize - use the current active session
    onMount(async () => {
        try {
            console.log("[Init] Using current active session")

            // Get the current active session from the store
            const sessions = store.session || []
            if (sessions.length > 0) {
                // Use the most recently updated session
                const sortedSessions = sessions.sort((a, b) => b.time.updated - a.time.updated)
                const activeSession = sortedSessions[0]

                console.log("[Init] Using session:", activeSession.id, activeSession.title)
                setCurrentSessionId(activeSession.id)
                await loadExistingMessages(activeSession.id)
            } else {
                // Create a new session if none exist
                console.log("[Init] No sessions found, creating new one")
                const response = await sdk.client.session.create({
                    directory: directory(),
                    title: "Business Chat",
                })
                if (response.data) {
                    console.log("[Init] Created session:", response.data.id)
                    setCurrentSessionId(response.data.id)
                }
            }
        } catch (error) {
            console.error("[Init] Failed to initialize session:", error)
        }
    })

    const loadExistingMessages = async (sessionId: string) => {
        try {
            console.log("[Load] Loading messages for session:", sessionId)

            const response = await sdk.client.session.messages({
                sessionID: sessionId,
                limit: 50,
            })

            const messages = response.data || []
            const conversationMessages: ConversationMessage[] = []

            for (const msg of messages) {
                if (!msg.info) continue

                const parts = msg.parts.filter((p) => p.type === "text")
                const content = parts.map((p: any) => p.text || "").join("\n")

                conversationMessages.push({
                    id: msg.info.id,
                    type: msg.info.role === "user" ? "user" : "assistant",
                    content,
                    timestamp: new Date(msg.info.time.created),
                })
            }

            console.log("[Load] Loaded", conversationMessages.length, "messages")

            setConversation(conversationMessages.sort((a, b) =>
                a.timestamp.getTime() - b.timestamp.getTime()
            ))
        } catch (error) {
            console.error("[Load] Failed to load existing messages:", error)
        }
    }

    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        const userQuery = query().trim()
        if (!userQuery || !currentSessionId()) return

        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        console.log("[Submit] Sending query:", userQuery)

        const currentModel = local.model.current()
        if (!currentModel) {
            const errorMessage: ConversationMessage = {
                id: `error_${Date.now()}`,
                type: "assistant",
                content: `❌ Error: No model selected. Please select a model to continue.`,
                timestamp: new Date(),
            }
            setConversation([...conversation(), errorMessage])
            return
        }

        // Add user message
        const userMessage: ConversationMessage = {
            id: messageId,
            type: "user",
            content: userQuery,
            timestamp: new Date(),
        }
        setConversation([...conversation(), userMessage])
        setQuery("")
        setIsProcessing(true)

        try {
            console.log("[Submit] Using provider:", currentModel.provider?.id, "model:", currentModel.id)

            // Log available agents to help with debugging MCP issues
            const availableAgents = store.agent || []
            console.log("[Submit] Available agents:", availableAgents.map(a => a.name))

            // Prioritize 'business-owner' agent which serves as the specialist for business tools
            // Fallback to 'general' or 'build'
            const businessAgent = availableAgents.find(a => a.name === "business-owner")
            const generalAgent = availableAgents.find(a => a.name === "general")
            const buildAgent = availableAgents.find(a => a.name === "build")
            const agent = businessAgent?.name || generalAgent?.name || buildAgent?.name || (availableAgents.length > 0 ? availableAgents[0].name : "general")

            console.log("[Submit] Selected agent:", agent)

            const model = {
                providerID: currentModel.provider.id,
                modelID: currentModel.id,
            }

            // Create the text part
            // Append a hint to force tool awareness for smaller models
            const toolHint = `\n\n(IMPORTANT: You have access to tools including: search_all_stores, query_sales, query_inventory, hydrogen-storefront_search_shop_catalog. Use them to answer questions with real data.)`
            const textPart = {
                id: `part_${Date.now()}`,
                type: "text" as const,
                text: userQuery + toolHint,
            }

            console.log("[Submit] Calling session.prompt with:", { sessionId: currentSessionId(), agent, model, messageId })

            await sdk.client.session.prompt({
                sessionID: currentSessionId()!,
                agent,
                model,
                messageID: messageId,
                parts: [textPart],
            })

            console.log("[Submit] Prompt sent successfully")

            // Safety timeout: if no response starts within 30 seconds, reset processing
            setTimeout(() => {
                setIsProcessing((processing) => {
                    if (processing) {
                        console.warn("[Submit] Timeout waiting for response")
                        return false
                    }
                    return false
                })
            }, 30000)

        } catch (error) {
            console.error("[Submit] Failed to send message:", error)

            // Extract error message
            let errorMsg = "Unknown error"
            if (error instanceof Error) {
                errorMsg = error.message
            } else if (typeof error === "object" && error !== null) {
                errorMsg = JSON.stringify(error)
            }

            const errorMessage: ConversationMessage = {
                id: `error_${Date.now()}`,
                type: "assistant",
                content: `❌ Error: ${errorMsg}\n\nPlease check the console for more details.`,
                timestamp: new Date(),
            }
            setConversation([...conversation(), errorMessage])
            setIsProcessing(false)
        }
    }

    const handleSuggestedQuery = (text: string) => {
        setQuery(text)
    }

    return (
        <div class="bg-white rounded-lg border border-border-weak-base p-6 mb-6 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-16-semibold text-text-strong">Ask me anything</h2>

                <div class="flex items-center gap-2">
                    {/* MCP Indicator */}
                    <span class="text-xs text-red-500">[MCP]</span>
                    <SessionMcpIndicator />

                    {/* Model Selector - TUI Style */}
                    <div class="relative">
                        <ModelSelectorPopover>
                            <Button as="div" variant="ghost" size="small" class="text-12-regular text-text-weak flex items-center gap-2 cursor-pointer">
                                <Show when={local.model.current()?.provider?.id}>
                                    <ProviderIcon id={local.model.current()!.provider.id as IconName} class="size-4 shrink-0" />
                                </Show>
                                {local.model.current()?.name ?? "Select model"}
                                <Icon name="chevron-down" size="small" />
                            </Button>
                        </ModelSelectorPopover>
                    </div>

                    {/* Connect Provider Button */}
                    <Button
                        variant="ghost"
                        size="small"
                        class="text-12-regular text-accent-base flex items-center gap-1"
                        onClick={() => dialog.show(() => <DialogSelectProvider />)}
                    >
                        <Icon name="plus" size="small" />
                        Connect Provider
                    </Button>
                </div>
            </div>

            {/* Conversation History */}
            <Show when={conversation().length > 0}>
                <div
                    class="mb-4 space-y-4 overflow-y-auto transition-all duration-300"
                    classList={{
                        "max-h-[400px]": conversation().length <= 3,
                        "max-h-[600px]": conversation().length > 3,
                    }}
                >
                    <For each={conversation()}>
                        {(message) => (
                            <div
                                classList={{
                                    "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300": true,
                                    "justify-end": message.type === "user",
                                }}
                            >
                                <Show when={message.type === "assistant"}>
                                    <div class="size-8 rounded-full bg-accent-base text-white flex items-center justify-center shrink-0">
                                        <Icon name="brain" size="small" />
                                    </div>
                                </Show>

                                <div
                                    classList={{
                                        "flex-1 max-w-2xl transition-all duration-200": true,
                                        "bg-surface-raised-base rounded-lg p-4": message.type === "user",
                                    }}
                                >
                                    <div class="text-14-regular text-text-strong whitespace-pre-wrap break-words">{message.content || (message.isStreaming ? "..." : "")}</div>
                                    <Show when={message.isStreaming}>
                                        <div class="mt-2 flex items-center gap-2 text-12-regular text-text-weak">
                                            <div class="size-1 rounded-full bg-accent-base animate-pulse" />
                                            <span>Streaming...</span>
                                        </div>
                                    </Show>
                                </div>

                                <Show when={message.type === "user"}>
                                    <div class="size-8 rounded-full bg-surface-raised-base flex items-center justify-center shrink-0">
                                        <Icon name="bubble-5" size="small" />
                                    </div>
                                </Show>
                            </div>
                        )}
                    </For>

                    {/* Processing indicator */}
                    <Show when={isProcessing()}>
                        <div class="flex gap-3 animate-in fade-in duration-300">
                            <div class="size-8 rounded-full bg-accent-base text-white flex items-center justify-center shrink-0">
                                <Icon name="brain" size="small" />
                            </div>
                            <div class="flex items-center gap-2 text-13-regular text-text-weak">
                                <span>Thinking</span>
                                <div class="flex gap-1">
                                    <div class="size-1.5 rounded-full bg-text-weak animate-pulse" />
                                    <div class="size-1.5 rounded-full bg-text-weak animate-pulse" style={{ "animation-delay": "100ms" }} />
                                    <div class="size-1.5 rounded-full bg-text-weak animate-pulse" style={{ "animation-delay": "200ms" }} />
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>
            </Show>

            {/* Suggested Questions */}
            <div class="flex flex-wrap gap-2 mb-4">
                <For each={INITIAL_SUGGESTED_QUERIES}>
                    {(text) => <SuggestedQuery text={text} onClick={() => handleSuggestedQuery(text)} />}
                </For>
            </div>

            {/* Chat Input - Responsive */}
            <form onSubmit={handleSubmit} class="relative">
                <textarea
                    value={query()}
                    onInput={(e) => setQuery(e.currentTarget.value)}
                    placeholder="Ask anything about your business..."
                    disabled={isProcessing() || !currentSessionId()}
                    rows={1}
                    class="w-full px-4 py-3 pr-12 rounded-lg border border-border-weak-base focus:border-accent-base focus:outline-none text-14-regular disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-hidden transition-all duration-200"
                    style={{
                        "min-height": "48px",
                        "max-height": "200px",
                    }}
                    onKeyDown={(e) => {
                        // Auto-resize textarea
                        const target = e.currentTarget
                        target.style.height = "48px"
                        target.style.height = `${Math.min(target.scrollHeight, 200)}px`

                        // Submit on Enter (without Shift)
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e)
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={!query().trim() || isProcessing() || !currentSessionId()}
                    class="absolute right-2 bottom-2 size-8 rounded-full bg-accent-base text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    <Icon name="arrow-up" size="small" />
                </button>
            </form>

            {/* Clear conversation */}
            <Show when={conversation().length > 0}>
                <div class="mt-3 flex justify-end">
                    <Button variant="ghost" size="small" onClick={() => setConversation([])}>
                        Clear conversation
                    </Button>
                </div>
            </Show>
        </div>
    )
}

export function ConversationalChat(props: ConversationalChatProps) {
    const globalSync = useGlobalSync()
    const directory = () => globalSync.data.path.worktree || globalSync.data.path.home

    // DEBUG LOG
    console.log("[ConversationalChat] Directory:", directory())

    return (
        <SDKProvider directory={directory()}>
            <SyncProvider>
                <LocalProvider>
                    <ConversationalChatContent {...props} />
                </LocalProvider>
            </SyncProvider>
        </SDKProvider>
    )
}
