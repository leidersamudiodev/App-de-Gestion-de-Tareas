"use client"

import { Calendar, Plus, Tag, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { TaskPriority, TaskStatus } from "@/lib/taskflow/types"

interface NewTaskModalProps {
  open: boolean
  defaultStatus?: TaskStatus
  onClose: () => void
  onCreate: (input: {
    title: string
    description: string
    priority: TaskPriority
    status: TaskStatus
    dueDate: string
    tags: string[]
  }) => void
}

export function NewTaskModal({ open, defaultStatus = "todo", onClose, onCreate }: NewTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [status, setStatus] = useState<TaskStatus>(defaultStatus)
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toISOString().slice(0, 10)
  })
  const [tagDraft, setTagDraft] = useState("")
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (!open) return
    setStatus(defaultStatus)
    setTitle("")
    setDescription("")
    setPriority("medium")
    setTags([])
    setTagDraft("")
    const d = new Date()
    d.setDate(d.getDate() + 3)
    setDueDate(d.toISOString().slice(0, 10))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, defaultStatus, onClose])

  if (!open) return null

  const canSubmit = title.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    const d = new Date(dueDate)
    d.setHours(17, 0, 0, 0)
    onCreate({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: d.toISOString(),
      tags,
    })
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
        aria-label="Create new task"
        className="animate-in-soft w-full max-w-lg overflow-hidden rounded-t-2xl bg-card shadow-card-hover sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Create task</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Add it to your board and keep shipping.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          className="space-y-4 px-5 py-5"
        >
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design the onboarding empty state"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="A brief description, acceptance criteria, links…"
              className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </label>
              <div className="mt-1 flex gap-1">
                {(["todo", "doing", "done"] as TaskStatus[]).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatus(s)}
                    className={[
                      "flex-1 rounded-md px-1 py-1.5 text-[11px] font-medium transition-colors",
                      status === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-background-muted",
                    ].join(" ")}
                  >
                    {s === "todo" ? "To do" : s === "doing" ? "Doing" : "Done"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Priority
              </label>
              <div className="mt-1 flex gap-1">
                {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={[
                      "flex-1 rounded-md px-1 py-1.5 text-[11px] font-medium capitalize transition-colors",
                      priority === p
                        ? p === "high"
                          ? "bg-destructive-soft text-destructive"
                          : p === "medium"
                            ? "bg-warning-soft text-warning"
                            : "bg-success-soft text-success"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Due date
              </label>
              <div className="relative mt-1">
                <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-[34px] w-full rounded-md border border-border bg-background pl-7 pr-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tags
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                    className="text-accent-foreground/60 hover:text-destructive"
                    aria-label={`Remove ${t}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <div className="flex min-w-[120px] flex-1 items-center gap-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault()
                      const v = tagDraft.trim().replace(/,$/, "")
                      if (v && !tags.includes(v)) setTags((prev) => [...prev, v])
                      setTagDraft("")
                    } else if (e.key === "Backspace" && !tagDraft) {
                      setTags((prev) => prev.slice(0, -1))
                    }
                  }}
                  placeholder="Add tag and press Enter"
                  className="min-w-0 flex-1 bg-transparent text-xs placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
