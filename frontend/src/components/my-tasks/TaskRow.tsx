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
    <div className='flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors gap-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0'>
      {/* Left Section - Title + Project + Due Date */}
      <div className='min-w-0 flex-1'>
        <p className='text-sm  text-start font-medium text-gray-800 dark:text-gray-200 truncate'>
          {task.title}
        </p>

        <div className='flex items-center gap-2 mt-1 flex-wrap'>
          <button
            onClick={onProjectClick}
            className='text-xs text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[180px]'
          >
            {projectName}
          </button>

          {task.due_date && (
            <span
              className={`text-xs whitespace-nowrap ${
                isOverdue
                  ? 'text-red-500 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              · Due {format(parseISO(task.due_date), 'MMM d')}
            </span>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2 shrink-0 w-full sm:w-auto'>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>

        <select
          value={task.status}
          onChange={e => onStatusChange(e.target.value as TaskStatus)}
          className='text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:border-gray-400 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 cursor-pointer flex-1 sm:flex-none min-w-[115px]'
        >
          <option value='todo'>Todo</option>
          <option value='in_progress'>In Progress</option>
          <option value='done'>Done</option>
        </select>
      </div>
    </div>
  )
}
