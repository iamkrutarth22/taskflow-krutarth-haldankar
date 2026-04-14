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
      key={task.id}
      className='flex items-center border-b border-gray-200 justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors '
      onClick={() => navigate(`/projects/${task.project_id}`)}
    >
      <div className='flex items-center gap-3 min-w-0'>
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            task.status === 'done'
              ? 'bg-green-500'
              : task.status === 'in_progress'
              ? 'bg-blue-500'
              : 'bg-slate-400'
          }`}
        />
        <div className='min-w-0'>
          <p className='text-sm font-medium text-gray-800 truncate'>
            {task.title}
          </p>
          <p className='text-xs text-muted-foreground truncate'>
            {getProjectName(task.project_id)}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-2 shrink-0 ml-4'>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            statusColors[task.status]
          }`}
        >
          {statusLabels[task.status]}
        </span>
        {task.due_date && (
          <span
            className={`text-xs ${
              isPast(parseISO(task.due_date)) && task.status !== 'done'
                ? 'text-red-500 font-medium'
                : 'text-muted-foreground'
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
