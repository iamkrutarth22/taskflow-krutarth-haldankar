import { ChevronDown } from 'lucide-react'

type Props = {
  activeTab: string
  setActiveTab: (v: string) => void
  assigneeFilter: string
  setAssigneeFilter: (v: string) => void
  STATUS_TABS: string[]
}

export default function ProjectFilters({
  activeTab,
  setActiveTab,
  assigneeFilter,
  setAssigneeFilter,
  STATUS_TABS
}: Props) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium
              ${activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="relative">
        <select
          value={assigneeFilter}
          onChange={e => setAssigneeFilter(e.target.value)}
          className="appearance-none pl-3 pr-8 py-1.5 border rounded-lg text-xs"
        >
          <option value="all">Assignee: All</option>
          <option value="mine">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
        </select>
        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  )
}