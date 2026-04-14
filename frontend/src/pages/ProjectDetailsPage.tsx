import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import type { IProject } from '@/models/IProject'
import type { ITask } from '@/models/ITask'
import api from '@/lib/axios'
import { ArrowLeft, Plus,  } from 'lucide-react'
import TaskModal from '@/components/shared/project-details/TaskModal'
import type { AuthState } from '@/models/IAuth'
import ProjectFilters from '@/components/shared/project-details/ProjectFilters'
import TaskItem from '@/components/shared/project-details/TaskItem'

const STATUS_TABS = ['All', 'Todo', 'In Progress', 'Done']

const STATUS_MAP: Record<string, string> = {
  All: 'all',
  Todo: 'todo',
  'In Progress': 'in_progress',
  Done: 'done'
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-yellow-100 text-yellow-600',
  low: 'bg-green-100 text-green-600'
}

const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  done: 'bg-green-500'
}

export default function ProjectDetailPage () {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentUser = useSelector(
    (state: { auth: AuthState }) => state.auth.user
  )

  const [activeTab, setActiveTab] = useState('All')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ITask | null>(null)

  const {
    data: project,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await api.get(`/projects/${id}`)
      return res.data as IProject
    }
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({
      taskId,
      status
    }: {
      taskId: string
      status: string
    }) => {
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

  const { mutate: deleteTask } = useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    }
  })

  const filteredTasks = (project?.tasks || []).filter((task: ITask) => {
    const statusMatch =
      activeTab === 'All' || task.status === STATUS_MAP[activeTab]
    const assigneeMatch =
      assigneeFilter === 'all' ||
      (assigneeFilter === 'mine' && task.assignee_id === currentUser?.id) ||
      (assigneeFilter === 'unassigned' && !task.assignee_id)
    return statusMatch && assigneeMatch
  })

  
  if (isLoading)
    return (
      <div className='animate-pulse space-y-4'>
        <div className='h-6 bg-gray-100 rounded w-48' />
        <div className='h-4 bg-gray-100 rounded w-64' />
        <div className='mt-6 space-y-3'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-16 bg-gray-100 rounded-xl' />
          ))}
        </div>
      </div>
    )

 
  if (isError)
    return (
      <div className='text-center py-16'>
        <p className='text-gray-400 text-sm mb-4'>Failed to load project.</p>
        <button
          onClick={() => navigate('/projects')}
          className='text-blue-600 text-sm hover:underline'
        >
          Back to Projects
        </button>
      </div>
    )

  return (
    <div>
      <button
        onClick={() => navigate('/projects')}
        className='flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors'
      >
        <ArrowLeft className='w-4 h-4' />
        Projects
      </button>

      <div className='flex items-start justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>{project?.name}</h1>
          {project?.description && (
            <p className='text-sm text-gray-400 mt-1'>{project.description}</p>
          )}
        </div>
        <button
          onClick={() => {
            setEditingTask(null)
            setTaskModalOpen(true)
          }}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0'
        >
          <Plus className='w-4 h-4' />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <ProjectFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        STATUS_TABS={STATUS_TABS}
      />

      {/* Empty state */}
      {filteredTasks.length === 0 && (
        <div className='text-center py-16'>
          <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3'>
            <Plus className='w-6 h-6 text-gray-300' />
          </div>
          <p className='text-gray-400 text-sm mb-1'>
            {activeTab !== 'All'
              ? `No ${activeTab.toLowerCase()} tasks`
              : 'No tasks yet'}
          </p>
          <p className='text-gray-300 text-xs mb-4'>
            {activeTab !== 'All'
              ? 'Try a different filter'
              : 'Add your first task to get started'}
          </p>
          {activeTab === 'All' && (
            <button
              onClick={() => {
                setEditingTask(null)
                setTaskModalOpen(true)
              }}
              className='text-sm text-blue-600 hover:underline'
            >
              Add Task
            </button>
          )}
        </div>
      )}

      {filteredTasks.length > 0 && (
        <div className='space-y-2'>
          

          {filteredTasks.map((task: ITask) => (
            <TaskItem
              key={task.id}
              task={task}
              currentUserId={currentUser?.id}
              onEdit={() => {
                setEditingTask(task)
                setTaskModalOpen(true)
              }}
              onDelete={() => deleteTask(task.id)}
              onStatusChange={status =>
                updateStatus({ taskId: task.id, status })
              }
              STATUS_COLORS={STATUS_COLORS}
              PRIORITY_COLORS={PRIORITY_COLORS}
            />
          ))}
        </div>
      )}

      {/* add task modal */}
      <TaskModal
        open={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false)
          setEditingTask(null)
        }}
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
