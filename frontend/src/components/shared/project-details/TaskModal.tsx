import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ITask } from '@/models/ITask'
import type { User } from '@/models/IUser'
import api from '@/lib/axios'
import { X } from 'lucide-react'
import DatePicker from '../DatePicker'

type Props = {
  open: boolean
  onClose: () => void
  projectId: string
  task: ITask | null
  onSuccess: () => void
}

export default function TaskModal ({
  open,
  onClose,
  projectId,
  task,
  onSuccess
}: Props) {
  const isEditing = !!task

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('todo')
  const [assigneeId, setAssigneeId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [titleError, setTitleError] = useState('')

  useEffect(() => {
    // if edit mode
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setStatus(task.status)
      setAssigneeId(task.assignee_id || '')
      setDueDate(task.due_date || '')
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus('todo')
      setAssigneeId('')
      setDueDate('')
    }
    setTitleError('')
  }, [task, open])

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users')
      return res.data.users as User[]
    },
    enabled: open
  })

  // if new task then create else update
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        description: description || null,
        priority,
        status,
        assignee_id: assigneeId || null,
        due_date: dueDate || null
      }
      if (isEditing) {
        const res = await api.patch(`/tasks/${task.id}`, payload)
        return res.data
      } else {
        const res = await api.post(`/projects/${projectId}/tasks`, payload)
        return res.data
      }
    },
    onSuccess,
    onError: (err: any) => {
      const fields = err.response?.data?.fields
      if (fields?.title) setTitleError(fields.title)
    }
  })

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('Title is required')
      return
    }
    setTitleError('')
    mutate()
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-end'>
      <div
        className='absolute inset-0 bg-black/30 backdrop-blur-sm'
        onClick={onClose}
      />

      <div className='relative bg-white h-full w-full max-w-md shadow-2xl flex flex-col'>
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100'>
          <div>
            <h2 className='text-base font-bold text-gray-900'>
              {isEditing ? 'Edit Task' : 'New Task'}
            </h2>
            {isEditing && (
              <p className='text-xs text-gray-400 mt-0.5 line-clamp-1'>
                {task.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className='w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors'
          >
            <X className='w-4 h-4 text-gray-400' />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto px-6 py-5 space-y-5'
        >
          {/* Title */}
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
              Title *
            </label>
            <input
              type='text'
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                setTitleError('')
              }}
              placeholder='e.g. Finalize Landing Page Hero'
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all
                ${
                  titleError
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
            />
            {titleError && <p className='text-xs text-red-500'>{titleError}</p>}
          </div>

          {/* Description */}
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Update the headline and primary CTA...'
              rows={3}
              className='w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none'
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className='w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white cursor-pointer'
              >
                <option value='todo'>Todo</option>
                <option value='in_progress'>In Progress</option>
                <option value='done'>Done</option>
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className='w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white cursor-pointer'
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>
          </div>

          {/* Assignee + Due date */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                className='w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white cursor-pointer'
              >
                <option value=''>Unassigned</option>
                {users?.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Due Date
              </label>

              <DatePicker dueDate={dueDate} setDueDate={setDueDate} />
            </div>
          </div>
        </form>
        <div className='px-6 py-4 border-t border-gray-100 flex items-center gap-3'>
          {isEditing && (
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium'
            >
              Delete Task
            </button>
          )}
          <div className='flex gap-3 ml-auto'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className='px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer'
            >
              {isPending
                ? isEditing
                  ? 'Saving...'
                  : 'Creating...'
                : isEditing
                ? 'Save Changes'
                : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
