import type { Task } from "./types"
import { isOverdue } from "./utils"

export type PageKey = "workspace" | "projects" | "team" | "reports"

export interface Member {
  id: string
  name: string
  initials: string
  role: string
  online: boolean
  lastSeen?: string
}

export const MEMBERS: Member[] = [
  { id: "u_me", name: "You", initials: "YO", role: "Product Designer", online: true },
  { id: "u_lg", name: "Lucía García", initials: "LG", role: "Lead Designer", online: true },
  {
    id: "u_dr",
    name: "Diego Romero",
    initials: "DR",
    role: "Senior Engineer",
    online: false,
    lastSeen: "2h ago",
  },
  { id: "u_mi", name: "Mateo Ibáñez", initials: "MI", role: "Frontend Engineer", online: true },
  {
    id: "u_sm",
    name: "Sara Mendes",
    initials: "SM",
    role: "QA Engineer",
    online: false,
    lastSeen: "30m ago",
  },
]

export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  lead: string // member initials
  accent: "primary" | "success" | "warning" | "destructive" | "accent"
}

export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "TaskFlow Redesign",
    description: "Refresh the marketing site and product surfaces with the 2026 brand system.",
    tags: ["UI/UX", "Marketing"],
    lead: "LG",
    accent: "primary",
  },
  {
    id: "p2",
    name: "Design System 2.0",
    description: "Semantic tokens, accessibility pass and a documented component library.",
    tags: ["Design System", "Frontend"],
    lead: "DR",
    accent: "accent",
  },
  {
    id: "p3",
    name: "API Platform v2",
    description: "Public REST reference, auth overhaul and improved rate limiting.",
    tags: ["API", "Documentation"],
    lead: "DR",
    accent: "warning",
  },
  {
    id: "p4",
    name: "Performance Sprint",
    description: "SWR migration, optimistic updates and shaving milliseconds across the dashboard.",
    tags: ["Performance", "Refactor"],
    lead: "MI",
    accent: "success",
  },
  {
    id: "p5",
    name: "Quality Initiative",
    description: "Playwright E2E coverage, axe-based a11y audits and manual QA passes.",
    tags: ["Testing", "QA", "A11y"],
    lead: "SM",
    accent: "destructive",
  },
  {
    id: "p6",
    name: "Developer Experience",
    description: "Command palette, icon migration and internal tooling polish.",
    tags: ["DX"],
    lead: "MI",
    accent: "primary",
  },
]

export function tasksForProject(project: Project, tasks: Task[]): Task[] {
  return tasks.filter((t) => t.tags.some((tag) => project.tags.includes(tag)))
}

export function tasksForMember(member: Member, tasks: Task[]): Task[] {
  return tasks.filter((t) => t.assignee.avatar === member.initials)
}

export interface NotificationItem {
  id: string
  title: string
  description: string
  taskId?: string
  kind: "urgent" | "reminder" | "mention" | "activity"
  when: string
}

export function buildNotifications(tasks: Task[]): NotificationItem[] {
  const items: NotificationItem[] = []

  // Overdue
  tasks
    .filter(isOverdue)
    .slice(0, 3)
    .forEach((t) => {
      items.push({
        id: `n_over_${t.id}`,
        title: "Task is overdue",
        description: t.title,
        taskId: t.id,
        kind: "urgent",
        when: "now",
      })
    })

  // Due soon
  const now = Date.now()
  tasks
    .filter((t) => {
      if (t.status === "done") return false
      const diff = new Date(t.dueDate).getTime() - now
      return diff >= 0 && diff <= 2 * 24 * 60 * 60 * 1000
    })
    .slice(0, 3)
    .forEach((t) => {
      items.push({
        id: `n_due_${t.id}`,
        title: "Due soon",
        description: t.title,
        taskId: t.id,
        kind: "reminder",
        when: "today",
      })
    })

  // Mentions from comments
  tasks.forEach((t) => {
    t.comments.slice(-1).forEach((c) => {
      if (c.author !== "You") {
        items.push({
          id: `n_mention_${c.id}`,
          title: `${c.author} commented`,
          description: `“${c.message.slice(0, 70)}${c.message.length > 70 ? "…" : ""}”`,
          taskId: t.id,
          kind: "mention",
          when: "recent",
        })
      }
    })
  })

  return items.slice(0, 8)
}
