"use client"

import {
  Calendar,
  Check,
  Clock,
  History,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import type { Task, TaskPriority, TaskStatus } from "@/lib/taskflow/types"
import { formatRelative, progressFor } from "@/lib/taskflow/utils"
import { PriorityBadge } from "./priority-badge"
import { TagPill } from "./tag-pill"

interface TaskModalProps {
  task: Task | null
  onClose: () => void
  onUpdate: (id: string, updater: (t: Task) => Task) => void
  onDelete: (id: string) => void
  onToggleSubtask: (taskId: string, subtaskId: string) => void
  onAddSubtask: (taskId: string, title: string) => void
  onRemoveSubtask: (taskId: string, subtaskId: string) => void
  onAddComment: (taskId: string, message: string) => void
}

export function TaskModal(props: TaskModalProps) {
  const { task, onClose, onUpdate, onDelete, onToggleSubtask, onAddSubtask, onRemoveSubtask, onAddComment } = props

  const [newSubtask, setNewSubtask] = useState("")
  const [newComment, setNewComment] = useState("")
  const [titleDraft, setTitleDraft] = useState("")
  const [descDraft, setDescDraft] = useState("")

  useEffect(() => {
    setTitleDraft(task?.title ?? "")
    setDescDraft(task?.description ?? "")
    setNewSubtask("")
    setNewComment("")
  }, [task?.id, task?.title, task?.description])

  useEffect(() => {
    if (!task) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [task, onClose])

  if (!task) return null

  const progress = progressFor(task)

  const commitTitle = () => {
    const t = titleDraft.trim()
    if (!t || t === task.title) return
    onUpdate(task.id, (x) => ({
      ...x,
      title: t,
      history: [
        { id: `h_${Date.now()}`, action: `Renamed task`, actor: "You", at: new Date().toISOString() },
        ...x.history,
      ],
    }))
  }
  const commitDesc = () => {
    if (descDraft === task.description) return
    onUpdate(task.id, (x) => ({ ...x, description: descDraft }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/25 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Task: ${task.title}`}
        className="animate-in-soft relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-card-hover sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-border px-6 py-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} size="md" />
              <StatusPill status={task.status} />
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                Updated {formatRelative(task.updatedAt)}
              </span>
            </div>
            <input
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  ;(e.target as HTMLInputElement).blur()
                }
              }}
              className="mt-2 w-full border-none bg-transparent p-0 text-xl font-semibold tracking-tight text-foreground focus:outline-none"
              aria-label="Task title"
            />
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="scrollbar-thin grid grid-cols-1 gap-6 overflow-y-auto px-6 py-5 md:grid-cols-[1fr_260px]">
          <div className="space-y-6">
            {/* Description */}
            <section>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </h4>
              <textarea
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                onBlur={commitDesc}
                placeholder="Add a description…"
                rows={3}
                className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </section>

            {/* Subtasks */}
            <section>
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Subtasks
                </h4>
                <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} · {progress}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={[
                    "h-full rounded-full transition-all duration-500",
                    progress === 100 ? "bg-success" : "bg-primary",
                  ].join(" ")}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <ul className="mt-3 space-y-1">
                {task.subtasks.map((s) => (
                  <li
                    key={s.id}
                    className="group flex items-center gap-2.5 rounded-lg border border-border bg-background-muted/40 px-3 py-2 transition-colors hover:bg-background-muted/70"
                  >
                    <button
                      onClick={() => onToggleSubtask(task.id, s.id)}
                      aria-pressed={s.completed}
                      className={[
                        "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all",
                        s.completed
                          ? "border-success bg-success text-white"
                          : "border-border bg-card hover:border-primary",
                      ].join(" ")}
                    >
                      {s.completed && <Check className="h-3 w-3" strokeWidth={3} />}
                    </button>
                    <span
                      className={[
                        "flex-1 text-sm",
                        s.completed ? "text-muted-foreground line-through" : "text-foreground",
                      ].join(" ")}
                    >
                      {s.title}
                    </span>
                    <button
                      onClick={() => onRemoveSubtask(task.id, s.id)}
                      className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive-soft hover:text-destructive group-hover:opacity-100"
                      aria-label="Remove subtask"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!newSubtask.trim()) return
                  onAddSubtask(task.id, newSubtask)
                  setNewSubtask("")
                }}
                className="mt-2 flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Plus className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add subtask and press Enter…"
                    className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </form>
            </section>

            {/* Comments */}
            <section>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Comments
                </h4>
                <span className="text-[11px] text-muted-foreground">({task.comments.length})</span>
              </div>

              <ul className="mt-3 space-y-3">
                {task.comments.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[10px] font-semibold text-primary-foreground">
                      {c.avatar}
                    </div>
                    <div className="flex-1 rounded-xl border border-border bg-background-muted/40 px-3.5 py-2.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground">{c.author}</span>
                        <span className="text-[10px] text-muted-foreground">{formatRelative(c.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-foreground">{c.message}</p>
                    </div>
                  </li>
                ))}
                {task.comments.length === 0 && (
                  <li className="rounded-lg bg-background-muted/60 px-3 py-3 text-xs text-muted-foreground">
                    No comments yet. Start the conversation.
                  </li>
                )}
              </ul>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!newComment.trim()) return
                  onAddComment(task.id, newComment)
                  setNewComment("")
                }}
                className="mt-3 flex items-end gap-2"
              >
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment…"
                  rows={2}
                  className="flex-1 resize-none rounded-lg border border-border bg-background p-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send comment"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </section>

            {/* History */}
            <section>
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Activity
                </h4>
              </div>
              <ol className="mt-3 space-y-2.5 border-l border-border pl-4">
                {task.history.map((h) => (
                  <li key={h.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                    <p className="text-xs font-medium text-foreground">
                      <span className="font-semibold">{h.actor}</span> {h.action.toLowerCase()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{formatRelative(h.at)}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 md:border-l md:border-border md:pl-5">
            <Field label="Status">
              <div className="flex flex-wrap gap-1">
                {(["todo", "doing", "done"] as TaskStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      onUpdate(task.id, (x) => {
                        if (x.status === s) return x
                        const label =
                          s === "todo" ? "Moved to To Do" : s === "doing" ? "Moved to Doing" : "Moved to Done"
                        return {
                          ...x,
                          status: s,
                          history: [
                            { id: `h_${Date.now()}`, action: label, actor: "You", at: new Date().toISOString() },
                            ...x.history,
                          ],
                        }
                      })
                    }
                    className={[
                      "rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors",
                      task.status === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-background-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    {s === "todo" ? "To do" : s}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Priority">
              <div className="flex gap-1">
                {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() =>
                      onUpdate(task.id, (x) => ({
                        ...x,
                        priority: p,
                        history: [
                          {
                            id: `h_${Date.now()}`,
                            action: `Set priority to ${p[0].toUpperCase() + p.slice(1)}`,
                            actor: "You",
                            at: new Date().toISOString(),
                          },
                          ...x.history,
                        ],
                      }))
                    }
                    className={[
                      "flex-1 rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors",
                      task.priority === p
                        ? p === "high"
                          ? "bg-destructive-soft text-destructive ring-1 ring-destructive/30"
                          : p === "medium"
                            ? "bg-warning-soft text-warning ring-1 ring-warning/30"
                            : "bg-success-soft text-success ring-1 ring-success/30"
                        : "bg-muted text-muted-foreground hover:bg-background-muted",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Due date">
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={new Date(task.dueDate).toISOString().slice(0, 10)}
                  onChange={(e) => {
                    const d = new Date(e.target.value)
                    d.setHours(17, 0, 0, 0)
                    onUpdate(task.id, (x) => ({ ...x, dueDate: d.toISOString() }))
                  }}
                  className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </Field>

            <Field label="Tags">
              <div className="flex flex-wrap gap-1">
                {task.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1">
                    <TagPill label={t} />
                    <button
                      onClick={() => onUpdate(task.id, (x) => ({ ...x, tags: x.tags.filter((y) => y !== t) }))}
                      className="text-muted-foreground/60 hover:text-destructive"
                      aria-label={`Remove ${t}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <AddTagInput
                  onAdd={(t) =>
                    onUpdate(task.id, (x) => {
                      if (x.tags.includes(t)) return x
                      return { ...x, tags: [...x.tags, t] }
                    })
                  }
                />
              </div>
            </Field>

            <Field label="Assignee">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background-muted/40 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[10px] font-semibold text-primary-foreground">
                  {task.assignee.avatar}
                </div>
                <span className="text-xs font-medium text-foreground">{task.assignee.name}</span>
              </div>
            </Field>

            <div className="pt-2">
              <button
                onClick={() => {
                  onDelete(task.id)
                  onClose()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive-soft/60 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive-soft"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete task
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

function StatusPill({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { label: string; cls: string }> = {
    todo: { label: "To do", cls: "bg-muted text-muted-foreground" },
    doing: { label: "In progress", cls: "bg-accent text-accent-foreground" },
    done: { label: "Done", cls: "bg-success-soft text-success" },
  }
  const s = map[status]
  return (
    <span className={["inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", s.cls].join(" ")}>
      {s.label}
    </span>
  )
}

function AddTagInput({ onAdd }: { onAdd: (t: string) => void }) {
  const [val, setVal] = useState("")
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-primary hover:text-primary"
      >
        <Plus className="h-3 w-3" />
        Add
      </button>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const v = val.trim()
        if (v) onAdd(v)
        setVal("")
        setOpen(false)
      }}
    >
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => {
          const v = val.trim()
          if (v) onAdd(v)
          setVal("")
          setOpen(false)
        }}
        placeholder="Tag…"
        className="h-6 w-20 rounded-md border border-border bg-background px-1.5 text-[10px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </form>
  )
}
