import { CategoricalIndexedFields, Fields } from "@snTypes/DataDictionary"
import { CategoricalIndexSet, NavigatorDatabase, NumericIndex, RecordDict, StellaratorRecord } from "@snTypes/Types"
// import { meanIotaSentinelValue, meanIotaValidValues } from "@snTypes/ValidValues"
import * as _rawData from "database.json"

type RawData = {
    columns: string[],
    index: number[],
    data: number[][]
}

const rawData = _rawData as RawData


// It's easier, and not even much less brittle, to just ignore the column names listed in the json file
// and use the known values for the column names directly.
// Source file lists columns in the order:
//  -  0    qa_error
//  -  1    coil_length_per_hp
//  -  2    total_coil_length
//  -  3    mean_iota
//  -  4    max_kappa
//  -  5    max_msc
//  -  6    min_coil2coil_dist
//  -  7    nc_per_hp
//  -  8    nfp
//  -  9    constraint_success // --> NOTE Omit this one, it's always just "True"
//  - 10    gradient
//  - 11    aspect_ratio
//  - 12    ID
//  - 13    globalization_method
//  - 14    minor_radius
//  - 15    Nfourier_coil
//  - 16    Nsurfaces
//  - 17    volume
//  - 18    min_coil2surface_dist
// Also, the value in the "index" list corresponds to the ID (PK of rows) --
// but we don't care about that one either, since that data is repeated in the actual records

const data = rawData.data

const dataList = data.map((row) => {
    return {
        id: row[12],
        coilLengthPerHp: row[1],
        totalCoilLength: row[2],
        meanIota: row[3],
        ncPerHp: row[7],
        nfp: row[8],
        globalizationMethod: row[13],
        nFourierCoil: row[15],
        nSurfaces: row[16],
        maxKappa: row[4],
        maxMeanSquaredCurve: row[5],
        minIntercoilDist: row[6],
        qaError: row[0],
        gradient: row[10],
        aspectRatio: row[11],
        minorRadius: row[14],
        volume: row[17],
        minCoil2SurfaceDist: row[18]
    } as StellaratorRecord
})

const dataDict: RecordDict = {}

dataList.forEach(entry => {
    dataDict[entry.id] = entry
})

// TODO: Is this going to use too much memory?

const categoricalFieldIndexes: CategoricalIndexSet = {
    'meanIota': {},
    'ncPerHp': {},
    'nfp': {},
    'globalizationMethod': {},
    'nFourierCoil': {},
    'nSurfaces': {}
}

const categoricalFields = Object.keys(categoricalFieldIndexes) as CategoricalIndexedFields[]
categoricalFields.forEach(k => {
    const vals = Fields[k].values
    if (vals === undefined) {
        throw Error(`Bad value in indexes-keys: ${k}`)
    }
    const key = k as keyof StellaratorRecord
    const idx: NumericIndex = {}
    vals.forEach(v => {
        idx[v] = new Set(dataList.filter(row => row[key] === v).map(row => row.id))
    })
    categoricalFieldIndexes[k] = idx
})


const database: NavigatorDatabase = {
    list: dataList,
    byId: dataDict,
    allIdSet: new Set(dataList.map(r => r.id)),
    //---Indexes
    categoricalIndexes: categoricalFieldIndexes
}

export default database
