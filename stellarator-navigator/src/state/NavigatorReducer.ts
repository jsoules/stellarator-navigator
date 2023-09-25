import { DependentVariables, Fields, IndependentVariables, RangeVariables, ToggleableVariables, TripartiteVariables } from "@snTypes/DataDictionary"
import { FilterSettings } from "@snTypes/Types"

export type NavigatorStateAction = {
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
}

// TODO: updating the filter should automatically trigger a narrowing or widening of the
// selection state!!!
// DOING THIS EFFICIENTLY IS PROBABLY HARDER THAN THIS
// OR GET THE SELECTION STATE OUT OF THIS REDUCER

const NavigatorReducer = (s: FilterSettings, a: NavigatorStateAction): FilterSettings => {
    switch (a.type) {
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
    const newSelections = reset ? new Array(rightLength).fill(false)
                                : index === -1
                                    ? new Array(rightLength).fill(newState)
                                    : current
    if (index >= 0) {
        newSelections[index] = newState
    }

    const result = { ...settings }
    result[key] = newSelections
    
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
    return newSettings
}

const updateTripart = (key: TripartiteVariables, settings: FilterSettings, newValue: number | undefined) => {
    const existingValue = settings[key]
    if (existingValue === newValue) return settings
    const newSettings = { ...settings }
    newSettings[key] = newValue
    return newSettings
}

export default NavigatorReducer