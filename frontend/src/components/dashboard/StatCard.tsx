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
      className={`border border-gray-100 shadow-md  hover:-translate-y-0.5 rounded-xl p-5 space-y-1 ${
        onClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
      }`}
    >
      <p className='text-xs text-muted-foreground uppercase tracking-wide font-medium'>
        {label}
      </p>
      <p
        className={`text-3xl font-bold ${
          accent === 'red' ? 'text-red-500' : 'text-gray-900'
        }`}
      >
        {value}
      </p>
      <p className='text-xs text-muted-foreground'>{sub}</p>
    </div>
  )
}
