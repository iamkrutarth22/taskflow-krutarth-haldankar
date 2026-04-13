export function AuthLayout ({ children }: any) {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      <div className='hidden lg:flex flex-col justify-between bg-blue-600 p-16'>
        
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-white rounded-md flex items-center justify-center'>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path
                d='M2 4h12M2 8h8M2 12h5'
                stroke='#2563eb'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </div>
          <span className='font-bold text-xl text-white'>TaskFlow</span>
        </div>

        {/* Center text */}
        <div className='space-y-4 max-w-sm'>
          <h1 className='text-3xl font-bold text-white leading-snug'>
            Manage your team
            <br />
            with clarity and speed.
          </h1>
          <p className='text-blue-200 text-sm'>
            Plan projects, track tasks, and collaborate effortlessly in one
            unified workspace.
          </p>
        </div>

        <p className='text-blue-300 text-xs'>
          © 2026 TaskFlow · Privacy · Terms
        </p>
      </div>
      <div className='flex items-center justify-center bg-gray-50 px-6 py-10'>
        <div className='w-full max-w-md'>
          <div className='lg:hidden flex items-center justify-center gap-2 mb-8'>
            <div className='w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center'>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path
                  d='M2 4h12M2 8h8M2 12h5'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <span className='font-bold text-lg'>TaskFlow</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
