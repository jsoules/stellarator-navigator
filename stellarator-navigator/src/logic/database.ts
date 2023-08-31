import { meanIotaSentinelValue, meanIotaValidValues } from "../constants/ValidValues"
// import * as _rawData from "../data_16082023.json"
import * as _rawData from "../data_17082023.json"
import { NavigatorDatabase, RecordDict, StellaratorRecord } from "../types/Types"

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
//  -  6    min_dist
//  -  7    nc_per_hp
//  -  8    nfp
//  -  9    constraint_success // --> NOTE Omit this one
//  - 10    gradient
//  - 11    seed
//  - 12    aspect_ratio
//  - 13    ID
// Also, the value in the "index" list corresponds to the ID (PK of rows) --
// but we don't care about that one either, since that data is repeated in the actual records

const data = rawData.data

const dataList = data.map((row) => {
    return {
        id: row[13],
        coilLengthPerHp: row[1],
        totalCoilLength: row[2],
        meanIota: row[3],
        ncPerHp: row[7],
        nfp: row[8],
        seed: row[11],
        maxKappa: row[4],
        maxMsc: row[5],
        minDist: row[6],
        qaError: row[0],
        gradient: row[10],
        aspectRatio: row[12]
    } as StellaratorRecord
})

const dataDict: RecordDict = {}

dataList.forEach(entry => {
    dataDict[entry.id] = entry
})

const iotasIndex: {[key: number]: Set<number>} = {}
meanIotaValidValues.forEach(v => {
    iotasIndex[v] = new Set(dataList.filter(row => row.meanIota === v).map(row => row.id))
})
iotasIndex[meanIotaSentinelValue] = new Set(dataList.map(row => row.id))

const database: NavigatorDatabase = {
    list: dataList,
    byId: dataDict,
    //---Indexes
    iotasIndex
}

export default database
