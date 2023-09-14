import { NavigatorStateAction } from "@snState/NavigatorReducer"
import { Dispatch } from "react"

export type DependentVariableOpt = 'maxKappa' | 'maxMsc' | 'minDist' | 'qaError'
export type IndependentVariableOpt = 'total' | 'halfPeriod'

export type FilterSettings = {
    coilLengthPerHp: number[]
    totalCoilLength: number[]
    meanIota: number,
    ncPerHp: boolean[],
    nfp: boolean[],
    dependentVariable: DependentVariableOpt,
    independentVariable: IndependentVariableOpt,
    markedRecords: Set<number>
}

export type StellaratorRecord = {
    // PK
    id: number,
    // Filterable fields
    coilLengthPerHp: number,    // range 4.5-60
    totalCoilLength: number,    // range 28.5 - 120
    meanIota: number,           // range -0.6 - 0.9, mean magnetic shear
    ncPerHp: number,            // range 1-13, coil count per half-period
    nfp: number,                // range 1-5, field period count
    seed: number,               // 0-7, use for color coding only
    // Dependent-variable fields (globally unique values)
    maxKappa: number,           // range 1.5 - 4.4, max curvature
    maxMsc: number,             // range 1.8 - 5.005, ??
    minDist: number,            // range epsilon-below-0.1 - 0.3, ??
    qaError: number,            // range 2e-11 - 4e-2, need log scale? quasiasymmetry error
                                // stored in log10, -10.71 to -1.39
    gradient: number,           // range 2.5e-14 - 0.1, log scale needed?
                                // now storing in log10 so range -13.6 to -1
    aspectRatio: number,        // do we care? range 2.8 - 20.03
}
export type RecordDict = { [key: number]: StellaratorRecord }

export type NavigatorDatabase = {
    list: StellaratorRecord[]
    byId: RecordDict
    iotasIndex: {[key: number]: Set<number>}
}

export type NavigatorDispatch = Dispatch<NavigatorStateAction>

export type NavigatorContextType = {
    filterSettings: FilterSettings
    selection: Set<number>
    database: NavigatorDatabase
    dispatch: React.Dispatch<NavigatorStateAction>
    fetchRecords: (ids: Set<number>) => StellaratorRecord[]
}

export type FilterUpdateAction = unknown


export type PlotDimensions = {
    width: number
    height: number
    marginTop: number
    marginRight: number
    marginBottom: number
    marginLeft: number
}

export type BoundedPlotDimensions = PlotDimensions & {
    boundedWidth: number
    boundedHeight: number
    tickLength: number
    pixelsPerTick: number
    fontPx: number,
    clipAvoidanceXOffset: number,
    clipAvoidanceYOffset: number,
    axisLabelOffset: number
}

export type Vec3 = [number, number, number]

export type Vec3Field = Vec3[][]

export type ScalarField = number[][]

export type SurfaceApiResponseObject = {
    surfacePoints: Vec3Field[],
    pointValues: ScalarField[]
}
