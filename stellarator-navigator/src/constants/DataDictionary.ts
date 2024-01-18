export const getEnumVals = (x: object): string[] => {
    return (Object.values(x) as string[]).filter(v => isNaN(Number(v)))
}

export enum KnownFields {
    ID = 'id',
    COIL_LENGTH_PER_HP = 'coilLengthPerHp',
    TOTAL_COIL_LENGTH = 'totalCoilLength',
    MEAN_IOTA = 'meanIota',
    NC_PER_HP = 'ncPerHp',
    NFP = 'nfp',
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
    MEAN_ELONGATION = 'meanElongation',
    MAX_ELONGATION = 'maxElongation',
    MESSAGE = 'message',
    IOTA_PROFILE = 'iotaProfile',
    TF_PROFILE = 'tfProfile',
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
    MEAN_ELONGATION = KnownFields.MEAN_ELONGATION,
    MAX_ELONGATION = KnownFields.MAX_ELONGATION
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
    MEAN_ELONGATION = KnownFields.MEAN_ELONGATION,
    MAX_ELONGATION = KnownFields.MAX_ELONGATION,
    // NOTE: I think putting categorical variables on the x-axis isn't going to be terribly informative, but we'll try it
    NC_PER_HP = KnownFields.NC_PER_HP,
    NFP = KnownFields.NFP,
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
    MEAN_ELONGATION = KnownFields.MEAN_ELONGATION,
    MAX_ELONGATION = KnownFields.MAX_ELONGATION
}

export enum TripartiteVariables {
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
    { key: 11, fieldName: DependentVariables.MEAN_ELONGATION          },
    { key: 12, fieldName: DependentVariables.MAX_ELONGATION           },
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
    { key: 12, fieldName: IndependentVariables.MEAN_ELONGATION          },
    { key: 13, fieldName: IndependentVariables.MAX_ELONGATION           },
    { key: 14, fieldName: IndependentVariables.NC_PER_HP                },
    { key: 15, fieldName: IndependentVariables.NFP                      },
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


export const coilLengthPerHpValidValues = [
    4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 
    6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0, 8.25,
    8.5, 8.75, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0,
    12.5, 13.0, 13.5, 14.0, 14.25, 14.5, 15.0, 15.5, 15.75,
    16.0, 16.5, 17.0, 17.25, 17.5, 18.0, 18.75, 19.0, 19.5,
    20.0, 20.25, 21.0, 21.75, 22.0, 22.5, 23.0, 23.25, 23.75,
    24.0, 24.75, 25.0, 25.5, 26.0, 26.25, 27.0, 27.5, 28.0,
    28.5, 28.75, 29.0, 30.0, 31.0, 31.25, 31.5, 32.0, 32.5,
    33.0, 33.25, 33.75, 34.0, 34.5, 35.0, 36.0, 36.25, 36.75,
    37.5, 38.0, 38.5, 38.75, 39.0, 40.0, 40.25, 40.5, 41.25,
    42.0, 42.5, 42.75, 43.5, 43.75, 44.0, 45.0, 45.5, 46.0,
    46.5, 47.25, 47.5, 48.0, 49.0, 49.5, 50.0, 50.75, 51.0,
    51.75, 52.0, 52.25, 52.5, 54.0, 54.25, 55.0, 56.0, 56.25,
    57.0, 57.5, 57.75, 58.0, 58.5, 60.0
]

export const totalCoilLengthValidValues = [
    28.5, 30.0, 31.0, 31.5, 32.0, 33.0, 34.0, 34.5, 35.0, 
    36.0, 37.5, 38.0, 39.0, 40.0, 40.5, 42.0, 43.5, 44.0,
    45.0, 46.0, 46.5, 47.5, 48.0, 49.5, 50.0, 51.0, 52.0,
    52.5, 54.0, 55.0, 56.0, 57.0, 57.5, 58.0, 60.0, 62.0,
    62.5, 63.0, 64.0, 65.0, 66.0, 66.5, 67.5, 68.0, 69.0,
    70.0, 72.0, 72.5, 73.5, 75.0, 76.0, 77.0, 77.5, 78.0, 
    80.0, 80.5, 81.0, 82.5, 84.0, 85.0, 85.5, 87.0, 87.5,
    88.0, 90.0, 91.0, 92.0, 93.0, 94.5, 95.0, 96.0, 98.0, 
    99.0, 100.0, 101.5, 102.0, 103.5, 104.0, 104.5, 105.0,
    108.0, 108.5, 110.0, 112.0, 112.5, 114.0, 115.0, 115.5, 
    116.0, 117.0, 120.0
]

export const meanIotaValidValues = [
    0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9
]

export const ncPerHpValidValues = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
]

export const nfpValidValues = [
    1, 2, 3, 4, 5
]

export const nFourierCoilValidValues = [6, 16]

export const nSurfacesValidValues = [
    1, 2, 3, 4, 5, 6, 7
]


// TODO: Something about init-capping these in some contexts
export const getLabel = (props: {name: string, labelType: 'short' | 'full' | 'plot'}) => {
    const { name, labelType } = props
    const rec = Fields[name as KnownFields]
    // if (rec === undefined) { TODO REMOVE
    //     console.warn(`Attempt to request description for unknown field ${name}.`)
    //     return 'ERROR OCCURRED'
    // }
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
        shortLabel: "NC/HP",
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
        shortLabel: "NFP",
        plotLabel: "FP Count",
        fullLabel: "Number of Field Periods (NFP)",
        description: "Count of field periods",
        unit: undefined,
        range: [1, 5],
        values: nfpValidValues,
        isLog: false,
        isCategorical: true,
        markedValue: undefined,
        tableColumnWidth: 75,
        displayInTable: true
    },
    'nFourierCoil': {
        shortLabel: "Modes",
        plotLabel: "Fourier mode count",
        fullLabel: "Number of Fourier modes per coil",
        description: "Number of fourier modes used to represent each modular coil",
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
        fullLabel: "Root of Quasi-Axisymmetry (QA) Error",
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
        fullLabel: "Aspect ratio (AR)",
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
        description: "Volume enclosed by the outermost toroidal surface over which quasiasymmetry was optimized",
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
    'meanElongation': {
        shortLabel: "AvgElng",
        plotLabel: "Mean Elongation",
        fullLabel: "Mean Elongation (elliptical axis ratio)",
        description: "Ratio of major to minor axis of an ellipse fitted to an innermost magnetic surface (mean)",
        range: [1, 44],
        isLog: false,
        isCategorical: false,
        // markedValue?: undefined,
        displayInTable: true
    },
    'maxElongation': {
        shortLabel: "MxElng",
        plotLabel: "Max Elongation",
        fullLabel: "Max Elongation (elliptical axis ratio)",
        description: "Maximum ratio of major to m inor axis of an ellipse fitted to an innermost magnetic surface",
        range: [1, 146],
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
        description: "Rotational transform with respect to normalized toroidal flux (# of surfaces + 1 values)",
        range: [0, 1],
        isLog: false,
        isCategorical: false,
        tableColumnWidth: 0,
        displayInTable: false
    },
    'tfProfile': {
        shortLabel: "tf-prof",
        plotLabel: "TF profile",
        fullLabel: "Toroidal Flux profile",
        description: "Normalized toroidal flux (# of surfaces + 1 values)",
        range: [0, 1.5],
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

export enum CategoricalIndexedFields {
    MEAN_IOTA = 'meanIota',
    NC_PER_HP = 'ncPerHp',
    NFP = 'nfp',
    NFOURIER = 'nFourierCoil',
    NSURFACES = 'nSurfaces'
}

export enum KnownPathType {
    COILS = "curves",
    SURFACES = "surfaces",
    MODB = "modB",
    NML_VMEC = "nml",
    SIMSOPT = "simsopt_serials",
    CURRENTS = "currents",
    POINCARE = "poincare",
    DATABASE = "database",
    RECORD = "record"
}

export enum GraphicsType {
    COILS = KnownPathType.COILS,
    CURRENTS = KnownPathType.CURRENTS,
    SURFACES = KnownPathType.SURFACES,
    MODB = KnownPathType.MODB,
    POINCARE = KnownPathType.POINCARE
}
