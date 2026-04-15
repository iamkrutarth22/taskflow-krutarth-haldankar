import type { AuthState } from '@/models/IAuth'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'

const ProtectedRoute = () => {
  const token = useSelector((state: { auth: AuthState }) => state.auth.token)
  if (!token) {
    return <Navigate to='/login' replace />
  } else {
    return (
      <div className='flex h-screen  overflow-hidden bg-gray-50 dark:bg-gray-950'>
        <div className='shrink-0'>
          <Sidebar />
        </div>
        <main className='flex-1 max-lg:mt-10 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    )
  }
}

export default ProtectedRoute
