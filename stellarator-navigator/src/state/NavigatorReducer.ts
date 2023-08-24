import { DependentVariableOpt, FilterSettings, IndependentVariableOpt } from "../types/Types"

export type NavigatorStateAction = {
    type: 'updateCoilLengthPerHp',
    coilLength: number[]
} | {
    type: 'updateTotalCoilLength',
    coilLength: number[]
} | {
    type: 'updateMeanIota',
    newIota: number,
} | {
    type: 'updateNcPerHp',
    index: number,
    targetState: boolean
} | {
    type: 'updateNfp',
    index: number,
    targetState: boolean
} | {
    type: 'updateDependentVariable',
    newValue: DependentVariableOpt
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
            return { ...s, meanIota: a.newIota }
        }
        case "updateNcPerHp": {
            return updateBooleanList('ncPerHp', a.index, a.targetState, s)
        }
        case "updateNfp": {
            return updateBooleanList('nfp', a.index, a.targetState, s)
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

const updateBooleanList = (key: 'ncPerHp' | 'nfp', index: number, newState: boolean, settings: FilterSettings): FilterSettings => {
    const rightLength = key === 'ncPerHp' ? 13 : key === 'nfp' ? 5 : -1
    const current = key === 'ncPerHp' ? settings.ncPerHp : key === 'nfp' ? settings.nfp : []

    if (rightLength === -1) throw Error(`Unsupported keytype ${key} in updateBooleanList.`)
    const reset = current.length !== rightLength
    const newSelections = reset ? new Array(rightLength).fill(false) : current

    newSelections[index] = newState

    const result = { ...settings }
    if (key === 'ncPerHp') {
        result.ncPerHp = newSelections
    }
    if (key === 'nfp') {
        result.nfp = newSelections
    }
    
    return result
}

export default NavigatorReducer