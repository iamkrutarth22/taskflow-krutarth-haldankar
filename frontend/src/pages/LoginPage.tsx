import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/store/authSlice'
import api from '@/lib/axios'
import { AlertCircle } from 'lucide-react'
import { AuthLayout } from '@/components/shared/AuthLayout'

export default function LoginPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/login', { email, password })
      return res.data
    },
    onSuccess: data => {
      dispatch(login({ token: data.token, user: data.user }))
      navigate('/dashboard')
    },
    onError: (err: any) => {
      const fields = err.response?.data?.fields
      if (fields) {
        setErrors(fields)
      } else {
        setServerError('Invalid email or password. Please try again.')
      }
    }
  })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email) e.email = 'Email is required'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError('')
    if (validate()) mutate()
  }

  return (
    <AuthLayout>
      <div className='mb-8 text-left'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
          Sign in
        </h2>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
          Enter your workspace credentials.
        </p>
      </div>

      {serverError && (
        <div className='flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-5'>
          <AlertCircle className='w-4 h-4' />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Email */}
        <div className='space-y-1 text-left'>
          <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
            Email address
          </label>
          <input
            type='email'
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setServerError('')
            }}
            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
              ${
                errors.email
                  ? 'border-red-400 bg-red-50 dark:bg-red-950'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500'
              } text-gray-900 dark:text-gray-100`}
          />
          {errors.email && (
            <p className='text-xs text-red-500'>{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className='space-y-1 text-left'>
          <div className='flex justify-between items-center'>
            <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
              Password
            </label>
          </div>

          <input
            type='password'
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              setServerError('')
            }}
            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
              ${
                errors.password
                  ? 'border-red-400 bg-red-50 dark:bg-red-950'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500'
              } text-gray-900 dark:text-gray-100`}
          />
          {errors.password && (
            <p className='text-xs text-red-500'>{errors.password}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isPending}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-70'
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className='text-sm text-gray-500 dark:text-gray-400 mt-6 text-center'>
        Don’t have an account?{' '}
        <Link
          to='/register'
          className='text-blue-600 dark:text-blue-400 font-medium hover:underline'
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
