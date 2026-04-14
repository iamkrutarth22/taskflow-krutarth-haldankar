import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'

type Props = {
  dueDate: string | ''
  setDueDate: (date: string) => void
}

const DatePicker = ({ dueDate, setDueDate }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-full px-4 py-5 border border-gray-200 dark:border-gray-700 
                     bg-gray-50 dark:bg-gray-950 text-left font-normal text-sm
                     hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors
                     justify-start rounded-lg'
        >
          <CalendarIcon className='w-4 h-4 mr-3 text-gray-400 dark:text-gray-500' />
          {dueDate ? (
            new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          ) : (
            <span className='text-gray-500 dark:text-gray-400'>
              Select due date
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='w-auto p-0 shadow-xl border border-gray-200 dark:border-gray-800'
        align='start'
      >
        <Calendar
          mode='single'
          selected={dueDate ? new Date(dueDate + 'T00:00:00') : undefined}
          onSelect={date => {
            if (date) {
              const year = date.getFullYear()
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const day = String(date.getDate()).padStart(2, '0')
              setDueDate(`${year}-${month}-${day}`)
            } else {
              setDueDate('')
            }
          }}
          className='bg-gray-50 dark:bg-gray-950'
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
