import { coilLengthPerHpValidValues, meanIotaValidValues, nFourierCoilValidValues, nSurfacesValidValues, ncPerHpValidValues, nfpValidValues, totalCoilLengthValidValues } from "./ValidValues"

export const getEnumVals = (x: object) => {
    return Object.values(x).filter(v => isNaN(Number(v)))
}

export enum KnownFields {
    ID = "id",
    COIL_LENGTH_PER_HP = "coilLengthPerHp",
    TOTAL_COIL_LENGTH = 'totalCoilLength',
    MEAN_IOTA = 'meanIota',
    NC_PER_HP = 'ncPerHp',
    NFP = 'nfp',
    GLOBALIZATION_METHOD = 'globalizationMethod',
    N_FOURIER_COIL = 'nFourierCoil',
    NSURFACES = 'nSurfaces',
    MAX_KAPPA = 'maxKappa',
    MAX_MEAN_SQUARED_CURVE = 'maxMeanSquaredCurve',
    MIN_INTERCOIL_DIST = 'minIntercoilDist',
    QA_ERROR = 'qaError',
    GRADIENT = 'gradient',
    ASPECT_RATIO = 'aspectRatio',
    MINOR_RADIUS = 'minorRadius',
    VOLUME = 'volume',
    MIN_COIL_TO_SURFACE_DIST = 'minCoil2SurfaceDist',
}

export enum DependentVariables {
    COIL_LENGTH_PER_HP = KnownFields.COIL_LENGTH_PER_HP,
    TOTAL_COIL_LENGTH = KnownFields.TOTAL_COIL_LENGTH,
    MAX_KAPPA = KnownFields.MAX_KAPPA,
    MAX_MEAN_SQUARED_CURVE = KnownFields.MAX_MEAN_SQUARED_CURVE,
    MIN_INTERCOIL_DIST = KnownFields.MIN_INTERCOIL_DIST,
    QA_ERROR = KnownFields.QA_ERROR,
    ASPECT_RATIO = KnownFields.ASPECT_RATIO,
    MINOR_RADIUS = KnownFields.MINOR_RADIUS,
    VOLUME = KnownFields.VOLUME,
    MIN_COIL_TO_SURFACE_DIST = KnownFields.MIN_COIL_TO_SURFACE_DIST
}

// NOTE: I think putting categorical variables on the x-axis isn't going to be terribly informative, but we'll try it
export enum IndependentVariables {
    TOTAL_COIL_LENGTH = KnownFields.TOTAL_COIL_LENGTH,
    COIL_LENGTH_PER_HP = KnownFields.COIL_LENGTH_PER_HP,
    MIN_INTERCOIL_DIST = KnownFields.MIN_INTERCOIL_DIST,
    MIN_COIL_TO_SURFACE_DIST = KnownFields.MIN_COIL_TO_SURFACE_DIST,
    QA_ERROR = KnownFields.QA_ERROR,
    MAX_KAPPA = KnownFields.MAX_KAPPA,
    MAX_MEAN_SQUARED_CURVE = KnownFields.MAX_MEAN_SQUARED_CURVE,
    ASPECT_RATIO = KnownFields.ASPECT_RATIO,
    MINOR_RADIUS = KnownFields.MINOR_RADIUS,
    VOLUME = KnownFields.VOLUME,
    MEAN_IOTA = KnownFields.MEAN_IOTA,
    NC_PER_HP = KnownFields.NC_PER_HP,
    NFP = KnownFields.NFP,
    GLOBALIZATION_METHOD = KnownFields.GLOBALIZATION_METHOD,
    N_FOURIER_COIL = KnownFields.N_FOURIER_COIL,
    NSURFACES = KnownFields.NSURFACES,
}

export enum ToggleableVariables {
    NC_PER_HP = KnownFields.NC_PER_HP,
    NFP = KnownFields.NFP,
    MEAN_IOTA = KnownFields.MEAN_IOTA,
    N_SURFACES = KnownFields.NSURFACES
}

export enum RangeVariables {
    COIL_LENGTH_PER_HP = KnownFields.COIL_LENGTH_PER_HP,
    TOTAL_COIL_LENGTH = KnownFields.TOTAL_COIL_LENGTH,
    MAX_KAPPA = KnownFields.MAX_KAPPA,
    MAX_MEAN_SQUARED_CURVE = KnownFields.MAX_MEAN_SQUARED_CURVE,
    MIN_INTERCOIL_DIST = KnownFields.MIN_INTERCOIL_DIST,
    QA_ERROR = KnownFields.QA_ERROR,
    ASPECT_RATIO = KnownFields.ASPECT_RATIO,
    MINOR_RADIUS = KnownFields.MINOR_RADIUS,
    VOLUME = KnownFields.VOLUME,
    MIN_COIL_TO_SURFACE_DIST = KnownFields.MIN_COIL_TO_SURFACE_DIST,
}

export enum TripartiteVariables {
    GLOBALIZATION_METHOD = KnownFields.GLOBALIZATION_METHOD,
    N_FOURIER_COIL = KnownFields.N_FOURIER_COIL,
}

export const defaultDependentVariableValue = DependentVariables.QA_ERROR
export const defaultIndependentVariableValue = IndependentVariables.TOTAL_COIL_LENGTH

export const dependentVariableDropdownConfig: { key: number, fieldName: DependentVariables }[] = [
    { key:  1, fieldName: DependentVariables.QA_ERROR                 },
    { key:  2, fieldName: DependentVariables.MAX_KAPPA                },
    { key:  3, fieldName: DependentVariables.MAX_MEAN_SQUARED_CURVE   },
    { key:  4, fieldName: DependentVariables.MIN_INTERCOIL_DIST       },
    { key:  5, fieldName: DependentVariables.MIN_COIL_TO_SURFACE_DIST },
    { key:  6, fieldName: DependentVariables.MINOR_RADIUS             },
    { key:  7, fieldName: DependentVariables.VOLUME                   },
    { key:  8, fieldName: DependentVariables.ASPECT_RATIO             },
    { key:  9, fieldName: DependentVariables.COIL_LENGTH_PER_HP       },
    { key: 10, fieldName: DependentVariables.TOTAL_COIL_LENGTH        },
]

export const independentVariableDropdownConfig: { key: number, fieldName: IndependentVariables }[] = [
    { key:  1, fieldName: IndependentVariables.TOTAL_COIL_LENGTH        },
    { key:  2, fieldName: IndependentVariables.COIL_LENGTH_PER_HP       },
    { key:  3, fieldName: IndependentVariables.MIN_INTERCOIL_DIST       },
    { key:  4, fieldName: IndependentVariables.MIN_COIL_TO_SURFACE_DIST },
    { key:  5, fieldName: IndependentVariables.QA_ERROR                 },
    { key:  6, fieldName: IndependentVariables.MAX_KAPPA                },
    { key:  7, fieldName: IndependentVariables.MAX_MEAN_SQUARED_CURVE   },
    { key:  8, fieldName: IndependentVariables.ASPECT_RATIO             },
    { key:  9, fieldName: IndependentVariables.MINOR_RADIUS             },
    { key: 10, fieldName: IndependentVariables.VOLUME                   },
    { key: 11, fieldName: IndependentVariables.MEAN_IOTA                },
    { key: 12, fieldName: IndependentVariables.NC_PER_HP                },
    { key: 13, fieldName: IndependentVariables.NFP                      },
    { key: 14, fieldName: IndependentVariables.GLOBALIZATION_METHOD     },
    { key: 15, fieldName: IndependentVariables.N_FOURIER_COIL           },
    { key: 16, fieldName: IndependentVariables.NSURFACES                },
]

export type FieldDescription = {
    shortLabel: string,
    plotLabel: string,
    fullLabel: string,
    description: string,
    unit?: string,
    range: [number, number],
    values?: number[],
    isLog: boolean,
    isCategorical: boolean,
    markedValue?: number,
    tableColumnWidth?: number
}

type FieldRecords = {
    [name in KnownFields]: FieldDescription
}

// TODO: Something about init-capping these in some contexts
export const getLabel = (props: {name: string, labelType: 'short' | 'full' | 'plot'}) => {
    const { name, labelType } = props
    const rec = Fields[name as KnownFields]
    if (rec === undefined) {
        console.warn(`Attempt to request description for unknown field ${name}.`)
        return 'ERROR OCCURRED'
    }
    const unitPart = rec.unit === undefined ? '' : ` (${rec.unit})`
    // TODO: ugly, fix
    const labelPart = labelType === 'short' ? rec.shortLabel : labelType === 'plot' ? rec.plotLabel : rec.fullLabel
    return `${labelPart}${unitPart}`
}

export const getValuesFromBoolArray = (field: string, choices: boolean[]) => {
    if (choices.length === 0) return []

    const vals = Fields[field as KnownFields].values ?? []
    if (vals.length !== choices.length ) {
        throw Error(`Boolean-to-values for Key ${field}: choices length ${choices.length} but values length ${vals.length}`)
    }
    return vals.filter((_, idx) => choices[idx])
}

// TODO: add sorting order field for table

const METER_UNIT = "M"
export const Fields: FieldRecords = {
    'id': {
        shortLabel: "ID",
        plotLabel: "ID",
        fullLabel: "Device ID",
        description: "Unique identifier of the design simulation",
        unit: undefined,
        range: [952, 504819],
        isLog: false,
        isCategorical: true,
        markedValue: undefined,
        tableColumnWidth: 70
    },
    'coilLengthPerHp': {
        shortLabel: "HP len",
        plotLabel: "Half-period len",
        fullLabel: "Coil length per half-period",
        description: "Total length of coil per half-period",
        unit: METER_UNIT,
        range: [4.5, 60],
        values: coilLengthPerHpValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined,
        tableColumnWidth: 80
    },
    'totalCoilLength': {
        shortLabel: "Tot len",
        plotLabel: "Total coil len",
        fullLabel: "Total coil length",
        description: "Total length of coil used to construct the device",
        unit: METER_UNIT,
        range: [28.5, 120],
        values: totalCoilLengthValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined,
        tableColumnWidth: 80
    },
    'meanIota': {
        // TODO: CONFIRM VERBIAGE ON THIS
        shortLabel: "Mean Iota",
        plotLabel: "Mean Iota",
        fullLabel: "Mean Iota",
        description: "The mean pitch of a particle trajectory across the surface",
        unit: undefined,
        range: [0.1, 0.9],
        values: meanIotaValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined,
        tableColumnWidth: 90
    },
    'ncPerHp': {
        shortLabel: "Coils/hp",
        plotLabel: "Coils per HP",
        fullLabel: "Coil count per half-period (NC per HP)",
        description: "Coil count per half-period",
        unit: undefined,
        range: [1, 13],
        values: ncPerHpValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined,
        tableColumnWidth: 80
    },
    'nfp': {
        shortLabel: "FPs",
        plotLabel: "FP Count",
        fullLabel: "Number of Field Periods",
        description: "Count of field periods",
        unit: undefined,
        range: [1, 5],
        values: nfpValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined,
        tableColumnWidth: 50
    },
    'globalizationMethod': {
        shortLabel: "Algo",
        plotLabel: "Optimization algorithm",
        fullLabel: "Global optimization algorithm",
        description: "Global optimization algorithm used to generate the device",
        unit: undefined,
        range: [0, 1],
        values: [0, 1],
        isLog: false,
        isCategorical: true,
        markedValue: undefined,
        tableColumnWidth: 65,
    },
    'nFourierCoil': {
        shortLabel: "Modes",
        plotLabel: "Fourier mode count",
        fullLabel: "Number of Fourier modes",
        description: "Number of fourier modes used to reprsent each modular coil",
        range: [6, 16],
        values: nFourierCoilValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined,
        tableColumnWidth: 60
    },
    'nSurfaces': {
        shortLabel: "Surfaces",
        plotLabel: "Surface count",
        fullLabel: "Number of surfaces",
        description: "Number of surfaces on which quasiasymmetry was optimized",
        range: [1, 7],
        values: nSurfacesValidValues,
        isLog: false,
        isCategorical: true,
        tableColumnWidth: 70
    },
    'maxKappa': {
        shortLabel: "Max kappa",
        plotLabel: "Max curve",
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
        plotLabel: "Max mean-sq curve",
        fullLabel: "Max mean-squared curvature",
        description: "Maximum mean squared curvature of the coils",
        unit: `1/${METER_UNIT}^2`,
        range: [1.05, 5.005],
        isLog: false,
        isCategorical: false,
        markedValue: 5
    },
    'minIntercoilDist': {
        shortLabel: "Min C-C dist",
        plotLabel: "Min intercoil dist",
        fullLabel: "Minimum intercoil dist",
        description: "Minimum distance between coils",
        unit: METER_UNIT,
        range: [0.08, 0.4],
        isLog: false,
        isCategorical: false,
        markedValue: 0.1
    },
    'qaError': {
        shortLabel: "Sqrt(QA Err)",
        plotLabel: "Root of QA Error",
        fullLabel: "Root of Quasi-Axisymmtery (QA) Error",
        description: "Square root of quasi-Axisymmetry (QA) error, proxy for particle loss",
        range: [-10.94, -1.07],
        isLog: true,
        isCategorical: false,
        markedValue: -4.30
    },
    'gradient': {
        shortLabel: "Gradient",
        plotLabel: "Gradient",
        fullLabel: "Optimization gradient",
        description: "Norm of the gradient at the final iteration of the optimization algorithm--an indicator of closeness to optimality",
        range: [-12.74, 12.12],
        isLog: true,
        isCategorical: false,
    },
    'aspectRatio': {
        shortLabel: "AR",
        plotLabel: "Aspect ratio",
        fullLabel: "Aspect ratio",
        description: "The aspect ratio of the device, computed using the VMEC definition",
        range: [2.5, 20.03],
        isLog: false,
        isCategorical: false,   // technically not categorical, but for our display purposes, might as well be
        tableColumnWidth: 30,
    },
    'minorRadius': {
        shortLabel: "Minor rad",
        plotLabel: "Minor radius",
        fullLabel: "Minor radius",
        description: "The minor radius of the outermost surface, scaled so the major radius is 1",
        unit: METER_UNIT,
        range: [0.04996, 0.363],
        isLog: false,
        isCategorical: false,
    },
    'volume': {
        shortLabel: "Vol",
        plotLabel: "Volume",
        fullLabel: "Volume",
        description: "Volme enclosed by the outermost toroidal surface over which quasiasymmetry was optimized",
        unit: `${METER_UNIT}^3`,
        range: [0.049, 2.42],
        isLog: false,
        isCategorical: false,
    },
    'minCoil2SurfaceDist': {
        shortLabel: "Min C-S dist",
        plotLabel: "Min coil-surface dist",
        fullLabel: "Min coil-surface distance",
        description: "Minimumn distance between any device coil and the outermost surface over which quasiasymmetry was optimized",
        unit: METER_UNIT,
        range: [0.0999, 0.61],
        isLog: false,
        isCategorical: false,
        markedValue: 0.1
    }
}

export const GlobalizationMethodNames = ["naive", "TuRBO"]

export enum CategoricalIndexedFields {
    MEAN_IOTA = 'meanIota',
    NC_PER_HP = 'ncPerHp',
    NFP = 'nfp',
    GLOBALIZATION_METHOD = 'globalizationMethod',
    NFOURIER = 'nFourierCoil',
    NSURFACES = 'nSurfaces'
}

// x qa_error:  0 means perfect QA on the volume --> Quasiasymmetry error (directly related to particle losses) (no unit) --> THIS SHOULD BE SQRT OF THE QUANTITY!
// x coil_length_per_hp: length of coil used per half period (meters)
// x total_coil_length: total coil length used to construct the coils (meters)
// x mean_iota:
// x max_kappa: max curvature in the coils of the device (we don't want this above 5 meters^-1) "max curvature" (1/meters)
// x max_msc: maximum mean squared curvature of the coils (we don't want this above 5 meters^-2) "max mean squared curvature" (1/meters-squared)
// x min_coil2coil_dist: minimum intercoil distance in meters (we don't want this below 10 cm) "minimum intercoil distance" (meters)
// x nc_per_hp: number of discrete coils per half period of the device "coils per half period" (unitless)
// x nfp: discrete rotational symmetry "Number of field periods" (unitless) 
// x aspect_ratio: the aspect ratio of the device. (obvs) (unitless) (note it is using the VMEC definition)
// x ID: ID number of the device. (obvs) (unitless)
// x globalization_method: the global optimization algorithm I used to get that device, either 0 or 1. 0 = "naive" 1 = "TuRBO"
// x minor_radius: the minor radius of the outermost surface "minor radius" (explain that this is scaled so major radius is always 1) (meters)
// x Nfourier_coil: the number of Fourier modes used to represent each modular coil, either 6, or 16. (for plotting, some coils have 60 points, others have 160)
// x Nsurfaces: number of surfaces on which quasisymmetry was optimized. --> Should correspond to the # of surfaces in the database
// x volume: the volume enclosed by the outermost toroidal surface on which quasisymmetry was optimized. --> in meters cubed.
// x min_coil2surface_dist: 
// x gradient: norm of gradient at the final iteration of the optimization algorithm,  indication of how close we are to optimality --> arbitrary, part of optimizer
