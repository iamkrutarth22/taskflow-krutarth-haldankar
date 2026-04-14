import ProtectedRoute from '@/components/protected-route/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage'
import ProjectsPage from '@/pages/ProjectsPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import MyTasksPage from '@/pages/MyTasksPage'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import NotFoundPage from '@/pages/PageNotFound'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to='/dashboard' replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'my-tasks', element: <MyTasksPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:id', element: <ProjectDetailsPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
])
