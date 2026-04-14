import type { TaskStatus } from "@/models/ITask";
import { CheckSquare, FolderOpen, LayoutDashboard } from "lucide-react";

export const statusColors: Record<string, string> = {
  todo: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  in_progress: 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300',
  done: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
}


export const statusLabels: Record<string, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done'
}

export const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-600 dark:bg-red-800/50 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/50 dark:text-yellow-300',
  low: 'bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300'
}


export const STATUS_GROUPS: { key: TaskStatus; label: string; dot: string }[] = [
  { key: "todo", label: "Todo", dot: "bg-slate-400" },
  { key: "in_progress", label: "In Progress", dot: "bg-blue-500" },
  { key: "done", label: "Done", dot: "bg-green-500" },
]

export const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', disabled: false},
  { label: 'Projects', icon: FolderOpen, path: '/projects', disabled: false },
  { label: 'My Tasks', icon: CheckSquare, path: '/my-tasks', disabled: false },
]