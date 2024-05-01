import { KnownPathType } from '@snTypes/DataDictionary'
import makeResourcePath, { getStringId } from '@snUtil/makeResourcePath'
import { describe, expect, test } from 'vitest'


describe("snUtil makeResourcePath", () => {
    const val = 1234
    const validId = getStringId(val)
    const basePath = 'http://localhost:5173/'

    const expected: { t: KnownPathType, path: string }[] = [
        { t: KnownPathType.RECORD,   path: "records/0001/0001234.json" },
        { t: KnownPathType.NML_VMEC, path: "nml/0001/input.0001234" },
        { t: KnownPathType.SIMSOPT,  path: "simsopt_serials/0001/serial0001234.json" },
        { t: KnownPathType.POINCARE, path: "graphics/poincare_png/0001/poincare0001234.png" },
        { t: KnownPathType.COILS,    path: "graphics/curves/0001/curves0001234.json" },
        { t: KnownPathType.CURRENTS, path: "graphics/currents/0001/currents0001234.json" },
        { t: KnownPathType.MODB,     path: "graphics/modB/0001/modB0001234.json" },
        { t: KnownPathType.SURFACES, path: "graphics/surfaces/0001/surfaces0001234.json" },
        { t: KnownPathType.DATABASE, path: "database.json.gz" },
    ]

    expected.map((o): void => {
        test(`makeResourcePath returns expected value for ${o.t}`, () => {
            const path = makeResourcePath(validId, o.t)
            expect(path).toEqual(`${basePath}${o.path}`)
        })
    })

})

describe("snUtil getStringId", () => {
    const val = 1234
    const strVal = `${val}`
    const targetLength = 7 // hard-coded in makeResourcePath.ts

    test("getStringId correctly pads integer inputs", () => {
        const validId = getStringId(val)
        expect(validId.id.length).toEqual(targetLength)
        expect(Number(validId.id)).toEqual(val)
    })

    test("getStringId correctly pads strign inputs", () => {
        const validId = getStringId(strVal)
        expect(validId.id.length).toEqual(targetLength)
        expect(Number(validId.id)).toEqual(Number(strVal))
    })
})

