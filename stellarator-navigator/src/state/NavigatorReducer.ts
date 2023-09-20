import { BooleanFields, DependentVariables, Fields, IndependentVariableOpt } from "@snTypes/DataDictionary"
import { FilterSettings } from "@snTypes/Types"

export type NavigatorStateAction = {
    type: 'updateCoilLengthPerHp',
    coilLength: number[]
} | {
    type: 'updateTotalCoilLength',
    coilLength: number[]
// } | {
//     type: 'updateMeanIota',
//     newIota: number,
// TODO: UNIFY THE BOOLEAN UPDATES
} | {
    type: 'updateNcPerHp',
    index: number,
    targetState: boolean
} | {
    type: 'updateNfp',
    index: number,
    targetState: boolean
} | {
    type: 'updateMeanIota',
    index: number,
    targetState: boolean
} | {
    type: 'updateNSurfaces',
    index: number,
    targetState: boolean
} | {
    type: 'updateDependentVariable',
    newValue: DependentVariables
} | {
    type: 'updateIndependentVariable',
    newValue: IndependentVariableOpt
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
        case "updateCoilLengthPerHp": {
            return { ...s, coilLengthPerHp: [Math.min(...a.coilLength), Math.max(...a.coilLength)] }
        }
        case "updateTotalCoilLength": {
            return { ...s, totalCoilLength: [Math.min(...a.coilLength), Math.max(...a.coilLength)] }
        }
        case "updateMeanIota": {
            return updateBooleanList('meanIota', a.index, a.targetState, s)
        }
        case "updateNcPerHp": {
            return updateBooleanList('ncPerHp', a.index, a.targetState, s)
        }
        case "updateNfp": {
            return updateBooleanList('nfp', a.index, a.targetState, s)
        }
        case "updateNSurfaces": {
            return updateBooleanList('nSurfaces', a.index, a.targetState, s)
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

const updateBooleanList = (key: BooleanFields, index: number, newState: boolean, settings: FilterSettings): FilterSettings => {
    const rightLength = (Fields[key].values || []).length
    if (!(key in settings)) {
        throw Error(`Initialization error for boolean filter for ${key}.`)
    }
    const current = (settings[key] ?? [])

    const reset = current.length !== rightLength    // handles initialization
    const newSelections = reset ? new Array(rightLength).fill(false) : current

    newSelections[index] = newState

    const result = { ...settings }
    result[key] = newSelections
    
    return result
}

export default NavigatorReducer