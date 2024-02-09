import { GraphicsType, KnownPathType, getEnumVals } from "@snTypes/DataDictionary"

// TODO: move basename to a config file? Read from viteconfig?
const BASENAME = import.meta.env.BASE_URL
const basePath = BASENAME === '/'
                    ? import.meta.env.DEV
                        ? 'http://localhost:5173/'
                        : 'https://quasr.flatironinstitute.org/'
                    : `https://users.flatironinstitute.org${BASENAME}/`
const idLength = 7
const prefixLength = 4


export type ValidId = { id: string }
export const getStringId = (id: number | string): ValidId => {
    return { id: `${id}`.padStart(idLength, '0') }
}

const makeResourcePath = (validId: ValidId, type: KnownPathType) => {
    const { id } = validId
    const graphicsTypes = getEnumVals(GraphicsType)
    const graphicsPart = graphicsTypes.includes(type) ? 'graphics/' : ''
    const binPrefix = id.substring(0, prefixLength)

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
            typeDirectory = type
            fileBase = `serial${id}`
            suffix = `.json`
            break
        case KnownPathType.NML_VMEC:
            typeDirectory = type
            fileBase = "input."
            suffix = id
            break
        case KnownPathType.RECORD:
            typeDirectory = 'records'
            fileBase = id
            suffix = '.json'
            break
        default:
            typeDirectory = type
            fileBase = `${type}${id}`
            suffix = '.json'
    }

    return type === KnownPathType.DATABASE
        ? `${basePath}database.json.gz`
        : `${basePath}${graphicsPart}${typeDirectory}/${binPrefix}/${fileBase}${suffix}`
}

export default makeResourcePath
