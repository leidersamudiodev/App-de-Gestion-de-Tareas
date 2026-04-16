"use client"

import { useMemo, useState } from "react"
import { ArrowRight, CheckCircle2, CircleDashed, Clock, FolderKanban, Users } from "lucide-react"
import { PROJECTS, MEMBERS, tasksForProject, type Project } from "@/lib/taskflow/workspace-data"
import type { Task } from "@/lib/taskflow/types"
import { formatDueDate } from "@/lib/taskflow/utils"

type StatusFilter = "all" | "active" | "at-risk" | "complete"

interface ProjectsViewProps {
  tasks: Task[]
  onOpenTask: (id: string) => void
}

function accentClasses(accent: Project["accent"]) {
  switch (accent) {
    case "success":
      return { dot: "bg-success", bar: "bg-success", soft: "bg-success-soft text-success" }
    case "warning":
      return { dot: "bg-warning", bar: "bg-warning", soft: "bg-warning-soft text-warning" }
    case "destructive":
      return {
        dot: "bg-destructive",
        bar: "bg-destructive",
        soft: "bg-destructive-soft text-destructive",
      }
    case "accent":
      return { dot: "bg-accent-foreground", bar: "bg-accent-foreground", soft: "bg-accent text-accent-foreground" }
    case "primary":
    default:
      return { dot: "bg-primary", bar: "bg-primary", soft: "bg-accent text-primary" }
  }
}

function computeProjectStats(project: Project, tasks: Task[]) {
  const scoped = tasksForProject(project, tasks)
  const total = scoped.length
  const done = scoped.filter((t) => t.status === "done").length
  const doing = scoped.filter((t) => t.status === "doing").length
  const overdue = scoped.filter(
    (t) => t.status !== "done" && new Date(t.dueDate).getTime() < Date.now(),
  ).length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)
  const members = Array.from(new Set(scoped.map((t) => t.assignee.avatar)))
  const nextDue = scoped
    .filter((t) => t.status !== "done")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
  return { scoped, total, done, doing, overdue, progress, members, nextDue }
}

export function ProjectsView({ tasks, onOpenTask }: ProjectsViewProps) {
  const [filter, setFilter] = useState<StatusFilter>("all")

  const projectsWithStats = useMemo(
    () => PROJECTS.map((p) => ({ project: p, stats: computeProjectStats(p, tasks) })),
    [tasks],
  )

  const filtered = useMemo(() => {
    return projectsWithStats.filter(({ stats }) => {
      if (filter === "all") return true
      if (filter === "active") return stats.progress < 100 && stats.overdue === 0
      if (filter === "at-risk") return stats.overdue > 0 && stats.progress < 100
      if (filter === "complete") return stats.progress === 100
      return true
    })
  }, [projectsWithStats, filter])

  const totals = useMemo(() => {
    const t = { total: 0, done: 0, doing: 0, overdue: 0 }
    projectsWithStats.forEach(({ stats }) => {
      t.total += stats.total
      t.done += stats.done
      t.doing += stats.doing
      t.overdue += stats.overdue
    })
    return t
  }, [projectsWithStats])

  const weekly = useMemo(() => buildWeekly(tasks), [tasks])

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryTile icon={<FolderKanban className="h-4 w-4" />} label="Projects" value={PROJECTS.length} />
        <SummaryTile icon={<CircleDashed className="h-4 w-4" />} label="Active tasks" value={totals.doing + (totals.total - totals.done - totals.doing)} />
        <SummaryTile icon={<CheckCircle2 className="h-4 w-4" />} label="Completed" value={totals.done} tone="success" />
        <SummaryTile icon={<Clock className="h-4 w-4" />} label="Overdue" value={totals.overdue} tone="destructive" />
      </div>

      {/* Filters + weekly progress */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-border bg-card p-3 shadow-soft">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pl-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </span>
            {(
              [
                { v: "all", label: "All projects" },
                { v: "active", label: "Active" },
                { v: "at-risk", label: "At risk" },
                { v: "complete", label: "Completed" },
              ] as { v: StatusFilter; label: string }[]
            ).map((opt) => (
              <button
                key={opt.v}
                onClick={() => setFilter(opt.v)}
                className={[
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === opt.v
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Weekly progress
            </p>
            <span className="text-[11px] font-medium text-success">+{weekly.done} done</span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-1.5">
            {weekly.bars.map((b, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={[
                    "w-full rounded-md transition-all",
                    b.isToday ? "bg-primary" : b.value > 0 ? "bg-primary/40" : "bg-muted",
                  ].join(" ")}
                  style={{ height: `${Math.max(6, b.height)}px` }}
                />
                <span className="text-[9px] font-medium text-muted-foreground">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm font-medium text-foreground">No projects match this filter.</p>
          <p className="mt-1 text-xs text-muted-foreground">Try another status to see more projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ project, stats }) => {
            const accent = accentClasses(project.accent)
            const previewTasks = stats.scoped.slice(0, 3)
            const leadMember = MEMBERS.find((m) => m.initials === project.lead)
            return (
              <article
                key={project.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-10 w-10 rounded-xl ${accent.soft} flex items-center justify-center`}>
                      <FolderKanban className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                        {project.name}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                        {stats.total} tasks · {stats.done} done
                      </p>
                    </div>
                  </div>
                  {stats.overdue > 0 && (
                    <span className="rounded-md bg-destructive-soft px-2 py-0.5 text-[10px] font-semibold text-destructive">
                      {stats.overdue} overdue
                    </span>
                  )}
                </div>

                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground tabular-nums">{stats.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${accent.bar}`}
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                </div>

                {previewTasks.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {previewTasks.map((t) => (
                      <li key={t.id}>
                        <button
                          onClick={() => onOpenTask(t.id)}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-background-muted/60"
                        >
                          <span
                            className={[
                              "h-1.5 w-1.5 flex-shrink-0 rounded-full",
                              t.status === "done"
                                ? "bg-success"
                                : t.status === "doing"
                                  ? "bg-primary"
                                  : "bg-muted-foreground/40",
                            ].join(" ")}
                          />
                          <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                            {t.title}
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {formatDueDate(t.dueDate)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex -space-x-1.5">
                      {stats.members.slice(0, 4).map((m) => (
                        <div
                          key={m}
                          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-gradient-to-br from-primary/80 to-primary text-[9px] font-semibold text-primary-foreground"
                          title={MEMBERS.find((mm) => mm.initials === m)?.name ?? m}
                        >
                          {m}
                        </div>
                      ))}
                    </div>
                    {leadMember && (
                      <span className="ml-1 text-[11px] text-muted-foreground">
                        Lead {leadMember.name.split(" ")[0]}
                      </span>
                    )}
                  </div>
                  {stats.nextDue ? (
                    <button
                      onClick={() => onOpenTask(stats.nextDue!.id)}
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-primary hover:bg-accent"
                    >
                      Next {formatDueDate(stats.nextDue.dueDate)}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success">
                      <CheckCircle2 className="h-3 w-3" /> All clear
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SummaryTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone?: "success" | "destructive"
}) {
  const toneClass =
    tone === "success"
      ? "bg-success-soft text-success"
      : tone === "destructive"
        ? "bg-destructive-soft text-destructive"
        : "bg-accent text-primary"
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      </div>
    </div>
  )
}

function buildWeekly(tasks: Task[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const start = new Date(today)
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  let done = 0
  const bars = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const dayDone = tasks.filter((t) => {
      if (t.status !== "done") return false
      const u = new Date(t.updatedAt)
      u.setHours(0, 0, 0, 0)
      return u.getTime() === d.getTime()
    }).length
    const dayTotal = tasks.filter((t) => {
      const dd = new Date(t.dueDate)
      dd.setHours(0, 0, 0, 0)
      return dd.getTime() === d.getTime()
    }).length
    done += dayDone
    return {
      label: labels[i],
      value: dayTotal + dayDone,
      height: dayTotal * 8 + dayDone * 10,
      isToday: d.getTime() === today.getTime(),
    }
  })
  return { bars, done: Math.max(done, 1) }
}
