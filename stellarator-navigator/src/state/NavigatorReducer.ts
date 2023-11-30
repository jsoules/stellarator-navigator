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

    // having updated a filter, we may need to update the selections.
    // TODO: Condition which input to use based on whether our selections got more or less restrictive
    // (The big win will be that we don't have to rerun *all* the filters in that case, only whichever one actually changed.)
    if (settings.database !== undefined) { // This should never not be the case
        const newSet = applyFiltersToSet(result, settings.database, settings.database.allIdSet)
        // Cheat: we're using the size of the selected record set as a proxy
        // because there shouldn't be a single interaction that allows you to select an entirely different set,
        // those would all be broken into two or more interactions
        const updateRecords = newSet.size !== settings.recordIds.size
        if (updateRecords) {
            const newMaterializedRecords = projectRecords(newSet, settings.database)
            return { ...result, recordIds: newSet, records: newMaterializedRecords }
        }
    }
    
    return result
}

const updateRange = (key: RangeVariables, newRange: number[], settings: FilterSettings) => {
    const existingRange = settings[key]
    if (existingRange === undefined || existingRange.length !== 2) {
        throw Error(`Error attempting to update non-extant/misconfigured range ${key} (currently ${existingRange})`)
    }
    if (newRange[0] === existingRange[0] && newRange[1] === existingRange[1]) {
        // no change, return reference equality. Shouldn't happen
        return settings
    }
    const newSettings = { ...settings}
    newSettings[key] = [Math.min(...newRange), Math.max(...newRange)]

    // TODO: HARMONIZE AS MUCH AS POSSIBLE WITH THE VERSION IN UPDATEBOOLEANLIST
    // this is separated because if we implement intelligent "did-it-shrink" logic, that will
    // likely differ between this and the above.
    // having updated a filter, we may need to update the selections.
    // TODO: Condition which input to use based on whether our selections got more or less restrictive
    if (settings.database !== undefined) { // This should never not be the case
        const newSet = applyFiltersToSet(newSettings, settings.database, settings.database.allIdSet)
        // Cheat: we're using the size of the selected record set as a proxy
        // because there shouldn't be a single interaction that allows you to select an entirely different set,
        // those would all be broken into two or more interactions
        const updateRecords = newSet.size !== settings.recordIds.size
        if (updateRecords) {
            const newMaterializedRecords = projectRecords(newSet, settings.database)
            return { ...newSettings, recordIds: newSet, records: newMaterializedRecords }
        }
    }

    return newSettings
}

const updateTripart = (key: TripartiteVariables, settings: FilterSettings, newValue: number | undefined) => {
    const existingValue = settings[key]
    if (existingValue === newValue) return settings
    const newSettings = { ...settings }
    newSettings[key] = newValue

    // having updated a filter, we may need to update the selections.
    if (settings.database !== undefined) { // This should never not be the case
        // Note we CANNOT use size as a proxy here, because flipping one of these could conceivably actually
        // create two distinct sets of different size.
        // So we'll always just rerun all filters on the current set.
        const newSet = applyFiltersToSet(newSettings, settings.database, settings.database.allIdSet)
        const newMaterializedRecords = projectRecords(newSet, settings.database)
        return { ...newSettings, recordIds: newSet, records: newMaterializedRecords }
    }

    return newSettings
}


const updatePlotSplits = (settings: FilterSettings, newSplits: (ToggleableVariables | undefined)[]): FilterSettings => {
    const coarseField = newSplits[0]
    const fineField = newSplits[1]
    const coarseVal = coarseField === undefined ? undefined : (Fields[coarseField].values ?? [])[settings[coarseField].findIndex(x => x)]
    const fineVal = fineField === undefined ? undefined : (Fields[fineField].values ?? [])[settings[fineField].findIndex(x => x)]
    return { ...settings, coarsePlotSplit: coarseField, finePlotSplit: fineField, coarsePlotSelectedValue: coarseVal, finePlotSelectedValue: fineVal }
}


export default NavigatorReducer