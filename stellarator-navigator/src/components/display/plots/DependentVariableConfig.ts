import { DependentVariableOpt, IndependentVariableOpt } from "@snTypes/Types"

export const defaultDependentVariableValue = 'qaError'

export const dependentVariableValidValues: {key: number, value: DependentVariableOpt, text: string}[] = [
    { key: 1, value: 'maxKappa', text: 'Max curvature (Kappa)'        },
    { key: 2, value:   'maxMsc', text: 'Max mean-squared curvature'   },
    { key: 3, value:  'minDist', text: 'Minimum Intercoil Distance'   },
    { key: 4, value:  'qaError', text: 'Quasi-Axisymmetry (QA) Error' }
] 

export const dependentVariableRanges = {
    'maxKappa': { range: [0,          5], isLog: false, marked:  5    },
    'maxMsc':   { range: [0,        5.5], isLog: false, marked:  5    },
    'minDist':  { range: [0,        0.3], isLog: false, marked:  0.1  },
    'qaError':  { range: [-10.71, -1.39], isLog: true , marked: -4.30 },
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
