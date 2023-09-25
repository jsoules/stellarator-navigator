import { Fields, RangeVariables, ToggleableVariables, TripartiteVariables, getValuesFromBoolArray } from "@snTypes/DataDictionary"
import { CategoricalIndexSet, FilterSettings, NavigatorDatabase, StellaratorRecord } from "@snTypes/Types"
import database from "./database"


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


export const intersect = (...sets: Set<number>[]): Set<number> => {
    const minLength = Math.min(...sets.map(s => s.size))
    const shortestSetIdx = sets.findIndex(s => s.size === minLength)
    const shortest = sets[shortestSetIdx]
    
    return _intersect(shortest, ...sets.filter((_, i) => i !== shortestSetIdx))
}


const applyFilterToState = (filters: FilterSettings, updateSelection: React.Dispatch<React.SetStateAction<Set<number>>>) => {
    const set = applyFiltersToSet(filters, database.allIdSet)
    updateSelection(set)
}


// TODO: DEBOUNCE?
export const applyFiltersToSet = (filters: FilterSettings, set?: Set<number>): Set<number> => {
    const boolSets = booleanFilters.map(b => {
        const { key, callback } = b
        const choices = filters[key]
        return callback(choices)
    })
    const selectionSets = selectionFilters.map(f => {
        const { key, callback } = f
        const val = filters[key as TripartiteVariables]
        return callback(val)
    })
    const allSets = [set, ...boolSets, ...selectionSets].filter(s => s !== undefined) as Set<number>[]
    const indexIntersectionSet = intersect(...allSets)
    // Okay maybe repeatedly projecting and re-set-ifying isn't ideal but
    const materializedRows = projectRecords(indexIntersectionSet, database)
    const rangeTests = rangeFilters.map(r => {
        const { key, callback } = r
        const valueRange = filters[key]
        return callback(valueRange)
    })
    const finalSet = new Set(materializedRows.filter(r => rangeTests.every(test => test(r))).map(r => r.id))
    return finalSet
}


// Filter setup
const makeBooleanFilter = (key: ToggleableVariables, db: NavigatorDatabase) => {
    const callback = (choices: boolean[]) => {
        if (choices.every(c => c) || choices.every(c => !c)) {
            return undefined
        }
        const vals = getValuesFromBoolArray(key, choices)
        const idx = db.categoricalIndexes[key as unknown as keyof CategoricalIndexSet]
        const sets = vals.map(v => idx[v])
        const union = new Set(sets.reduce((curr: number[], newSet) => { return [...curr, ...newSet] }, []))
        return union
    }
    return {key, callback}
}
const booleanFields: ToggleableVariables[] = [ToggleableVariables.MEAN_IOTA, ToggleableVariables.NFP, ToggleableVariables.NC_PER_HP, ToggleableVariables.N_SURFACES]
export const booleanFilters = booleanFields.map(f => makeBooleanFilter(f, database))


const makeRangeFilter = (key: RangeVariables) => {
    const callback = (range: number[]) => {
        if (range.length === 0) {
            return () => true
        }
        if (range.length !== 2) {
            throw Error(`Attempt to apply range filter with ill-formed range ${JSON.stringify(range)}`)
        }
        const valRange = Fields[key].range
        const noOp = range[0] <= valRange[0] && range[1] >= valRange[1]
        if (noOp) return () => true
        return (row: StellaratorRecord) => row[key] >= range[0] && row[key] <= range[1]
    }
    return {key, callback}
}
export const rangeFilters = Object.values(RangeVariables).filter(rv => isNaN(Number(rv))).map(f => makeRangeFilter(f as RangeVariables))


const makeSelectionFilter = (key: TripartiteVariables, db: NavigatorDatabase) => {
    const callback = (value?: number) => {
        if (value === undefined) return undefined
        const vals = Fields[key].range
        if (!(vals.includes(value))) {
            throw Error(`Attempt to filter ${key} with unknown value ${value}, known range ${Fields[key].range}`)
        }
        return db.categoricalIndexes[key][value]
    }
    return {key, callback}
}
export const selectionFilters = Object.values(TripartiteVariables).filter(v => isNaN(Number(v))).map(f => makeSelectionFilter(f as TripartiteVariables, database))


export const filterTo = (records: StellaratorRecord[], filters: { [key in ToggleableVariables]?: number }) => {
    let result = records
    Object.keys(filters).forEach(k => {
        if (filters[k as ToggleableVariables] !== undefined) {
            result = result.filter(r => r[k as ToggleableVariables] === filters[k as ToggleableVariables])
        }
    })
    return result
}


export default applyFilterToState
