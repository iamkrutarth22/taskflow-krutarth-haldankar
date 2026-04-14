import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import axios from '@/lib/axios'
import type { IProject } from '@/models/IProject'
import type { ITask } from '@/models/ITask'
import { useNavigate } from 'react-router-dom'
import {  isPast, parseISO } from 'date-fns'
import type { AuthState } from '@/models/IAuth'
import { StatCard } from '@/components/dashboard/StatCard'
import RecentProjectCard from '@/components/dashboard/RecentProjectCard'

export default function DashboardPage () {
  const user = useSelector((state: { auth: AuthState }) => state.auth.user)
  const navigate = useNavigate()

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

  const isLoading = projectsLoading || tasksLoading

  const myTasks = allTasks?.filter(t => t.assignee_id === user?.id) ?? []
  const totalProjects = projectsData?.length ?? 0
  const totalTasks = allTasks?.length ?? 0
  const dueSoonTasks = myTasks.filter(
    t => t.due_date && t.status !== 'done' && isPast(parseISO(t.due_date))
  )

  const recentTasks = [...myTasks]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className='p-8 space-y-6'>
        <div className='h-8 w-48 bg-gray-200 rounded animate-pulse' />
        <div className='grid grid-cols-3 gap-4'>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className='h-24 bg-gray-200 rounded-xl animate-pulse'
            />
          ))}
        </div>
        <div className='h-64 bg-gray-200 rounded-xl animate-pulse' />
      </div>
    )
  }

  return (
    <div className='p-6 md:p-8 max-w-5xl space-y-8'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-semibold text-gray-900'>
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
        <p className='text-sm text-muted-foreground mt-1'>
          Here's what's happening across your workspace.
        </p>
      </div>

      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard
          label='Total Projects'
          value={totalProjects}
          sub='projects in your workspace'
          onClick={() => navigate('/projects')}
        />
        <StatCard
          label='Total Tasks'
          value={totalTasks}
          sub='across all projects'
        />
        <StatCard
          label='Overdue Tasks'
          value={dueSoonTasks.length}
          sub='assigned to you'
          accent={dueSoonTasks.length > 0 ? 'red' : undefined}
        />
      </div>

      <div>
        <h2 className='text-base font-semibold text-gray-800 mb-3'>
          My Recent Tasks
        </h2>

        {recentTasks.length === 0 ? (
          <div className='border rounded-xl p-10 text-center text-muted-foreground'>
            <p className='text-4xl mb-3'>📋</p>
            <p className='font-medium'>No tasks assigned to you yet</p>
            <p className='text-sm mt-1'>
              Head to a project and create a task assigned to yourself.
            </p>
          </div>
        ) : (
          <div className=' rounded-xl border-gray-200  border overflow-hidden'>
            {recentTasks.map(
              task =>
                projectsData && (
                  <RecentProjectCard
                    key={task.id}
                    task={task}
                    projectsData={projectsData}
                  />
                )
            )}
          </div>
        )}
      </div>

      {/* Projects Quick Access */}
      {(projectsData?.length ?? 0) > 0 && (
        <div>
          <h2 className='text-base font-semibold text-gray-800 mb-3'>
            Your Projects
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {projectsData?.map(p => {
              const count =
                allTasks?.filter(t => t.project_id === p.id).length ?? 0
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className='border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors'
                >
                  <p className='font-medium text-gray-800 text-sm'>{p.name}</p>
                  <p className='text-xs text-muted-foreground mt-0.5 truncate'>
                    {p.description || 'No description'}
                  </p>
                  <p className='text-xs text-muted-foreground mt-2'>
                    {count} task{count !== 1 ? 's' : ''}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
