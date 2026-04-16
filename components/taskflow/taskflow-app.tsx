"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useTaskflow } from "@/hooks/use-taskflow"
import type { SortKey, TaskPriority, TaskStatus, ViewKey } from "@/lib/taskflow/types"
import type { PageKey } from "@/lib/taskflow/workspace-data"
import { isOverdue, priorityValue, uniqueTags } from "@/lib/taskflow/utils"

import { CalendarView } from "./calendar-view"
import { FiltersBar } from "./filters-bar"
import { KanbanBoard } from "./kanban-board"
import { ListView } from "./list-view"
import { NewTaskModal } from "./new-task-modal"
import { ProjectsView } from "./projects-view"
import { ReportsView } from "./reports-view"
import { RightSidebar } from "./right-sidebar"
import { SettingsSheet } from "./settings-sheet"
import { StatsCards } from "./stats-cards"
import { TaskModal } from "./task-modal"
import { TeamView } from "./team-view"
import { TopBar } from "./top-bar"
import { ViewTabs } from "./view-tabs"

type DueFilter = "all" | "today" | "week" | "overdue"

const PAGE_META: Record<PageKey, { eyebrow: string; title: string; subtitle: string }> = {
  workspace: {
    eyebrow: "Workspace",
    title: "Good to see you back",
    subtitle: "Here's an overview of your work across every board.",
  },
  projects: {
    eyebrow: "Projects",
    title: "All projects at a glance",
    subtitle: "Track progress, upcoming deadlines and team load per project.",
  },
  team: {
    eyebrow: "Team",
    title: "The people moving things forward",
    subtitle: "See who's online, what they're working on and recent activity.",
  },
  reports: {
    eyebrow: "Reports",
    title: "Performance & productivity",
    subtitle: "Weekly throughput, on-time rate and monthly trends.",
  },
}

export function TaskflowApp() {
  const {
    tasks,
    hydrated,
    stats,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleSubtask,
    addSubtask,
    removeSubtask,
    addComment,
    resetDemo,
  } = useTaskflow()

  const [page, setPage] = useState<PageKey>("workspace")
  const [view, setView] = useState<ViewKey>("kanban")

  const [query, setQuery] = useState("")
  const [priority, setPriority] = useState<TaskPriority | "all">("all")
  const [status, setStatus] = useState<TaskStatus | "all">("all")
  const [dueFilter, setDueFilter] = useState<DueFilter>("all")
  const [sort, setSort] = useState<SortKey>("recent")
  const [tag, setTag] = useState<string | null>(null)

  // Display preferences (from settings sheet)
  const [compact, setCompact] = useState(false)
  const [showCompleted, setShowCompleted] = useState(true)

  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [newOpen, setNewOpen] = useState(false)
  const [newDefaultStatus, setNewDefaultStatus] = useState<TaskStatus>("todo")
  const [settingsOpen, setSettingsOpen] = useState(false)

  const availableTags = useMemo(() => uniqueTags(tasks), [tasks])

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase()
    const now = Date.now()
    const sevenDays = 7 * 24 * 60 * 60 * 1000

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const endOfToday = new Date(startOfToday)
    endOfToday.setHours(23, 59, 59, 999)

    const result = tasks.filter((t) => {
      if (!showCompleted && t.status === "done") return false
      if (priority !== "all" && t.priority !== priority) return false
      if (status !== "all" && t.status !== status) return false
      if (tag && !t.tags.includes(tag)) return false

      if (dueFilter !== "all") {
        const due = new Date(t.dueDate).getTime()
        if (dueFilter === "today") {
          if (due < startOfToday.getTime() || due > endOfToday.getTime()) return false
        } else if (dueFilter === "week") {
          if (due < now || due - now > sevenDays) return false
        } else if (dueFilter === "overdue") {
          if (!isOverdue(t)) return false
        }
      }

      if (q) {
        const hay = `${t.title} ${t.description} ${t.tags.join(" ")}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    const sorted = [...result].sort((a, b) => {
      switch (sort) {
        case "due":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "priority":
          return priorityValue(b.priority) - priorityValue(a.priority)
        case "alpha":
          return a.title.localeCompare(b.title)
        case "recent":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })
    return sorted
  }, [tasks, query, priority, status, dueFilter, sort, tag, showCompleted])

  const openTask = tasks.find((t) => t.id === openTaskId) ?? null
  const meta = PAGE_META[page]

  const handleCreate = (input: {
    title: string
    description: string
    priority: TaskPriority
    status: TaskStatus
    dueDate: string
    tags: string[]
  }) => {
    addTask(input)
    toast.success("Task created", {
      description: input.title,
    })
    setNewOpen(false)
  }

  const handleDelete = (id: string) => {
    const t = tasks.find((x) => x.id === id)
    deleteTask(id)
    toast.success("Task deleted", { description: t?.title })
  }

  const handleMove = (id: string, newStatus: TaskStatus) => {
    const t = tasks.find((x) => x.id === id)
    if (!t || t.status === newStatus) return
    moveTask(id, newStatus)
    if (newStatus === "done") {
      toast.success("Task completed 🎉", { description: t.title })
    } else {
      toast(`Moved to ${newStatus === "todo" ? "To do" : "Doing"}`, { description: t.title })
    }
  }

  const handleUpdate = (id: string, updater: Parameters<typeof updateTask>[1]) => {
    updateTask(id, updater)
  }

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    const sub = task?.subtasks.find((s) => s.id === subtaskId)
    toggleSubtask(taskId, subtaskId)
    if (sub && !sub.completed) {
      const completedAfter = (task?.subtasks.filter((s) => s.completed).length ?? 0) + 1
      if (completedAfter === task?.subtasks.length) {
        toast.success("All subtasks completed", { description: task?.title })
      }
    }
  }

  const handleReset = () => {
    resetDemo()
    toast.success("Demo data restored", { description: "Sample tasks are back." })
  }

  const handlePageChange = (p: PageKey) => {
    setPage(p)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const clearFilters = () => {
    setPriority("all")
    setStatus("all")
    setDueFilter("all")
    setTag(null)
    setSort("recent")
    toast("Filters cleared")
  }

  // Keyboard shortcuts: 1-4 to jump pages, N for new task, / for search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          (target as HTMLElement).isContentEditable)
      if (typing) return

      if (e.key === "1") setPage("workspace")
      else if (e.key === "2") setPage("projects")
      else if (e.key === "3") setPage("team")
      else if (e.key === "4") setPage("reports")
      else if (e.key.toLowerCase() === "n") {
        e.preventDefault()
        setNewOpen(true)
      } else if (e.key === "/") {
        const search = document.querySelector<HTMLInputElement>('input[aria-label="Search tasks"]')
        if (search) {
          e.preventDefault()
          search.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar
          page={page}
          onPageChange={handlePageChange}
          onNewTask={() => setNewOpen(true)}
          onReset={handleReset}
          onOpenSettings={() => setSettingsOpen(true)}
          tasks={[]}
          onOpenTask={() => {}}
        />
        <div className="mx-auto flex max-w-[1560px] flex-col gap-6 px-4 py-6 md:px-6 xl:flex-row">
          <main className="flex-1 space-y-5">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[420px] animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          </main>
          <div className="hidden w-[340px] flex-shrink-0 xl:block">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const showSidebar = page === "workspace"

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        page={page}
        onPageChange={handlePageChange}
        onNewTask={() => setNewOpen(true)}
        onReset={handleReset}
        onOpenSettings={() => setSettingsOpen(true)}
        tasks={tasks}
        onOpenTask={(id) => setOpenTaskId(id)}
      />

      <div
        key={page /* re-run enter animation on page change */}
        className={[
          "mx-auto flex max-w-[1560px] flex-col px-4 md:px-6",
          compact ? "gap-4 py-4" : "gap-6 py-6",
          showSidebar ? "xl:flex-row" : "",
          "animate-in-soft",
        ].join(" ")}
      >
        <main className="flex-1 space-y-5">
          {/* Heading */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {meta.eyebrow}
              </p>
              <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
                {meta.title}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{meta.subtitle}</p>
            </div>
            {page === "workspace" && <ViewTabs value={view} onChange={setView} />}
          </div>

          {page === "workspace" && (
            <>
              <StatsCards stats={stats} />

              <FiltersBar
                query={query}
                onQueryChange={setQuery}
                priority={priority}
                onPriorityChange={setPriority}
                status={status}
                onStatusChange={setStatus}
                dueFilter={dueFilter}
                onDueFilterChange={setDueFilter}
                sort={sort}
                onSortChange={setSort}
                tag={tag}
                onTagChange={setTag}
                availableTags={availableTags}
              />

              {view === "kanban" && (
                <KanbanBoard
                  tasks={filteredTasks}
                  onOpenTask={(id) => setOpenTaskId(id)}
                  onMoveTask={handleMove}
                  onCreateInColumn={(s) => {
                    setNewDefaultStatus(s)
                    setNewOpen(true)
                  }}
                />
              )}
              {view === "list" && <ListView tasks={filteredTasks} onOpenTask={(id) => setOpenTaskId(id)} />}
              {view === "calendar" && (
                <CalendarView tasks={filteredTasks} onOpenTask={(id) => setOpenTaskId(id)} />
              )}
            </>
          )}

          {page === "projects" && (
            <ProjectsView tasks={tasks} onOpenTask={(id) => setOpenTaskId(id)} />
          )}
          {page === "team" && <TeamView tasks={tasks} onOpenTask={(id) => setOpenTaskId(id)} />}
          {page === "reports" && <ReportsView tasks={tasks} onOpenTask={(id) => setOpenTaskId(id)} />}
        </main>

        {showSidebar && (
          <div className="w-full xl:w-[340px] xl:flex-shrink-0">
            <div className="xl:sticky xl:top-20">
              <RightSidebar tasks={tasks} onOpenTask={(id) => setOpenTaskId(id)} />
            </div>
          </div>
        )}
      </div>

      <TaskModal
        task={openTask}
        onClose={() => setOpenTaskId(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onToggleSubtask={handleToggleSubtask}
        onAddSubtask={addSubtask}
        onRemoveSubtask={removeSubtask}
        onAddComment={addComment}
      />

      <NewTaskModal
        open={newOpen}
        defaultStatus={newDefaultStatus}
        onClose={() => setNewOpen(false)}
        onCreate={handleCreate}
      />

      <SettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        priority={priority}
        onPriorityChange={setPriority}
        status={status}
        onStatusChange={setStatus}
        dueFilter={dueFilter}
        onDueFilterChange={setDueFilter}
        sort={sort}
        onSortChange={setSort}
        tag={tag}
        onTagChange={setTag}
        availableTags={availableTags}
        onClearAll={clearFilters}
        compact={compact}
        onCompactChange={setCompact}
        showCompleted={showCompleted}
        onShowCompletedChange={setShowCompleted}
      />

    </div>
  )
}
