import { applyCoilSymmetries, applySurfaceSymmetries } from "@snComponents/display/visualizer/symmetries"
import { CoilRecord, ScalarField, SurfaceObject, Vec3, Vec3Field } from "@snTypes/Types"
import makeResourcePath, { KnownPathType, getStringId } from "@snUtil/makeResourcePath"
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import queryFn from "./queryFn"

// Need to fetch (in parallel) the coils, currents, surfaces, and modB
// fortunately, multiple useQuery calls will run in parallel

// TODO: Compress all files on server!
const coilsQueryKey = (id: string) => ['coils', id]
const coilsQueryFn = async (id: string) => {
    const path = makeResourcePath(id, KnownPathType.COILS)
    return queryFn<Vec3[][]>(path, false)
}

const currentsQueryKey = (id: string) => ['currents', id]
const currentsQueryFn = async (id: string) => {
    const path = makeResourcePath(id, KnownPathType.CURRENTS)
    return queryFn<number[]>(path, false)
}

const modBQueryKey = (id: string) => ['modB', id]
const modBQueryFn = async (id: string) => {
    const path = makeResourcePath(id, KnownPathType.MODB)
    return queryFn<ScalarField[]>(path, false)
}

const surfacesQueryKey = (id: string) => ['surfaces', id]
const surfacesQueryFn = async (id: string) => {
    const path = makeResourcePath(id, KnownPathType.SURFACES)
    return queryFn<Vec3Field[]>(path, false)
}


const handleCoils = (id: string, coilData: Vec3[][] | undefined, currentData: number[] | undefined): CoilRecord[] => {
    if (coilData === undefined || currentData === undefined) return []
    if (coilData.length !== currentData.length) throw Error(`Mismatched record lengths for record ${id}: coils ${coilData.length}, currents ${currentData.length}`)
    return currentData.map((current, idx) => ({ coil: coilData[idx], current } as CoilRecord))
}


const handleSurfaces = (id: string, surfacePts: Vec3Field[] | undefined, pointValues: ScalarField[] | undefined): SurfaceObject => {
    if (surfacePts === undefined || pointValues === undefined) return { surfacePoints: [], pointValues: [], incomplete: true }
    if (surfacePts.length !== pointValues.length) throw Error(`Mismatched record lengths for record ${id}: surfaces ${surfacePts.length}, values ${pointValues.length}`)
    return { surfacePoints: surfacePts, pointValues: pointValues, incomplete: false } 
}


const useModel = (id: string | number, nfp: number) => {
    const stringId = getStringId(id)
    const coilsQuery = useQuery({ 
        queryKey: coilsQueryKey(stringId), 
        queryFn: () => coilsQueryFn(stringId)
    })
    const currentsQuery = useQuery({ 
        queryKey: currentsQueryKey(stringId),
        queryFn: () => currentsQueryFn(stringId)
    })
    const modBQuery = useQuery({ 
        queryKey: modBQueryKey(stringId),
        queryFn: () => modBQueryFn(stringId)
    })
    const surfacesQuery = useQuery({ 
        queryKey: surfacesQueryKey(stringId),
        queryFn: () => surfacesQueryFn(stringId)
    })
    
    const errs = [coilsQuery.error, currentsQuery.error, modBQuery.error, surfacesQuery.error]
    errs.forEach(e => {if (e) throw e})

    const baseCoils = useMemo(() => handleCoils(stringId, coilsQuery.data, currentsQuery.data), [coilsQuery.data, currentsQuery.data, stringId])
    const baseSurfaces = useMemo(() => handleSurfaces(stringId, surfacesQuery.data, modBQuery.data), [modBQuery.data, stringId, surfacesQuery.data])

    const fullCoils = useMemo(() => {
        if (baseCoils === undefined || baseCoils.length === 0) return undefined
        if (baseCoils.some(c => c.coil === undefined || (c.coil?.length ?? 0) === 0)) return undefined
        return applyCoilSymmetries(baseCoils, nfp)
    }, [baseCoils, nfp])

    const fullSurfs = useMemo(() => {
        if (baseSurfaces.incomplete) return undefined
        // can't happen:
        if (baseSurfaces.surfacePoints === undefined || baseSurfaces.pointValues === undefined) return undefined

        return applySurfaceSymmetries(baseSurfaces, nfp)
    }, [baseSurfaces, nfp])

    const record = useMemo(() => 
        ({
            baseCoils,
            baseSurfs: baseSurfaces.incomplete ? undefined : baseSurfaces,
            fullCoils,
            fullSurfs,
            surfaceCount: surfacesQuery?.data?.length || 0
        }), [baseCoils, baseSurfaces, fullCoils, fullSurfs, surfacesQuery?.data?.length])
    
    return record
}

export default useModel
