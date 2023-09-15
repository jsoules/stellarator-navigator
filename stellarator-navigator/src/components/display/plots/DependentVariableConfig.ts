import { DependentVariableOpt, IndependentVariableOpt } from "@snTypes/Types"

export const defaultDependentVariableValue = 'qaError'

export const dependentVariableValidValues: {key: number, value: DependentVariableOpt, text: string}[] = [
    { key: 1, value: 'maxKappa', text: 'Max curvature (Kappa)'        },
    { key: 2, value:   'maxMsc', text: 'Max MSC'                      },
    { key: 3, value:  'minDist', text: 'Min Dist'                     },
    { key: 4, value:  'qaError', text: 'Quasi-Axisymmetry (QA) Error' }
] 

export const dependentVariableRanges = {
    'maxKappa': { range: [0,        5], isLog: false },
    'maxMsc':   { range: [0,      5.5], isLog: false },
    'minDist':  { range: [0,      0.3], isLog: false },
    // 'qaError':  { range: [2e-11, 4e-2], isLog: true  },
    'qaError':  { range: [-10.71, -1.39], isLog: true  },
}

export const defaultIndependentVariableValue = 'total'

export const independentVariableValidValues: {key: number, value: IndependentVariableOpt, text: string}[] = [
    { key: 1, value: 'total',      text: 'Total coil length (m)'           },
    { key: 2, value: 'halfPeriod', text: 'Coil length per half-period (m)' }
]

export const independentVariableRanges = {
    'total':      { range: [0, 120], isLog: false },
    'halfPeriod': { range: [0,  60], isLog: false }
}
