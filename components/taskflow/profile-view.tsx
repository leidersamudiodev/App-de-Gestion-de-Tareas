"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Flame,
  LayoutGrid,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/use-auth"
import { useTaskflow } from "@/hooks/use-taskflow"
import { isOverdue } from "@/lib/taskflow/utils"

export function ProfileView() {
  const router = useRouter()
  const { user, logout, updateUser } = useAuth()
  const { tasks, hydrated: tasksHydrated } = useTaskflow()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? "")
  const [role, setRole] = useState(user?.role ?? "")
  const [saving, setSaving] = useState(false)

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "done").length
    const inProgress = tasks.filter((t) => t.status === "doing").length
    const overdue = tasks.filter(isOverdue).length
    const total = tasks.length || 1
    const completionRate = Math.round((completed / total) * 100)

    // Streak = count of recent consecutive days that have at least one completion
    const completionDays = new Set(
      tasks
        .filter((t) => t.status === "done")
        .map((t) => new Date(t.updatedAt).toISOString().slice(0, 10)),
    )
    let streak = 0
    const cursor = new Date()
    for (let i = 0; i < 60; i++) {
      const key = cursor.toISOString().slice(0, 10)
      if (completionDays.has(key)) streak++
      else if (i !== 0) break
      cursor.setDate(cursor.getDate() - 1)
    }

    // Last 7 days productivity
    const week: { day: string; done: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const count = tasks.filter(
        (t) => t.status === "done" && new Date(t.updatedAt).toISOString().slice(0, 10) === key,
      ).length
      week.push({ day: d.toLocaleDateString(undefined, { weekday: "short" }), done: count })
    }
    const maxDone = Math.max(1, ...week.map((w) => w.done))

    return { completed, inProgress, overdue, completionRate, streak, week, maxDone }
  }, [tasks])

  if (!user) return null

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })

  const handleSave = async () => {
    if (name.trim().length < 2) {
      toast.error("Please enter your full name.")
      return
    }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    updateUser({ name: name.trim(), role: role.trim() || "Team Member" })
    setSaving(false)
    setEditing(false)
    toast.success("Profile updated")
  }

  const handleLogout = () => {
    logout()
    toast("Signed out", { description: "See you soon." })
    router.replace("/login")
  }

  const recent = tasks
    .filter((t) => t.status === "done")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to workspace</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-muted"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
                <LayoutGrid className="h-4.5 w-4.5" strokeWidth={2.25} />
              </div>
              <span className="hidden text-[15px] font-semibold tracking-tight text-foreground sm:inline">
                TaskFlow
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 md:py-10 animate-in-soft">
        {/* Hero card */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-primary to-primary-hover" aria-hidden />
          <div className="relative px-6 pb-6 pt-16 md:px-8 md:pt-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary to-primary-hover text-xl font-semibold text-primary-foreground shadow-card-hover md:h-24 md:w-24 md:text-2xl">
                  {user.initials}
                </div>
                <div className="min-w-0 pb-1">
                  {!editing ? (
                    <>
                      <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground md:text-[26px]">
                        {user.name}
                      </h1>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          {user.email}
                        </span>
                        <span className="text-border">·</span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
                          <ShieldCheck className="h-3 w-3" />
                          {user.role}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-lg font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:w-80"
                        placeholder="Your name"
                      />
                      <input
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:w-80"
                        placeholder="Your role"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!editing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setName(user.name)
                        setRole(user.role)
                        setEditing(true)
                      }}
                      className="h-9 gap-1.5 rounded-lg border-border"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit profile
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="h-9 gap-1.5 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="h-9 gap-1.5 rounded-lg border-border"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save changes
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <MetaPill icon={<Sparkles className="h-3.5 w-3.5 text-warning" />} label={`${user.plan} plan`} />
              <MetaPill icon={<CheckCircle2 className="h-3.5 w-3.5 text-success" />} label={`Member since ${memberSince}`} />
              <MetaPill icon={<Flame className="h-3.5 w-3.5 text-destructive" />} label={`${stats.streak}-day streak`} />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            icon={<CheckCircle2 className="h-4 w-4 text-success" />}
            label="Completed"
            value={stats.completed}
            helper={`${stats.completionRate}% completion rate`}
          />
          <StatCard
            icon={<Target className="h-4 w-4 text-primary" />}
            label="In progress"
            value={stats.inProgress}
            helper="Currently active tasks"
          />
          <StatCard
            icon={<Flame className="h-4 w-4 text-destructive" />}
            label="Streak"
            value={`${stats.streak}d`}
            helper="Consecutive active days"
          />
          <StatCard
            icon={<Award className="h-4 w-4 text-warning" />}
            label="Overdue"
            value={stats.overdue}
            helper={stats.overdue === 0 ? "All on track" : "Needs attention"}
          />
        </section>

        {/* Two columns */}
        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Weekly productivity */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground">Weekly productivity</h2>
                <p className="text-xs text-muted-foreground">Tasks completed across the last 7 days</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                <TrendingUp className="h-3.5 w-3.5" />
                {stats.completed > 0 ? `+${stats.completed} this week` : "No activity yet"}
              </div>
            </div>
            <div className="flex items-end gap-3" style={{ height: 160 }}>
              {stats.week.map((w) => {
                const h = (w.done / stats.maxDone) * 100
                return (
                  <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary transition-all"
                        style={{ height: `${Math.max(6, h)}%` }}
                        title={`${w.done} completed`}
                      />
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {w.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold tracking-tight text-foreground">Achievements</h2>
            <ul className="space-y-2.5">
              <Achievement
                unlocked={stats.completed >= 1}
                icon={<CheckCircle2 className="h-4 w-4 text-success" />}
                title="First finish"
                desc="Complete your first task"
              />
              <Achievement
                unlocked={stats.completed >= 10}
                icon={<Award className="h-4 w-4 text-warning" />}
                title="On a roll"
                desc="Complete 10 tasks total"
              />
              <Achievement
                unlocked={stats.streak >= 3}
                icon={<Flame className="h-4 w-4 text-destructive" />}
                title="Focused week"
                desc="Maintain a 3-day streak"
              />
              <Achievement
                unlocked={stats.completionRate >= 60}
                icon={<Target className="h-4 w-4 text-primary" />}
                title="Consistent closer"
                desc="Reach a 60% completion rate"
              />
            </ul>
          </div>
        </section>

        {/* Recent completions */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Recently completed</h2>
            <Link href="/" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {!tasksHydrated ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No completed tasks yet — go make some progress!</p>
              <Link
                href="/"
                className="mt-1 text-xs font-medium text-primary hover:underline"
              >
                Open workspace
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{t.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {t.tags.slice(0, 3).join(" · ") || "No tags"}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(t.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

function MetaPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1">
      {icon}
      {label}
    </span>
  )
}

function StatCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  helper: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{helper}</p>
    </div>
  )
}

function Achievement({
  unlocked,
  icon,
  title,
  desc,
}: {
  unlocked: boolean
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <li
      className={[
        "flex items-start gap-3 rounded-lg border p-2.5",
        unlocked ? "border-border bg-background" : "border-dashed border-border bg-muted/40 opacity-70",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
          unlocked ? "bg-accent" : "bg-muted",
        ].join(" ")}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      {unlocked && (
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-success">Unlocked</span>
      )}
    </li>
  )
}
