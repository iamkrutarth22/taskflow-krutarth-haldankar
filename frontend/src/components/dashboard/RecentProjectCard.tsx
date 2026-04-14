import { priorityColors, statusColors, statusLabels } from '@/constants/app'
import type { IProject } from '@/models/IProject'
import type { ITask } from '@/models/ITask'
import { format, isPast, parseISO } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const RecentProjectCard = ({
  task,
  projectsData
}: {
  task: ITask
  projectsData: IProject[]
}) => {
  const getProjectName = (projectId: string) =>
    projectsData?.find(p => p.id === projectId)?.name ?? 'Unknown'

  const navigate = useNavigate()

  return (
    <div
      className='flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 
               cursor-pointer transition-colors border-b border-gray-200 dark:border-gray-800 last:border-b-0 gap-4 hover:shadow-lg hover:border-b hover:border-t hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-0.5'
      onClick={() => navigate(`/projects/${task.project_id}`)}
    >
      <div className='flex items-start gap-3 min-w-0 flex-1'>
        <span
          className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
            task.status === 'done'
              ? 'bg-green-500'
              : task.status === 'in_progress'
              ? 'bg-blue-500'
              : 'bg-slate-400'
          }`}
        />
        <div className='min-w-0 flex-1'>
          <p className='text-sm text-start font-medium text-gray-900 dark:text-gray-100 leading-tight truncate'>
            {task.title}
          </p>
          <p className='text-xs text-start text-gray-500 dark:text-gray-400 mt-0.5 truncate'>
            {getProjectName(task.project_id)}
          </p>
        </div>
      </div>

      <div className='flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto'>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap shrink-0 ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>

        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap shrink-0 ${
            statusColors[task.status]
          }`}
        >
          {statusLabels[task.status]}
        </span>

        {task.due_date && (
          <span
            className={`text-xs whitespace-nowrap ml-auto sm:ml-0 ${
              isPast(parseISO(task.due_date)) && task.status !== 'done'
                ? 'text-red-500 font-medium'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Due {format(parseISO(task.due_date), 'MMM d')}
          </span>
        )}
      </div>
    </div>
  )
}

export default RecentProjectCard
