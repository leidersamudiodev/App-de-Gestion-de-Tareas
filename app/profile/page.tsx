import type { Metadata } from "next"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ProfileView } from "@/components/taskflow/profile-view"

export const metadata: Metadata = {
  title: "Profile — TaskFlow",
  description: "Your TaskFlow profile, productivity stats, streak and recent achievements.",
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileView />
    </AuthGuard>
  )
}
