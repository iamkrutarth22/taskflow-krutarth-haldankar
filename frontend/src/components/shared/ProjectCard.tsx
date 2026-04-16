
import { useNavigate } from 'react-router-dom'
import type { IProject } from '@/models/IProject'

type Props = {
  project: IProject
}

export default function ProjectCard ({ project }: Props) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className='group bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 cursor-pointer
                 transition-all duration-200 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-0.5'
    >
      <div className='flex items-center justify-between mb-3'>
        <span className='text-[11px] font-semibold text-green-600 bg-green-50 dark:bg-green-950 px-2.5 py-0.5 rounded-full'>
          ACTIVE
        </span>

        <span className='text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors text-sm'>
          →
        </span>
      </div>

      <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1.5 text-[15px] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
        {project.name}
      </h3>

      {project.description ? (
        <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed'>
          {project.description}
        </p>
      ) : (
        <p className='text-sm text-gray-300 dark:text-gray-600 italic mb-4'>
          No description provided
        </p>
      )}

      <div className='h-px bg-gray-100 dark:bg-gray-800 mb-3' />

      <div className='flex items-center justify-between text-xs text-gray-400 dark:text-gray-500'>
        <span>
          {new Date(project.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>

        <span className='opacity-0 group-hover:opacity-100 text-blue-500 font-medium transition-opacity'>
          Open →
        </span>
      </div>
    </div>
  )
}
