import { Icon } from "@opencode-ai/ui/icon"
import { Component, ComponentProps, For } from "solid-js"

export interface SessionStarterTilesProps {
    onSelect: (tile: string) => void
}

type IconName = ComponentProps<typeof Icon>["name"]

const TILES: { id: string; label: string; icon: IconName; color: string }[] = [
    { id: "marketing", label: "Start a marketing campaign", icon: "speech-bubble", color: "text-blue-500" },
    { id: "analysis", label: "Analyse your shop", icon: "magnifying-glass-menu", color: "text-purple-500" },
    { id: "branding", label: "Work on Branding", icon: "edit-small-2", color: "text-pink-500" },
    { id: "assets", label: "Asset generation", icon: "photo", color: "text-amber-500" },
    { id: "prep", label: "Prepare for today", icon: "checklist", color: "text-emerald-500" },
    { id: "connect", label: "Connect with ShopOS", icon: "server", color: "text-indigo-500" },
]

const BACKGROUND_ICONS: { icon: IconName; top: string; left: string; size: "large" | "normal" }[] = [
    // Left side (0-15% width)
    { icon: "archive", top: "10%", left: "5%", size: "large" },
    { icon: "magnifying-glass", top: "30%", left: "8%", size: "large" },
    { icon: "checklist", top: "50%", left: "3%", size: "large" },
    { icon: "settings-gear", top: "70%", left: "10%", size: "large" },
    { icon: "photo", top: "85%", left: "5%", size: "large" },

    // Right side (85-100% width)
    { icon: "server", top: "15%", left: "90%", size: "large" },
    { icon: "speech-bubble", top: "35%", left: "85%", size: "large" },
    { icon: "workflow", top: "55%", left: "92%", size: "large" },
    { icon: "pencil-line", top: "75%", left: "88%", size: "large" },
    { icon: "brain", top: "20%", left: "82%", size: "large" },
]

export const SessionStarterTiles: Component<SessionStarterTilesProps> = (props) => {
    return (
        <div class="w-full relative min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Background Icons - Full width absolute container */}
            <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <For each={BACKGROUND_ICONS}>
                    {(item) => (
                        <div
                            class="absolute text-neutral-200/40 transition-all duration-1000 ease-in-out hover:scale-110 opacity-30 scale-[2.5]"
                            style={{ top: item.top, left: item.left }}
                        >
                            <Icon name={item.icon} size={item.size} />
                        </div>
                    )}
                </For>
            </div>

            {/* Tiles Container - Centered and constrained */}
            <div class="w-full max-w-3xl px-6 z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                    <For each={TILES}>
                        {(tile) => (
                            <button
                                onClick={() => props.onSelect(tile.id)}
                                class="group flex items-center gap-4 p-4 rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 text-left border border-transparent"
                            >
                                <div class={`flex items-center justify-center size-14 rounded-2xl bg-surface-base shadow-inner group-hover:scale-110 transition-all duration-300 ${tile.color}`}>
                                    <Icon name={tile.icon} size="large" />
                                </div>
                                <div class="flex flex-col gap-0.5">
                                    <span class="text-16-medium text-text-primary group-hover:text-black transition-colors font-bold tracking-tight">
                                        {tile.label}
                                    </span>
                                    <span class="text-13-regular text-text-tertiary group-hover:text-text-subtle transition-colors">
                                        Select to start
                                    </span>
                                </div>
                                <div class="ml-auto opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                    <div class="p-1.5 rounded-full bg-surface-base">
                                        <Icon name="chevron-right" class="text-text-primary" size="small" />
                                    </div>
                                </div>
                            </button>
                        )}
                    </For>
                </div>
            </div>
        </div>
    )
}
