import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ITask } from '@/models/ITask'

type Props = {
  task: ITask
  currentUserId?: string
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: string) => void
  STATUS_COLORS: Record<string, string>
  PRIORITY_COLORS: Record<string, string>
}

export default function TaskItem ({
  task,
  currentUserId,
  onEdit,
  onDelete,
  onStatusChange,
  STATUS_COLORS,
  PRIORITY_COLORS
}: Props) {
  return (
    <div className='bg-white border border-gray-100  rounded-xl px-5 py-4 hover:shadow-sm flex justify-between group'>
      {/* Left */}
      <div className='flex gap-3 min-w-0'>
        <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[task.status]}`} />

        <div>
          <p className='text-sm font-medium truncate'>{task.title}</p>

          <div className='flex gap-2 mt-1 flex-wrap'>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                PRIORITY_COLORS[task.priority]
              }`}
            >
              {task.priority}
            </span>

            {task.assignee_id === currentUserId && (
              <span className='text-xs text-blue-500'>You</span>
            )}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className='flex gap-2'>
        <select
          value={task.status}
          onChange={e => onStatusChange(e.target.value)}
          className='text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-gray-400 bg-white cursor-pointer'
        >
          <option value='todo'>Todo</option>
          <option value='in_progress'>In Progress</option>
          <option value='done'>Done</option>
        </select>
       
        <button
          onClick={onEdit}
          className='text-xs text-gray-400 hover:text-blue-600 px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100'
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className='text-xs text-gray-400 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100'
        >
          Delete
        </button>
      </div>
    </div>
  )
}
