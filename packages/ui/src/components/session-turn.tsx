import {
  AssistantMessage,
  Message as MessageType,
  Part as PartType,
  type PermissionRequest,
  TextPart,
  ToolPart,
  UserMessage,
} from "@opencode-ai/sdk/v2/client"
import { useData } from "../context"
import { useDiffComponent } from "../context/diff"
import { getDirectory, getFilename } from "@opencode-ai/util/path"

import { Binary } from "@opencode-ai/util/binary"
import { createEffect, createMemo, createSignal, For, Match, on, onCleanup, ParentProps, Show, Switch } from "solid-js"
import { createResizeObserver } from "@solid-primitives/resize-observer"
import { DiffChanges } from "./diff-changes"
import { Typewriter } from "./typewriter"
import { Message, Part } from "./message-part"
import { Markdown } from "./markdown"
import { Accordion } from "./accordion"
import { AgentDialogue } from "./agent-dialogue"
import { ResultModal } from "./result-modal"
import { StickyAccordionHeader } from "./sticky-accordion-header"
import { FileIcon } from "./file-icon"
import { Icon } from "./icon"
import { ProviderIcon } from "./provider-icon"
import type { IconName } from "./provider-icons/types"
import { IconButton } from "./icon-button"
import { Tooltip } from "./tooltip"
import { Card } from "./card"
import { Dynamic } from "solid-js/web"
import { Button } from "./button"
import { Spinner } from "./spinner"
import { createStore } from "solid-js/store"
import { DateTime, DurationUnit, Interval } from "luxon"
import { createAutoScroll } from "../hooks"

function computeStatusFromPart(part: PartType | undefined): string | undefined {
  if (!part) return undefined

  if (part.type === "tool") {
    switch (part.tool) {
      case "task":
        return "Delegating work"
      case "todowrite":
      case "todoread":
        return "Planning next steps"
      case "read":
        return "Gathering context"
      case "list":
      case "grep":
      case "glob":
        return "Searching the codebase"
      case "webfetch":
        return "Searching the web"
      case "edit":
      case "write":
        return "Making edits"
      case "bash":
        return "Running commands"
      default:
        return undefined
    }
  }
  if (part.type === "reasoning") {
    const text = part.text ?? ""
    const match = text.trimStart().match(/^\*\*(.+?)\*\*/)
    if (match) return `Thinking · ${match[1].trim()}`
    return "Thinking"
  }
  if (part.type === "text") {
    return "Gathering thoughts"
  }
  return undefined
}

function same<T>(a: readonly T[], b: readonly T[]) {
  if (a === b) return true
  if (a.length !== b.length) return false
  return a.every((x, i) => x === b[i])
}



export function SessionTurn(
  props: ParentProps<{
    sessionID: string
    messageID: string
    lastUserMessageID?: string
    stepsExpanded?: boolean
    onStepsExpandedToggle?: () => void
    onUserInteracted?: () => void
    classes?: {
      root?: string
      content?: string
      container?: string
    }
  }>,
) {
  const data = useData()
  const diffComponent = useDiffComponent()

  const emptyMessages: MessageType[] = []
  const emptyParts: PartType[] = []
  const emptyAssistant: AssistantMessage[] = []
  const emptyPermissions: PermissionRequest[] = []
  const emptyPermissionParts: { part: ToolPart; message: AssistantMessage }[] = []
  const idle = { type: "idle" as const }

  const allMessages = createMemo(() => data.store.message[props.sessionID] ?? emptyMessages)

  const messageIndex = createMemo(() => {
    const messages = allMessages()
    const result = Binary.search(messages, props.messageID, (m) => m.id)
    if (!result.found) return -1

    const msg = messages[result.index]
    if (msg.role !== "user") return -1

    return result.index
  })

  const message = createMemo(() => {
    const index = messageIndex()
    if (index < 0) return undefined

    const msg = allMessages()[index]
    if (!msg || msg.role !== "user") return undefined

    return msg
  })

  const lastUserMessageID = createMemo(() => {
    if (props.lastUserMessageID) return props.lastUserMessageID

    const messages = allMessages()
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg?.role === "user") return msg.id
    }
    return undefined
  })

  const isLastUserMessage = createMemo(() => props.messageID === lastUserMessageID())

  const parts = createMemo(() => {
    const msg = message()
    if (!msg) return emptyParts
    return data.store.part[msg.id] ?? emptyParts
  })

  const assistantMessages = createMemo(
    () => {
      const msg = message()
      if (!msg) return emptyAssistant

      const messages = allMessages()
      const index = messageIndex()
      if (index < 0) return emptyAssistant

      const result: AssistantMessage[] = []
      for (let i = index + 1; i < messages.length; i++) {
        const item = messages[i]
        if (!item) continue
        if (item.role === "user") break
        if (item.role === "assistant" && item.parentID === msg.id) result.push(item as AssistantMessage)
      }
      return result
    },
    emptyAssistant,
    { equals: same },
  )

  const lastAssistantMessage = createMemo(() => assistantMessages().at(-1))

  const error = createMemo(() => assistantMessages().find((m) => m.error)?.error)

  const lastTextPart = createMemo(() => {
    const msgs = assistantMessages()
    for (let mi = msgs.length - 1; mi >= 0; mi--) {
      const msgParts = data.store.part[msgs[mi].id] ?? emptyParts
      for (let pi = msgParts.length - 1; pi >= 0; pi--) {
        const part = msgParts[pi]
        if (part?.type === "text") return part as TextPart
      }
    }
    return undefined
  })

  const hasSteps = createMemo(() => {
    for (const m of assistantMessages()) {
      const msgParts = data.store.part[m.id]
      if (!msgParts) continue
      for (const p of msgParts) {
        if (p?.type === "tool") return true
      }
    }
    return false
  })

  const permissions = createMemo(() => data.store.permission?.[props.sessionID] ?? emptyPermissions)
  const permissionCount = createMemo(() => permissions().length)
  const nextPermission = createMemo(() => permissions()[0])



  const shellModePart = createMemo(() => {
    const p = parts()
    if (!p.every((part) => part?.type === "text" && part?.synthetic)) return

    const msgs = assistantMessages()
    if (msgs.length !== 1) return

    const msgParts = data.store.part[msgs[0].id] ?? emptyParts
    if (msgParts.length !== 1) return

    const assistantPart = msgParts[0]
    if (assistantPart?.type === "tool" && assistantPart.tool === "bash") return assistantPart
  })

  const isShellMode = createMemo(() => !!shellModePart())

  const rawStatus = createMemo(() => {
    const msgs = assistantMessages()
    let last: PartType | undefined
    let currentTask: ToolPart | undefined

    for (let mi = msgs.length - 1; mi >= 0; mi--) {
      const msgParts = data.store.part[msgs[mi].id] ?? emptyParts
      for (let pi = msgParts.length - 1; pi >= 0; pi--) {
        const part = msgParts[pi]
        if (!part) continue
        if (!last) last = part

        if (
          part.type === "tool" &&
          part.tool === "task" &&
          part.state &&
          "metadata" in part.state &&
          part.state.metadata?.sessionId &&
          part.state.status === "running"
        ) {
          currentTask = part as ToolPart
          break
        }
      }
      if (currentTask) break
    }

    const taskSessionId =
      currentTask?.state && "metadata" in currentTask.state
        ? (currentTask.state.metadata?.sessionId as string | undefined)
        : undefined

    if (taskSessionId) {
      const taskMessages = data.store.message[taskSessionId] ?? emptyMessages
      for (let mi = taskMessages.length - 1; mi >= 0; mi--) {
        const msg = taskMessages[mi]
        if (!msg || msg.role !== "assistant") continue

        const msgParts = data.store.part[msg.id] ?? emptyParts
        for (let pi = msgParts.length - 1; pi >= 0; pi--) {
          const part = msgParts[pi]
          if (part) return computeStatusFromPart(part)
        }
      }
    }

    return computeStatusFromPart(last)
  })

  const status = createMemo(() => data.store.session_status[props.sessionID] ?? idle)
  const working = createMemo(() => status().type !== "idle" && isLastUserMessage())
  const retry = createMemo(() => {
    const s = status()
    if (s.type !== "retry") return
    return s
  })

  const response = createMemo(() => lastTextPart()?.text)
  const responsePartId = createMemo(() => lastTextPart()?.id)
  const hasDiffs = createMemo(() => message()?.summary?.diffs?.length)
  const hideResponsePart = createMemo(() => !working() && !!responsePartId())

  const [responseCopied, setResponseCopied] = createSignal(false)
  const handleCopyResponse = async () => {
    const content = response()
    if (!content) return
    await navigator.clipboard.writeText(content)
    setResponseCopied(true)
    setTimeout(() => setResponseCopied(false), 2000)
  }

  function duration() {
    const msg = message()
    if (!msg) return ""
    const completed = lastAssistantMessage()?.time.completed
    const from = DateTime.fromMillis(msg.time.created)
    const to = completed ? DateTime.fromMillis(completed) : DateTime.now()
    const interval = Interval.fromDateTimes(from, to)
    const unit: DurationUnit[] = interval.length("seconds") > 60 ? ["minutes", "seconds"] : ["seconds"]

    return interval.toDuration(unit).normalize().toHuman({
      notation: "compact",
      unitDisplay: "narrow",
      compactDisplay: "short",
      showZeros: false,
    })
  }

  const autoScroll = createAutoScroll({
    working,
    onUserInteracted: props.onUserInteracted,
  })

  const diffInit = 20
  const diffBatch = 20

  const [store, setStore] = createStore({
    stickyTitleRef: undefined as HTMLDivElement | undefined,
    stickyTriggerRef: undefined as HTMLDivElement | undefined,
    stickyHeaderHeight: 0,
    retrySeconds: 0,
    diffsOpen: [] as string[],
    diffLimit: diffInit,
    status: rawStatus(),
    duration: duration(),
    summaryExpanded: true,
  })

  createEffect(
    on(
      () => message()?.id,
      () => {
        setStore("diffsOpen", [])
        setStore("diffLimit", diffInit)
      },
      { defer: true },
    ),
  )

  createEffect(() => {
    const r = retry()
    if (!r) {
      setStore("retrySeconds", 0)
      return
    }
    const updateSeconds = () => {
      const next = r.next
      if (next) setStore("retrySeconds", Math.max(0, Math.round((next - Date.now()) / 1000)))
    }
    updateSeconds()
    const timer = setInterval(updateSeconds, 1000)
    onCleanup(() => clearInterval(timer))
  })

  createResizeObserver(
    () => store.stickyTitleRef,
    ({ height }) => {
      const triggerHeight = store.stickyTriggerRef?.offsetHeight ?? 0
      setStore("stickyHeaderHeight", height + triggerHeight + 8)
    },
  )

  createResizeObserver(
    () => store.stickyTriggerRef,
    ({ height }) => {
      const titleHeight = store.stickyTitleRef?.offsetHeight ?? 0
      setStore("stickyHeaderHeight", titleHeight + height + 8)
    },
  )

  createEffect(() => {
    const timer = setInterval(() => {
      setStore("duration", duration())
    }, 1000)
    onCleanup(() => clearInterval(timer))
  })

  createEffect(
    on(permissionCount, (count, prev) => {
      if (!count) return
      if (prev !== undefined && count <= prev) return
      autoScroll.forceScrollToBottom()
    }),
  )

  let lastStatusChange = Date.now()
  let statusTimeout: number | undefined
  createEffect(() => {
    const newStatus = rawStatus()
    if (newStatus === store.status || !newStatus) return

    const timeSinceLastChange = Date.now() - lastStatusChange
    if (timeSinceLastChange >= 2500) {
      setStore("status", newStatus)
      lastStatusChange = Date.now()
      if (statusTimeout) {
        clearTimeout(statusTimeout)
        statusTimeout = undefined
      }
    } else {
      if (statusTimeout) clearTimeout(statusTimeout)
      statusTimeout = setTimeout(() => {
        setStore("status", rawStatus())
        lastStatusChange = Date.now()
        statusTimeout = undefined
      }, 2500 - timeSinceLastChange) as unknown as number
    }
  })

  /* Result Modal Logic */
  const [modalState, setModalState] = createSignal<"open" | "minimized" | "closed">("closed")
  const [parsedResult, setParsedResult] = createSignal<{ title?: string, chips?: string[], workflows?: any[], content?: string } | null>(null)

  // Use a refined computed to parse the response
  createEffect(() => {
    const text = response()
    if (!text || working()) return

    // Heuristic: Look for ```result ... ``` or just last json block? 
    // Plan said JSON block. Let's look for a generic JSON block at the very end
    // Or simpler: The agent might just start the json block with ```result
    // Let's support ```json result ...

    const regex = /```json\s+(?:result)?\s*({[\s\S]*?})\s*```$/
    const match = text.match(regex)

    if (match) {
      try {
        const json = JSON.parse(match[1])
        if (json.type === "result_modal" || json.chips || json.workflows) {
          // Determine content: everything BEFORE the block
          const content = text.replace(regex, "").trim()

          // Only open if we haven't already interacted with this specific result?
          // For now, if state is 'closed' and we just finished working, open it.
          // But we need to avoid re-opening if user closed it.
          // We can use a ref or just rely on 'working' transition.
          // Actually, createEffect runs when `text` changes.
          // We'll check if the Parsed Result is DIFFERENT than what we have.
          const newResult = {
            title: json.title,
            chips: json.chips,
            workflows: json.workflows,
            content
          }

          // Simple equality check to avoid loops (naïve)
          if (JSON.stringify(newResult) !== JSON.stringify(parsedResult())) {
            setParsedResult(newResult)
            setModalState("open")
          }
        }
      } catch (e) {
        console.error("Failed to parse result block", e)
      }
    }
  })

  // Computed text for display (hiding the JSON block)
  const displayResponse = createMemo(() => {
    const text = response()
    if (!text) return ""
    // Hide the result block if parsed
    if (parsedResult()) {
      const regex = /```json\s+(?:result)?\s*({[\s\S]*?})\s*```$/
      return text.replace(regex, "").trim()
    }
    return text
  })

  return (
    <div data-component="session-turn" class={props.classes?.root}>
      {/* Result Modal - Rendered at root of turn or preferably Portal, but inline is fine for now if using fixed overlay */}
      <Show when={parsedResult() && modalState() === "open"}>
        <ResultModal
          isOpen={true}
          onOpenChange={(open) => !open && setModalState("closed")}
          onMinimize={() => setModalState("minimized")}
          content={parsedResult()!.content || ""}
          chips={parsedResult()!.chips}
          workflows={parsedResult()!.workflows}
          onChipClick={(chip) => console.log("Chip clicked:", chip)} // To implement: send message?
          onWorkflowClick={(wf) => console.log("Workflow clicked:", wf)} // To implement: trigger action
        />
      </Show>

      <div
        ref={autoScroll.scrollRef}
        onScroll={autoScroll.handleScroll}
        data-slot="session-turn-content"
        class={props.classes?.content}
      >
        <div onClick={autoScroll.handleInteraction}>
          <Show when={message()}>
            {(msg) => (
              <div
                ref={autoScroll.contentRef}
                data-message={msg().id}
                data-slot="session-turn-message-container"
                class={props.classes?.container}
                style={{ "--sticky-header-height": `${store.stickyHeaderHeight}px` }}
              >
                <Switch>
                  <Match when={isShellMode()}>
                    <Part part={shellModePart()!} message={msg()} defaultOpen />
                  </Match>
                  <Match when={true}>
                    {/* Title (sticky) */}
                    <div ref={(el) => setStore("stickyTitleRef", el)} data-slot="session-turn-sticky-title">
                      <div data-slot="session-turn-message-header">
                        <div data-slot="session-turn-message-title">
                          <Switch>
                            <Match when={working()}>
                              <Typewriter as="h1" text={msg().summary?.title} data-slot="session-turn-typewriter" />
                            </Match>
                            <Match when={true}>
                              <h1>{msg().summary?.title}</h1>
                            </Match>
                          </Switch>
                        </div>
                        <div data-slot="session-turn-user-badges">
                          <Show when={(msg() as UserMessage).agent}>
                            <span data-slot="session-turn-badge">{(msg() as UserMessage).agent}</span>
                          </Show>
                          <Show when={(msg() as UserMessage).model?.modelID}>
                            <span data-slot="session-turn-badge" class="inline-flex items-center gap-1">
                              <ProviderIcon
                                id={(msg() as UserMessage).model!.providerID as IconName}
                                class="size-3.5 shrink-0"
                              />
                              {(msg() as UserMessage).model?.modelID}
                            </span>
                          </Show>
                          <span data-slot="session-turn-badge">{(msg() as UserMessage).variant || "default"}</span>
                        </div>
                      </div>
                    </div>
                    {/* User Message */}
                    <div data-slot="session-turn-message-content">
                      <Message message={msg()} parts={parts()} />
                    </div>
                    {/* Agent Dialogue (Always visible if there's activity) */}
                    <Show when={assistantMessages().length > 0 || working()}>
                      <AgentDialogue
                        messages={assistantMessages()}
                        working={working()}
                        classes={{ root: "mb-2" }}
                      />
                    </Show>

                    {/* Permission Parts (if not handled by AgentDialogue, but they likely are now within the message parts) */}
                    {/* We verify if permissions are shown inside AssistantMessage parts. If yes, we might not need this separate block 
                        OR we keep it if it's for pending permissions not yet attached to a message part? 
                        The original code showed them when !props.stepsExpanded. 
                        Since we are expanding everything, we might not need this separate view if AgentDialogue covers it. 
                        Let's keep it safe for now but maybe wrap it differently or rely on AgentDialogue. 
                        Actually, existing logic: Render permissionParts if !stepsExpanded. 
                        If we treat AgentDialogue as "Expanded Steps", we might duplicate.
                        Let's assume AgentDialogue renders the tool parts which contain the permission request.
                    */}

                    {/* Response */}
                    <Show when={!working() && (displayResponse() || hasDiffs())}>
                      <div data-slot="session-turn-summary-section">
                        <div data-slot="session-turn-summary-header">
                          <div class="flex items-center justify-between w-full">
                            <h2 data-slot="session-turn-summary-title">Response</h2>
                            <div class="flex items-center gap-2">
                              {/* Minimized Result Button */}
                              <Show when={modalState() === "minimized"}>
                                <button
                                  onClick={() => setModalState("open")}
                                  class="
                                        flex items-center gap-2 px-3 py-1.5 text-xs font-medium 
                                        text-accent-blue bg-accent-blue/10 rounded-full 
                                        hover:bg-accent-blue/20 transition-colors animate-in fade-in zoom-in
                                    "
                                >
                                  <Icon name="branch" class="size-3" />
                                  View Analysis Result
                                </button>
                              </Show>

                              <Show when={store.summaryExpanded}>
                                <div data-slot="session-turn-summary-copy">
                                  <Tooltip value={responseCopied() ? "Copied!" : "Copy"} placement="top" gutter={8}>
                                    <IconButton
                                      icon={responseCopied() ? "check" : "copy"}
                                      variant="secondary"
                                      onClick={handleCopyResponse}
                                    />
                                  </Tooltip>
                                </div>
                              </Show>
                              <Button
                                variant="ghost"
                                size="small"
                                onClick={() => setStore("summaryExpanded", !store.summaryExpanded)}
                              >
                                {store.summaryExpanded ? "Close" : "Show Response"}
                              </Button>
                            </div>
                          </div>
                          <Show when={store.summaryExpanded}>
                            <Markdown
                              data-slot="session-turn-markdown"
                              data-diffs={hasDiffs()}
                              text={displayResponse() ?? ""}
                              cacheKey={responsePartId()}
                            />
                          </Show>
                        </div>
                        <Show when={store.summaryExpanded}>
                          <Accordion
                            data-slot="session-turn-accordion"
                            multiple
                            value={store.diffsOpen}
                            onChange={(value) => {
                              if (!Array.isArray(value)) return
                              setStore("diffsOpen", value)
                            }}
                          >
                            <For each={(msg().summary?.diffs ?? []).slice(0, store.diffLimit)}>
                              {(diff) => (
                                <Accordion.Item value={diff.file}>
                                  <StickyAccordionHeader>
                                    <Accordion.Trigger>
                                      <div data-slot="session-turn-accordion-trigger-content">
                                        <div data-slot="session-turn-file-info">
                                          <FileIcon
                                            node={{ path: diff.file, type: "file" }}
                                            data-slot="session-turn-file-icon"
                                          />
                                          <div data-slot="session-turn-file-path">
                                            <Show when={diff.file.includes("/")}>
                                              <span data-slot="session-turn-directory">
                                                {getDirectory(diff.file)}&lrm;
                                              </span>
                                            </Show>
                                            <span data-slot="session-turn-filename">{getFilename(diff.file)}</span>
                                          </div>
                                        </div>
                                        <div data-slot="session-turn-accordion-actions">
                                          <DiffChanges changes={diff} />
                                          <Icon name="chevron-grabber-vertical" size="small" />
                                        </div>
                                      </div>
                                    </Accordion.Trigger>
                                  </StickyAccordionHeader>
                                  <Accordion.Content data-slot="session-turn-accordion-content">
                                    <Show when={store.diffsOpen.includes(diff.file!)}>
                                      <Dynamic
                                        component={diffComponent}
                                        before={{
                                          name: diff.file!,
                                          contents: diff.before!,
                                        }}
                                        after={{
                                          name: diff.file!,
                                          contents: diff.after!,
                                        }}
                                      />
                                    </Show>
                                  </Accordion.Content>
                                </Accordion.Item>
                              )}
                            </For>
                          </Accordion>
                          <Show when={(msg().summary?.diffs?.length ?? 0) > store.diffLimit}>
                            <Button
                              data-slot="session-turn-accordion-more"
                              variant="ghost"
                              size="small"
                              onClick={() => {
                                const total = msg().summary?.diffs?.length ?? 0
                                setStore("diffLimit", (limit) => {
                                  const next = limit + diffBatch
                                  if (next > total) return total
                                  return next
                                })
                              }}
                            >
                              Show more changes ({(msg().summary?.diffs?.length ?? 0) - store.diffLimit})
                            </Button>
                          </Show>
                        </Show>
                      </div>
                    </Show>
                    <Show when={error() && !props.stepsExpanded}>
                      <Card variant="error" class="error-card">
                        {error()?.data?.message as string}
                      </Card>
                    </Show>
                  </Match>
                </Switch>
              </div>
            )}
          </Show>
          {props.children}
        </div>
      </div>
    </div>
  )
}
