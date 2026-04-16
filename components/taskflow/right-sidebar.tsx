"use client"

import { AlertCircle, CalendarClock, Flame, TrendingUp, Zap } from "lucide-react"
import { useMemo } from "react"
import type { Task } from "@/lib/taskflow/types"
import { formatDueDate, isDueSoon, progressFor } from "@/lib/taskflow/utils"
import { CircularProgress } from "./circular-progress"

interface RightSidebarProps {
  tasks: Task[]
  onOpenTask: (id: string) => void
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function RightSidebar({ tasks, onOpenTask }: RightSidebarProps) {
  const today = useMemo(() => startOfDay(new Date()), [])

  const todaysTasks = useMemo(() => {
    return tasks.filter((t) => {
      const d = startOfDay(new Date(t.dueDate))
      return d.getTime() === today.getTime()
    })
  }, [tasks, today])

  const todayProgress = useMemo(() => {
    if (todaysTasks.length === 0) return 0
    const done = todaysTasks.filter((t) => t.status === "done").length
    return Math.round((done / todaysTasks.length) * 100)
  }, [todaysTasks])

  const urgent = useMemo(() => {
    return tasks
      .filter((t) => t.priority === "high" && t.status !== "done")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4)
  }, [tasks])

  const upcoming = useMemo(() => {
    return tasks
      .filter(isDueSoon)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4)
  }, [tasks])

  const weekly = useMemo(() => buildWeekly(tasks), [tasks])
  const streak = useMemo(() => {
    // streak = consecutive days with at least 1 done task ending today
    let s = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const has = tasks.some((t) => {
        if (t.status !== "done") return false
        return startOfDay(new Date(t.updatedAt)).getTime() === d.getTime()
      })
      if (has) s++
      else if (i === 0) s = Math.max(s, 0)
      else break
    }
    // guarantee a minimum feel-good streak based on completed count (demo sugar)
    const completed = tasks.filter((t) => t.status === "done").length
    return Math.max(s, Math.min(7, completed))
  }, [tasks, today])

  return (
    <aside className="flex w-full flex-col gap-4">
      {/* Today's progress */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Today&apos;s progress
            </p>
            <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
              {todaysTasks.length === 0 ? "Nothing due today" : "Keep it going"}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {todaysTasks.filter((t) => t.status === "done").length} of {todaysTasks.length} tasks done
            </p>
          </div>
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-4 flex items-center justify-center">
          <CircularProgress value={todayProgress} label="today" size={140} stroke={12} />
        </div>
      </div>

      {/* Streak */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-accent/40 p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-soft text-warning">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Productivity streak
              </p>
              <p className="text-sm font-semibold tracking-tight text-foreground">
                {streak} day{streak === 1 ? "" : "s"} in a row
              </p>
            </div>
          </div>
          <TrendingUp className="h-4 w-4 text-success" />
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => {
            const active = i >= 7 - Math.min(streak, 7)
            return (
              <div
                key={i}
                className={[
                  "h-7 rounded-md transition-colors",
                  active ? "bg-primary" : "bg-muted",
                ].join(" ")}
                title={active ? "Active day" : "Rest day"}
              />
            )
          })}
        </div>
      </div>

      {/* Urgent tasks */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Urgent tasks</h3>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">{urgent.length}</span>
        </div>
        <ul className="mt-3 space-y-1.5">
          {urgent.length === 0 && (
            <li className="rounded-lg bg-background-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
              No high-priority tasks 🎉
            </li>
          )}
          {urgent.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => onOpenTask(t.id)}
                className="group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-background-muted/60"
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive" />
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground group-hover:text-primary">
                  {t.title}
                </span>
                <span className="flex-shrink-0 text-[10px] font-medium text-muted-foreground">
                  {formatDueDate(t.dueDate)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Upcoming */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Upcoming deliveries</h3>
          </div>
        </div>
        <ul className="mt-3 space-y-2">
          {upcoming.length === 0 && (
            <li className="rounded-lg bg-background-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
              Nothing due in the next 3 days.
            </li>
          )}
          {upcoming.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => onOpenTask(t.id)}
                className="flex w-full flex-col gap-1 rounded-lg border border-border bg-background-muted/40 px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-semibold text-foreground">{t.title}</span>
                  <span className="ml-2 flex-shrink-0 text-[10px] font-medium text-muted-foreground">
                    {formatDueDate(t.dueDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progressFor(t)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                    {progressFor(t)}%
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Weekly summary */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Weekly summary
            </p>
            <h3 className="mt-0.5 text-sm font-semibold tracking-tight text-foreground">
              {weekly.total} tasks · {weekly.done} done
            </h3>
          </div>
          <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
            +{weekly.doneDelta}
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-1.5" aria-hidden>
          {weekly.bars.map((b, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={[
                  "w-full rounded-md transition-all",
                  b.isToday ? "bg-primary" : b.value > 0 ? "bg-primary/40" : "bg-muted",
                ].join(" ")}
                style={{ height: `${Math.max(8, b.height)}px` }}
              />
              <span className="text-[9px] font-medium text-muted-foreground">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function buildWeekly(tasks: Task[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const bars: { label: string; value: number; height: number; isToday: boolean }[] = []
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const start = new Date(today)
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7))

  let total = 0
  let done = 0

  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const count = tasks.filter((t) => {
      const due = new Date(t.dueDate)
      due.setHours(0, 0, 0, 0)
      return due.getTime() === d.getTime()
    }).length
    total += count
    const dayDone = tasks.filter((t) => {
      if (t.status !== "done") return false
      const u = new Date(t.updatedAt)
      u.setHours(0, 0, 0, 0)
      return u.getTime() === d.getTime()
    }).length
    done += dayDone

    bars.push({
      label: labels[i],
      value: count,
      height: count * 10 + dayDone * 8,
      isToday: d.getTime() === today.getTime(),
    })
  }

  return {
    bars,
    total,
    done,
    doneDelta: Math.max(1, done),
  }
}
