import { useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '@/lib/axios'
import type { IProject } from '@/models/IProject'
import type { ITask, TaskStatus } from '@/models/ITask'
import { useNavigate } from 'react-router-dom'
import type { AuthState } from '@/models/IAuth'
import { STATUS_GROUPS } from '@/constants/app'
import { TaskRow } from '@/components/mytasks/TaskRow'

export default function MyTasksPage () {
  const user = useSelector((state: { auth: AuthState }) => state.auth.user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await axios.get<{ projects: IProject[] }>('/projects')
      return res.data.projects
    }
  })

  const { data: allTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['all-tasks', projectsData],
    enabled: !!projectsData && projectsData.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        (projectsData ?? []).map(p =>
          axios
            .get<{ tasks: ITask[] }>(`/projects/${p.id}/tasks`)
            .then(r => r.data.tasks)
        )
      )
      return results.flat()
    }
  })

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      status
    }: {
      taskId: string
      status: TaskStatus
    }) => {
      const res = await axios.patch<ITask>(`/tasks/${taskId}`, { status })
      return res.data
    },
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['all-tasks'] })
      const previous = queryClient.getQueryData(['all-tasks', projectsData])
      queryClient.setQueryData(
        ['all-tasks', projectsData],
        (old: ITask[] | undefined) =>
          old?.map(t => (t.id === taskId ? { ...t, status } : t))
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['all-tasks', projectsData], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
    }
  })

  const isLoading = projectsLoading || tasksLoading

  const myTasks = allTasks?.filter(t => t.assignee_id === user?.id) ?? []

  const getProjectName = (projectId: string) =>
    projectsData?.find(p => p.id === projectId)?.name ?? 'Unknown'

  if (isLoading) {
    return (
      <div className='p-8 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen'>
        <div className='h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse' />
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className='h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='p-6 md:p-8 max-w-4xl space-y-8 bg-gray-50 dark:bg-gray-950 min-h-screen'>
      {/* Header */}
      <div>
        <h2 className='text-2xl text-start font-semibold text-gray-900 dark:text-gray-100'>
          My Tasks
        </h2>
        <p className='text-sm text-start text-gray-500 dark:text-gray-400 mt-1'>
          All tasks assigned to you across every project.
        </p>
      </div>

      {myTasks.length === 0 ? (
        <div className='border border-gray-200 dark:border-gray-800 rounded-xl p-16 text-center bg-gray-50 dark:bg-gray-950'>
          <p className='text-5xl mb-4'>✅</p>
          <p className='font-medium text-gray-700 dark:text-gray-200'>
            No tasks assigned to you
          </p>
          <p className='text-sm mt-1 text-gray-500 dark:text-gray-400'>
            When someone assigns you a task, it will show up here.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className='mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline'
          >
            Browse projects →
          </button>
        </div>
      ) : (
        <div className='space-y-8'>
          {STATUS_GROUPS.map(({ key, label, dot }) => {
            const group = myTasks.filter(t => t.status === key)
            if (group.length === 0) return null

            return (
              <div key={key}>
                <div className='flex items-center gap-2 mb-3'>
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <h2 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    {label}
                  </h2>
                  <span className='text-xs text-gray-400 dark:text-gray-500'>
                    ({group.length})
                  </span>
                </div>

                <div className='border border-gray-200 dark:border-gray-800 rounded-xl divide-y overflow-hidden bg-gray-50 dark:bg-gray-950'>
                  {group.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      projectName={getProjectName(task.project_id)}
                      onStatusChange={status =>
                        updateTaskMutation.mutate({
                          taskId: task.id,
                          status
                        })
                      }
                      onProjectClick={() =>
                        navigate(`/projects/${task.project_id}`)
                      }
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
