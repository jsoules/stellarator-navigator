import { FilterSettings, NavigatorDatabase, StellaratorRecord } from "@snTypes/Types"
import { coilLengthPerHpValidValues, totalCoilLengthValidValues } from "@snTypes/ValidValues"

export const projectRecords = (selection: Set<number>, database: NavigatorDatabase) => {
    const projection: StellaratorRecord[] = []
    selection.forEach(s => projection.push(database.byId[s]))
    return projection
}

//  Set intersection should be in the actual language standard Any Day Now
const _intersect = (shortest: Set<number>, ...rest: Set<number>[]): Set<number> => {
    const result = rest.reduce((currentResult, newSet) => { return new Set([...currentResult].filter(id => newSet.has(id))) }, shortest)
    return result
}

const intersect = (...sets: Set<number>[]): Set<number> => {
    const minLength = Math.min(...sets.map(s => s.size))
    const shortestSetIdx = sets.findIndex(s => s.size === minLength)
    const shortest = sets[shortestSetIdx]
    
    return _intersect(shortest, ...sets.filter((_, i) => i !== shortestSetIdx))
}

const applyFilter = (db: NavigatorDatabase, filters: FilterSettings, updateSelection: React.Dispatch<React.SetStateAction<Set<number>>>) => {
    const resultSet = db.iotasIndex[filters.meanIota]
    const perHpRange = filters.coilLengthPerHp ?? [Math.min(...coilLengthPerHpValidValues), Math.max(...coilLengthPerHpValidValues)]
    const totalRange = filters.totalCoilLength ?? [Math.min(...totalCoilLengthValidValues), Math.max(...totalCoilLengthValidValues)]

    const perHpLengthFilter = new Set(db.list.filter(row => row.coilLengthPerHp >= perHpRange[0] && row.coilLengthPerHp <= perHpRange[1]).map(r => r.id))
    const totalLengthFilter = new Set(db.list.filter(row => row.totalCoilLength >= totalRange[0] && row.totalCoilLength <= totalRange[1]).map(r => r.id))

    const finalResult = intersect(resultSet, perHpLengthFilter, totalLengthFilter)

    updateSelection(finalResult)
}

// Todo: combine these to one call? Eh...
export const filterNfp = (records: StellaratorRecord[], nfp?: number): StellaratorRecord[] => {
    return filterCheckboxes(records, 'nfp', nfp)
}

export const filterNc = (records: StellaratorRecord[], nc?: number): StellaratorRecord[] => {
    return filterCheckboxes(records, 'nc', nc)
}


const filterCheckboxes = (records: StellaratorRecord[], type: 'nfp' | 'nc', v?: number, ): StellaratorRecord[] => {
    if (v === undefined) return records
    switch(type) {
        case 'nfp': {
            return records.filter(d => d.nfp === v)
        }
        case 'nc': {
            return records.filter(d => d.ncPerHp === v)
        }
        default: {
            return []
        }
    }
}


export default applyFilter
