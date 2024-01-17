import { Inflate } from 'pako'
import { Dispatch, SetStateAction } from "react"

// const BASENAME = import.meta.env.BASE_URL
// const path = `${BASENAME}database.json.gz`

const queryFn = async <T>(path: string, isCompressed?: boolean) => {
    const response = await fetch(path)
    let parsedResponse: T | undefined = undefined
    
    if (!response.ok) {
        throw new Error(`Database download failed from ${path}:\n${response.status} ${response.statusText}`)
    }

    try {
        if (!isCompressed) {
            parsedResponse = (await response.json()) as T
        } else {
            const raw = await response.arrayBuffer()
            const inflater = new Inflate({ to: "string" })
            inflater.push(raw, true)
            if (inflater.err) {
                throw new Error(`Inflater generated error: ${inflater.msg}`)
            }
            const inflated = inflater.result as string
            parsedResponse = (JSON.parse(inflated)) as T
        }
    } catch (ex) {
        const msg = ex instanceof Error
            ? ex.toString()
            : typeof ex === "string"
                ? ex
                : 'of unknown type'
        console.error(`query function threw error ${msg} in parsing`)
    }

    if (parsedResponse === undefined) {
        throw new Error(`API endpoint response parsing error from ${path}`)
    }

    return parsedResponse as T
}

export const fetchData = async<T>(path: string, setResult: Dispatch<SetStateAction<T>>, isCompressed?: boolean) => {
    const parsedResponse = await queryFn<T>(path, isCompressed)
    setResult(parsedResponse)
}

export default queryFn
