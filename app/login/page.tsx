import Link from "next/link"
import type { Metadata } from "next"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign in — TaskFlow",
  description: "Sign in to your TaskFlow workspace to manage your team’s tasks, projects and calendars.",
}

export default function LoginPage() {
  return (
    <AuthGuard reverse redirectTo="/">
      <AuthShell
        eyebrow="Welcome back"
        title="Sign in to TaskFlow"
        subtitle="Pick up right where you left off — all your boards, filters and reports are ready."
        footer={
          <span>
            Don’t have an account yet?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </span>
        }
      >
        <LoginForm />
      </AuthShell>
    </AuthGuard>
  )
}
