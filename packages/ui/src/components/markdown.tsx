import { useMarked } from "../context/marked"
import DOMPurify from "dompurify"
import { checksum } from "@opencode-ai/util/encode"
import { ComponentProps, createResource, splitProps, createEffect, onCleanup } from "solid-js"
import { isServer, render } from "solid-js/web"
import { Chart, type ChartData } from "./chart"
import { MarkdownImage } from "./markdown-image"

type Entry = {
  hash: string
  html: string
}

const max = 200
const cache = new Map<string, Entry>()

if (typeof window !== "undefined" && DOMPurify.isSupported) {
  DOMPurify.addHook("afterSanitizeAttributes", (node: Element) => {
    if (!(node instanceof HTMLAnchorElement)) return
    if (node.target !== "_blank") return

    const rel = node.getAttribute("rel") ?? ""
    const set = new Set(rel.split(/\s+/).filter(Boolean))
    set.add("noopener")
    set.add("noreferrer")
    node.setAttribute("rel", Array.from(set).join(" "))
  })
}

const config = {
  USE_PROFILES: { html: true, mathMl: true },
  SANITIZE_NAMED_PROPS: true,
  FORBID_TAGS: ["style"],
  FORBID_CONTENTS: ["style", "script"],
  ADD_TAGS: ["opencode-chart", "opencode-image"],
  ADD_ATTR: ["data-chart", "data-src", "data-alt", "data-title"],
}

function sanitize(html: string) {
  if (!DOMPurify.isSupported) return ""
  return DOMPurify.sanitize(html, config)
}

function touch(key: string, value: Entry) {
  cache.delete(key)
  cache.set(key, value)

  if (cache.size <= max) return

  const first = cache.keys().next().value
  if (!first) return
  cache.delete(first)
}

export function Markdown(
  props: ComponentProps<"div"> & {
    text: string
    cacheKey?: string
    class?: string
    classList?: Record<string, boolean>
  },
) {
  let ref: HTMLDivElement | undefined
  const [local, others] = splitProps(props, ["text", "cacheKey", "class", "classList"])
  const marked = useMarked()
  const [html] = createResource(
    () => local.text,
    async (markdown) => {
      if (isServer) return ""

      const hash = checksum(markdown)
      const key = local.cacheKey ?? hash

      if (key && hash) {
        const cached = cache.get(key)
        if (cached && cached.hash === hash) {
          touch(key, cached)
          return cached.html
        }
      }

      const next = await marked.parse(markdown)
      const safe = sanitize(next)
      if (key && hash) touch(key, { hash, html: safe })
      return safe
    },
    { initialValue: "" },
  )
  createEffect(() => {
    if (!ref || !html.latest) return

    // Clean up previous charts if any exist in the same ref (though likely html update replaced them)
    // In Solid's fine-grained reactivity, we just mount new ones. 
    // Since innerHTML replaced the DOM nodes, we don't need to dispose previous renders attached to *old* nodes.
    // They are garbage collected. We strictly need to mount on *new* nodes.

    const charts = ref.querySelectorAll("opencode-chart")
    charts.forEach((el) => {
      // Avoid double mounting
      if (el.hasAttribute("data-mounted")) return
      el.setAttribute("data-mounted", "true")

      try {
        const raw = el.getAttribute("data-chart")
        if (!raw) return
        const data = JSON.parse(atob(raw)) as ChartData

        // Render the Chart component into the custom element
        render(() => <Chart data={data} />, el)
      } catch (e) {
        console.error("Failed to hydrate chart", e)
        el.innerHTML = `<div class="p-2 text-xs text-red-500 bg-red-50 border border-red-200 rounded">Failed to load chart</div>`
      }
    })

    const images = ref.querySelectorAll("opencode-image")
    images.forEach((el) => {
      if (el.hasAttribute("data-mounted")) return
      el.setAttribute("data-mounted", "true")

      try {
        const rawSrc = el.getAttribute("data-src")
        const rawAlt = el.getAttribute("data-alt")
        const rawTitle = el.getAttribute("data-title")

        if (!rawSrc) return

        const src = atob(rawSrc)
        const alt = rawAlt ? atob(rawAlt) : ""
        const title = rawTitle ? atob(rawTitle) : undefined

        // Import MarkdownImage is needed. Let's rely on standard import at top of file.
        // Wait, I haven't added the import yet. I will do that in a separate multi-replace or now?
        // I am in `replace_file_content`. I cannot add import here easily without context.
        // I will assume standard `render` works if I pass the component function.
        // But I need to import it. I'll add the import in the next tool call.

        // For now, let's just use the logic, expecting the import to be there.
        // Wait, if I don't import `MarkdownImage`, this code will fail at runtime or compile time.
        // I should separate the import addition.
        // But I can't use `MarkdownImage` here if it's not imported.
        // I'll add the logic now and then immediately add the import.

        // Wait, `MarkdownImage` needs to be imported.
        // I will use `Dynamic` if possible? No, static import is better.

        render(() => <MarkdownImage src={src} alt={alt} title={title} />, el)

      } catch (e) {
        console.error("Failed to hydrate image", e)
        el.innerHTML = `<span class="text-xs text-error">Failed to load image</span>`
      }
    })
  })

  return (
    <div
      ref={ref}
      data-component="markdown"
      classList={{
        ...(local.classList ?? {}),
        [local.class ?? ""]: !!local.class,
      }}
      innerHTML={html.latest}
      {...others}
    />
  )
}
