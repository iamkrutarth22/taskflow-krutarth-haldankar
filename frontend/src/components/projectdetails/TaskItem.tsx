import type { ITask } from '@/models/ITask'

type Props = {
  task: ITask
  currentUserId?: string
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: string) => void
  PRIORITY_COLORS: Record<string, string>
}

export default function TaskItem ({
  task,
  currentUserId,
  onEdit,
  onDelete,
  onStatusChange,
  PRIORITY_COLORS
}: Props) {
  return (
    <div className='bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-4  group duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-0.5'>
      <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
        <div className='flex gap-3 min-w-0 flex-1'>
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
            <p className='text-sm text-start font-medium text-gray-900 dark:text-gray-100 truncate'>
              {task.title}
            </p>

            <div className='flex gap-2 mt-1 flex-wrap'>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  PRIORITY_COLORS[task.priority]
                }`}
              >
                {task.priority}
              </span>

              {task.assignee_id === currentUserId && (
                <span className='text-xs text-blue-500 font-medium'>You</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Status Select + Actions */}
        <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto'>
          {/* Status Select */}
          <select
            value={task.status}
            onChange={e => onStatusChange(e.target.value)}
            className='text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:border-gray-400 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 cursor-pointer flex-1 sm:flex-none min-w-[110px]'
          >
            <option value='todo'>Todo</option>
            <option value='in_progress'>In Progress</option>
            <option value='done'>Done</option>
          </select>

          <div className='flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
            <button
              onClick={onEdit}
              className='text-xs text-gray-400 dark:text-gray-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 active:bg-blue-100 dark:active:bg-blue-900 transition-colors whitespace-nowrap'
            >
              Edit
            </button>

            <button
              onClick={onDelete}
              className='text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 active:bg-red-100 dark:active:bg-red-900 transition-colors whitespace-nowrap'
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
