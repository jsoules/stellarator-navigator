import { FunctionComponent } from "react"
import { isRouteErrorResponse, useParams, useRouteError } from 'react-router-dom'

const dev = import.meta.env.DEV

const ModelError: FunctionComponent = () => {
    const error = useRouteError()
    const params = useParams()
    const id = params.modelId ?? "default"
    if (id === "default") {
        console.log(`Unexpected: params ${JSON.stringify(params)} did not define modelId.`)
    }
    const errorBody =
        isRouteErrorResponse(error)
        ? <>
            <h2>{error.status}</h2>
            <div>{error.statusText}</div>
            { error.data?.message && <div>{error.data.message}</div> }
        </>
        : <>
            <div>
                {dev
                    ? JSON.stringify(error)
                    : (<div>An unspecified error occurred.</div>)
                }
            </div>
        </>
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>Error fetching device {id}</h1>
                {errorBody}
            </div>

        )
    }
}

export default ModelError
