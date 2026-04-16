import { AuthGuard } from "@/components/auth/auth-guard"
import { TaskflowApp } from "@/components/taskflow/taskflow-app"

export default function Page() {
  return (
    <AuthGuard>
      <TaskflowApp />
    </AuthGuard>
  )
}
