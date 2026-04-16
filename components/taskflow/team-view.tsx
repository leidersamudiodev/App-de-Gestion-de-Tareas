"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Circle, Clock, MessageSquare, Sparkles, Users } from "lucide-react"
import { MEMBERS, tasksForMember } from "@/lib/taskflow/workspace-data"
import type { Task } from "@/lib/taskflow/types"
import { formatDueDate, formatRelative } from "@/lib/taskflow/utils"

interface TeamViewProps {
  tasks: Task[]
  onOpenTask: (id: string) => void
}

type Filter = "all" | "online" | "offline"

export function TeamView({ tasks, onOpenTask }: TeamViewProps) {
  const [filter, setFilter] = useState<Filter>("all")
  const [selectedId, setSelectedId] = useState<string>(MEMBERS[0].id)

  const membersWithStats = useMemo(() => {
    return MEMBERS.map((m) => {
      const assigned = tasksForMember(m, tasks)
      const done = assigned.filter((t) => t.status === "done").length
      const active = assigned.filter((t) => t.status !== "done").length
      const overdue = assigned.filter(
        (t) => t.status !== "done" && new Date(t.dueDate).getTime() < Date.now(),
      ).length
      return { member: m, assigned, done, active, overdue }
    })
  }, [tasks])

  const filtered = useMemo(() => {
    return membersWithStats.filter(({ member }) => {
      if (filter === "online") return member.online
      if (filter === "offline") return !member.online
      return true
    })
  }, [membersWithStats, filter])

  const selected = membersWithStats.find(({ member }) => member.id === selectedId) ?? membersWithStats[0]

  const recentActivity = useMemo(() => buildRecentActivity(tasks), [tasks])

  return (
    <div className="space-y-5">
      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={<Users className="h-4 w-4" />} label="Members" value={MEMBERS.length} />
        <StatTile
          icon={<Circle className="h-4 w-4 fill-success" />}
          label="Online"
          value={MEMBERS.filter((m) => m.online).length}
          tone="success"
        />
        <StatTile
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Tasks done"
          value={membersWithStats.reduce((acc, m) => acc + m.done, 0)}
        />
        <StatTile
          icon={<Clock className="h-4 w-4" />}
          label="In progress"
          value={membersWithStats.reduce((acc, m) => acc + m.active, 0)}
          tone="primary"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-soft">
        <span className="pl-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Show
        </span>
        {(
          [
            { v: "all", label: "Everyone" },
            { v: "online", label: "Online" },
            { v: "offline", label: "Offline" },
          ] as { v: Filter; label: string }[]
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

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        {/* Member grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map(({ member, assigned, done, active, overdue }) => {
            const isSelected = member.id === selected?.member.id
            return (
              <button
                key={member.id}
                onClick={() => setSelectedId(member.id)}
                className={[
                  "flex flex-col rounded-2xl border bg-card p-4 text-left shadow-card transition-all hover:shadow-card-hover",
                  isSelected ? "border-primary ring-2 ring-primary/20" : "border-border",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-xs font-semibold text-primary-foreground">
                        {member.initials}
                      </div>
                      <span
                        className={[
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
                          member.online ? "bg-success" : "bg-muted-foreground/40",
                        ].join(" ")}
                        aria-label={member.online ? "Online" : "Offline"}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold tracking-tight text-foreground">{member.name}</p>
                      <p className="text-[11px] text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <span
                    className={[
                      "rounded-md px-2 py-0.5 text-[10px] font-semibold",
                      member.online
                        ? "bg-success-soft text-success"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {member.online ? "Online" : member.lastSeen ?? "Offline"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Mini label="Assigned" value={assigned.length} />
                  <Mini label="Done" value={done} tone="success" />
                  <Mini label="Overdue" value={overdue} tone={overdue > 0 ? "destructive" : "muted"} />
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                    <span>Workload</span>
                    <span className="tabular-nums">{active} active</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(100, assigned.length === 0 ? 0 : (active / Math.max(assigned.length, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Detail pane */}
        <div className="space-y-4">
          {selected && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Member detail
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-sm font-semibold text-primary-foreground">
                  {selected.member.initials}
                </div>
                <div>
                  <p className="text-base font-semibold tracking-tight text-foreground">
                    {selected.member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{selected.member.role}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Assigned tasks
                </p>
                {selected.assigned.length === 0 ? (
                  <p className="mt-2 rounded-lg bg-background-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
                    No tasks assigned.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {selected.assigned.slice(0, 6).map((t) => (
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
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold tracking-tight text-foreground">Recent activity</p>
            </div>
            {recentActivity.length === 0 ? (
              <p className="mt-3 rounded-lg bg-background-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
                No recent activity.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {recentActivity.map((a) => (
                  <li key={a.id} className="flex gap-2.5">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-[9px] font-semibold text-primary-foreground">
                      {a.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-foreground">
                        <span className="font-semibold">{a.actor}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>
                      </p>
                      {a.taskTitle && (
                        <button
                          onClick={() => a.taskId && onOpenTask(a.taskId)}
                          className="mt-0.5 truncate text-[11px] font-medium text-primary hover:underline"
                        >
                          {a.taskTitle}
                        </button>
                      )}
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                        {a.icon}
                        {formatRelative(a.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Mini({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: number
  tone?: "default" | "success" | "destructive" | "muted"
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "destructive"
        ? "text-destructive"
        : tone === "muted"
          ? "text-muted-foreground"
          : "text-foreground"
  return (
    <div className="rounded-lg bg-background-muted/60 px-2 py-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  )
}

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone?: "success" | "primary"
}) {
  const toneClass =
    tone === "success"
      ? "bg-success-soft text-success"
      : tone === "primary"
        ? "bg-accent text-primary"
        : "bg-muted text-foreground"
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

interface ActivityItem {
  id: string
  actor: string
  avatar: string
  action: string
  taskId?: string
  taskTitle?: string
  at: string
  icon: React.ReactNode
}

function buildRecentActivity(tasks: Task[]): ActivityItem[] {
  const items: ActivityItem[] = []

  tasks.forEach((t) => {
    t.comments.forEach((c) => {
      items.push({
        id: `act_c_${c.id}`,
        actor: c.author,
        avatar: c.avatar,
        action: "commented on",
        taskId: t.id,
        taskTitle: t.title,
        at: c.createdAt,
        icon: <MessageSquare className="h-2.5 w-2.5" />,
      })
    })
    t.history.forEach((h) => {
      items.push({
        id: `act_h_${h.id}`,
        actor: h.actor,
        avatar: (h.actor
          .split(" ")
          .map((x) => x[0])
          .join("")
          .slice(0, 2) || "··").toUpperCase(),
        action: h.action.toLowerCase(),
        taskId: t.id,
        taskTitle: t.title,
        at: h.at,
        icon: <Circle className="h-2.5 w-2.5" />,
      })
    })
  })

  return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 8)
}
