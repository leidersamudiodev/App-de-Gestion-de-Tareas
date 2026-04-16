"use client"

import { useState } from "react"
import { BookOpen, HelpCircle, Keyboard, Lightbulb } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const SHORTCUTS: { combo: string[]; label: string }[] = [
  { combo: ["N"], label: "Create a new task" },
  { combo: ["/"], label: "Focus search" },
  { combo: ["1"], label: "Go to Workspace" },
  { combo: ["2"], label: "Go to Projects" },
  { combo: ["3"], label: "Go to Team" },
  { combo: ["4"], label: "Go to Reports" },
  { combo: ["Esc"], label: "Close any open modal" },
]

const TIPS: { title: string; body: string }[] = [
  {
    title: "Drag between columns",
    body: "On the Kanban board, drag any card across columns to move it between To do, Doing and Done.",
  },
  {
    title: "Subtasks drive progress",
    body: "Check off subtasks to see the progress ring update live on each card and in the sidebar.",
  },
  {
    title: "Filter like a pro",
    body: "Combine priority, status, due date and tag filters. The active-filter count shows above the board.",
  },
  {
    title: "Reset demo data",
    body: "Use the Demo data button in the top bar to reload the sample tasks at any time.",
  },
]

export function HelpDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Help & shortcuts"
        >
          <HelpCircle className="h-4.5 w-4.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-hidden border-border bg-card p-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="text-left text-base font-semibold tracking-tight">
                TaskFlow quick guide
              </DialogTitle>
              <p className="text-left text-xs text-muted-foreground">
                Shortcuts, tips and everything you need to move fast.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid max-h-[520px] grid-cols-1 overflow-y-auto md:grid-cols-2">
          {/* Quick tour */}
          <section className="border-b border-border p-6 md:border-b-0 md:border-r">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Quick tour</h3>
            </div>
            <ol className="mt-3 space-y-3">
              {[
                "Use the top nav to switch between Workspace, Projects, Team and Reports.",
                "Click any task card to open the detail pane with subtasks and comments.",
                "Hit the New task button (or press N) to add tasks on the fly.",
                "Filter, sort and search from the toolbar above the board.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-foreground">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold tracking-tight text-foreground">Tips</h3>
              </div>
              <ul className="mt-3 space-y-3">
                {TIPS.map((t) => (
                  <li key={t.title} className="rounded-xl bg-background-muted/60 p-3">
                    <p className="text-xs font-semibold text-foreground">{t.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{t.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Shortcuts */}
          <section className="p-6">
            <div className="flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Keyboard shortcuts</h3>
            </div>
            <ul className="mt-3 space-y-1.5">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-background-muted/60"
                >
                  <span className="text-foreground">{s.label}</span>
                  <span className="flex items-center gap-1">
                    {s.combo.map((k) => (
                      <kbd
                        key={k}
                        className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-border bg-background px-1.5 text-[10px] font-semibold text-foreground shadow-soft"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-dashed border-border bg-background-muted/40 p-4">
              <p className="text-xs font-semibold text-foreground">Need more help?</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                This is a portfolio demo. Feel free to explore every menu — your changes stay local and can be
                restored anytime with the Demo data button.
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
