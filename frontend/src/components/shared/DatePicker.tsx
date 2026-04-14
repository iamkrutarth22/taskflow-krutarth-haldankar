import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

type props = {
  dueDate: string | ''
  setDueDate: (date: string) => void
}

const DatePicker = ({ dueDate, setDueDate }: props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className=' px-3 py-5 border border-gray-200 rounded-lg w-full justify-start text-sm font-normal'
        >
          {dueDate
            ? new Date(dueDate + 'T00:00:00').toLocaleDateString()
            : 'Select date'}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={dueDate ? new Date(dueDate + 'T00:00:00') : undefined}
          onSelect={date => {
            if (date) {
              // Use local date parts instead of toISOString() which uses UTC
              const year = date.getFullYear()
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const day = String(date.getDate()).padStart(2, '0')
              setDueDate(`${year}-${month}-${day}`)
            } else {
              setDueDate('')
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
