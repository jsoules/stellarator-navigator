import { FilterSettings, NavigatorDatabase, StellaratorRecord } from "@snTypes/Types";
import { CategoricalIndexedFields, DependentVariables, Fields, IndependentVariables } from "./DataDictionary";
import { coilLengthPerHpValidValues, meanIotaValidValues, ncPerHpValidValues, nfpValidValues, totalCoilLengthValidValues } from "./ValidValues";

export const initialNavigatorState: FilterSettings = {
    coilLengthPerHp: [Math.min(...coilLengthPerHpValidValues), Math.max(...coilLengthPerHpValidValues)],
    totalCoilLength: [Math.min(...totalCoilLengthValidValues), Math.max(...totalCoilLengthValidValues)],
    meanIota: [ true, ...(new Array(meanIotaValidValues.length - 1).fill(false)) ],
    ncPerHp: new Array(ncPerHpValidValues.length).fill(false),
    nfp: new Array(nfpValidValues.length).fill(false),
    nSurfaces: new Array((Fields.nSurfaces.values ?? []).length).fill(false),
    maxKappa: (Fields.maxKappa.range),
    maxMeanSquaredCurve: (Fields.maxMeanSquaredCurve.range),
    minIntercoilDist: (Fields.minIntercoilDist.range),
    qaError: (Fields.qaError.range),
    aspectRatio: (Fields.aspectRatio.range),
    minorRadius: (Fields.minorRadius.range),
    volume: (Fields.volume.range),
    minCoil2SurfaceDist: (Fields.minCoil2SurfaceDist.range),
    elongation: (Fields.elongation.range),
    shear: (Fields.shear.range),
    globalizationMethod: undefined,
    nFourierCoil: undefined,
    //
    dependentVariable: DependentVariables.QA_ERROR,
    independentVariable: IndependentVariables.TOTAL_COIL_LENGTH,
    markedRecords: new Set<number>(),
}

export const initialDatabase: NavigatorDatabase = {
    list: [],
    byId: {},
    categoricalIndexes: {
        [CategoricalIndexedFields.MEAN_IOTA]: {},
        [CategoricalIndexedFields.NC_PER_HP]: {},
        [CategoricalIndexedFields.NFP]: {},
        [CategoricalIndexedFields.GLOBALIZATION_METHOD]: {},
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
    globalizationMethod: 0,
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
    elongation: 0,
    shear: 0,
    message: "",
    iotaProfile: [],
    surfaceTypes: []
}
