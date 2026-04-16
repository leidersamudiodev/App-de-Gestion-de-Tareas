import type { Task, TaskPriority } from "./types"

export function formatDueDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const startOfDay = (date: Date) => {
    const x = new Date(date)
    x.setHours(0, 0, 0, 0)
    return x
  }
  const diffDays = Math.round((startOfDay(d).getTime() - startOfDay(now).getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays === -1) return "Yesterday"
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays <= 7) return `In ${diffDays}d`
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.round((now - then) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  const days = Math.floor(diff / 86400)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function priorityValue(p: TaskPriority) {
  return p === "high" ? 3 : p === "medium" ? 2 : 1
}

export function progressFor(task: Task) {
  if (task.subtasks.length === 0) {
    return task.status === "done" ? 100 : task.status === "doing" ? 45 : 0
  }
  const done = task.subtasks.filter((s) => s.completed).length
  return Math.round((done / task.subtasks.length) * 100)
}

export function isOverdue(task: Task) {
  if (task.status === "done") return false
  return new Date(task.dueDate).getTime() < Date.now() - 1000 * 60 * 60 * 12
}

export function isDueSoon(task: Task) {
  if (task.status === "done") return false
  const diff = new Date(task.dueDate).getTime() - Date.now()
  return diff >= 0 && diff <= 3 * 24 * 60 * 60 * 1000
}

export function uniqueTags(tasks: Task[]) {
  return Array.from(new Set(tasks.flatMap((t) => t.tags))).sort()
}
