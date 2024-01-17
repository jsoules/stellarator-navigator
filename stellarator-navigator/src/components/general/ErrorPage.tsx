import { FunctionComponent } from "react"
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

const dev = import.meta.env.DEV

type dataType = {
    message?: string
}

const msgExtractor = (data?: dataType) => {
    if (data && data.message) {
        return <div>{data.message}</div>
    }
}

const ErrorPage: FunctionComponent = () => {
    const error = useRouteError()
    console.log(`Error Page error: ${JSON.stringify(error)}`)
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>Error</h1>
                <h2>{error.status}</h2>
                <div>{error.statusText}</div>
                {msgExtractor(error.data as dataType)}
            </div>
        )
    }
    return dev
        ? <div><h1>Error</h1>{JSON.stringify(error)}</div>
        : <div><h1>Error</h1><div>An unspecified error occurred.</div></div>
}

export default ErrorPage
