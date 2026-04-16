export type TaskStatus = "todo" | "doing" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Comment {
  id: string
  author: string
  avatar: string
  message: string
  createdAt: string // ISO
}

export interface HistoryEntry {
  id: string
  action: string
  actor: string
  at: string // ISO
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string // ISO
  tags: string[]
  subtasks: Subtask[]
  comments: Comment[]
  history: HistoryEntry[]
  assignee: {
    name: string
    avatar: string
  }
  createdAt: string
  updatedAt: string
}

export type SortKey = "recent" | "due" | "priority" | "alpha"
export type ViewKey = "kanban" | "list" | "calendar"
