"use client"

import { ArrowUpDown, Calendar, ChevronDown, Filter, Search, SlidersHorizontal, Tag, X } from "lucide-react"
import { useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SortKey, TaskPriority, TaskStatus } from "@/lib/taskflow/types"

interface FiltersBarProps {
  query: string
  onQueryChange: (q: string) => void
  priority: TaskPriority | "all"
  onPriorityChange: (p: TaskPriority | "all") => void
  status: TaskStatus | "all"
  onStatusChange: (s: TaskStatus | "all") => void
  dueFilter: "all" | "today" | "week" | "overdue"
  onDueFilterChange: (v: "all" | "today" | "week" | "overdue") => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
  tag: string | null
  onTagChange: (t: string | null) => void
  availableTags: string[]
}

const PRIORITY_OPTS: { value: TaskPriority | "all"; label: string }[] = [
  { value: "all", label: "All priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]
const STATUS_OPTS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "todo", label: "To do" },
  { value: "doing", label: "Doing" },
  { value: "done", label: "Done" },
]
const DUE_OPTS: { value: FiltersBarProps["dueFilter"]; label: string }[] = [
  { value: "all", label: "Any date" },
  { value: "today", label: "Due today" },
  { value: "week", label: "This week" },
  { value: "overdue", label: "Overdue" },
]
const SORT_OPTS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Recently updated" },
  { value: "due", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "alpha", label: "Alphabetical" },
]

export function FiltersBar(props: FiltersBarProps) {
  const activeFilters = useMemo(() => {
    const count =
      (props.priority !== "all" ? 1 : 0) +
      (props.status !== "all" ? 1 : 0) +
      (props.dueFilter !== "all" ? 1 : 0) +
      (props.tag ? 1 : 0)
    return count
  }, [props.priority, props.status, props.dueFilter, props.tag])

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-soft lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={props.query}
          onChange={(e) => props.onQueryChange(e.target.value)}
          type="text"
          placeholder="Search tasks, descriptions or tags…"
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Search tasks"
        />
        {props.query && (
          <button
            onClick={() => props.onQueryChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DropdownButton
          icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          label={PRIORITY_OPTS.find((o) => o.value === props.priority)?.label ?? "Priority"}
          active={props.priority !== "all"}
        >
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PRIORITY_OPTS.map((o) => (
            <DropdownMenuItem key={o.value} onClick={() => props.onPriorityChange(o.value)}>
              <span
                className={[
                  "mr-2 h-2 w-2 rounded-full",
                  o.value === "high"
                    ? "bg-destructive"
                    : o.value === "medium"
                      ? "bg-warning"
                      : o.value === "low"
                        ? "bg-success"
                        : "bg-muted-foreground/40",
                ].join(" ")}
              />
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownButton>

        <DropdownButton
          icon={<Filter className="h-3.5 w-3.5" />}
          label={STATUS_OPTS.find((o) => o.value === props.status)?.label ?? "Status"}
          active={props.status !== "all"}
        >
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {STATUS_OPTS.map((o) => (
            <DropdownMenuItem key={o.value} onClick={() => props.onStatusChange(o.value)}>
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownButton>

        <DropdownButton
          icon={<Calendar className="h-3.5 w-3.5" />}
          label={DUE_OPTS.find((o) => o.value === props.dueFilter)?.label ?? "Due"}
          active={props.dueFilter !== "all"}
        >
          <DropdownMenuLabel>Due date</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {DUE_OPTS.map((o) => (
            <DropdownMenuItem key={o.value} onClick={() => props.onDueFilterChange(o.value)}>
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownButton>

        <DropdownButton
          icon={<Tag className="h-3.5 w-3.5" />}
          label={props.tag ?? "Tags"}
          active={!!props.tag}
        >
          <DropdownMenuLabel>Tags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => props.onTagChange(null)}>All tags</DropdownMenuItem>
          {props.availableTags.map((t) => (
            <DropdownMenuItem key={t} onClick={() => props.onTagChange(t)}>
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
              {t}
            </DropdownMenuItem>
          ))}
        </DropdownButton>

        <DropdownButton
          icon={<ArrowUpDown className="h-3.5 w-3.5" />}
          label={SORT_OPTS.find((o) => o.value === props.sort)?.label ?? "Sort"}
        >
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SORT_OPTS.map((o) => (
            <DropdownMenuItem key={o.value} onClick={() => props.onSortChange(o.value)}>
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownButton>

        {activeFilters > 0 && (
          <button
            onClick={() => {
              props.onPriorityChange("all")
              props.onStatusChange("all")
              props.onDueFilterChange("all")
              props.onTagChange(null)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
          >
            <X className="h-3.5 w-3.5" />
            Clear ({activeFilters})
          </button>
        )}
      </div>
    </div>
  )
}

function DropdownButton({
  icon,
  label,
  active,
  children,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={[
            "inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium transition-colors",
            active
              ? "border-primary/40 bg-accent text-accent-foreground"
              : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground",
          ].join(" ")}
        >
          {icon}
          <span className="max-w-[120px] truncate">{label}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
