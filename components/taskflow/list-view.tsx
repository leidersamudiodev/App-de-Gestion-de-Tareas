"use client"

import { Calendar, Inbox } from "lucide-react"
import type { Task } from "@/lib/taskflow/types"
import { formatDueDate, isOverdue, progressFor } from "@/lib/taskflow/utils"
import { PriorityBadge } from "./priority-badge"
import { TagPill } from "./tag-pill"

interface ListViewProps {
  tasks: Task[]
  onOpenTask: (id: string) => void
}

const STATUS_LABEL: Record<Task["status"], { label: string; className: string }> = {
  todo: { label: "To do", className: "bg-muted text-muted-foreground" },
  doing: { label: "Doing", className: "bg-accent text-accent-foreground" },
  done: { label: "Done", className: "bg-success-soft text-success" },
}

export function ListView({ tasks, onOpenTask }: ListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Inbox className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">No tasks match your filters</p>
          <p className="mt-1 text-xs text-muted-foreground">Try clearing filters or adding a new task.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-border bg-background-muted/50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
        <span>Task</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due</span>
        <span>Progress</span>
        <span className="text-right">Owner</span>
      </div>

      <ul className="divide-y divide-border">
        {tasks.map((t) => {
          const progress = progressFor(t)
          const overdue = isOverdue(t)
          const s = STATUS_LABEL[t.status]
          return (
            <li
              key={t.id}
              onClick={() => onOpenTask(t.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onOpenTask(t.id)
                }
              }}
              role="button"
              tabIndex={0}
              className="group grid cursor-pointer grid-cols-1 items-center gap-2 px-5 py-3.5 transition-colors hover:bg-background-muted/60 focus:bg-background-muted/80 focus:outline-none md:grid-cols-[2fr_1fr_1fr_1fr_1fr_0.5fr] md:gap-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                  {t.title}
                </p>
                {t.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {t.tags.slice(0, 3).map((tag) => (
                      <TagPill key={tag} label={tag} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <span
                  className={[
                    "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
                    s.className,
                  ].join(" ")}
                >
                  {s.label}
                </span>
              </div>
              <div>
                <PriorityBadge priority={t.priority} />
              </div>
              <div
                className={[
                  "inline-flex items-center gap-1 text-xs",
                  overdue ? "text-destructive" : "text-muted-foreground",
                ].join(" ")}
              >
                <Calendar className="h-3 w-3" />
                {formatDueDate(t.dueDate)}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-muted">
                  <div
                    className={[
                      "h-full rounded-full transition-all",
                      progress === 100 ? "bg-success" : "bg-primary",
                    ].join(" ")}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[11px] font-medium text-muted-foreground tabular-nums">
                  {progress}%
                </span>
              </div>
              <div className="flex justify-end">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[10px] font-semibold text-primary-foreground"
                  title={t.assignee.name}
                >
                  {t.assignee.avatar}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
