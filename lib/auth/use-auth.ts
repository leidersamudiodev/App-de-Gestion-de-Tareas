"use client"

import { useCallback, useEffect, useState } from "react"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  initials: string
  createdAt: string
  plan: "Free" | "Pro" | "Team"
}

const STORAGE_KEY = "taskflow:auth:user:v1"

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return "U"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

function writeStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else window.localStorage.removeItem(STORAGE_KEY)
    // broadcast change to other hook instances on the same tab
    window.dispatchEvent(new CustomEvent("taskflow:auth-change"))
  } catch {
    /* ignore quota errors */
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setUser(readStoredUser())
    setHydrated(true)

    const sync = () => setUser(readStoredUser())
    window.addEventListener("storage", sync)
    window.addEventListener("taskflow:auth-change", sync as EventListener)
    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener("taskflow:auth-change", sync as EventListener)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Simulated credential check — any valid-looking email + 6+ char password works
    await new Promise((r) => setTimeout(r, 650))
    const normalized = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new Error("Please enter a valid email address.")
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters.")
    }
    // Preserve existing profile if the same email has registered before
    const existing = readStoredUser()
    const user: AuthUser =
      existing && existing.email.toLowerCase() === normalized
        ? existing
        : {
            id: crypto.randomUUID(),
            name: normalized.split("@")[0]!.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "You",
            email: normalized,
            role: "Product Designer",
            initials: getInitials(normalized.split("@")[0]!),
            createdAt: new Date().toISOString(),
            plan: "Pro",
          }
    writeStoredUser(user)
    setUser(user)
    return user
  }, [])

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; confirm: string }) => {
      await new Promise((r) => setTimeout(r, 750))
      const name = payload.name.trim()
      const email = payload.email.trim().toLowerCase()
      if (name.length < 2) throw new Error("Please enter your full name.")
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.")
      if (!payload.password || payload.password.length < 6) throw new Error("Password must be at least 6 characters.")
      if (payload.password !== payload.confirm) throw new Error("Passwords don’t match.")
      const user: AuthUser = {
        id: crypto.randomUUID(),
        name,
        email,
        role: "Product Designer",
        initials: getInitials(name),
        createdAt: new Date().toISOString(),
        plan: "Pro",
      }
      writeStoredUser(user)
      setUser(user)
      return user
    },
    [],
  )

  const logout = useCallback(() => {
    writeStoredUser(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      if (patch.name) next.initials = getInitials(patch.name)
      writeStoredUser(next)
      return next
    })
  }, [])

  return { user, hydrated, login, register, logout, updateUser }
}
