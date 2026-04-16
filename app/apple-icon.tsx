import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0ea5b7 0%, #06b6d4 100%)",
        borderRadius: 40,
      }}
    >
      <svg width="110" height="110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="17" rx="3" stroke="#ffffff" strokeWidth="2" />
        <path d="M7.5 10.5l2.25 2.25L14.25 8.25" stroke="#ffffff" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="7.5" y1="16" x2="16.5" y2="16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>,
    { ...size },
  )
}
