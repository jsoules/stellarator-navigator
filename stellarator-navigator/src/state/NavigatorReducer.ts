import { applyFiltersToSet, projectRecords } from "@snState/filter"
import { DependentVariables, Fields, IndependentVariables, RangeVariables, ToggleableVariables, TripartiteVariables } from "@snTypes/DataDictionary"
import { FilterSettings, NavigatorDatabase } from "@snTypes/Types"

export type NavigatorStateAction = {
    type: 'initialize',
    database: NavigatorDatabase
} | {
    type: 'updateRange',
    field: RangeVariables,
    newRange: number[]
} | {
    type: 'updateRanges',
    fields: RangeVariables[],
    newRanges: number[][]
} | {
    type: 'updateCheckField',
    field: ToggleableVariables,
    index: number,
    targetState: boolean
} | {
    type: 'updateTripartiteField',
    field: TripartiteVariables,
    newValue: number | undefined
} | {
    type: 'updateDependentVariable',
    newValue: DependentVariables
} | {
    type: 'updateIndependentVariable',
    newValue: IndependentVariables
} | {
    type: 'updateMarkedRecords',
    newSelections: Set<number>
} | {
    type: 'updatePlotSplits',
    newSplits: (ToggleableVariables | undefined)[]
} | {
    type: 'updatePlotSplitValues',
    newValues: (number | undefined)[]
}

// TODO: updating the filter should automatically trigger a narrowing or widening of the
// selection state!!!
// DOING THIS EFFICIENTLY IS PROBABLY HARDER THAN THIS
// OR GET THE SELECTION STATE OUT OF THIS REDUCER

const NavigatorReducer = (s: FilterSettings, a: NavigatorStateAction): FilterSettings => {
    switch (a.type) {
        case "initialize": {
            const newSet = applyFiltersToSet(s, a.database)
            const newRecords = projectRecords(newSet, a.database)
            return { ...s, database: a.database, recordIds: newSet, records: newRecords }
        }
        case "updateRange": {
            return updateRange(a.field, a.newRange, s)
        }
        case "updateRanges": {
            return updateRanges(a.fields, a.newRanges, s)
        }
        case "updateCheckField": {
            return updateBooleanList(a.field, a.index, a.targetState, s)
        }
        case "updateTripartiteField": {
            return updateTripart(a.field, s, a.newValue)
        }
        case "updateDependentVariable": {
            return { ...s, dependentVariable: a.newValue }
        }
        case "updateIndependentVariable": {
            return { ...s, independentVariable: a.newValue }
        }
        case "updateMarkedRecords": {
            return { ...s, markedRecords: a.newSelections }
        }
        case "updatePlotSplits": {
            return updatePlotSplits(s, a.newSplits)
        }
        case "updatePlotSplitValues": {
            return { ...s, coarsePlotSelectedValue: a.newValues[0], finePlotSelectedValue: a.newValues[1] }
        }
        default: {
            throw Error(`Unknown reducer action ${JSON.stringify(a)}`)
        }
    }
}


const applyUpdatedFilters = (settings: FilterSettings, ignoreSizeCheck: boolean = false): FilterSettings => {
    // having updated a filter, we may need to update the selections.
    if (settings.database !== undefined) { // Shouldn't happen
        // TODO: Condition which input to use (the full database vs. the current set)
        // based on whether our selections got more or less restrictive
        const newSet = applyFiltersToSet(settings, settings.database, settings.database.allIdSet)
        // Cheat: we're using the size of the selected record set as a proxy
        // because there shouldn't be a single interaction that allows you to select an entirely different set,
        // those would all be broken into two or more interactions
        const updateRecords = newSet.size !== settings.recordIds.size
        if (updateRecords || ignoreSizeCheck) {
            const newMaterializedRecords = projectRecords(newSet, settings.database)
            return { ...settings, recordIds: newSet, records: newMaterializedRecords }
        }
    }

    return settings
}


const doSingleRangeUpdate = (key: RangeVariables, newRange: number[], settings: FilterSettings): FilterSettings => {
    const existingRange = settings[key]
    if (existingRange === undefined || existingRange.length !== 2) {
        throw Error(`Error attempting to update non-extant/misconfigured range ${key} (currently ${existingRange})`)
    }
    if (newRange[0] === existingRange[0] && newRange[1] === existingRange[1]) {
        // no change, return reference equality. Shouldn't happen
        return settings
    }
    settings[key] = [Math.min(...newRange), Math.max(...newRange)]

    return settings
}


const updateBooleanList = (key: ToggleableVariables, index: number, newState: boolean, settings: FilterSettings): FilterSettings => {
    const rightLength = (Fields[key].values || []).length
    if (!(key in settings)) {
        throw Error(`Initialization error for boolean filter for ${key}.`)
    }
    const current = (settings[key] ?? [])

    const reset = current.length !== rightLength    // handles initialization
    const newSelections: boolean[] = reset ? new Array(rightLength).fill(false)
                                           : index === -1
                                                ? new Array(rightLength).fill(newState)
                                                : current
    if (index >= 0) {
        newSelections[index] = newState
    }

    const result: FilterSettings = { ...settings }
    result[key] = newSelections

    return applyUpdatedFilters(result)
}


const updateRange = (key: RangeVariables, newRange: number[], settings: FilterSettings) => {
    const newSettings = {...doSingleRangeUpdate(key, newRange, settings)}
    return applyUpdatedFilters(newSettings)
}


const updateRanges = (keys: RangeVariables[], newRanges: number[][], settings: FilterSettings) => {
    if (keys === undefined || newRanges === undefined) throw Error("Undefined lists passed to updateRanges")
    if (keys.length !== newRanges.length) throw Error("updateRanges called with different number of keys and ranges.")

    let newSettings = {...settings}
    keys.forEach((k, i) => {
        newSettings = doSingleRangeUpdate(k, newRanges[i], newSettings)
    })

    return applyUpdatedFilters(newSettings)
}


const updateTripart = (key: TripartiteVariables, settings: FilterSettings, newValue: number | undefined) => {
    const existingValue = settings[key]
    if (existingValue === newValue) return settings
    const newSettings = { ...settings }
    newSettings[key] = newValue

    // Note we CANNOT use size as a proxy here, because flipping one of these could conceivably actually
    // create two distinct sets of different size.
    return applyUpdatedFilters(newSettings, true)
}


const updatePlotSplits = (settings: FilterSettings, newSplits: (ToggleableVariables | undefined)[]): FilterSettings => {
    const coarseField = newSplits[0]
    const fineField = newSplits[1]
    const coarseVal = coarseField === undefined ? undefined : (Fields[coarseField].values ?? [])[settings[coarseField].findIndex(x => x)]
    const fineVal = fineField === undefined ? undefined : (Fields[fineField].values ?? [])[settings[fineField].findIndex(x => x)]
    return { ...settings, coarsePlotSplit: coarseField, finePlotSplit: fineField, coarsePlotSelectedValue: coarseVal, finePlotSelectedValue: fineVal }
}


export default NavigatorReducer