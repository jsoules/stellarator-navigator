import { FilterSettings, NavigatorDatabase, StellaratorRecord } from "@snTypes/Types";
import { CategoricalIndexedFields, DependentVariables, Fields, IndependentVariables, ToggleableVariables, coilLengthPerHpValidValues, meanIotaValidValues, ncPerHpValidValues, nfpValidValues, totalCoilLengthValidValues } from "./DataDictionary";

export const initialNavigatorState: FilterSettings = {
    coilLengthPerHp: [Math.min(...coilLengthPerHpValidValues), Math.max(...coilLengthPerHpValidValues)],
    totalCoilLength: [Math.min(...totalCoilLengthValidValues), Math.max(...totalCoilLengthValidValues)],
    meanIota: [ true, ...(new Array<boolean>(meanIotaValidValues.length - 1).fill(false)) ],
    ncPerHp: new Array<boolean>(ncPerHpValidValues.length).fill(false),
    nfp: new Array<boolean>(nfpValidValues.length).fill(false),
    nSurfaces: new Array<boolean>((Fields.nSurfaces.values ?? []).length).fill(false),
    maxKappa: (Fields.maxKappa.range),
    maxMeanSquaredCurve: (Fields.maxMeanSquaredCurve.range),
    minIntercoilDist: (Fields.minIntercoilDist.range),
    qaError: (Fields.qaError.range),
    aspectRatio: (Fields.aspectRatio.range),
    minorRadius: (Fields.minorRadius.range),
    volume: (Fields.volume.range),
    minCoil2SurfaceDist: (Fields.minCoil2SurfaceDist.range),
    meanElongation: (Fields.meanElongation.range),
    maxElongation: (Fields.maxElongation.range),
    nFourierCoil: undefined,
    //
    dependentVariable: DependentVariables.QA_ERROR,
    independentVariable: IndependentVariables.TOTAL_COIL_LENGTH,
    coarsePlotSplit: ToggleableVariables.NC_PER_HP,
    finePlotSplit: ToggleableVariables.NFP,
    finePlotSelectedValue: 1,
    database: undefined,
    records: [],
    recordIds: new Set<number>(),
    markedRecords: new Set<number>(),
}

export const initialDatabase: NavigatorDatabase = {
    list: [],
    byId: {},
    categoricalIndexes: {
        [CategoricalIndexedFields.MEAN_IOTA]: {},
        [CategoricalIndexedFields.NC_PER_HP]: {},
        [CategoricalIndexedFields.NFP]: {},
        [CategoricalIndexedFields.NFOURIER]: {},
        [CategoricalIndexedFields.NSURFACES]: {}
    },
    allIdSet: new Set<number>([])
}

export const nonExtantRecordId = '000000'
export const defaultEmptyRecord: StellaratorRecord = {
    id: parseInt(nonExtantRecordId),
    coilLengthPerHp: 0,
    totalCoilLength: 0,
    meanIota: 0,
    ncPerHp: 0,
    nfp: 1,
    nFourierCoil: 0,
    nSurfaces: 1,
    maxKappa: 0,
    maxMeanSquaredCurve: 0,
    minIntercoilDist: 0,
    qaError: 0,
    gradient: 0,
    aspectRatio: 0,
    minorRadius: 0,
    volume: 0,
    minCoil2SurfaceDist: 0,
    meanElongation: 0,
    maxElongation: 0,
    message: "",
    iotaProfile: [],
    tfProfile: [],
    surfaceTypes: []
}
