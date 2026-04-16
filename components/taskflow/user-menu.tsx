"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CircleUserRound, LogOut, Settings, Sparkles, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth/use-auth"

interface UserMenuProps {
  onOpenSettings: () => void
}

export function UserMenu({ onOpenSettings }: UserMenuProps) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast("Signed out", {
      description: "You’ve been returned to the login screen.",
    })
    router.replace("/login")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleUpgrade = () => {
    toast.success("You already have Pro", {
      description: "Every feature is unlocked in this demo workspace.",
    })
  }

  const initials = user?.initials ?? "YO"
  const name = user?.name ?? "You"
  const email = user?.email ?? "you@taskflow.app"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={[
            "ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold shadow-soft outline-none transition-all focus:ring-2 focus:ring-primary/30",
            user
              ? "bg-gradient-to-br from-primary to-primary-hover text-primary-foreground"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
          aria-label="Open user menu"
        >
          {user ? initials : <CircleUserRound className="h-4.5 w-4.5" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[11px] font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">{name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Account
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleUpgrade} className="cursor-pointer">
          <Sparkles className="mr-2 h-4 w-4 text-warning" />
          Upgrade plan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
