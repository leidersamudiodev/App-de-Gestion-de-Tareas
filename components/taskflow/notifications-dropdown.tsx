"use client"

import { useMemo, useState } from "react"
import { AlertOctagon, AtSign, Bell, BellOff, CalendarClock, Check, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Task } from "@/lib/taskflow/types"
import { buildNotifications, type NotificationItem } from "@/lib/taskflow/workspace-data"

interface NotificationsDropdownProps {
  tasks: Task[]
  onOpenTask: (id: string) => void
}

const KIND_META: Record<
  NotificationItem["kind"],
  { icon: React.ReactNode; color: string }
> = {
  urgent: { icon: <AlertOctagon className="h-3.5 w-3.5" />, color: "bg-destructive-soft text-destructive" },
  reminder: { icon: <CalendarClock className="h-3.5 w-3.5" />, color: "bg-warning-soft text-warning" },
  mention: { icon: <AtSign className="h-3.5 w-3.5" />, color: "bg-accent text-primary" },
  activity: { icon: <Sparkles className="h-3.5 w-3.5" />, color: "bg-muted text-muted-foreground" },
}

export function NotificationsDropdown({ tasks, onOpenTask }: NotificationsDropdownProps) {
  const all = useMemo(() => buildNotifications(tasks), [tasks])
  const [read, setRead] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState(false)

  const unreadCount = all.filter((n) => !read.has(n.id)).length

  const markAll = () => {
    setRead(new Set(all.map((n) => n.id)))
  }

  const handleClick = (n: NotificationItem) => {
    setRead((prev) => {
      const next = new Set(prev)
      next.add(n.id)
      return next
    })
    if (n.taskId) {
      onOpenTask(n.taskId)
      setOpen(false)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground shadow-soft">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[340px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">Notifications</p>
            <p className="text-[11px] text-muted-foreground">
              {unreadCount === 0 ? "All caught up" : `${unreadCount} unread`}
            </p>
          </div>
          {all.length > 0 && (
            <button
              onClick={markAll}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-primary hover:bg-accent"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {all.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <BellOff className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-foreground">You&apos;re all caught up</p>
              <p className="text-[11px] text-muted-foreground">We&apos;ll let you know when things change.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {all.map((n) => {
                const meta = KIND_META[n.kind]
                const isRead = read.has(n.id)
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => handleClick(n)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-background-muted/60"
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${meta.color}`}
                      >
                        {meta.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={[
                              "text-xs font-semibold tracking-tight",
                              isRead ? "text-muted-foreground" : "text-foreground",
                            ].join(" ")}
                          >
                            {n.title}
                          </p>
                          {!isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                          {n.description}
                        </p>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {n.when}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
