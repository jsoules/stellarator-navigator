import { FilterSettings, NavigatorDatabase } from "../types/Types";
import { coilLengthPerHpValidValues, totalCoilLengthValidValues } from "./ValidValues";

export const initialNavigatorState: FilterSettings = {
    coilLengthPerHp: [Math.min(...coilLengthPerHpValidValues), Math.max(...coilLengthPerHpValidValues)],
    totalCoilLength: [Math.min(...totalCoilLengthValidValues), Math.max(...totalCoilLengthValidValues)],
    meanIota: 0.1,
    ncPerHp: new Array(13).fill(false),
    nfp: new Array(5).fill(false),
    dependentVariable: "maxKappa",
    independentVariable: "total",
    markedRecords: new Set<number>(),
}

export const initialDatabase: NavigatorDatabase = {
    list: [],
    byId: {},
    iotasIndex: {}
}
