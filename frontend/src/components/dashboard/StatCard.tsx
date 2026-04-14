export function StatCard ({
  label,
  value,
  sub,
  accent,
  onClick
}: {
  label: string
  value: number
  sub: string
  accent?: 'red'
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`group border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 
        rounded-2xl p-5 sm:p-6 space-y-3  hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-0.5
        ${
          onClick
            ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]'
            : 'shadow-sm'
        }`}
    >
      <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest'>
        {label}
      </p>

      <p
        className={`text-4xl sm:text-5xl font-bold tracking-tighter transition-colors
          ${
            accent === 'red'
              ? 'text-red-500'
              : 'text-gray-900 dark:text-gray-100'
          }`}
      >
        {value}
      </p>

      <p className='text-sm text-gray-500 dark:text-gray-400 leading-snug'>
        {sub}
      </p>

      {onClick && (
        <div className='pt-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <span className='text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1'>
            View all →
          </span>
        </div>
      )}
    </div>
  )
}
