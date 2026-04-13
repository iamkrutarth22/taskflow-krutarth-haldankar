import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import type { IProject } from '@/models/IProject'
import type { ITask } from '@/models/ITask'
import api from '@/lib/axios'
import { ArrowLeft, Plus, ChevronDown } from 'lucide-react'
import TaskModal from '@/components/shared/TaskModal'
import type { AuthState } from '@/models/IAuth'

const STATUS_TABS = ['All', 'Todo', 'In Progress', 'Done']

const STATUS_MAP: Record<string, string> = {
  'All': 'all',
  'Todo': 'todo',
  'In Progress': 'in_progress',
  'Done': 'done',
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-yellow-100 text-yellow-600',
  low: 'bg-green-100 text-green-600',
}

const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  done: 'bg-green-500',
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentUser = useSelector((state: {auth:AuthState}) => state.auth.user)

  const [activeTab, setActiveTab] = useState('All')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ITask | null>(null)

  // ── Fetch project ─────────────────────────────────────
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await api.get(`/projects/${id}`)
      return res.data as IProject
    }
  })

  // ── Optimistic status update ──────────────────────────
  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const res = await api.patch(`/tasks/${taskId}`, { status })
      return res.data
    },
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['project', id] })
      const previous = queryClient.getQueryData(['project', id])
      queryClient.setQueryData(['project', id], (old: any) => ({
        ...old,
        tasks: old.tasks.map((t: ITask) =>
          t.id === taskId ? { ...t, status } : t
        )
      }))
      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['project', id], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    }
  })

  // ── Delete task ───────────────────────────────────────
  const { mutate: deleteTask } = useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    }
  })

  // ── Filter tasks ──────────────────────────────────────
  const filteredTasks = (project?.tasks || []).filter((task: ITask) => {
    const statusMatch =
      activeTab === 'All' || task.status === STATUS_MAP[activeTab]
    const assigneeMatch =
      assigneeFilter === 'all' ||
      (assigneeFilter === 'mine' && task.assignee_id === currentUser?.id) ||
      (assigneeFilter === 'unassigned' && !task.assignee_id)
    return statusMatch && assigneeMatch
  })

  // ── Loading ───────────────────────────────────────────
  if (isLoading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-100 rounded w-48" />
      <div className="h-4 bg-gray-100 rounded w-64" />
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  )

  // ── Error ─────────────────────────────────────────────
  if (isError) return (
    <div className="text-center py-16">
      <p className="text-gray-400 text-sm mb-4">Failed to load project.</p>
      <button
        onClick={() => navigate('/projects')}
        className="text-blue-600 text-sm hover:underline"
      >
        Back to Projects
      </button>
    </div>
  )

  return (
    <div>

      {/* Back button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Projects
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
          {project?.description && (
            <p className="text-sm text-gray-400 mt-1">{project.description}</p>
          )}
        </div>
        <button
          onClick={() => { setEditingTask(null); setTaskModalOpen(true) }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">

        {/* Status tabs */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Assignee filter */}
        <div className="relative">
          <select
            value={assigneeFilter}
            onChange={e => setAssigneeFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 outline-none focus:border-blue-400 bg-white cursor-pointer"
          >
            <option value="all">Assignee: All</option>
            <option value="mine">Assigned to me</option>
            <option value="unassigned">Unassigned</option>
          </select>
          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Empty state */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm mb-1">
            {activeTab !== 'All'
              ? `No ${activeTab.toLowerCase()} tasks`
              : 'No tasks yet'}
          </p>
          <p className="text-gray-300 text-xs mb-4">
            {activeTab !== 'All'
              ? 'Try a different filter'
              : 'Add your first task to get started'}
          </p>
          {activeTab === 'All' && (
            <button
              onClick={() => { setEditingTask(null); setTaskModalOpen(true) }}
              className="text-sm text-blue-600 hover:underline"
            >
              Add Task
            </button>
          )}
        </div>
      )}

      {/* Task list */}
      {filteredTasks.length > 0 && (
        <div className="space-y-2">
          {filteredTasks.map((task: ITask) => (
            <div
              key={task.id}
              className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow group"
            >
              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">

                {/* Status dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[task.status]}`} />

                {/* Title + meta */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-gray-400">
                        Due {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    {task.assignee_id === currentUser?.id && (
                      <span className="text-xs text-blue-500">You</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2 shrink-0">

                {/* Status selector — optimistic */}
                <select
                  value={task.status}
                  onChange={e => updateStatus({ taskId: task.id, status: e.target.value })}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 bg-white cursor-pointer"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {/* Edit */}
                <button
                  onClick={() => { setEditingTask(task); setTaskModalOpen(true) }}
                  className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Edit
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-xs text-gray-400 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        open={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null) }}
        projectId={id!}
        task={editingTask}
        onSuccess={() => {
          setTaskModalOpen(false)
          setEditingTask(null)
          queryClient.invalidateQueries({ queryKey: ['project', id] })
        }}
      />
    </div>
  )
}