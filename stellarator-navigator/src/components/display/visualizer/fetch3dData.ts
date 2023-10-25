import { nonExtantRecordId } from "@snTypes/Defaults"
import { CoilApiResponseRecord, ScalarField, SurfaceApiResponseObject, Vec3, Vec3Field } from "@snTypes/Types"
import { fetchData } from "@snUtil/fetchData"
import useResourcePath, { KnownPathType } from "@snUtil/useResourcePath"
import { useEffect, useMemo, useState } from "react"

type apiRequestProps = {
    recordId: string
}


const useFetchedCoils = (id: string) => {
    const [coilResponse, setCoilResponse] = useState<Vec3[][]>([])
    const coilPath = useResourcePath(id, KnownPathType.COILS)
    useEffect(() => {
        if (id !== nonExtantRecordId) {
            fetchData<Vec3[][]>(coilPath, setCoilResponse)
        }
    }, [coilPath, id])
    return useMemo(() => {
        coilResponse.forEach(rec => rec.push(rec[0]))
        return coilResponse
    }, [coilResponse])
}


const useFetchedCurrents = (id: string) => {
    const [currentsResponse, setCurrentsResponse] = useState<number[]>([])
    const currentsPath = useResourcePath(id, KnownPathType.CURRENTS)
    useEffect(() => {
        if (id !== nonExtantRecordId) {
            fetchData<number[]>(currentsPath, setCurrentsResponse)
        }
    }, [currentsPath, id])
    return currentsResponse
}


const useFetchedSurfaces = (id: string) => {
    const [surfaceResponse, setSurfaceResponse] = useState<Vec3Field[]>([])
    const surfacesPath = useResourcePath(id, KnownPathType.SURFACES)
    useEffect(() => {
        if (id !== nonExtantRecordId) {
            fetchData<Vec3Field[]>(surfacesPath, setSurfaceResponse)
        }
    }, [id, surfacesPath])
    return surfaceResponse
}


const useFetchedModB = (id: string) => {
    const [modbResponse, setModbResponse] = useState<ScalarField[]>([])
    const modbPath = useResourcePath(id, KnownPathType.MODB)
    useEffect(() => {
        if (id !== nonExtantRecordId) {
            fetchData<ScalarField[]>(modbPath, setModbResponse)
        }
    }, [id, modbPath])
    return modbResponse
}


export const useSurfaces = (props: apiRequestProps) => {
    const { recordId } = props
    const surfaces = useFetchedSurfaces(recordId)
    const modBs = useFetchedModB(recordId)
    return useMemo(() => (
        { surfacePoints: surfaces, pointValues: modBs } as SurfaceApiResponseObject
    ), [surfaces, modBs])
}


export const useCoils = (props: apiRequestProps) => {
    const { recordId } = props
    const coils = useFetchedCoils(recordId)
    const currents = useFetchedCurrents(recordId)
    return useMemo(() => (currents.map(
                (current, idx) => ({ coil: coils[idx], current })) as CoilApiResponseRecord[]
    ), [currents, coils])
}
