import { ActionDashboard } from "../dashboard/action-dashboard"

export interface NewSessionViewProps {
  worktree: string
  onWorktreeChange: (value: string) => void
}

export function NewSessionView(_: NewSessionViewProps) {
  return <ActionDashboard />
}
