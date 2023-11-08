import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 60 * 24
        }
    }
})

const devTools = import.meta.env.DEV && <ReactQueryDevtools position="bottom" />

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <BrowserRouter
            basename={import.meta.env.BASE_URL}
        >
            <App />
            {devTools}
        </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
