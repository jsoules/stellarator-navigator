import pako from 'pako'
import { Dispatch, SetStateAction } from "react"

export const fetchData = async <T>(path: string, setResult: Dispatch<SetStateAction<T>>, isCompressed?: boolean) => {
    // const response = await fetch(path, { mode: 'no-cors' })
    const response = await fetch(path)
    let parsedResponse: T | undefined = undefined

    if (!response.ok) {
        throw new Error(`API Endpoint did not return data from path ${path}:\n${response.status} ${response.statusText}`)
    }

    try {
        if (!isCompressed) {
            parsedResponse = await response.json()
        } else {
            const raw = await response.arrayBuffer()
            console.log(`${JSON.stringify(response)}`)
            console.log(`Received raw data, size is ${raw.byteLength}`)
            // const parsed = JSON.parse(raw as unknown as string)
            // console.log(`Parsing yielded object? ${typeof parsed}`)

            // v2
            // const inflate = new pako.Inflate({ chunkSize: 1024 * 1024, to: 'string', raw: true })
            // inflate.push(raw, true)
            // const inflated = inflate.result as string
            // v1
            // const inflated = pako.inflate(raw, { raw: true, to: 'string' })
            // v3
            // const inflated = pako.inflate(new Uint8Array(raw), { to: 'string', raw: true, chunkSize: 1024 * 1024 })
            // v4
            const rawInflate = pako.inflate(raw, { raw: true })
            console.log(`output size: ${rawInflate.byteLength}`)
            const inflated = new TextDecoder().decode(rawInflate)
            console.log(`\tInflated to string of length ${inflated.length}`)
            parsedResponse = JSON.parse(inflated)
        }
    } catch (ex) {
        console.error(`fetchData threw error ${ex} in parsing`)
        // console.error(`fetchData threw error ${ex} in parsing message body.`)
    }

    if (parsedResponse === undefined) {
        throw new Error(`API endpoint response parsing error from ${path}.`)
    }

    setResult(parsedResponse)
}
