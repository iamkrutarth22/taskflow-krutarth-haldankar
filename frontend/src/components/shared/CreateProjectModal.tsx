// import { X } from 'lucide-react'

// type Props = {
//   open: boolean
//   onClose: () => void
//   onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void
//   name: string
//   setName: (v: string) => void
//   description: string
//   setDescription: (v: string) => void
//   nameError: string
//   isPending: boolean
// }

// export default function CreateProjectModal ({
//   open,
//   onClose,
//   onSubmit,
//   name,
//   setName,
//   description,
//   setDescription,
//   nameError,
//   isPending
// }: Props) {
//   if (!open) return null

//   return (
//     <div className='fixed inset-0 z-50 flex items-center justify-center'>
//       <div
//         className='absolute inset-0 bg-black/30 backdrop-blur-sm'
//         onClick={onClose}
//       />

//       <div className='relative bg-gray-50 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6'>
//         <div className='flex items-center justify-between mb-1'>
//           <h2 className='text-base font-bold text-gray-900'>
//             Create New Project
//           </h2>
//           <button
//             onClick={onClose}
//             className='w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100'
//           >
//             <X className='w-4 h-4 text-gray-400' />
//           </button>
//         </div>

//         <p className='text-xs text-gray-400 mb-5'>
//           Define a project name and description.
//         </p>

//         <form onSubmit={onSubmit} className='space-y-4'>
//           {/* Name */}
//           <div className='space-y-1.5'>
//             <label className='block text-xs font-semibold text-gray-500 uppercase'>
//               Project Name
//             </label>
//             <input
//               type='text'
//               value={name}
//               onChange={e => {
//                 setName(e.target.value)
//               }}
//               className={`w-full px-4 py-2.5 border rounded-lg text-sm text-left
//                 ${
//                   nameError
//                     ? 'border-red-400 bg-red-50'
//                     : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
//                 }`}
//             />
//             {nameError && <p className='text-xs text-red-500'>{nameError}</p>}
//           </div>

//           <div className='space-y-1.5'>
//             <label className='block text-xs font-semibold text-gray-500 uppercase'>
//               Description
//             </label>
//             <textarea
//               value={description}
//               onChange={e => setDescription(e.target.value)}
//               rows={3}
//               className='w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-left focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none'
//             />
//           </div>

//           {/* Actions */}
//           <div className='flex gap-3 pt-2'>
//             <button
//               type='button'
//               onClick={onClose}
//               className='flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50'
//             >
//               Cancel
//             </button>
//             <button
//               type='submit'
//               disabled={isPending}
//               className='flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm'
//             >
//               {isPending ? 'Creating...' : 'Create Project'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

import { X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void
  name: string
  setName: (v: string) => void
  description: string
  setDescription: (v: string) => void
  nameError: string
  isPending: boolean
}

export default function CreateProjectModal ({
  open,
  onClose,
  onSubmit,
  name,
  setName,
  description,
  setDescription,
  nameError,
  isPending
}: Props) {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/30 backdrop-blur-sm'
        onClick={onClose}
      />

      <div className='relative bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 border border-gray-200 dark:border-gray-800'>
        <div className='flex items-center justify-between mb-1'>
          <h2 className='text-base font-bold text-gray-900 dark:text-white'>
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className='w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
          >
            <X className='w-4 h-4 text-gray-400 dark:text-gray-500' />
          </button>
        </div>

        <p className='text-xs text-gray-400 dark:text-gray-500 mb-5'>
          Define a project name and description.
        </p>

        <form onSubmit={onSubmit} className='space-y-4'>
          {/* Name */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase'>
              Project Name
            </label>
            <input
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm text-left
                ${
                  nameError
                    ? 'border-red-400 bg-red-50 dark:bg-red-950'
                    : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900'
                } bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}
            />
            {nameError && <p className='text-xs text-red-500'>{nameError}</p>}
          </div>

          {/* Description */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase'>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className='w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-left focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 resize-none'
            />
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isPending}
              className='flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-70'
            >
              {isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
