"use client"

import { Calendar, CheckCircle2, GripVertical, ListChecks, MessageSquare } from "lucide-react"
import type { DragEvent } from "react"
import type { Task } from "@/lib/taskflow/types"
import { formatDueDate, isOverdue, progressFor } from "@/lib/taskflow/utils"
import { PriorityBadge } from "./priority-badge"
import { TagPill } from "./tag-pill"

interface TaskCardProps {
  task: Task
  onClick: () => void
  draggable?: boolean
  onDragStart?: (e: DragEvent<HTMLDivElement>, task: Task) => void
  onDragEnd?: (e: DragEvent<HTMLDivElement>) => void
}

export function TaskCard({ task, onClick, draggable, onDragStart, onDragEnd }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length
  const totalSubtasks = task.subtasks.length
  const progress = progressFor(task)
  const overdue = isOverdue(task)

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open task ${task.title}`}
      className="group animate-in-soft relative cursor-pointer rounded-xl border border-border bg-card p-3.5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {draggable && (
        <div className="absolute -left-0.5 top-1/2 hidden -translate-y-1/2 text-muted-foreground/30 group-hover:block">
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        {task.status === "done" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-medium text-success">
            <CheckCircle2 className="h-3 w-3" />
            Done
          </span>
        )}
      </div>

      <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-snug tracking-tight text-foreground">
        {task.title}
      </h3>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{task.description}</p>
      )}

      {task.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((t) => (
            <TagPill key={t} label={t} />
          ))}
          {task.tags.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {totalSubtasks > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ListChecks className="h-3 w-3" />
              {completedSubtasks}/{totalSubtasks} subtasks
            </span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={[
                "h-full rounded-full transition-all duration-500",
                progress === 100 ? "bg-success" : "bg-primary",
              ].join(" ")}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div
          className={[
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
            overdue
              ? "bg-destructive-soft text-destructive"
              : task.status === "done"
                ? "text-muted-foreground"
                : "text-muted-foreground",
          ].join(" ")}
        >
          <Calendar className="h-3 w-3" />
          {formatDueDate(task.dueDate)}
        </div>

        <div className="flex items-center gap-2">
          {task.comments.length > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {task.comments.length}
            </span>
          )}
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[9px] font-semibold text-primary-foreground ring-2 ring-card"
            title={task.assignee.name}
          >
            {task.assignee.avatar}
          </div>
        </div>
      </div>
    </div>
  )
}
