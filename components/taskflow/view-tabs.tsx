"use client"

import { CalendarDays, LayoutList, Trello } from "lucide-react"
import type { ViewKey } from "@/lib/taskflow/types"

interface ViewTabsProps {
  value: ViewKey
  onChange: (v: ViewKey) => void
}

const TABS: { key: ViewKey; label: string; icon: typeof Trello }[] = [
  { key: "kanban", label: "Kanban", icon: Trello },
  { key: "list", label: "List", icon: LayoutList },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
]

export function ViewTabs({ value, onChange }: ViewTabsProps) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-xl border border-border bg-card p-1 shadow-soft">
      {TABS.map((t) => {
        const Icon = t.icon
        const active = t.key === value
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
            aria-pressed={active}
          >
            <Icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
