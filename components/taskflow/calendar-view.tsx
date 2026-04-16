"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"
import type { Task } from "@/lib/taskflow/types"

interface CalendarViewProps {
  tasks: Task[]
  onOpenTask: (id: string) => void
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function CalendarView({ tasks, onOpenTask }: CalendarViewProps) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  const grid = useMemo(() => buildMonth(cursor), [cursor])
  const today = new Date()

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const t of tasks) {
      const d = new Date(t.dueDate)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      const arr = map.get(key) ?? []
      arr.push(t)
      map.set(key, arr)
    }
    return map
  }, [tasks])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const d = new Date()
              d.setDate(1)
              setCursor(d)
            }}
            className="h-8 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Today
          </button>
          <button
            onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-background-muted/40">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {grid.map((day, idx) => {
          const key = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`
          const dayTasks = tasksByDay.get(key) ?? []
          const isToday = sameDay(day.date, today)
          return (
            <div
              key={idx}
              className={[
                "relative min-h-[110px] border-b border-r border-border p-2 last:border-r-0",
                day.isCurrentMonth ? "bg-card" : "bg-background-muted/40",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold tabular-nums",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : day.isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground/60",
                  ].join(" ")}
                >
                  {day.date.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-medium text-muted-foreground">{dayTasks.length}</span>
                )}
              </div>

              <div className="mt-1 space-y-1">
                {dayTasks.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onOpenTask(t.id)}
                    className={[
                      "block w-full truncate rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium transition-colors",
                      t.priority === "high"
                        ? "bg-destructive-soft text-destructive hover:bg-destructive/10"
                        : t.priority === "medium"
                          ? "bg-warning-soft text-warning hover:bg-warning/10"
                          : "bg-accent text-accent-foreground hover:bg-accent/80",
                      t.status === "done" ? "line-through opacity-60" : "",
                    ].join(" ")}
                  >
                    {t.title}
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <div className="px-1.5 text-[10px] font-medium text-muted-foreground">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function buildMonth(cursor: Date) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  // start on Monday
  const startDow = (first.getDay() + 6) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - startDow)
  const days: { date: Date; isCurrentMonth: boolean }[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push({ date: d, isCurrentMonth: d.getMonth() === cursor.getMonth() })
  }
  return days
}
