import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// May trim font references later
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Home from '@snComponents/Home'
import Model from '@snComponents/Model'
import ModelError from '@snComponents/display/visualizer/ModelError'
import ErrorPage from '@snComponents/general/ErrorPage'
import './App.css'
import './Loaders.css'

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// eslint-disable-next-line react-refresh/only-export-components
const BASENAME = import.meta.env.BASE_URL

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            errorElement={<ErrorPage />}
        >
            <Route
                path="/"
                element={<Home />}
            />
            <Route
                path="model/:modelId"
                element={<Model />}
                errorElement={<ModelError />}
            />
        </Route>
    ), {
        basename: BASENAME
    }
)


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 60 * 24
        }
    }
})

const devTools = import.meta.env.DEV && <ReactQueryDevtools position="bottom" />

const rootElement = document.getElementById('root')
if (rootElement === null) {
    throw Error("Impossible situation: document has no root element.")
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {devTools}
    </QueryClientProvider>
  </React.StrictMode>
)
