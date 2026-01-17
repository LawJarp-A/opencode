import { For, Show, createMemo } from "solid-js"

export type ChartData = {
    type: "bar" | "donut" | "metric" | "table"
    title?: string
    subtitle?: string
    data: Array<{
        label: string
        value: number
        color?: string
        meta?: string
    }>
    options?: {
        orientation?: "horizontal" | "vertical"
        formatValue?: string // e.g., "currency", "number", "percentage"
        columns?: string[] // for table
        height?: number
    }
}

// Helper to format values
const format = (val: number, type?: string) => {
    if (type === "currency") return `₹${val.toLocaleString()}`
    if (type === "percentage") return `${val}%`
    return val.toLocaleString()
}

// --- Sub-components ---

const MetricCard = (props: { data: ChartData }) => {
    return (
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <For each={props.data.data}>
                {(item) => (
                    <div class="flex flex-col p-4 bg-surface-subtle border border-border-base rounded-lg">
                        <span class="text-xs font-medium text-text-muted uppercase tracking-wider">{item.label}</span>
                        <span class="mt-1 text-2xl font-semibold text-text-strong">{format(item.value, props.data.options?.formatValue)}</span>
                        <Show when={item.meta}>
                            <span class="mt-1 text-xs text-text-muted">{item.meta}</span>
                        </Show>
                    </div>
                )}
            </For>
        </div>
    )
}

const BarChart = (props: { data: ChartData }) => {
    const max = createMemo(() => Math.max(...props.data.data.map(d => d.value)))

    return (
        <div class="w-full flex flex-col gap-2 py-2">
            <For each={props.data.data}>
                {(item, i) => (
                    <div class="flex items-center gap-3 text-sm">
                        <div class="w-24 shrink-0 text-right truncate text-text-muted" title={item.label}>
                            {item.label}
                        </div>
                        <div class="flex-1 h-8 bg-surface-subtle rounded-md overflow-hidden relative group">
                            <div
                                class="h-full bg-accent-blue/80 group-hover:bg-accent-blue transition-all duration-500 ease-out rounded-r-md min-w-[2px]"
                                style={{
                                    width: `${(item.value / max()) * 100}%`,
                                    "background-color": item.color
                                }}
                            />
                            <span class="absolute inset-y-0 right-2 flex items-center text-xs font-medium text-text-base">
                                {format(item.value, props.data.options?.formatValue)}
                            </span>
                        </div>
                    </div>
                )}
            </For>
        </div>
    )
}

const DonutChart = (props: { data: ChartData }) => {
    const total = createMemo(() => props.data.data.reduce((a, b) => a + b.value, 0))
    let cumulative = 0

    const segments = createMemo(() => {
        cumulative = 0
        return props.data.data.map(item => {
            const start = cumulative
            cumulative += item.value
            return { ...item, start, end: cumulative }
        })
    })

    // Basic SVG donut implementation
    const size = 160
    const center = size / 2
    const radius = (size / 2) - 20
    const circumference = 2 * Math.PI * radius

    return (
        <div class="flex items-center justify-center gap-8 py-4">
            <div class="relative w-40 h-40 shrink-0">
                <svg viewBox={`0 0 ${size} ${size}`} class="transform -rotate-90 w-full h-full">
                    <For each={segments()}>
                        {(item, i) => {
                            const percent = item.value / total()
                            const dashArray = `${percent * circumference} ${circumference}`
                            const offset = -1 * (item.start / total()) * circumference
                            const color = item.color || [
                                "var(--accent-blue)",
                                "var(--accent-green)",
                                "var(--accent-amber)",
                                "var(--accent-red)",
                                "var(--text-muted)"
                            ][i() % 5]

                            return (
                                <circle
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    fill="transparent"
                                    stroke={color}
                                    stroke-width="24"
                                    stroke-dasharray={dashArray}
                                    stroke-dashoffset={offset}
                                    class="hover:opacity-80 transition-opacity cursor-pointer"
                                >
                                    <title>{item.label}: {format(item.value, props.data.options?.formatValue)}</title>
                                </circle>
                            )
                        }}
                    </For>
                </svg>
            </div>
            <div class="flex flex-col gap-2 text-xs">
                <For each={props.data.data}>
                    {(item, i) => (
                        <div class="flex items-center gap-2">
                            <div
                                class="w-3 h-3 rounded-full"
                                style={{
                                    "background-color": item.color || [
                                        "var(--accent-blue)",
                                        "var(--accent-green)",
                                        "var(--accent-amber)",
                                        "var(--accent-red)",
                                        "var(--text-muted)"
                                    ][i() % 5]
                                }}
                            />
                            <span class="text-text-muted">{item.label}</span>
                            <span class="font-medium text-text-strong ml-auto">{format(item.value, props.data.options?.formatValue)}</span>
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}

// Default export
export function Chart(props: { data: ChartData }) {
    return (
        <div class="flex flex-col w-full my-4 rounded-lg border border-border-base bg-surface-base overflow-hidden">
            <Show when={props.data.title}>
                <div class="px-4 py-3 border-b border-border-base bg-surface-subtle/50">
                    <h3 class="font-semibold text-sm text-text-strong">{props.data.title}</h3>
                    <Show when={props.data.subtitle}>
                        <p class="text-xs text-text-muted mt-0.5">{props.data.subtitle}</p>
                    </Show>
                </div>
            </Show>

            <div class="p-4">
                <Show when={props.data.type === "metric"}>
                    <MetricCard data={props.data} />
                </Show>
                <Show when={props.data.type === "bar"}>
                    <BarChart data={props.data} />
                </Show>
                <Show when={props.data.type === "donut"}>
                    <DonutChart data={props.data} />
                </Show>
                <Show when={props.data.type === "table"}>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-border-base">
                                    <For each={props.data.options?.columns || ["Label", "Value"]}>
                                        {(col) => <th class="pb-2 font-medium text-text-muted">{col}</th>}
                                    </For>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border-subtle">
                                <For each={props.data.data}>
                                    {(item) => (
                                        <tr>
                                            <td class="py-2 pr-4">{item.label}</td>
                                            <td class="py-2 font-medium">{format(item.value, props.data.options?.formatValue)}</td>
                                        </tr>
                                    )}
                                </For>
                            </tbody>
                        </table>
                    </div>
                </Show>
            </div>
        </div>
    )
}
