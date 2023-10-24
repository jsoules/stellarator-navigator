import { coilLengthPerHpValidValues, meanIotaValidValues, nFourierCoilValidValues, nSurfacesValidValues, ncPerHpValidValues, nfpValidValues, totalCoilLengthValidValues } from "./ValidValues"

export const getEnumVals = (x: object): string[] => {
    return Object.values(x).filter(v => isNaN(Number(v)))
}

export enum KnownFields {
    ID = 'id',
    COIL_LENGTH_PER_HP = 'coilLengthPerHp',
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
    ELONGATION = 'elongation',
    SHEAR = 'shear',
    MESSAGE = 'message',
    IOTA_PROFILE = 'iotaProfile',
    SURFACE_TYPES = 'surfaceTypes',
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
    MIN_COIL_TO_SURFACE_DIST = KnownFields.MIN_COIL_TO_SURFACE_DIST,
    ELONGATION = KnownFields.ELONGATION,
    SHEAR = KnownFields.SHEAR
}

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
    ELONGATION = KnownFields.ELONGATION,
    SHEAR = KnownFields.SHEAR,
    // NOTE: I think putting categorical variables on the x-axis isn't going to be terribly informative, but we'll try it
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
    ELONGATION = KnownFields.ELONGATION,
    SHEAR = KnownFields.SHEAR,
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
    { key: 11, fieldName: DependentVariables.ELONGATION               },
    { key: 12, fieldName: DependentVariables.SHEAR                    },
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
    { key: 12, fieldName: IndependentVariables.ELONGATION               },
    { key: 13, fieldName: IndependentVariables.SHEAR                    },
    { key: 14, fieldName: IndependentVariables.NC_PER_HP                },
    { key: 15, fieldName: IndependentVariables.NFP                      },
    { key: 16, fieldName: IndependentVariables.GLOBALIZATION_METHOD     },
    { key: 17, fieldName: IndependentVariables.N_FOURIER_COIL           },
    { key: 18, fieldName: IndependentVariables.NSURFACES                },
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
    tableColumnWidth?: number,
    displayInTable: boolean
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
        tableColumnWidth: 70,
        displayInTable: true
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
        tableColumnWidth: 80,
        displayInTable: true
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
        tableColumnWidth: 80,
        displayInTable: true
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
        tableColumnWidth: 90,
        displayInTable: true
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
        tableColumnWidth: 80,
        displayInTable: true
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
        tableColumnWidth: 50,
        displayInTable: true
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
        displayInTable: true
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
        tableColumnWidth: 60,
        displayInTable: true
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
        tableColumnWidth: 70,
        displayInTable: true
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
        markedValue: 5,
        displayInTable: true
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
        markedValue: 5,
        displayInTable: true
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
        markedValue: 0.1,
        displayInTable: true
    },
    'qaError': {
        shortLabel: "Sqrt(QA Err)",
        plotLabel: "Root of QA Error",
        fullLabel: "Root of Quasi-Axisymmtery (QA) Error",
        description: "Square root of quasi-Axisymmetry (QA) error, proxy for particle loss",
        range: [-5.47, -0.535],
        isLog: true,
        isCategorical: false,
        markedValue: -4.30,
        displayInTable: true
    },
    'gradient': {
        shortLabel: "Gradient",
        plotLabel: "Gradient",
        fullLabel: "Optimization gradient",
        description: "Norm of the gradient at the final iteration of the optimization algorithm--an indicator of closeness to optimality",
        range: [-12.74, 12.12],
        isLog: true,
        isCategorical: false,
        displayInTable: true
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
        displayInTable: true
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
        displayInTable: true
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
        displayInTable: true
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
        markedValue: 0.1,
        displayInTable: true
    },
    'elongation': {
        shortLabel: "Elng",
        plotLabel: "Elongation",
        fullLabel: "Elongation (elliptical axis ratio)",
        description: "Ratio of major to minor axis of an ellipse fitted to an innermost magnetic surface",
        range: [1, 321.4],
        isLog: false,
        isCategorical: false,
        // markedValue?: undefined,
        displayInTable: true
    },
    'shear': {
        shortLabel: "Shear",
        plotLabel: "Shear",
        fullLabel: "Shear",
        description: "The slope of a line closest (in a least-squares sense) to the rotational transform profile, where the independent variable is normalized toroidal flux",
        range: [-1.02, 0.79],
        isLog: false,
        isCategorical: false,
        // markedValue?: undefined,
        displayInTable: true
    },
    'message': {
        shortLabel: "Msg",
        plotLabel: "Message",
        fullLabel: "Notes on method",
        description: "Descriptor of analysis type",
        range: [0, 1],
        isLog: false,
        isCategorical: true,
        // tableColumnWidth: 0,
        displayInTable: false
    },
    'iotaProfile': {
        shortLabel: "i-prof",
        plotLabel: "Iota profile",
        fullLabel: "Iota profile",
        description: "Rotational transform with respect to normalized toroidal flux (as (# of surfaces + 1) x-y pairs)",
        range: [0, 1],
        isLog: false,
        isCategorical: false,
        tableColumnWidth: 0,
        displayInTable: false
    },
    'surfaceTypes': {
        shortLabel: "SurfTypes",
        plotLabel: "Surface Types",
        fullLabel: "Types of Surfaces",
        description: "For each of (# surfaces + 1) surfaces, whether the surface is BoozerExact or least-squares",
        range: [0, 1],
        isLog: false,
        isCategorical: false,
        tableColumnWidth: 0,
        displayInTable: false
    }
}

export const GlobalizationMethodNames = ["TuRBO", "naive"]

export enum CategoricalIndexedFields {
    MEAN_IOTA = 'meanIota',
    NC_PER_HP = 'ncPerHp',
    NFP = 'nfp',
    GLOBALIZATION_METHOD = 'globalizationMethod',
    NFOURIER = 'nFourierCoil',
    NSURFACES = 'nSurfaces'
}
