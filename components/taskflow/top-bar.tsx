"use client"

import { LayoutGrid, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/taskflow/types"
import type { PageKey } from "@/lib/taskflow/workspace-data"
import { HelpDialog } from "./help-dialog"
import { NotificationsDropdown } from "./notifications-dropdown"
import { UserMenu } from "./user-menu"

interface TopBarProps {
  page: PageKey
  onPageChange: (p: PageKey) => void
  onNewTask: () => void
  onReset: () => void
  onOpenSettings: () => void
  tasks: Task[]
  onOpenTask: (id: string) => void
}

const NAV: { key: PageKey; label: string }[] = [
  { key: "workspace", label: "Workspace" },
  { key: "projects", label: "Projects" },
  { key: "team", label: "Team" },
  { key: "reports", label: "Reports" },
]

export function TopBar({
  page,
  onPageChange,
  onNewTask,
  onReset,
  onOpenSettings,
  tasks,
  onOpenTask,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-6">
        <button
          onClick={() => onPageChange("workspace")}
          className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-muted"
          aria-label="Go to Workspace"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <LayoutGrid className="h-4.5 w-4.5" strokeWidth={2.25} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[17px] font-semibold tracking-tight text-foreground">TaskFlow</span>
            <span className="hidden rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground md:inline-block">
              Pro
            </span>
          </div>
        </button>

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <TopBarLink
              key={item.key}
              active={page === item.key}
              onClick={() => onPageChange(item.key)}
            >
              {item.label}
            </TopBarLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onReset}
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
            aria-label="Reset demo data"
          >
            <Sparkles className="h-4 w-4" />
            Demo data
          </button>

          <HelpDialog />
          <NotificationsDropdown tasks={tasks} onOpenTask={onOpenTask} />
          <button
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Global filters & settings"
          >
            <SettingsIcon />
          </button>

          <div className="mx-2 hidden h-6 w-px bg-border md:block" />

          <Button
            onClick={onNewTask}
            className="h-9 gap-1.5 rounded-lg bg-primary px-3.5 text-primary-foreground shadow-soft hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span className="text-sm font-medium">New task</span>
          </Button>

          <UserMenu onOpenSettings={onOpenSettings} />
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-3 py-2 lg:hidden" aria-label="Primary mobile">
        {NAV.map((item) => (
          <TopBarLink key={item.key} active={page === item.key} onClick={() => onPageChange(item.key)}>
            {item.label}
          </TopBarLink>
        ))}
      </nav>
    </header>
  )
}

function TopBarLink({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function SettingsIcon() {
  // Inline so we don't need another lucide import when icon comes from the sheet
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4.5 w-4.5"
      aria-hidden
    >
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  )
}
