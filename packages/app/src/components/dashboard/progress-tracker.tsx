import { createSignal, Show, For } from "solid-js"
import { Icon } from "@opencode-ai/ui/icon"

export interface Task {
    id: string
    label: string
    status: "pending" | "in-progress" | "completed" | "failed"
}

interface ProgressTrackerProps {
    tasks: Task[]
}

export function ProgressTracker(props: ProgressTrackerProps) {
    const [expanded, setExpanded] = createSignal(true)

    return (
        <div class="w-full bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 font-sans">
            <button
                type="button"
                onClick={() => setExpanded(!expanded())}
                class="w-full flex items-center justify-between px-8 py-6 bg-transparent outline-none cursor-pointer group hover:bg-[#FAFAFA] transition-colors"
            >
                <div class="flex items-center gap-4">
                    <span class="text-[19px] font-semibold text-[#1C1C1E] tracking-tight">Progress</span>
                    <Show when={props.tasks.length > 0}>
                        <span class="text-[13px] text-[#6B7280] font-medium bg-[#F3F4F6] px-3 py-1 rounded-full tabular-nums">
                            {props.tasks.filter(t => t.status === 'completed').length} / {props.tasks.length}
                        </span>
                    </Show>
                </div>
                <div class={`text-[#9CA3AF] group-hover:text-[#1F2937] transition-all duration-300 transform ${expanded() ? 'rotate-180' : ''}`}>
                    <Icon name="chevron-down" size="small" />
                </div>
            </button>

            <div
                class={`transition-all duration-500 cubic-bezier(0.2, 0, 0.2, 1) ${expanded() ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div class="px-8 pb-8 pt-2 flex flex-col relative">
                    {/* Vertical Connector Line - made extremely subtle */}
                    <div class="absolute left-[40.5px] top-4 bottom-12 w-[1.5px] bg-[#F3F4F6] pointer-events-none" />

                    <For each={props.tasks}>
                        {(task, index) => (
                            <div
                                class="flex items-start gap-6 py-3 group/task relative z-10 animate-enter-item"
                                style={{ "animation-delay": `${index() * 0.08}s` }}
                            >
                                {/* Indicator */}
                                <div class="shrink-0 size-7 flex items-center justify-center relative mt-0.5 bg-white rounded-full ring-4 ring-white">
                                    <Show when={task.status === "completed"}>
                                        <div class="size-6 bg-[#14532D] rounded-full flex items-center justify-center text-white animate-scale-fade-in origin-center shadow-sm">
                                            <Icon name="check" size="small" class="stroke-[3]" />
                                        </div>
                                    </Show>

                                    <Show when={task.status === "in-progress"}>
                                        <div class="relative size-6 flex items-center justify-center animate-fade-in">
                                            <svg class="absolute inset-0 size-full animate-spin-slow" viewBox="0 0 32 32">
                                                <circle
                                                    cx="16" cy="16" r="14"
                                                    fill="none"
                                                    stroke="#059669"
                                                    stroke-width="2.5"
                                                    stroke-dasharray="60 40"
                                                    stroke-linecap="round"
                                                    class="opacity-100"
                                                />
                                            </svg>
                                        </div>
                                    </Show>

                                    <Show when={task.status === "pending"}>
                                        <div class="size-6 bg-[#F3F4F6] rounded-full flex items-center justify-center transition-colors duration-300" />
                                    </Show>
                                </div>

                                {/* Label & Content */}
                                <div class="flex flex-col pt-0.5 w-full min-w-0">
                                    <div class="relative w-fit">
                                        <span
                                            class={`text-[16px] leading-relaxed transition-colors duration-500 ease-in-out block truncate
                                                ${task.status === "completed"
                                                    ? "text-[#9CA3AF]"
                                                    : task.status === "in-progress"
                                                        ? "text-[#111827] font-semibold"
                                                        : "text-[#6B7280]"
                                                }
                                                bg-gradient-to-r from-[#9CA3AF] to-[#9CA3AF]
                                                bg-[length:0%_1.5px] bg-no-repeat bg-left-center 
                                                ${task.status === "completed" ? "bg-[length:100%_1.5px]" : ""}
                                            `}
                                            style={{
                                                "transition-property": "color, background-size",
                                                "background-position": "0 55%"
                                            }}
                                        >
                                            {task.label}
                                        </span>
                                    </div>

                                    <Show when={task.status === "in-progress"}>
                                        <div class="overflow-hidden animate-slide-in-down">
                                            <span class="text-[13px] text-[#059669] font-medium mt-1 block opacity-90 transition-opacity duration-300">
                                                Processing...
                                            </span>
                                        </div>
                                    </Show>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    )
}

