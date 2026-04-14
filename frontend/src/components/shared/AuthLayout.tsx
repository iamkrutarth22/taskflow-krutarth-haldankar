export function AuthLayout ({ children }: any) {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50 dark:bg-gray-950'>
      {/* Left Sidebar - Branding (Blue Section) */}
      <div className='hidden lg:flex flex-col justify-between bg-blue-600 p-16'>
        <div className='flex items-center  gap-2'>
          <div className='w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center'>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path
                d='M2 4h12M2 8h8M2 12h5'
                stroke='#2563eb'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </div>
          <span className='font-bold text-4xl text-white'>TaskFlow</span>
        </div>

        <p className='text-blue-300 text-xs'>
          © 2026 TaskFlow · Privacy · Terms
        </p>
      </div>

      <div className='flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-10 border-l border-gray-200 dark:border-gray-800'>
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
            <span className='font-bold text-lg text-gray-900 dark:text-gray-100'>
              TaskFlow
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
