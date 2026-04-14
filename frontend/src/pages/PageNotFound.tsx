export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 mb-4">Page not found</p>

      <a
        href="/dashboard"
        className="text-blue-600 hover:underline text-sm"
      >
        Go to Dashboard
      </a>
    </div>
  )
}