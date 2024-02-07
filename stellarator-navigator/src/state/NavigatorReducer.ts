import { applyFiltersToSet, projectRecords, restrictMarksToFilteredInIds } from "@snState/filter"
import { DependentVariables, Fields, IndependentVariables, RangeVariables, ToggleableVariables, TripartiteVariables, getValuesFromBoolArray } from "@snTypes/DataDictionary"
import { FilterSettings, NavigatorDatabase } from "@snTypes/Types"

export type FacetSplitType = 'coarse' | 'fine'

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
    type: 'resetRange',
    field: RangeVariables
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
    newSplit: (ToggleableVariables | undefined)
    target: FacetSplitType
} | {
    type: 'updateFocusedPlotIndices',
    newValues: (number | undefined)[]
}

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
        case "resetRange": {
            return resetRange(a.field, s)
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
            return updatePlotSplits(s, a.target, a.newSplit)
        }
        case "updateFocusedPlotIndices": {
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
        // Cheat: we're using the size of the selected record set as a proxy for set change,
        // since no single interaction allows you to select an entirely different set of the same size.
        const updateRecords = newSet.size !== settings.recordIds.size
        const newMarks = restrictMarksToFilteredInIds(settings.markedRecords, newSet)
        if (updateRecords || ignoreSizeCheck) {
            const settingsWithCorrectedFocusPlot = rationalizeFocusedPlot(settings)
            const newMaterializedRecords = projectRecords(newSet, settings.database)
            return { ...settingsWithCorrectedFocusPlot, recordIds: newSet, records: newMaterializedRecords, markedRecords: newMarks }
        }
    }

    return settings
}


const selectedOrFirst = (field: ToggleableVariables, choices: boolean[], selected: number | undefined): number | undefined => {
    if (selected === undefined) return selected
    const setVals = getValuesFromBoolArray(field, choices)
    return setVals.includes(selected) ? selected : setVals[0]
}


const rationalizeFocusedPlot = (settings: FilterSettings): FilterSettings => {
    const newCoarse = settings.coarsePlotSplit === undefined
        ? settings.coarsePlotSelectedValue
        : selectedOrFirst(settings.coarsePlotSplit, settings[settings.coarsePlotSplit], settings.coarsePlotSelectedValue)
    const newFine = settings.finePlotSplit === undefined
        ? settings.finePlotSelectedValue
        : selectedOrFirst(settings.finePlotSplit, settings[settings.finePlotSplit], settings.finePlotSelectedValue)
    if (newCoarse !== settings.coarsePlotSelectedValue || newFine !== settings.finePlotSelectedValue) {
        return { ...settings, coarsePlotSelectedValue: newCoarse, finePlotSelectedValue: newFine }
    }
    return settings
}


const doSingleRangeUpdate = (key: RangeVariables, newRange: number[], settings: FilterSettings): FilterSettings => {
    const existingRange = settings[key]
    if (existingRange.length !== 2) {
        throw Error(`Error attempting to update non-extant/misconfigured range ${key} (currently ${existingRange[0]}, ${existingRange[1]})`)
    }
    if (newRange[0] === existingRange[0] && newRange[1] === existingRange[1]) {
        // no change, return reference equality. e.g. user clicks "reset" for already-default range.
        return settings
    }
    settings[key] = [Math.min(...newRange), Math.max(...newRange)]

    return settings
}


const updateBooleanList = (key: ToggleableVariables, index: number, newState: boolean, settings: FilterSettings): FilterSettings => {
    const rightLength = (Fields[key].values ?? []).length
    if (!(key in settings)) {
        throw Error(`Initialization error for boolean filter for ${key}.`)
    }
    const current = settings[key]
    const reset = current.length !== rightLength    // handles initialization
    const newSelections: boolean[] = reset ? new Array<boolean>(rightLength).fill(false)
                                           : index === -1
                                                ? new Array<boolean>(rightLength).fill(newState)
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
    if (keys.length !== newRanges.length) throw Error("updateRanges called with different number of keys and ranges.")

    let newSettings = {...settings}
    keys.forEach((k, i) => {
        newSettings = doSingleRangeUpdate(k, newRanges[i], newSettings)
    })

    return applyUpdatedFilters(newSettings)
}


const resetRange = (key: RangeVariables, settings: FilterSettings) => {
    const newRange = Fields[key]?.range ?? [-1, 1]
    return updateRange(key, newRange, settings)
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


const updatePlotSplits = (settings: FilterSettings, target: FacetSplitType, newSplit: ToggleableVariables | undefined): FilterSettings => {
    // because of the dropdown select interface, this is sometimes passed a literal string value of "undefined" :(
    const splitUndefined = newSplit === undefined || ("undefined" === newSplit as string)
    const value = splitUndefined ? undefined : (Fields[newSplit]?.values ?? [])[settings[newSplit].findIndex(x => x)]
    switch(target) {
        case 'coarse':
            return { ...settings, coarsePlotSplit: newSplit, coarsePlotSelectedValue: value }
        case 'fine':
            return { ...settings, finePlotSplit: newSplit, finePlotSelectedValue: value }
        default:
            throw Error('Unsupported update-plot-split target.')
    }
}


export default NavigatorReducer