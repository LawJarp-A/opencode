import { Icon } from "@opencode-ai/ui/icon"
import { ActionCard } from "./action-card"
import { usePrompt } from "@/context/prompt"

import { createSignal, createMemo, Switch, Match, createEffect, onCleanup, Show } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { PromptInput } from "@/components/prompt-input"
import { ProgressTracker, type Task } from "./progress-tracker"
import { ResultsView } from "./results-view"

const ACTIONS = [
    {
        title: "Create a marketing campaign",
        icon: "photo",
        prompt: "I want to create a marketing campaign for...",
        chip: { label: "Work in a folder", icon: "folder" }
    },
    {
        title: "Do some analysis",
        icon: "magnifying-glass",
        prompt: "Perform an analysis on...",
        chip: { label: "Select dataset", icon: "database" }
    },
    {
        title: "Simulate business Scenario",
        icon: "branch",
        prompt: "Simulate a business scenario where...",
        chip: { label: "Work in a folder", icon: "folder" }
    },
    {
        title: "Prep for the day",
        icon: "checklist",
        prompt: "Help me prep for the day using...",
        chip: { label: "Connect calendar", icon: "calendar" }
    },
    {
        title: "Manage Products",
        icon: "folder",
        prompt: "Manage my products...",
        chip: { label: "Select product line", icon: "tag" }
    },
    {
        title: "Get on a call with us",
        icon: "speech-bubble",
        prompt: "Schedule a support call...",
        chip: { label: "Support ticket", icon: "help-circle" }
    }
] as const

const RESPONSE_MAPPING: Record<string, { loading: string, headline: string, subtext: string, options: string[] }> = {
    "Create a marketing campaign": {
        loading: "Shaping your campaign...",
        headline: "Let’s build a campaign that actually converts",
        subtext: "I'll help you define goals, identify your audience, suggest channels, and outline key messaging.",
        options: [
            "Define the campaign objective",
            "Identify and segment the target audience",
            "Select optimal channels",
            "Draft core messaging and positioning",
            "Outline budget and timeline"
        ]
    },
    "Do some analysis": {
        loading: "Digging into the data...",
        headline: "Turning your data into clear insights",
        subtext: "I'll analyze your dataset to identify key metrics, trends, and actionable insights.",
        options: [
            "Identify key metrics and KPIs",
            "Clean and validate the input data",
            "Run exploratory analysis to surface patterns",
            "Highlight anomalies, risks, or opportunities",
            "Summarize insights into actionable takeaways"
        ]
    },
    "Simulate business Scenario": {
        loading: "Running scenarios...",
        headline: "Let’s explore what happens if…",
        subtext: "I'll model different assumptions and compare outcomes to help you forecast effectively.",
        options: [
            "Define assumptions and variables",
            "Create multiple what-if scenarios",
            "Compare outcomes across scenarios",
            "Estimate impact on revenue, cost, or growth",
            "Highlight best- and worst-case outcomes"
        ]
    },
    "Prep for the day": {
        loading: "Organizing your day...",
        headline: "Here’s a focused plan for today",
        subtext: "I'll extract priorities, suggest time-blocks, and help clarify key decisions.",
        options: [
            "Review today’s meetings and commitments",
            "Identify top priorities and must-do tasks",
            "Allocate time blocks for deep work",
            "Flag decisions or follow-ups needed today",
            "Create a realistic end-of-day wrap-up plan"
        ]
    },
    "Manage Products": {
        loading: "Reviewing your products...",
        headline: "Let’s get your products under control",
        subtext: "I'll overview your catalog, identify gaps, and suggest optimization paths.",
        options: [
            "Review current product catalog and status",
            "Identify underperforming or inactive products",
            "Surface pricing, inventory, or lifecycle issues",
            "Highlight quick wins and optimization opportunities",
            "Suggest next actions per product"
        ]
    },
    "Get on a call with us": {
        loading: "Setting things up...",
        headline: "Let’s talk",
        subtext: "I'll help you schedule a call, capture context, and clarify the agenda.",
        options: [
            "Capture context and goals for the call",
            "Identify the right team or expert to join",
            "Propose available time slots",
            "Prepare a clear agenda for the discussion",
            "Confirm next steps after the call"
        ]
    }
}

const DEFAULT_MAPPING = {
    loading: "Thinking...",
    headline: "Let’s get started",
    subtext: "I'm ready to help you with your task.",
    options: [
        "Review your request",
        "Analyze the context",
        "Identify key information",
        "Generate a plan of action"
    ]
}

export function ActionDashboard() {
    const prompt = usePrompt()
    const [selectedActionIndex, setSelectedActionIndex] = createSignal<number | null>(null)
    // Updated flow state to include 'preview', 'executing', and 'result'
    const [flowState, setFlowState] = createSignal<"input" | "loading" | "preview" | "executing" | "result">("input")
    const [tasks, setTasks] = createStore<Task[]>([])

    const handleActionClick = (index: number) => {
        setSelectedActionIndex(index)
        const action = ACTIONS[index]
        const text = action.prompt
        prompt.set([{ type: "text", content: text, start: 0, end: text.length }])
    }

    const currentAction = createMemo(() => selectedActionIndex() !== null ? ACTIONS[selectedActionIndex()!] : null)
    const chipLabel = createMemo(() => currentAction()?.chip.label || "Work in a folder")
    const chipIcon = createMemo(() => currentAction()?.chip.icon || "folder")

    const responseContent = createMemo(() => {
        const action = currentAction()
        if (action && action.title in RESPONSE_MAPPING) {
            return RESPONSE_MAPPING[action.title as keyof typeof RESPONSE_MAPPING]
        }
        return DEFAULT_MAPPING
    })

    const handleSubmit = async () => {
        if (flowState() !== "input") return
        setFlowState("loading")

        // Wait for 2 seconds to simulate loading/thinking
        setTimeout(() => {
            setFlowState("preview")
        }, 2000)
    }

    const handleStartExecution = () => {
        setFlowState("executing")
    }

    const resetSession = () => {
        setFlowState("input")
        setSelectedActionIndex(null)
        setTasks([])
        prompt.set([])
    }

    // Simulation Effect - ONLY runs when in "executing" state
    createEffect(() => {
        if (flowState() === "executing") {
            const content = responseContent()
            if (!content.options) return

            // Initialize tasks if empty (or reset)
            setTasks(content.options.map((label, i) => ({
                id: i.toString(),
                label,
                status: i === 0 ? "in-progress" : "pending"
            })))

            let currentStep = 0
            const totalSteps = content.options.length

            // Speed up simulation for demo purposes
            const interval = setInterval(() => {
                setTasks(produce((draft) => {
                    if (currentStep < totalSteps) {
                        // Mark current as completed
                        draft[currentStep].status = "completed"

                        // Start next if available
                        if (currentStep + 1 < totalSteps) {
                            draft[currentStep + 1].status = "in-progress"
                        }
                        currentStep++
                    }
                }))

                if (currentStep >= totalSteps) {
                    clearInterval(interval)
                    // Auto-transition to results after short delay
                    setTimeout(() => {
                        setFlowState("result")
                    }, 1200)
                }
            }, 1500) // Faster pace for better demo flow (1.5s per step)

            onCleanup(() => clearInterval(interval))
        }
    })

    return (
        <div class="flex-1 size-full flex flex-col items-center justify-center bg-[var(--background-base)] relative overflow-hidden font-sans p-6 md:p-12 transition-colors duration-500">
            {/* Background Watermark */}
            <div class="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                <img src="/logo.png" alt="" class="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] max-w-[800px] max-h-[800px] object-contain opacity-50 blur-[1px]" />
            </div>
            <Switch>
                {/* 1. INPUT STATE */}
                <Match when={flowState() === "input"}>
                    <div class="z-10 w-full max-w-5xl flex flex-col items-center gap-10 md:gap-14 animate-in fade-in duration-500">
                        {/* Header */}
                        <div class="flex flex-col items-center gap-6 text-center">
                            <img src="/logo.png" alt="ShopOS" class="h-16 w-auto" />
                            <h1 class="flex flex-col gap-2 md:gap-3 items-center text-3xl md:text-[40px] font-sans font-medium text-[var(--text-strong)] tracking-tight">
                                <span>What's on your mind today?</span>
                            </h1>
                        </div>

                        {/* Main Action Container */}
                        <div class="w-full flex flex-col gap-6">
                            <div class="w-full bg-white/40 rounded-[32px] p-2 md:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl">
                                <div class="bg-white/40 rounded-[24px] p-6 md:p-10">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                        {ACTIONS.map((action, index) => (
                                            <ActionCard
                                                title={action.title}
                                                icon={action.icon as any}
                                                onClick={() => handleActionClick(index)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input Module */}
                            <div class="w-full max-w-4xl mx-auto">
                                <PromptInput
                                    onSubmit={handleSubmit}
                                    contextChip={{
                                        label: chipLabel(),
                                        icon: chipIcon(),
                                        onClick: () => console.log("Context chip clicked:", chipLabel())
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Match>

                {/* 2. LOADING STATE */}
                <Match when={flowState() === "loading"}>
                    <div class="z-10 flex flex-col items-center justify-center flex-1 min-h-[400px] gap-12 animate-in fade-in duration-700">
                        {/* Large Central Loader Visual */}
                        <div class="relative size-32 flex items-center justify-center">
                            {/* Outer Spinning Ring */}
                            <svg class="absolute inset-0 size-full animate-spin-slow text-[var(--icon-primary)]" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="100 200" stroke-linecap="round" class="opacity-30" />
                                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="60 360" stroke-linecap="round" />
                            </svg>

                            {/* Inner Glow Background */}
                            <div class="absolute inset-4 rounded-full bg-gradient-to-tr from-[var(--surface-raised-strong)] to-transparent opacity-50 blur-xl animate-pulse"></div>

                            {/* Central Hero Icon (Scaled Up) */}
                            <div class="relative z-10 text-[var(--icon-primary)] scale-[2.5]">
                                <Icon name={currentAction()?.icon as any || "branch"} size="normal" />
                            </div>

                            {/* Satellite Ecommerce Icons */}
                            <div class="absolute -top-4 right-0 p-2.5 bg-white rounded-full shadow-lg shadow-black/5 border border-[var(--border-weaker-base)] animate-bounce" style={{ "animation-duration": "3s" }}>
                                <Icon name="checklist" size="small" class="text-[var(--text-subtle)]" />
                            </div>
                            <div class="absolute bottom-2 -left-4 p-2.5 bg-white rounded-full shadow-lg shadow-black/5 border border-[var(--border-weaker-base)] animate-bounce" style={{ "animation-duration": "2.5s", "animation-delay": "0.5s" }}>
                                <Icon name="folder" size="small" class="text-[var(--text-subtle)]" />
                            </div>
                            <div class="absolute -bottom-4 right-4 p-2.5 bg-white rounded-full shadow-lg shadow-black/5 border border-[var(--border-weaker-base)] animate-bounce" style={{ "animation-duration": "3.5s", "animation-delay": "1s" }}>
                                <Icon name="magnifying-glass" size="small" class="text-[var(--text-subtle)]" />
                            </div>
                        </div>

                        {/* Text and Processing Flow */}
                        <div class="flex flex-col items-center gap-4 text-center">
                            <h2 class="text-2xl md:text-3xl text-[var(--text-strong)] font-semibold tracking-tight">
                                {responseContent().loading}
                            </h2>
                            <div class="flex items-center gap-2.5 px-5 py-2 rounded-full bg-[var(--surface-raised-base)] border border-[var(--border-weaker-base)] animate-pulse">
                                <div class="size-2 rounded-full bg-[var(--icon-primary)]"></div>
                                <span class="text-[14px] font-medium text-[var(--text-subtle)]">
                                    Analyzing store context & data...
                                </span>
                            </div>
                        </div>
                    </div>
                </Match>

                {/* 3. PREVIEW STATE (Options List + Buttons) */}
                <Match when={flowState() === "preview"}>
                    <div class="z-10 w-full max-w-2xl flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {/* Apple-Grade Preview Card */}
                        <button
                            onClick={handleStartExecution}
                            class="w-full bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:bg-white/90 hover:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.08)] hover:scale-[1.005] transition-all duration-500 group cursor-pointer text-left ring-1 ring-black/5"
                        >
                            <div class="flex flex-col items-center gap-10">
                                {/* Header */}
                                <div class="flex flex-col items-center gap-4 text-center">
                                    <div class="size-16 rounded-2xl bg-gradient-to-br from-[#F2F2F7] to-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] shadow-inner">
                                        <Icon name={currentAction()?.icon as any || "branch"} size="large" />
                                    </div>
                                    <div class="space-y-2">
                                        <h1 class="text-2xl font-semibold text-[#1C1C1E] tracking-tight">
                                            {responseContent().headline}
                                        </h1>
                                        <p class="text-[17px] text-[#8E8E93] leading-relaxed max-w-md">
                                            {responseContent().subtext}
                                        </p>
                                    </div>
                                </div>

                                {/* Inset Grouped List */}
                                <div class="w-full bg-[#F5F5F7]/50 rounded-[20px] p-2 ring-1 ring-black/5">
                                    <div class="flex flex-col bg-white rounded-[16px] shadow-sm divide-y divide-[#E5E5EA] overflow-hidden">
                                        <Show when={responseContent().options}>
                                            {responseContent().options!.map((option, idx) => (
                                                <div class="px-5 py-4 flex items-center gap-4 hover:bg-[#F2F2F7] transition-colors duration-200">
                                                    <div class="size-6 rounded-full bg-[#E5E5EA] flex items-center justify-center shrink-0">
                                                        <span class="text-[12px] font-semibold text-[#8E8E93] font-mono">{idx + 1}</span>
                                                    </div>
                                                    <span class="text-[15px] text-[#1C1C1E] font-medium tracking-tight truncate">{option}</span>
                                                    {/* Subtle arrow implies flow/drilldown */}
                                                    <div class="ml-auto text-[#C7C7CC]">
                                                        <Icon name="chevron-right" size="small" />
                                                    </div>
                                                </div>
                                            ))}
                                        </Show>
                                    </div>
                                </div>

                                {/* Unlock/Action Hint */}
                                <div class="h-8 flex items-center gap-2 text-[#007AFF] font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    <span class="text-[15px]">Tap to Start</span>
                                    <Icon name="chevron-right" size="small" />
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStartExecution();
                            }}
                            class="text-[15px] text-[#8E8E93] hover:text-[#1C1C1E] transition-colors font-medium px-4 py-2"
                        >
                            Skip & Continue
                        </button>
                    </div>
                </Match>

                {/* 4. EXECUTING STATE (Progress Tracker) */}
                <Match when={flowState() === "executing"}>
                    <div class="z-10 w-full max-w-3xl flex flex-col items-center gap-8 md:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Execution View */}
                        <div class="w-full bg-white/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
                            <div class="flex flex-col items-center gap-6 text-center mb-10">
                                <div class="p-3 bg-[var(--surface-raised-strong)] rounded-2xl text-[var(--icon-warning-base)] animate-pulse">
                                    <Icon name={currentAction()?.icon as any || "branch"} size="large" />
                                </div>
                                <div class="space-y-2 max-w-xl">
                                    <h1 class="text-2xl md:text-3xl font-medium text-[var(--text-strong)] tracking-tight">
                                        Executing Plan...
                                    </h1>
                                    <p class="text-base text-[var(--text-subtle)]">
                                        Please wait while we process your request.
                                    </p>
                                </div>
                            </div>

                            {/* Progress Tracker (Live Execution) */}
                            <div class="w-full">
                                <ProgressTracker tasks={tasks} />
                            </div>
                        </div>
                    </div>
                </Match>

                <Match when={flowState() === "result"}>
                    <div class="z-10 w-full max-w-[1600px] h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div class="grid grid-cols-12 gap-6 h-full items-start">

                            {/* LEFT COLUMN: Summary & Continuation (Secondary) */}
                            <div class="col-span-12 lg:col-span-3 flex flex-col h-full max-h-[calc(100vh-6rem)]">
                                <section class="bg-white/60 backdrop-blur-2xl rounded-[32px] p-6 shadow-sm ring-1 ring-black/5 flex flex-col h-full">
                                    {/* Top: Summary */}
                                    <div class="flex-1 space-y-8">
                                        <div class="space-y-4">
                                            <div class="flex items-center gap-2 text-[#34C759]">
                                                <Icon name="check-small" size="small" />
                                                <span class="text-sm font-semibold uppercase tracking-wide">Mission Complete</span>
                                            </div>

                                            <div class="space-y-2">
                                                <h1 class="text-xl font-bold text-[#1C1C1E] leading-tight">
                                                    Task executed successfully.
                                                </h1>
                                                <p class="text-[15px] text-[#48484A] leading-relaxed max-w-[280px]">
                                                    I've generated the strategy documents and organized all assets for your review.
                                                </p>
                                            </div>
                                        </div>

                                        <div class="space-y-4">
                                            <h3 class="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">Highlights</h3>
                                            <ul class="space-y-3">
                                                <li class="flex items-start gap-3 text-[14px] text-[#1C1C1E]">
                                                    <div class="mt-0.5 text-[#34C759]"><Icon name="check-small" size="small" /></div>
                                                    <span class="leading-snug">Generated multi-channel strategy</span>
                                                </li>
                                                <li class="flex items-start gap-3 text-[14px] text-[#1C1C1E]">
                                                    <div class="mt-0.5 text-[#34C759]"><Icon name="check-small" size="small" /></div>
                                                    <span class="leading-snug">Identified 3 key growth areas</span>
                                                </li>
                                                <li class="flex items-start gap-3 text-[14px] text-[#1C1C1E]">
                                                    <div class="mt-0.5 text-[#34C759]"><Icon name="check-small" size="small" /></div>
                                                    <span class="leading-snug">Prepared asset bundle</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Bottom: Continuation (Chat) */}
                                    <div class="mt-6 pt-6 border-t border-black/5">
                                        <label class="block text-[13px] font-semibold text-[#1C1C1E] mb-3 ml-1">
                                            What would you like to do next?
                                        </label>
                                        <div class="relative group">
                                            <PromptInput
                                                onSubmit={() => { /* Handle continuation */ }}
                                                submitLabel="Send"
                                                class="shadow-sm border border-black/10 bg-white hover:border-black/20 focus-within:border-[#007AFF] focus-within:ring-1 focus-within:ring-[#007AFF]/20 transition-all"
                                                placeholder="Ask a follow-up ("
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* CENTER COLUMN: Hero Result (Primary) */}
                            <div class="col-span-12 lg:col-span-6 flex flex-col h-full">
                                <section class="bg-white/80 backdrop-blur-3xl rounded-[32px] p-8 shadow-md ring-1 ring-black/5 relative overflow-hidden flex flex-col gap-8">
                                    {/* Header */}
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-center gap-5">
                                            <div class="size-14 bg-gradient-to-br from-[#F2F2F7] to-[#E5E5EA] rounded-2xl flex items-center justify-center text-[#1C1C1E] shadow-inner ring-1 ring-black/5">
                                                <Icon name={currentAction()?.icon as any || "branch"} size="normal" />
                                            </div>
                                            <div>
                                                <h1 class="text-2xl font-bold text-[#1C1C1E] tracking-tight">{currentAction()?.title}</h1>
                                                <div class="flex items-center gap-2 mt-1.5">
                                                    <span class="size-2 rounded-full bg-[#34C759]" />
                                                    <span class="text-[14px] font-medium text-[#48484A]">Final Output</span>
                                                    <span class="text-[#E5E5EA] mx-1">•</span>
                                                    <span class="text-[14px] text-[#8E8E93]">Just now</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <button class="p-2 text-[#1C1C1E] hover:bg-[#F2F2F7] rounded-full transition-colors" title="Menu">
                                                <Icon name="menu" size="small" />
                                            </button>
                                            <button class="pl-4 pr-3 py-2 text-[14px] font-medium text-white bg-[#1C1C1E] rounded-full hover:bg-[#3A3A3C] transition-colors shadow-sm flex items-center gap-2">
                                                Export <Icon name="chevron-down" size="small" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Main Content Area */}
                                    <div class="flex-1 min-h-0">
                                        <ResultsView actionTitle={currentAction()?.title || ""} />
                                    </div>

                                    {/* Integrated Insights Footer (Quiet) */}
                                    <div class="pt-6 border-t border-black/5 flex items-center divide-x divide-black/5">
                                        <div class="pr-8">
                                            <div class="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Confidence</div>
                                            <div class="text-xl font-medium text-[#1C1C1E]">98%</div>
                                        </div>
                                        <div class="px-8">
                                            <div class="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Tasks</div>
                                            <div class="text-xl font-medium text-[#1C1C1E]">{tasks.length}</div>
                                        </div>
                                        <div class="px-8">
                                            <div class="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Saved</div>
                                            <div class="text-xl font-medium text-[#1C1C1E]">2.5h</div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT COLUMN: Metadata (Tertiary) */}
                            <div class="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full max-h-[calc(100vh-6rem)]">
                                {/* Execution Log */}
                                <section class="bg-white/40 backdrop-blur-xl rounded-[32px] p-6 shadow-sm ring-1 ring-black/5 flex-1 max-h-[40%] flex flex-col">
                                    <div class="flex items-center justify-between mb-4 px-1 shrink-0">
                                        <h3 class="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">Execution Log</h3>
                                        <span class="text-[11px] font-medium text-[#8E8E93] bg-black/5 px-2 py-0.5 rounded-full">Completed</span>
                                    </div>
                                    <div class="overflow-y-auto pr-2 no-scrollbar">
                                        <ProgressTracker tasks={tasks} />
                                    </div>
                                </section>

                                {/* Artifacts & Context */}
                                <section class="bg-white/40 backdrop-blur-xl rounded-[32px] p-6 shadow-sm ring-1 ring-black/5 flex-1 flex flex-col gap-6">
                                    <div>
                                        <h3 class="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-3 px-1">Artifacts</h3>
                                        <div class="space-y-2">
                                            <div class="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-black/5 hover:bg-white hover:border-[#007AFF]/30 transition-all cursor-pointer group">
                                                <div class="size-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
                                                    <Icon name="folder" size="small" />
                                                </div>
                                                <div class="flex flex-col min-w-0">
                                                    <span class="text-[13px] font-medium text-[#1C1C1E] truncate group-hover:text-[#007AFF] transition-colors">Campaign_Strategy.pdf</span>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-black/5 hover:bg-white hover:border-[#FF9500]/30 transition-all cursor-pointer group">
                                                <div class="size-8 rounded-lg bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center">
                                                    <Icon name="photo" size="small" />
                                                </div>
                                                <div class="flex flex-col min-w-0">
                                                    <span class="text-[13px] font-medium text-[#1C1C1E] truncate group-hover:text-[#FF9500] transition-colors">Creative_Assets.zip</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="h-px bg-black/5 w-full" />

                                    <div>
                                        <h3 class="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-3 px-1">Context</h3>
                                        <div class="flex flex-wrap gap-2">
                                            <div class="px-2.5 py-1.5 bg-white/60 border border-black/5 rounded-lg text-[13px] text-[#48484A] flex items-center gap-2">
                                                <Icon name="server" size="tiny" class="text-[#8E8E93]" />
                                                <span>Sales Data</span>
                                            </div>
                                            <div class="px-2.5 py-1.5 bg-white/60 border border-black/5 rounded-lg text-[13px] text-[#48484A] flex items-center gap-2">
                                                <Icon name="speech-bubble" size="tiny" class="text-[#8E8E93]" />
                                                <span>Transcript</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                        </div>
                    </div>
                </Match>

            </Switch>
        </div>
    )
}
