import { priorityColors } from '@/constants/app'
import { format, isPast, parseISO } from 'date-fns'

import type { ITask, TaskStatus } from '@/models/ITask'

export function TaskRow ({
  task,
  projectName,
  onStatusChange,
  onProjectClick
}: {
  task: ITask
  projectName: string
  onStatusChange: (status: TaskStatus) => void
  onProjectClick: () => void
}) {
  const isOverdue =
    task.due_date && task.status !== 'done' && isPast(parseISO(task.due_date))

  return (
    <div className='flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors gap-4'>
      <div className='min-w-0 flex-1'>
        <p className='text-sm text-start font-medium text-gray-800 truncate '>
          {task.title}
        </p>
        <div className='flex items-center gap-2 mt-0.5'>
          <button
            onClick={onProjectClick}
            className='text-xs text-blue-600 hover:underline truncate'
          >
            {projectName}
          </button>
          {task.due_date && (
            <span
              className={`text-xs ${
                isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'
              }`}
            >
              · Due {format(parseISO(task.due_date), 'MMM d')}
            </span>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>

        <select
          value={task.status}
          onChange={e => onStatusChange(e.target.value as TaskStatus)}
          className='text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-gray-400 bg-white cursor-pointer'
        >
          <option value='todo'>Todo</option>
          <option value='in_progress'>In Progress</option>
          <option value='done'>Done</option>
        </select>
      </div>
    </div>
  )
}
