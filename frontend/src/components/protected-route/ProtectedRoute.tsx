import type { AuthState } from '@/models/IAuth'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../side-bar/Sidebar'

const ProtectedRoute = () => {
  const token = useSelector((state: { auth: AuthState }) => state.auth.token)
    console.log("ProtectedRoute token:", token) // Debug log
  if (!token) {
    return <Navigate to='/login' replace />
  } else {  
    return (
       <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className=" flex-1 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
    )
  }
}

export default ProtectedRoute
