import { FilterSettings, NavigatorDatabase } from "@snTypes/Types";
import { CategoricalIndexedFields, DependentVariables, Fields } from "./DataDictionary";
import { coilLengthPerHpValidValues, totalCoilLengthValidValues } from "./ValidValues";

export const initialNavigatorState: FilterSettings = {
    coilLengthPerHp: [Math.min(...coilLengthPerHpValidValues), Math.max(...coilLengthPerHpValidValues)],
    totalCoilLength: [Math.min(...totalCoilLengthValidValues), Math.max(...totalCoilLengthValidValues)],
    meanIota: [ true, ...(new Array(8).fill(false)) ],
    ncPerHp: new Array(13).fill(false),
    nfp: new Array(5).fill(false),
    // new
    nSurfaces: new Array((Fields.nSurfaces.values ?? []).length).fill(false),
    maxKappa: (Fields.maxKappa.range),
    maxMeanSquaredCurve: [],
    minIntercoilDist: [],
    qaError: [],
    aspectRatio: [],
    minorRadius: [],
    volume: [],
    minCoil2SurfaceDist: [],
    globalizationMethod: undefined,
    nFourierCoil: undefined,
    //
    dependentVariable: DependentVariables.QA_ERROR,
    independentVariable: "totalCoilLength",
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
