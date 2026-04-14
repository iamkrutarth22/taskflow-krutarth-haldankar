import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/store/authSlice'
import api from '@/lib/axios'
import { AlertCircle } from 'lucide-react'
import { AuthLayout } from '@/components/shared/AuthLayout'

export default function RegisterPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/register', { name, email, password })
      return res.data
    },
    onSuccess: data => {
      dispatch(login({ token: data.token, user: data.user }))
      navigate('/projects')
    },
    onError: (err: any) => {
      const fields = err.response?.data?.fields
      if (fields) {
        setErrors(fields)
      } else {
        setServerError('Registration failed. Please try again.')
      }
    }
  })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email) e.email = 'Email is required'
    if (!email.includes('@')) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    if (password.length < 6)
      e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    if (validate()) mutate()
  }

  //   const clearError = (field: string) => {
  //     setErrors(prev => ({ ...prev, [field]: '' }))
  //     setServerError('')
  //   }

  return (

    <AuthLayout>
      <div className='mb-8 text-left'>
        <h2 className='text-2xl font-semibold text-gray-900'>Create account</h2>
        <p className='text-sm text-gray-500 mt-1'>
          Get started with your workspace.
        </p>
      </div>

      {serverError && (
        <div className='flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mb-5'>
          <AlertCircle className='w-4 h-4' />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Full Name */}
        <div className='space-y-1 text-left'>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide'>
            Full name
          </label>
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
          ${
            errors.name
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500'
          }`}
          />
          {errors.name && <p className='text-xs text-red-500'>{errors.name}</p>}
        </div>

        {/* Email */}
        <div className='space-y-1 text-left'>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide'>
            Email address
          </label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
          ${
            errors.email
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500'
          }`}
          />
          {errors.email && (
            <p className='text-xs text-red-500'>{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className='space-y-1 text-left'>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide'>
            Password
          </label>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
          ${
            errors.password
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500'
          }`}
          />
          {errors.password && (
            <p className='text-xs text-red-500'>{errors.password}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isPending}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition active:scale-[0.99]'
        >
          {isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className='text-sm text-gray-500 mt-6 text-center'>
        Already have an account?{' '}
        <Link to='/login' className='text-blue-600 font-medium hover:underline'>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
