import { getEnumVals } from "@snTypes/DataDictionary"
import { useMemo } from "react"

// TODO: move to a config file? Read from viteconfig?
// const basePath = "https://sdsc-users.flatironinstitute.org/~agiuliani/QUASR/"
const basePath = "https://users.flatironinstitute.org/~jsoules/test/" // FIXME
// const basePath = "http://localhost:5173/" // FIXME
const idLength = 6


export enum KnownPathType {
    COILS = "curves",
    SURFACES = "surfaces",
    MODB = "modB",
    NML_VMEC = "nml",
    SIMSOPT = "simsopt_serials",
    CURRENTS = "currents",
    POINCARE = "poincare"
}

enum GraphicsType {
    COILS = KnownPathType.COILS,
    CURRENTS = KnownPathType.CURRENTS,
    SURFACES = KnownPathType.SURFACES,
    MODB = KnownPathType.MODB,
    POINCARE = KnownPathType.POINCARE
}


export const getStringId = (id: number): string => {
    return `${id}`.padStart(idLength, '0')
}


const useResourcePath = (id: string, type: KnownPathType) => {
    const graphicsTypes = getEnumVals(GraphicsType)
    const graphicsPart = graphicsTypes.includes(type) ? 'graphics/' : ''
    const binPrefix = id.substring(0, 3)

    let typeDirectory = ''
    let fileBase = ''
    let suffix = ''

    switch (type) {
        case KnownPathType.POINCARE:
            typeDirectory = 'poincare_png'
            fileBase = `poincare${id}`
            suffix = '.png'
            break
        case KnownPathType.SIMSOPT:
            typeDirectory = `${type}`
            fileBase = `serial${id}`
            suffix = `.json`
            break
        case KnownPathType.NML_VMEC:
            typeDirectory = `${type}`
            fileBase = "input."
            suffix = `${id}`
            break
        default:
            typeDirectory = `${type}`
            fileBase = `${type}${id}`
            // suffix = '.txt'
            suffix = '.json'
    }

    return useMemo(() => {
        return `${basePath}${graphicsPart}${typeDirectory}/${binPrefix}/${fileBase}${suffix}`
    }, [binPrefix, fileBase, graphicsPart, suffix, typeDirectory])
}


export default useResourcePath
