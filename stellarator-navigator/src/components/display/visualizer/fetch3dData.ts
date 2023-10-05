import { CoilApiResponseRecord, ScalarField, SurfaceApiResponseObject, Vec3, Vec3Field } from "@snTypes/Types"
import useResourcePath, { KnownPathType } from "@snUtil/useResourcePath"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"

type apiRequestProps = {
    recordId: string
}


// TODO: This is no longer actually a web api call, might be appropriate to move the code
export const useDownloadPaths = (props: apiRequestProps) => {
    const { recordId } = props
    const vmecPath = useResourcePath(recordId, KnownPathType.NML_VMEC)
    const simsoptPath = useResourcePath(recordId, KnownPathType.SIMSOPT)
    
    return useMemo(() => ({ vmecPath, simsoptPath }), [vmecPath, simsoptPath])
}


const fetchData = async <T>(path: string, setResult: Dispatch<SetStateAction<T>>) => {
    const response = await fetch(path)
    let parsedResponse: T | undefined = undefined

    try {
        parsedResponse = await response.json()
    } catch (ex) {
        // console.error(`fetchData threw error ${ex} in parsing message body.`)
    }

    if (!response.ok) {
        throw new Error(`API Endpoint did not return data from path ${path}:\n${response.status} ${response.statusText}`)
    }
    if (parsedResponse === undefined) {
        throw new Error(`API endpoint response parsing error.`)
    }

    setResult(parsedResponse)
}


const useFetchedCoils = (id: string) => {
    const [coilResponse, setCoilResponse] = useState<Vec3[][]>([])
    const coilPath = useResourcePath(id, KnownPathType.COILS)
    useEffect(() => {
        fetchData<Vec3[][]>(coilPath, setCoilResponse)
    }, [coilPath])
    return useMemo(() => {
        coilResponse.forEach(rec => rec.push(rec[0]))
        return coilResponse
    }, [coilResponse])
}


const useFetchedCurrents = (id: string) => {
    const [currentsResponse, setCurrentsResponse] = useState<number[]>([])
    const currentsPath = useResourcePath(id, KnownPathType.CURRENTS)
    useEffect(() => {
        fetchData<number[]>(currentsPath, setCurrentsResponse)
    }, [currentsPath])
    return currentsResponse
}


const useFetchedSurfaces = (id: string) => {
    const [surfaceResponse, setSurfaceResponse] = useState<Vec3Field[]>([])
    const surfacesPath = useResourcePath(id, KnownPathType.SURFACES)
    useEffect(() => {
        fetchData<Vec3Field[]>(surfacesPath, setSurfaceResponse)
    }, [surfacesPath])
    return surfaceResponse
}


const useFetchedModB = (id: string) => {
    const [modbResponse, setModbResponse] = useState<ScalarField[]>([])
    const modbPath = useResourcePath(id, KnownPathType.MODB)
    useEffect(() => {
        fetchData<ScalarField[]>(modbPath, setModbResponse)
    }, [modbPath])
    return modbResponse
}


export const useSurfaces_ = (props: apiRequestProps) => {
    const { recordId } = props
    const surfaces = useFetchedSurfaces(recordId)
    const modBs = useFetchedModB(recordId)
    return useMemo(() => (
        { surfacePoints: surfaces, pointValues: modBs } as SurfaceApiResponseObject
    ), [surfaces, modBs])
}


export const useCoils_ = (props: apiRequestProps) => {
    const { recordId } = props
    const coils = useFetchedCoils(recordId)
    const currents = useFetchedCurrents(recordId)
    return useMemo(() => (currents.map(
                (current, idx) => ({ coil: coils[idx], current })) as CoilApiResponseRecord[]
    ), [currents, coils])
}
