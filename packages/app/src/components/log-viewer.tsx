import { createSignal, Show, For, onMount, onCleanup } from "solid-js"
import { Icon } from "@opencode-ai/ui/icon"

interface LogEntry {
    timestamp: string
    level: "info" | "warn" | "error" | "debug"
    source: "frontend" | "backend" | "system"
    message: string
}

/**
 * Browser-based Log Viewer Component
 * 
 * Displays real-time logs from frontend execution
 * Can be toggled on/off with a floating button
 */
export function LogViewer() {
    const [logs, setLogs] = createSignal<LogEntry[]>([])
    const [isOpen, setIsOpen] = createSignal(false)
    const [filter, setFilter] = createSignal<"all" | "info" | "warn" | "error">("all")

    let logContainerRef: HTMLDivElement | undefined

    // Override console methods to capture logs
    onMount(() => {
        const originalLog = console.log
        const originalWarn = console.warn
        const originalError = console.error

        console.log = (...args: any[]) => {
            originalLog(...args)
            addLog("info", "frontend", args.join(" "))
        }

        console.warn = (...args: any[]) => {
            originalWarn(...args)
            addLog("warn", "frontend", args.join(" "))
        }

        console.error = (...args: any[]) => {
            originalError(...args)
            addLog("error", "frontend", args.join(" "))
        }

        onCleanup(() => {
            console.log = originalLog
            console.warn = originalWarn
            console.error = originalError
        })
    })

    const addLog = (level: LogEntry["level"], source: LogEntry["source"], message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs(prev => [...prev, { timestamp, level, source, message }].slice(-100)) // Keep last 100 logs

        // Auto-scroll to bottom
        setTimeout(() => {
            if (logContainerRef) {
                logContainerRef.scrollTop = logContainerRef.scrollHeight
            }
        }, 0)
    }

    const filteredLogs = () => {
        const f = filter()
        if (f === "all") return logs()
        return logs().filter(log => log.level === f)
    }

    const getLevelColor = (level: LogEntry["level"]) => {
        switch (level) {
            case "info": return "text-blue-600"
            case "warn": return "text-yellow-600"
            case "error": return "text-red-600"
            case "debug": return "text-gray-600"
        }
    }

    const getLevelBg = (level: LogEntry["level"]) => {
        switch (level) {
            case "info": return "bg-blue-50"
            case "warn": return "bg-yellow-50"
            case "error": return "bg-red-50"
            case "debug": return "bg-gray-50"
        }
    }

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen())}
                class="fixed bottom-6 right-6 z-50 bg-black text-white rounded-full p-4 shadow-2xl hover:bg-gray-800 transition-all"
                title="Toggle Log Viewer"
            >
                <Icon name={isOpen() ? "xmark" : "terminal"} class="w-5 h-5" />
            </button>

            {/* Log Viewer Panel */}
            <Show when={isOpen()}>
                <div class="fixed bottom-24 right-6 w-[600px] h-[400px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col border border-gray-200">
                    {/* Header */}
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Icon name="terminal" class="w-5 h-5 text-gray-700" />
                            <h3 class="text-lg font-semibold text-gray-900">Runtime Logs</h3>
                            <span class="text-xs text-gray-500">({logs().length} entries)</span>
                        </div>

                        {/* Filter Buttons */}
                        <div class="flex gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                class={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter() === "all"
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("info")}
                                class={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter() === "info"
                                        ? "bg-blue-600 text-white"
                                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    }`}
                            >
                                Info
                            </button>
                            <button
                                onClick={() => setFilter("warn")}
                                class={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter() === "warn"
                                        ? "bg-yellow-600 text-white"
                                        : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                    }`}
                            >
                                Warn
                            </button>
                            <button
                                onClick={() => setFilter("error")}
                                class={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter() === "error"
                                        ? "bg-red-600 text-white"
                                        : "bg-red-50 text-red-600 hover:bg-red-100"
                                    }`}
                            >
                                Error
                            </button>
                            <button
                                onClick={() => setLogs([])}
                                class="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                                title="Clear logs"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Logs Container */}
                    <div
                        ref={logContainerRef}
                        class="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs"
                    >
                        <For each={filteredLogs()}>
                            {(log) => (
                                <div class={`p-3 rounded-lg ${getLevelBg(log.level)} border border-gray-200`}>
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-gray-500">{log.timestamp}</span>
                                        <span class={`font-semibold ${getLevelColor(log.level)} uppercase`}>
                                            [{log.level}]
                                        </span>
                                        <span class="text-gray-600">{log.source}</span>
                                    </div>
                                    <div class="text-gray-800 break-all">{log.message}</div>
                                </div>
                            )}
                        </For>

                        <Show when={filteredLogs().length === 0}>
                            <div class="text-center text-gray-400 py-12">
                                No logs to display
                            </div>
                        </Show>
                    </div>
                </div>
            </Show>
        </>
    )
}
