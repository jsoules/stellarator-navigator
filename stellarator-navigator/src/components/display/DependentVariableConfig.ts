import { DependentVariableOpt } from "../../types/Types"

export const defaultDependentVariableValue = 'qaError'
// export const parseDependentVariableValues = (value: DependentVariableOpt) => {
//     const obj = dependentVariableValidValues.find(v => v.value === value)
//     if (obj === undefined) return -1
//     return obj.key
// }
export const dependentVariableValidValues: {key: number, value: DependentVariableOpt, text: string}[] = [
    {key: 1, value: 'maxKappa', text: 'Max curvature (Kappa)'},
    {key: 2, value:   'maxMsc', text: 'Max MSC'},
    {key: 3, value:  'minDist', text: 'Min Dist'},
    {key: 4, value:  'qaError', text: 'Quasi-Axisymmetry (QA) Error'}
]

export const dependentVariableRanges = {
    'maxKappa': { range: [0,        5], isLog: false },
    'maxMsc':   { range: [0,      5.5], isLog: false },
    'minDist':  { range: [0,      0.3], isLog: false },
    // 'qaError':  { range: [2e-11, 4e-2], isLog: true  },
    'qaError':  { range: [-10.71, -1.39], isLog: true  },
}



