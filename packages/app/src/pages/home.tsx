import { useGlobalSync } from "@/context/global-sync"
import { createMemo, For, Match, Show, Switch } from "solid-js"
import { Button } from "@opencode-ai/ui/button"
import { ShopOSLogo } from "@opencode-ai/ui/shopos-logo"
import { useLayout } from "@/context/layout"
import { useNavigate } from "@solidjs/router"
import { base64Encode } from "@opencode-ai/util/encode"
import { Icon } from "@opencode-ai/ui/icon"
import { usePlatform } from "@/context/platform"
import { DateTime } from "luxon"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { DialogSelectDirectory } from "@/components/dialog-select-directory"
import { DialogSelectServer } from "@/components/dialog-select-server"
import { useServer } from "@/context/server"

export default function Home() {
  const sync = useGlobalSync()
  const layout = useLayout()
  const platform = usePlatform()
  const dialog = useDialog()
  const navigate = useNavigate()
  const server = useServer()
  const homedir = createMemo(() => sync.data.path.home)

  function openProject(directory: string) {
    layout.projects.open(directory)
    navigate(`/${base64Encode(directory)}`)
  }

  async function chooseProject() {
    function resolve(result: string | string[] | null) {
      if (Array.isArray(result)) {
        for (const directory of result) {
          openProject(directory)
        }
      } else if (result) {
        openProject(result)
      }
    }

    if (platform.openDirectoryPickerDialog && server.isLocal()) {
      const result = await platform.openDirectoryPickerDialog?.({
        title: "Open project",
        multiple: true,
      })
      resolve(result)
    } else {
      dialog.show(
        () => <DialogSelectDirectory multiple={true} onSelect={resolve} />,
        () => resolve(null),
      )
    }
  }

  return (
    <div class="relative w-full h-full flex flex-col items-center justify-center">
      <Button
        size="small"
        variant="ghost"
        class="absolute top-4 right-4 text-14-regular text-text-weak"
        onClick={() => dialog.show(() => <DialogSelectServer />)}
      >
        <div
          classList={{
            "size-2 rounded-full": true,
            "bg-icon-success-base": server.healthy() === true,
            "bg-icon-critical-base": server.healthy() === false,
            "bg-border-weak-base": server.healthy() === undefined,
          }}
        />
        {server.name}
      </Button>
      <div class="w-full max-w-xl px-4 flex flex-col items-center relative z-10">
        <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-10 text-center">
          <h1 class="text-6xl md:text-[2.5rem] font-medium text-text-strong tracking-wide pt-2">Welcome to</h1>
          <img
            src="/shopos-branding.png"
            class="h-16 md:h-24 w-auto object-contain"
            alt="ShopOS Branding"
          />
        </div>
        <p class="md:text-[1rem] text-text-subtle mb-10 text-center max-w-md">Your premium ecommerce operating system. Manage, analyze, and grow your business with ease.</p>

        <div class="flex justify-center">
          <Button
            size="large"
            variant="primary"
            class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg rounded-xl border-none"
            onClick={() => {
              const path = `${homedir()}/Documents/ShopOS/opencode`
              openProject(path)
            }}
          >
            Jump Right In
            <Icon name="chevron-right" class="ml-2" />
          </Button>
        </div>
      </div>

      {/* Decorative Background Elements - Premium Depth Layering */}
      <div class="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">

        {/* Layer 2: Medium, Slightly Focused */}
        {/* Shopping Bag (Blue) */}
        <div class="absolute top-[15%] left-[15%] animate-float opacity-5 text-blue-600">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" /></svg>
        </div>

        {/* Price Tag (Indigo) */}
        <div class="absolute bottom-[20%] right-[20%] animate-float-delayed opacity-5 text-indigo-600">
          <svg width="90" height="90" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-8.5-6H4v7.5L12.5 22l7.5-7.5zm-9.5-4c.83 0 1.5.67 1.5 1.5S11.33 11 10.5 11 9 10.33 9 9.5 9.67 8 10.5 8z" /></svg>
        </div>

        {/* Rising Graph (Green) */}
        <div class="absolute top-[20%] right-[10%] animate-float-slow opacity-5 text-emerald-600">
          <svg width="110" height="110" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" /></svg>
        </div>

        {/* Credit Card (Purple) */}
        <div class="absolute bottom-[15%] left-[10%] animate-float-delayed opacity-5 text-purple-600">
          <svg width="95" height="95" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" /></svg>
        </div>

        {/* Storefront (Orange) */}
        <div class="absolute top-[10%] left-[45%] animate-float opacity-5 text-orange-600">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" /></svg>
        </div>

        {/* Box/Package (Amber) */}
        <div class="absolute top-[50%] right-[5%] animate-float-slow opacity-5 text-amber-600">
          <svg width="85" height="85" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></svg>
        </div>

        {/* Layer 3: Smaller, crisper details to fill gaps */}
        {/* Wallet (Teal) */}
        <div class="absolute bottom-[40%] left-[25%] animate-float opacity-5 text-teal-600 scale-75">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>
        </div>

        {/* Diamond/Premium (Rose) */}
        <div class="absolute top-[35%] right-[25%] animate-float-delayed opacity-5 text-rose-600 scale-75">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 16l-5-5 5-5 5 5-5 5zm0-12l-5-5 5-5 5 5-5 5z" /></svg>
        </div>

        {/* Receipt (Gray) */}
        <div class="absolute bottom-[10%] right-[40%] animate-float-slow opacity-5 text-slate-600 scale-75">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z" /></svg>
        </div>

        {/* Calculator (Cyan) */}
        <div class="absolute top-[60%] left-[5%] animate-float opacity-5 text-cyan-600 scale-75">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 14H7v-2h6v2zm4 0h-2v-2h2v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
        </div>

        {/* Shield (Slate) */}
        <div class="absolute top-[5%] right-[35%] animate-float-delayed opacity-5 text-slate-500 scale-75">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg>
        </div>

        {/* Delivery Truck (Lime) */}
        <div class="absolute bottom-[35%] left-[80%] animate-float-slow opacity-5 text-lime-600 scale-75">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3v14h1v2h2v-2h8v2h2v-2h3v-2.06l1.95-3.16L21.36 10H20V8zm-2 5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM6 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>
        </div>
      </div>
    </div>
  )
}
