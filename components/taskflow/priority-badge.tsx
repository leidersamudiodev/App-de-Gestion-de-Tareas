import type { TaskPriority } from "@/lib/taskflow/types"

const STYLES: Record<TaskPriority, { bg: string; text: string; dot: string; label: string }> = {
  high: {
    bg: "bg-destructive-soft",
    text: "text-destructive",
    dot: "bg-destructive",
    label: "High",
  },
  medium: {
    bg: "bg-warning-soft",
    text: "text-warning",
    dot: "bg-warning",
    label: "Medium",
  },
  low: {
    bg: "bg-success-soft",
    text: "text-success",
    dot: "bg-success",
    label: "Low",
  },
}

export function PriorityBadge({
  priority,
  size = "sm",
}: {
  priority: TaskPriority
  size?: "sm" | "md"
}) {
  const s = STYLES[priority]
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full font-medium",
        s.bg,
        s.text,
        size === "md" ? "px-2 py-0.5 text-xs" : "px-1.5 py-0.5 text-[10px]",
      ].join(" ")}
    >
      <span className={["h-1.5 w-1.5 rounded-full", s.dot].join(" ")} />
      {s.label}
    </span>
  )
}
