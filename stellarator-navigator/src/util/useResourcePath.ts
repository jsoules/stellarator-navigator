import { useMemo } from "react"

export enum KnownPathType {
    POINCARE = "poincare"
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum GraphicsType {
    POINCARE = KnownPathType.POINCARE
}

// TODO: move to a config file?
const basePath = "https://sdsc-users.flatironinstitute.org/~agiuliani/QUASR/"

// TODO: expand this to include all the functionality from path construction in app.py


const idLength = 6
export const getStringId = (id: number): string => {
    return `${id}`.padStart(idLength, '0')
}


const useResourcePath = (id: string, type: KnownPathType) => {
    return useMemo(() => {
        switch (type) {
            case KnownPathType.POINCARE: {
                const parentDir = id.substring(0, 3)
                return `${basePath}/graphics/poincare_png/${parentDir}/poincare${id}.png`
            }
            default:
                throw Error(`Unsupported path type ${type}`)
        }
    }, [id, type])
}


export default useResourcePath
