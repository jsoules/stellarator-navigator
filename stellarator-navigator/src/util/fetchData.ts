// import pako from 'pako'
// import { Dispatch, SetStateAction } from "react"

// export const fetchData = async <T>(path: string, setResult: Dispatch<SetStateAction<T>>, isCompressed?: boolean) => {
//     const response = await fetch(path)
//     let parsedResponse: T | undefined = undefined

//     if (!response.ok) {
//         throw new Error(`API Endpoint did not return data from path ${path}:\n${response.status} ${response.statusText}`)
//     }

//     try {
//         if (!isCompressed) {
//             parsedResponse = await response.json()
//         } else {
//             const raw = await response.arrayBuffer()
//             const inflater = new pako.Inflate({ to: "string" })
//             inflater.push(raw, true)
//             if (inflater.err) {
//                 console.log(`Inflater generated error: ${inflater.msg}`)
//             }
//             const inflated = inflater.result as string
//             parsedResponse = JSON.parse(inflated)
//         }
//     } catch (ex) {
//         console.error(`fetchData threw error ${ex} in parsing`)
//     }

//     if (parsedResponse === undefined) {
//         throw new Error(`API endpoint response parsing error from ${path}.`)
//     }

//     setResult(parsedResponse)
// }
