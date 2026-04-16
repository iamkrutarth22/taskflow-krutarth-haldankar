import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { IProject } from '@/models/IProject'
import { Plus, FolderOpen } from 'lucide-react'
import CreateProjectModal from '@/components/shared/CreateProjectModal'
import ProjectCard from '@/components/shared/ProjectCard'

export default function ProjectsPage () {
  const queryClient = useQueryClient()

  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')

  const {
    data: projects,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects')
      return res.data.projects as IProject[]
    }
  })

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post('/projects', { name, description })
      return res.data as IProject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setModalOpen(false)
      setName('')
      setDescription('')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (err: any) => {
      const fields = err.response?.data?.fields
      if (fields?.name) setNameError(fields.name)
    }
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Project name is required')
      return
    }
    setNameError('')
    createProject()
  }

  const closeModal = () => {
    setModalOpen(false)
    setName('')
    setDescription('')
    setNameError('')
  }

  return (
    <div className='p-6 lg:p-10 bg-gray-50 dark:bg-gray-950 min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h2 className='text-2xl text-start font-bold text-gray-900 dark:text-gray-100'>
            Projects
          </h2>
          <p className='text-sm text-start text-gray-500 dark:text-gray-400 mt-0.5'>
            Manage and track your high-impact initiatives.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className='flex mt-3 md:hidden items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
          >
            <Plus className='w-4 h-4' />
            New Project
          </button>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className='flex max-md:hidden items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
        >
          <Plus className='w-4 h-4' />
          New Project
        </button>
      </div>

      {isLoading && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className='bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-5 animate-pulse'
            >
              <div className='h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-3' />
              <div className='h-3 bg-gray-100 dark:bg-gray-800 rounded w-full mb-2' />
              <div className='h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3' />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className='text-center py-16'>
          <p className='text-gray-400 dark:text-gray-500 text-sm'>
            Failed to load projects. Please refresh.
          </p>
        </div>
      )}

      {!isLoading && !isError && projects?.length === 0 && (
        <div className='flex flex-col items-center justify-center py-24 text-center'>
          <div className='w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4'>
            <FolderOpen className='w-7 h-7 text-gray-400 dark:text-gray-500' />
          </div>
          <h3 className='font-semibold text-gray-700 dark:text-gray-200 mb-1'>
            No projects yet
          </h3>
          <p className='text-sm text-gray-400 dark:text-gray-500 mb-6'>
            Create your first project to get started <br />
            with the precision workflow engine.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
          >
            <Plus className='w-4 h-4' />
            New Project
          </button>
        </div>
      )}

      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {modalOpen && (
        <CreateProjectModal
          open={modalOpen}
          onClose={closeModal}
          onSubmit={handleCreate}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          nameError={nameError}
          isPending={isPending}
        />
      )}
    </div>
  )
}
