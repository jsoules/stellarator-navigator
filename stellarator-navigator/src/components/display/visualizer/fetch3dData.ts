import { SurfaceApiResponseObject, Vec3 } from "@snTypes/Types"
import { useEffect, useMemo, useState } from "react"

type apiRequestProps = {
    recordId: string
}

const CurvesEndpoint = "http://127.0.0.1:5000/api/curves/"
const SurfacesEndpoint = "http://127.0.0.1:5000/api/surfaces/"


export const useCoils = (props: apiRequestProps) => {
    const { recordId } = props
    const [ coils, setCoils ] = useState([])
    useEffect(() => {
        fetch(`${CurvesEndpoint}${recordId}`)
            .then((response) => response.json())
            .then((coilData) => {
                coilData.forEach((coil: Vec3[]) => coil.push(coil[0]))
                setCoils(coilData)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [recordId])
    return useMemo(() => coils, [coils])
}


export const useSurfaces = (props: apiRequestProps) => {
    const { recordId } = props
    const [ response, setResponse ] = useState({} as SurfaceApiResponseObject)

    useEffect(() => {
        fetch(`${SurfacesEndpoint}${recordId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`API endpoint did not return data:\n${response.status} ${response.statusText}`)
                }
                return response.json()
            })
            .then((surfObj) => {
                const surface: SurfaceApiResponseObject = {
                    surfacePoints: surfObj.surfacePoints,
                    pointValues: surfObj.pointValues
                }
                setResponse(surface)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [recordId])
    return useMemo(() => response, [response])
}
