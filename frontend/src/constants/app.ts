import type { TaskStatus } from "@/models/ITask";
import { CheckSquare, FolderOpen, LayoutDashboard } from "lucide-react";

export const statusColors: Record<string, string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700'
}


export const statusLabels: Record<string, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done'
}

export const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700'
}


export const STATUS_GROUPS: { key: TaskStatus; label: string; dot: string }[] = [
  { key: "todo", label: "Todo", dot: "bg-slate-400" },
  { key: "in_progress", label: "In Progress", dot: "bg-blue-500" },
  { key: "done", label: "Done", dot: "bg-green-500" },
]

export const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', disabled: false},
  { label: 'My Tasks', icon: CheckSquare, path: '/my-tasks', disabled: false },
  { label: 'Projects', icon: FolderOpen, path: '/projects', disabled: false },
]