import { Inflate } from 'pako'

// const BASENAME = import.meta.env.BASE_URL
// const path = `${BASENAME}database.json.gz`

const queryFn = async <T>(path: string, isCompressed?: boolean) => {
    const response = await fetch(path)
    
    if (!response.ok) {
        throw new Error(`Database download failed from ${path}:\n${response.status} ${response.statusText}`)
    }

    let parsedResponse: T | undefined = undefined

    if (!isCompressed) {
        parsedResponse = await response.json()
    } else {
        const raw = await response.arrayBuffer()
        const inflater = new Inflate({ to: "string" })
        inflater.push(raw, true)
        if (inflater.err) {
            throw new Error(`Inflater generated error: ${inflater.msg}`)
        }
        const inflated = inflater.result as string
        parsedResponse = JSON.parse(inflated)
    }

    if (parsedResponse === undefined) {
        throw new Error(`API endpoint response parsing error from ${path}`)
    }

    return parsedResponse as T
}

export default queryFn
