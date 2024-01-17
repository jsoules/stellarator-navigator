import { fetchData } from "@snQuerying/queryFn"
import { KnownPathType } from "@snTypes/DataDictionary"
import { nonExtantRecordId } from "@snTypes/Defaults"
import { CoilRecord, ScalarField, SurfaceObject, Vec3, Vec3Field } from "@snTypes/Types"
import makeResourcePath, { getStringId } from "@snUtil/makeResourcePath"
import { useEffect, useMemo, useState } from "react"

type apiRequestProps = {
    recordId: string
}


const useFetchedCoils = (id: string) => {
    const [coilResponse, setCoilResponse] = useState<Vec3[][]>([])
    const coilPath = makeResourcePath(getStringId(id), KnownPathType.COILS)
    useEffect(() => {
        if (id !== nonExtantRecordId) {
            void fetchData<Vec3[][]>(coilPath, setCoilResponse)
        }
    }, [coilPath, id])
    return useMemo(() => {
        coilResponse.forEach(rec => rec.push(rec[0]))
        return coilResponse
    }, [coilResponse])
}


const useFetchedCurrents = (id: string) => {
    const [currentsResponse, setCurrentsResponse] = useState<number[]>([])
    const currentsPath = makeResourcePath(getStringId(id), KnownPathType.CURRENTS)
    useEffect(() => {
        if (id !== nonExtantRecordId) {
            void fetchData<number[]>(currentsPath, setCurrentsResponse)
        }
    }, [currentsPath, id])
    return currentsResponse
}


const useFetchedSurfaces = (id: string) => {
    const [surfaceResponse, setSurfaceResponse] = useState<Vec3Field[]>([])
    const surfacesPath = makeResourcePath(getStringId(id), KnownPathType.SURFACES)
    useEffect(() => {
        if (id !== nonExtantRecordId) {
            void fetchData<Vec3Field[]>(surfacesPath, setSurfaceResponse)
        }
    }, [id, surfacesPath])
    return surfaceResponse
}


const useFetchedModB = (id: string) => {
    const [modbResponse, setModbResponse] = useState<ScalarField[]>([])
    const modbPath = makeResourcePath(getStringId(id), KnownPathType.MODB)
    useEffect(() => {
        if (id !== nonExtantRecordId) {
            void fetchData<ScalarField[]>(modbPath, setModbResponse)
        }
    }, [id, modbPath])
    return modbResponse
}


export const useSurfaces = (props: apiRequestProps) => {
    const { recordId } = props
    const surfaces = useFetchedSurfaces(recordId)
    const modBs = useFetchedModB(recordId)
    return useMemo(() => (
        { surfacePoints: surfaces, pointValues: modBs } as SurfaceObject
    ), [surfaces, modBs])
}


export const useCoils = (props: apiRequestProps) => {
    const { recordId } = props
    const coils = useFetchedCoils(recordId)
    const currents = useFetchedCurrents(recordId)
    return useMemo(() => (currents.map(
                (current, idx) => ({ coil: coils[idx], current })) as CoilRecord[]
    ), [currents, coils])
}
