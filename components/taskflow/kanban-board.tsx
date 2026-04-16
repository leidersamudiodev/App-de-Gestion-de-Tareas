"use client"

import { CircleDashed, Flame, CheckCircle2, Plus } from "lucide-react"
import { type DragEvent, useState } from "react"
import type { Task, TaskStatus } from "@/lib/taskflow/types"
import { TaskCard } from "./task-card"

interface KanbanBoardProps {
  tasks: Task[]
  onOpenTask: (id: string) => void
  onMoveTask: (id: string, status: TaskStatus) => void
  onCreateInColumn: (status: TaskStatus) => void
}

const COLUMNS: {
  key: TaskStatus
  label: string
  icon: typeof CircleDashed
  accent: string
  dotBg: string
}[] = [
  { key: "todo", label: "To do", icon: CircleDashed, accent: "text-muted-foreground", dotBg: "bg-muted-foreground/40" },
  { key: "doing", label: "Doing", icon: Flame, accent: "text-primary", dotBg: "bg-primary" },
  { key: "done", label: "Done", icon: CheckCircle2, accent: "text-success", dotBg: "bg-success" },
]

export function KanbanBoard({ tasks, onOpenTask, onMoveTask, onCreateInColumn }: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<TaskStatus | null>(null)

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    setDraggingId(task.id)
    e.dataTransfer.setData("text/plain", task.id)
    e.dataTransfer.effectAllowed = "move"
    // subtle lift visual
    requestAnimationFrame(() => {
      const el = e.currentTarget as HTMLDivElement
      el.classList.add("dragging")
    })
  }

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDraggingId(null)
    setOverColumn(null)
    const el = e.currentTarget as HTMLDivElement
    el.classList.remove("dragging")
  }

  const handleColumnDragOver = (e: DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (overColumn !== status) setOverColumn(status)
  }

  const handleColumnDrop = (e: DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain") || draggingId
    if (id) onMoveTask(id, status)
    setOverColumn(null)
    setDraggingId(null)
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {COLUMNS.map((col) => {
        const Icon = col.icon
        const colTasks = tasks.filter((t) => t.status === col.key)
        const isOver = overColumn === col.key

        return (
          <div
            key={col.key}
            className="flex flex-col rounded-2xl border border-border bg-background-muted/60"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={["flex h-1.5 w-1.5 rounded-full", col.dotBg].join(" ")} />
                <Icon className={["h-4 w-4", col.accent].join(" ")} strokeWidth={2.25} />
                <h3 className="text-sm font-semibold tracking-tight text-foreground">{col.label}</h3>
                <span className="rounded-md bg-card px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border tabular-nums">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onCreateInColumn(col.key)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                aria-label={`Add task to ${col.label}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div
              onDragOver={(e) => handleColumnDragOver(e, col.key)}
              onDragLeave={() => setOverColumn((s) => (s === col.key ? null : s))}
              onDrop={(e) => handleColumnDrop(e, col.key)}
              className={[
                "scrollbar-thin flex min-h-[240px] flex-1 flex-col gap-2.5 overflow-y-auto p-3 transition-colors",
                isOver ? "drag-over rounded-b-2xl" : "",
              ].join(" ")}
            >
              {colTasks.length === 0 ? (
                <EmptyColumn onCreate={() => onCreateInColumn(col.key)} />
              ) : (
                colTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onClick={() => onOpenTask(t.id)}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EmptyColumn({ onCreate }: { onCreate: () => void }) {
  return (
    <button
      onClick={onCreate}
      className="group flex h-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-background/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent/50 hover:text-primary"
    >
      <Plus className="h-4 w-4" />
      <span className="text-xs font-medium">Add a task</span>
    </button>
  )
}
