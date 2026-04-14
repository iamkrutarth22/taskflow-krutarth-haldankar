import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '@/store/authSlice'
import {
  
  LogOut,
  Menu
} from 'lucide-react'
import type { AuthState } from '@/models/IAuth'
import { navItems } from '@/constants/app'



export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector((state: { auth: AuthState }) => state.auth.user)

  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white  flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h8M2 12h5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-sm">TaskFlow</span>
        </div>
        <button onClick={() => setOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col z-50 transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static`}
      >

        {/* Logo */}
        <div
          className="flex items-center gap-2 px-5 py-5 cursor-pointer"
          onClick={() => navigate('/projects')}
        >
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h8M2 12h5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-base text-gray-900">TaskFlow</span>
        </div>

        {/* Workspace label */}
        <div className="px-5 mb-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
            Your Workspace
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            const Icon = item.icon

            return (
              <button
                key={item.label}
                onClick={() => {
                  if (!item.disabled) {
                    navigate(item.path)
                    setOpen(false)
                  }
                }}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left
                  ${isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : item.disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="px-3 pb-4 space-y-0.5">

          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed"
          >
            <Settings className="w-4 h-4 shrink-0" />
            Settings
          </button>

          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            Help
          </button> */}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>

        </div>
      </aside>
    </>
  )
}
