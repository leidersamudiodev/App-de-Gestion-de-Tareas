"use client"

import { Check, RefreshCw, Settings2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import type { SortKey, TaskPriority, TaskStatus } from "@/lib/taskflow/types"

type DueFilter = "all" | "today" | "week" | "overdue"

interface SettingsSheetProps {
  // trigger-controlled
  open: boolean
  onOpenChange: (open: boolean) => void

  priority: TaskPriority | "all"
  onPriorityChange: (p: TaskPriority | "all") => void
  status: TaskStatus | "all"
  onStatusChange: (s: TaskStatus | "all") => void
  dueFilter: DueFilter
  onDueFilterChange: (v: DueFilter) => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
  tag: string | null
  onTagChange: (t: string | null) => void
  availableTags: string[]

  onClearAll: () => void

  // Display prefs
  compact: boolean
  onCompactChange: (v: boolean) => void
  showCompleted: boolean
  onShowCompletedChange: (v: boolean) => void
}

export function SettingsSheet(props: SettingsSheetProps) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetTrigger asChild>
        <button
          onClick={() => props.onOpenChange(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Global filters & settings"
        >
          <Settings2 className="h-4.5 w-4.5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto border-l border-border bg-card p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
              <Settings2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold tracking-tight">Global filters</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Fine-tune what you see across every view.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-6 py-5">
          <Section title="Priority">
            <Chips
              value={props.priority}
              onChange={props.onPriorityChange as (v: string) => void}
              options={[
                { v: "all", label: "Any" },
                { v: "high", label: "High", dot: "bg-destructive" },
                { v: "medium", label: "Medium", dot: "bg-warning" },
                { v: "low", label: "Low", dot: "bg-success" },
              ]}
            />
          </Section>

          <Section title="Status">
            <Chips
              value={props.status}
              onChange={props.onStatusChange as (v: string) => void}
              options={[
                { v: "all", label: "Any" },
                { v: "todo", label: "To do" },
                { v: "doing", label: "Doing" },
                { v: "done", label: "Done" },
              ]}
            />
          </Section>

          <Section title="Due date">
            <Chips
              value={props.dueFilter}
              onChange={props.onDueFilterChange as (v: string) => void}
              options={[
                { v: "all", label: "Any time" },
                { v: "today", label: "Today" },
                { v: "week", label: "This week" },
                { v: "overdue", label: "Overdue" },
              ]}
            />
          </Section>

          <Section title="Sort by">
            <Chips
              value={props.sort}
              onChange={props.onSortChange as (v: string) => void}
              options={[
                { v: "recent", label: "Recent" },
                { v: "due", label: "Due date" },
                { v: "priority", label: "Priority" },
                { v: "alpha", label: "A → Z" },
              ]}
            />
          </Section>

          {props.availableTags.length > 0 && (
            <Section title="Tag">
              <Chips
                value={props.tag ?? "__all"}
                onChange={(v) => props.onTagChange(v === "__all" ? null : v)}
                options={[
                  { v: "__all", label: "Any tag" },
                  ...props.availableTags.map((t) => ({ v: t, label: t })),
                ]}
              />
            </Section>
          )}

          <div className="border-t border-border pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Display
            </p>
            <div className="mt-3 space-y-3">
              <ToggleRow
                label="Compact cards"
                description="Tighter spacing on the Kanban board."
                checked={props.compact}
                onCheckedChange={props.onCompactChange}
              />
              <ToggleRow
                label="Show completed"
                description="Include completed tasks in filtered views."
                checked={props.showCompleted}
                onCheckedChange={props.onShowCompletedChange}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2 border-t border-border bg-background-muted/40 px-6 py-4">
          <button
            onClick={props.onClearAll}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset filters
          </button>
          <button
            onClick={() => props.onOpenChange(false)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
          >
            <Check className="h-3.5 w-3.5" />
            Apply
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function Chips<V extends string>({
  value,
  onChange,
  options,
}: {
  value: V
  onChange: (v: V) => void
  options: { v: V; label: string; dot?: string }[]
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o.v === value
        return (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={[
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-primary/40 bg-accent text-accent-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            {o.dot && <span className={`h-1.5 w-1.5 rounded-full ${o.dot}`} />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
      <div>
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
