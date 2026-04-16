"use client"

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Flame,
  ListChecks,
  type LucideIcon,
} from "lucide-react"

interface Stat {
  key: string
  label: string
  value: number
  accent: "primary" | "muted" | "warning" | "success" | "destructive" | "info"
  icon: LucideIcon
  hint: string
}

interface StatsCardsProps {
  stats: {
    total: number
    todo: number
    doing: number
    done: number
    high: number
    soon: number
  }
}

const ACCENTS: Record<Stat["accent"], { bg: string; fg: string; ring: string }> = {
  primary: { bg: "bg-accent", fg: "text-accent-foreground", ring: "ring-accent-foreground/10" },
  muted: { bg: "bg-muted", fg: "text-foreground", ring: "ring-border" },
  warning: { bg: "bg-warning-soft", fg: "text-warning", ring: "ring-warning/20" },
  success: { bg: "bg-success-soft", fg: "text-success", ring: "ring-success/20" },
  destructive: { bg: "bg-destructive-soft", fg: "text-destructive", ring: "ring-destructive/20" },
  info: { bg: "bg-accent", fg: "text-primary", ring: "ring-primary/20" },
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items: Stat[] = [
    {
      key: "total",
      label: "Total tasks",
      value: stats.total,
      accent: "primary",
      icon: ListChecks,
      hint: "Across all boards",
    },
    {
      key: "todo",
      label: "To do",
      value: stats.todo,
      accent: "muted",
      icon: CircleDashed,
      hint: "Waiting to start",
    },
    {
      key: "doing",
      label: "In progress",
      value: stats.doing,
      accent: "info",
      icon: Flame,
      hint: "Currently active",
    },
    {
      key: "done",
      label: "Completed",
      value: stats.done,
      accent: "success",
      icon: CheckCircle2,
      hint: "Shipped & closed",
    },
    {
      key: "high",
      label: "High priority",
      value: stats.high,
      accent: "destructive",
      icon: AlertTriangle,
      hint: "Need attention",
    },
    {
      key: "soon",
      label: "Due soon",
      value: stats.soon,
      accent: "warning",
      icon: CalendarClock,
      hint: "Next 72 hours",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <StatCard key={item.key} stat={item} />
      ))}
    </div>
  )
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon
  const a = ACCENTS[stat.accent]
  return (
    <div className="group relative rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-1.5 font-sans text-[28px] font-semibold tracking-tight text-foreground tabular-nums">
            {stat.value}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
        </div>
        <div
          className={[
            "flex h-9 w-9 items-center justify-center rounded-lg ring-1 transition-transform group-hover:scale-105",
            a.bg,
            a.fg,
            a.ring,
          ].join(" ")}
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={2.25} />
        </div>
      </div>
    </div>
  )
}
