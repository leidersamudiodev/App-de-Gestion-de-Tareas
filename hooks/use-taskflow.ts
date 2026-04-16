"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { Task, TaskPriority, TaskStatus } from "@/lib/taskflow/types"
import { INITIAL_TASKS } from "@/lib/taskflow/mock-data"

const STORAGE_KEY = "taskflow:v1"

function loadInitial(): Task[] {
  if (typeof window === "undefined") return INITIAL_TASKS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_TASKS
    const parsed = JSON.parse(raw) as Task[]
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_TASKS
    return parsed
  } catch {
    return INITIAL_TASKS
  }
}

export function useTaskflow() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [hydrated, setHydrated] = useState(false)

  // hydrate from localStorage on mount (client only to avoid time-based hydration mismatches)
  useEffect(() => {
    setTasks(loadInitial())
    setHydrated(true)
  }, [])

  // persist
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      /* ignore quota errors */
    }
  }, [tasks, hydrated])

  const addTask = useCallback(
    (input: {
      title: string
      description?: string
      priority?: TaskPriority
      dueDate?: string
      tags?: string[]
      status?: TaskStatus
    }) => {
      const now = new Date().toISOString()
      const newTask: Task = {
        id: `t_${Date.now()}`,
        title: input.title.trim() || "Untitled task",
        description: input.description?.trim() ?? "",
        status: input.status ?? "todo",
        priority: input.priority ?? "medium",
        dueDate: input.dueDate ?? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: input.tags ?? [],
        subtasks: [],
        comments: [],
        history: [{ id: `h_${Date.now()}`, action: "Created task", actor: "You", at: now }],
        assignee: { name: "You", avatar: "YO" },
        createdAt: now,
        updatedAt: now,
      }
      setTasks((prev) => [newTask, ...prev])
      return newTask
    },
    [],
  )

  const updateTask = useCallback((id: string, updater: (t: Task) => Task) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const updated = updater(t)
        updated.updatedAt = new Date().toISOString()
        return updated
      }),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        if (t.status === status) return t
        const now = new Date().toISOString()
        const label =
          status === "todo" ? "Moved to To Do" : status === "doing" ? "Moved to Doing" : "Moved to Done"
        return {
          ...t,
          status,
          updatedAt: now,
          history: [{ id: `h_${Date.now()}`, action: label, actor: "You", at: now }, ...t.history],
        }
      }),
    )
  }, [])

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s)),
        }
      }),
    )
  }, [])

  const addSubtask = useCallback((taskId: string, title: string) => {
    if (!title.trim()) return
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          subtasks: [...t.subtasks, { id: `s_${Date.now()}`, title: title.trim(), completed: false }],
        }
      }),
    )
  }, [])

  const removeSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
        }
      }),
    )
  }, [])

  const addComment = useCallback((taskId: string, message: string) => {
    if (!message.trim()) return
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        const now = new Date().toISOString()
        return {
          ...t,
          updatedAt: now,
          comments: [
            ...t.comments,
            {
              id: `c_${Date.now()}`,
              author: "You",
              avatar: "YO",
              message: message.trim(),
              createdAt: now,
            },
          ],
        }
      }),
    )
  }, [])

  const resetDemo = useCallback(() => {
    setTasks(INITIAL_TASKS)
  }, [])

  const stats = useMemo(() => {
    const total = tasks.length
    const todo = tasks.filter((t) => t.status === "todo").length
    const doing = tasks.filter((t) => t.status === "doing").length
    const done = tasks.filter((t) => t.status === "done").length
    const high = tasks.filter((t) => t.priority === "high" && t.status !== "done").length
    const now = Date.now()
    const soon = tasks.filter((t) => {
      if (t.status === "done") return false
      const diff = new Date(t.dueDate).getTime() - now
      return diff >= 0 && diff <= 3 * 24 * 60 * 60 * 1000
    }).length
    return { total, todo, doing, done, high, soon }
  }, [tasks])

  return {
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
  }
}
