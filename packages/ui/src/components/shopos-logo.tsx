import "./shopos-logo.css"

export interface ShopOSLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  class?: string
}

export function ShopOSLogo(props: ShopOSLogoProps) {
  const size = () => props.size ?? "md"

  return (
    <div
      data-component="shopos-logo"
      data-size={size()}
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <div data-slot="icon">
        <img src="/logo.png" alt="ShopOS Logo" class="w-full h-full object-contain" />
      </div>
      {props.showText !== false && (
        <span data-slot="text">ShopOS</span>
      )}
    </div>
  )
}

export function ShopOSMark(props: { class?: string }) {
  return (
    <img
      src="/logo.png"
      alt="ShopOS Mark"
      data-component="shopos-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
    />
  )

}
