import Link from "next/link"
import type { Metadata } from "next"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create account — TaskFlow",
  description: "Start your TaskFlow workspace and bring calm, focused execution to your team.",
}

export default function RegisterPage() {
  return (
    <AuthGuard reverse redirectTo="/">
      <AuthShell
        eyebrow="Get started"
        title="Create your TaskFlow account"
        subtitle="Ship more with fewer tools — Kanban, calendar, reports and team collaboration in one calm workspace."
        footer={
          <span>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </span>
        }
      >
        <RegisterForm />
      </AuthShell>
    </AuthGuard>
  )
}
