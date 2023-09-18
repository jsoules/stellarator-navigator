import { coilLengthPerHpValidValues, meanIotaValidValues, nFourierCoilValidValues, ncPerHpValidValues, nfpValidValues, totalCoilLengthValidValues } from "./ValidValues"

export type DependentVariableOpt = 'maxKappa' | 'maxMeanSquaredCurve' | 'minIntercoilDist' | 'qaError'
export type IndependentVariableOpt = 'total' | 'halfPeriod'

export const defaultDependentVariableValue = 'qaError'

export const dependentVariableValidValues: {key: number, value: DependentVariableOpt, text: string}[] = [
    { key: 1, value:            'maxKappa', text: 'Max curvature (Kappa)'        },
    { key: 2, value: 'maxMeanSquaredCurve', text: 'Max mean-squared curvature'   },
    { key: 3, value:    'minIntercoilDist', text: 'Minimum Intercoil Distance'   },
    { key: 4, value:             'qaError', text: 'Quasi-Axisymmetry (QA) Error' }
] 

export const dependentVariableRanges = {
    'maxKappa':            { range: [0,          5], isLog: false, marked:  5    },
    'maxMeanSquaredCurve': { range: [0,        5.5], isLog: false, marked:  5    },
    'minIntercoilDist':    { range: [0,        0.3], isLog: false, marked:  0.1  },
    'qaError':             { range: [-10.71, -1.39], isLog: true , marked: -4.30 },
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

export type FieldDefinition = {
    shortLabel: string,
    fullLabel: string,
    description: string,
    unit?: string,
    range: [number, number],
    values?: number[],
    isLog: boolean,
    isCategorical: boolean,
    markedValue?: number,

}

type FieldRecords = {
    [name: string]: FieldDefinition
}

const METER_UNIT = "M"

// TODO: Something about init-capping these in some contexts
export const getLabel = (props: {name: string, labelType: 'short' | 'long'}) => {
    const { name, labelType } = props
    const rec = Fields[name]
    if (rec === undefined) {
        console.warn(`Attempt to request description for unknown field ${name}.`)
        return 'ERROR OCCURRED'
    }
    return `${labelType === 'short' ? rec.shortLabel : rec.fullLabel}${rec.unit === undefined ? '' : ` (${rec.unit})`}`
}

export const Fields: FieldRecords = {
    'id': {
        shortLabel: "ID",
        fullLabel: "Device ID",
        description: "Unique identifier of the device",
        unit: undefined,
        range: [952, 504819],
        isLog: false,
        isCategorical: false,
        markedValue: undefined
    },
    'coilLengthPerHp': {
        shortLabel: "HP length",
        fullLabel: "Coil length per half-period",
        description: "Total length of coil per half-period",
        unit: METER_UNIT,
        range: [4.5, 60],
        values: coilLengthPerHpValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined
    },
    'totalCoilLength': {
        shortLabel: "Total length",
        fullLabel: "Total coil length",
        description: "Total length of coil used to construct the device",
        unit: METER_UNIT,
        range: [28.5, 120],
        values: totalCoilLengthValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined
    },
    'meanIota': {
        // TODO: CONFIRM VERBIAGE ON THIS
        shortLabel: "Mean Iota",
        fullLabel: "Mean Iota",
        description: "The mean pitch of a particle trajectory across the surface",
        unit: undefined,
        range: [0.1, 0.9],
        values: meanIotaValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined
    },
    'ncPerHp': {
        shortLabel: "Coils/hp",
        fullLabel: "Coil count per half-period (NC per HP)",
        description: "Coil count per half-period",
        unit: undefined,
        range: [1, 13],
        values: ncPerHpValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined
    },
    'nfp': {
        shortLabel: "# FP",
        fullLabel: "Number of Field Periods",
        description: "Count of field periods",
        unit: undefined,
        range: [1, 5],
        values: nfpValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined
    },
    'globalizationMethod': {
        shortLabel: "Algo",
        fullLabel: "Global optimization algorithm",
        description: "Global optimization algorithm used to generate the device",
        unit: undefined,
        range: [0, 1],
        isLog: false,
        isCategorical: true,
        markedValue: undefined
    },
    'nFourierCoil': {
        shortLabel: "# modes",
        fullLabel: "Number of Fourier modes",
        description: "Number of fourier modes used to reprsent each modular coil",
        range: [6, 16],
        values: nFourierCoilValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined
    },
    'nSurfaces': {
        shortLabel: "# Surfaces",
        fullLabel: "Number of surfaces",
        description: "Number of surfaces on which quasiasymmetry was optimized",
        range: [1, 7],
        isLog: false,
        isCategorical: true
    },
    'maxKappa': {
        shortLabel: "Max kappa",
        fullLabel: "Max curvature (kappa)",
        description: "Maximum curvature in the coils of the device",
        unit: `1/${METER_UNIT}`,
        range: [1.6, 5.005],
        isLog: false,
        isCategorical: false,
        markedValue: 5
    },
    'maxMeanSquaredCurve': {
        shortLabel: "Max MSC",
        fullLabel: "Max mean-squared curvature",
        description: "Maximum mean squared curvature of the coils",
        unit: `1/${METER_UNIT}^2`,
        range: [1.05, 5.005],
        isLog: false,
        isCategorical: false,
        markedValue: 5
    },
    'minIntercoilDist': {
        shortLabel: "Min c-c dist",
        fullLabel: "Min intercoil dist",
        description: "Minimum distance between coils",
        unit: METER_UNIT,
        range: [0.08, 0.4],
        isLog: false,
        isCategorical: false,
        markedValue: 0.1
    },
    'qaError': {
        // TODO: DISPLAY SQUARE ROOT OF THIS??
        shortLabel: "QA Err",
        fullLabel: "Quasi-Asymmtery (QA) Error",
        description: "Quasi-Asymmetry (QA) error, directly related to particle losses",
        range: [-10.94, -1.07],
        isLog: true,
        isCategorical: false,
        markedValue: -4.30
    },
    'gradient': {
        shortLabel: "Gradient",
        fullLabel: "Optimization gradient",
        description: "Norm of the gradient at the final iteration of the optimization algorithm--an indicator of closeness to optimality",
        range: [-12.74, 12.12],
        isLog: true,
        isCategorical: false,
    },
    'aspectRatio': {
        shortLabel: "Aspect ratio",
        fullLabel: "Aspect ratio",
        description: "The aspect ratio of the device, computed using the VMEC definition",
        range: [2.5, 20.03],
        isLog: false,
        isCategorical: false,
    },
    'minorRadius': {
        shortLabel: "Min rad",
        fullLabel: "Minor radius",
        description: "The minor radius of the outermost surface, scaled so the major radius is 1",
        unit: METER_UNIT,
        range: [0.04996, 0.363],
        isLog: false,
        isCategorical: false,
    },
    'volume': {
        shortLabel: "Vol",
        fullLabel: "Volume",
        description: "Volme enclosed by the outermost toroidal surface over which quasiasymmetry was optimized",
        unit: `${METER_UNIT}^3`,
        range: [0.049, 2.42],
        isLog: false,
        isCategorical: false,
    },
    'minCoil2SurfaceDist': {
        shortLabel: "Min cs dist",
        fullLabel: "Min coil-surface distance",
        description: "Minimumn distance between any device coil and the outermost surface over which quasiasymmetry was optimized",
        unit: METER_UNIT,
        range: [0.0999, 0.61],
        isLog: false,
        isCategorical: false,
    }
}

