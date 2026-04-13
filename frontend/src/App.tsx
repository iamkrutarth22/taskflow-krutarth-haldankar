import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from './lib/queryClient';

// import './App.css'
import { router } from './routes/router';

function App() {
  return (
    <>
      <QueryClientProvider client={queryClientInstance}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  )
}

export default App
