"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/use-auth"
import { LayoutGrid } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  /** when true, redirects authenticated users AWAY (e.g. from /login to /) */
  reverse?: boolean
  redirectTo?: string
}

export function AuthGuard({ children, reverse = false, redirectTo }: AuthGuardProps) {
  const router = useRouter()
  const { user, hydrated } = useAuth()

  useEffect(() => {
    if (!hydrated) return
    if (!reverse && !user) {
      router.replace(redirectTo ?? "/login")
    } else if (reverse && user) {
      router.replace(redirectTo ?? "/")
    }
  }, [hydrated, user, reverse, redirectTo, router])

  // Hold the UI until we know the auth state to avoid flashing protected content
  const shouldHold = !hydrated || (!reverse && !user) || (reverse && !!user)
  if (shouldHold) {
    return <AuthLoader />
  }

  return <>{children}</>
}

function AuthLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background" aria-busy="true">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
        <LayoutGrid className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        <span>Preparing your workspace…</span>
      </div>
    </div>
  )
}
