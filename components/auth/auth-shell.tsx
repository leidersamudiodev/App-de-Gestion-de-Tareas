import Link from "next/link"
import { CheckCircle2, LayoutGrid, Sparkles, Zap } from "lucide-react"

interface AuthShellProps {
  children: React.ReactNode
  eyebrow: string
  title: string
  subtitle: string
  footer: React.ReactNode
}

// Deterministic particle configuration so SSR and client match exactly.
const PARTICLES: Array<{
  left: string
  size: number
  duration: string
  delay: string
  opacity: number
}> = [
  { left: "6%", size: 6, duration: "11s", delay: "0s", opacity: 0.6 },
  { left: "14%", size: 4, duration: "13s", delay: "2.2s", opacity: 0.5 },
  { left: "22%", size: 8, duration: "15s", delay: "4.8s", opacity: 0.55 },
  { left: "31%", size: 5, duration: "12s", delay: "1.4s", opacity: 0.65 },
  { left: "40%", size: 3, duration: "14s", delay: "3.6s", opacity: 0.45 },
  { left: "48%", size: 7, duration: "10s", delay: "5.2s", opacity: 0.6 },
  { left: "57%", size: 4, duration: "13.5s", delay: "0.8s", opacity: 0.5 },
  { left: "66%", size: 6, duration: "11.5s", delay: "2.9s", opacity: 0.55 },
  { left: "74%", size: 5, duration: "14.5s", delay: "4.2s", opacity: 0.6 },
  { left: "82%", size: 3, duration: "12.5s", delay: "1.1s", opacity: 0.4 },
  { left: "90%", size: 7, duration: "10.5s", delay: "3.1s", opacity: 0.5 },
  { left: "96%", size: 4, duration: "13s", delay: "5.6s", opacity: 0.55 },
]

export function AuthShell({ children, eyebrow, title, subtitle, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left — brand & highlights with animated premium background */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-10 text-primary-foreground lg:flex">
        {/* Layer 1 — slow-shifting base gradient */}
        <div className="auth-gradient absolute inset-0" aria-hidden />

        {/* Layer 2 — soft radial vignette for depth */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(100% 60% at 100% 100%, rgba(6,182,212,0.35), transparent 55%)",
          }}
        />

        {/* Layer 3 — drifting blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="animate-blob-a absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #e0f7fa 0%, rgba(103,232,249,0.55) 45%, transparent 70%)",
            }}
          />
          <div
            className="animate-blob-b absolute right-[-120px] top-1/3 h-[380px] w-[380px] rounded-full opacity-55 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #22d3ee 0%, rgba(34,211,238,0.45) 50%, transparent 75%)",
            }}
          />
          <div
            className="animate-blob-c absolute -bottom-32 left-1/4 h-[460px] w-[460px] rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #67e8f9 0%, rgba(6,182,212,0.4) 55%, transparent 80%)",
            }}
          />
        </div>

        {/* Layer 4 — subtle tech grid */}
        <div className="auth-grid-overlay pointer-events-none absolute inset-0 opacity-60" aria-hidden />

        {/* Layer 5 — floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="animate-particle absolute bottom-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              style={
                {
                  left: p.left,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  opacity: p.opacity,
                  "--particle-duration": p.duration,
                  "--particle-delay": p.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Top — brand */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-[0_8px_24px_rgba(6,182,212,0.35)] backdrop-blur-md">
            <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[17px] font-semibold tracking-tight drop-shadow-[0_1px_8px_rgba(0,0,0,0.12)]">
              TaskFlow
            </span>
            <span className="rounded-md border border-white/20 bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
              Pro
            </span>
          </div>
        </Link>

        {/* Middle — copy + testimonial (glassmorphism) */}
        <div className="relative z-10 max-w-md space-y-6">
          <h2 className="text-pretty text-3xl font-semibold leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
            The calm, focused way to ship meaningful work.
          </h2>
          <ul className="space-y-3.5 text-sm text-white/90">
            <Feature icon={<CheckCircle2 className="h-4 w-4" />} text="Kanban, List and Calendar — switch instantly" />
            <Feature icon={<Zap className="h-4 w-4" />} text="Smart filters, streaks and productivity reports" />
            <Feature icon={<Sparkles className="h-4 w-4" />} text="Real-time team collaboration and comments" />
          </ul>

          {/* Glassmorphism testimonial */}
          <div className="relative">
            {/* Soft pulsing glow behind card */}
            <div
              className="animate-glow-pulse pointer-events-none absolute -inset-2 rounded-3xl blur-2xl"
              aria-hidden
              style={{
                background:
                  "radial-gradient(60% 80% at 30% 30%, rgba(255,255,255,0.35), transparent 70%)",
              }}
            />
            <blockquote
              className="relative rounded-2xl border border-white/25 bg-white/15 p-5 text-sm leading-relaxed text-white/95 shadow-[0_8px_32px_rgba(8,47,73,0.18),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl backdrop-saturate-150"
            >
              <svg
                className="mb-2 h-5 w-5 text-white/70"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M9.5 6C5.9 6 3 8.9 3 12.5V18h6v-5.5H6c0-1.9 1.6-3.5 3.5-3.5V6zm11 0c-3.6 0-6.5 2.9-6.5 6.5V18h6v-5.5h-3c0-1.9 1.6-3.5 3.5-3.5V6z" />
              </svg>
              <p className="font-medium">
                TaskFlow replaced three tools for our design team. The default views actually match how we work.
              </p>
              <footer className="mt-3 flex items-center gap-2.5 border-t border-white/20 pt-3 text-xs text-white/80">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/20 text-[11px] font-semibold backdrop-blur-sm">
                  LG
                </span>
                <span>
                  <span className="font-semibold text-white">Lucía García</span>
                  <span className="block text-[11px] text-white/70">Lead Designer · Nova Studio</span>
                </span>
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Bottom — legal */}
        <p className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} TaskFlow Labs. All rights reserved.
        </p>
      </aside>

      {/* Right — form */}
      <main className="flex w-full flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-foreground">TaskFlow</span>
          </Link>

          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
            <h1 className="mt-2 text-balance text-[28px] font-semibold leading-tight tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
      </main>
    </div>
  )
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md">
        {icon}
      </span>
      <span className="drop-shadow-[0_1px_6px_rgba(0,0,0,0.08)]">{text}</span>
    </li>
  )
}
