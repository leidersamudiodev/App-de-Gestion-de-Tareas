import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "TaskFlow — Premium Task Management",
    template: "%s · TaskFlow",
  },
  description:
    "TaskFlow is a modern task management workspace with Kanban, list and calendar views, smart filters, streaks and productivity reports.",
  applicationName: "TaskFlow",
  keywords: ["TaskFlow", "task management", "kanban", "productivity", "project management", "team collaboration"],
  authors: [{ name: "TaskFlow Labs" }],
  openGraph: {
    title: "TaskFlow — Premium Task Management",
    description: "Kanban, list and calendar views, smart filters, streaks and productivity reports.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#f5f7fb",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid #dbe3ec",
              color: "#1e293b",
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            },
          }}
        />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
