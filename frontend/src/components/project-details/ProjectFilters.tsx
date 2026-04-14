import { ChevronDown } from 'lucide-react'

type Props = {
  activeTab: string
  setActiveTab: (v: string) => void
  assigneeFilter: string
  setAssigneeFilter: (v: string) => void
  STATUS_TABS: string[]
}

export default function ProjectFilters ({
  activeTab,
  setActiveTab,
  assigneeFilter,
  setAssigneeFilter,
  STATUS_TABS
}: Props) {
  return (
    <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
      {/* Tabs */}
      <div className='flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1'>
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${
                activeTab === tab
                  ? 'bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assignee Filter */}
      <div className='relative'>
        <select
          value={assigneeFilter}
          onChange={e => setAssigneeFilter(e.target.value)}
          className='appearance-none pl-3 pr-8 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900'
        >
          <option value='all'>Assignee: All</option>
          <option value='mine'>Assigned to me</option>
          <option value='unassigned'>Unassigned</option>
        </select>
        <ChevronDown className='w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500' />
      </div>
    </div>
  )
}
