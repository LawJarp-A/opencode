import { createSignal, Show } from "solid-js"
import { ImagePreview } from "./image-preview"
import { useDialog } from "../context/dialog"
import { Icon } from "./icon"

export interface MarkdownImageProps {
    src: string
    alt?: string
    title?: string
}

export function MarkdownImage(props: MarkdownImageProps) {
    const dialog = useDialog()
    const [error, setError] = createSignal(false)

    const openPreview = () => {
        if (error()) return
        dialog.show(() => <ImagePreview src={props.src} alt={props.alt} />)
    }

    return (
        <div
            class="relative inline-block my-2 group cursor-zoom-in"
            classList={{ "cursor-not-allowed opacity-50": error() }}
            onClick={openPreview}
        >
            <img
                src={props.src}
                alt={props.alt}
                title={props.title}
                class="max-w-full h-auto rounded-lg border border-border-base shadow-sm group-hover:shadow-md transition-shadow bg-surface-base"
                onError={() => setError(true)}
            />

            <Show when={error()}>
                <div class="absolute inset-0 flex items-center justify-center bg-surface-base/50 text-text-muted rounded-lg border border-border-base">
                    <div class="flex flex-col items-center gap-1 text-xs">
                        <Icon name="circle-ban-sign" size="small" />
                        <span>Failed to load</span>
                    </div>
                </div>
            </Show>

            <Show when={!error()}>
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div class="bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm">
                        <Icon name="eye" class="size-4" /> {/* Assuming 'search' or similar exists, checked icons earlier: magnifying-glass */}
                        {/* Checking icon list: 'magnifying-glass' is valid. 'eye' matches intent better. 'eye' is valid per file-icon.tsx but let's check icon.tsx again. */}
                        {/* Step 912 showed icon.tsx. 'eye' is lines 26. 'magnifying-glass' is line 29. */}
                    </div>
                </div>
            </Show>
        </div>
    )
}
