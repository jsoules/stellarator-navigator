import { NavigatorStateAction } from "@snState/NavigatorReducer"
import { CategoricalIndexSet, DependentVariables, IndependentVariableOpt } from "@snTypes/DataDictionary"
import { Dispatch } from "react"

export type FilterSettings = {
    coilLengthPerHp: number[]
    totalCoilLength: number[]
    meanIota: boolean[],
    ncPerHp: boolean[],
    nfp: boolean[],
    nSurfaces: boolean[],
    // NEW
    maxKappa: number[],
    maxMeanSquaredCurve: number[],
    minIntercoilDist: number[],
    qaError: number[],
    aspectRatio: number[],
    minorRadius: number[],
    volume: number[],
    minCoil2SurfaceDist: number[],
    globalizationMethod?: number,
    nFourierCoil?: number,
    // END NEW
    dependentVariable: DependentVariables,
    independentVariable: IndependentVariableOpt,
    markedRecords: Set<number>
}

// --> ANY FLOAT should be eligible for dependent axis, ANY VALUE for independent axis.
// EXCEPT GRADIENT we just won't plot that


// See also the further explanations/notes in DataDictionary.ts
export type StellaratorRecord = {
    // PK
    id: number,                     // 952 - 504819
    // Categorical fields
    coilLengthPerHp: number,        // range 4.5-60. Length of coil used per half-period (meters)
    totalCoilLength: number,        // range 28.5 - 120. Total length of coil used to construct coils (m)
    meanIota: number,               // range 0.1 - 0.9
    ncPerHp: number,                // range 1-13, coil count per half-period
    nfp: number,                    // range 1-5, field period count
    globalizationMethod: number,    // 0 = "naive", 1 = "TuRBO"
    nFourierCoil: number,           // 6 or 16. (Number of Fourier modes used in coil simulation)
    nSurfaces: number,              // # of surfaces over which QA was optimized. (1-7). Shld correspond to surface data.
    // Globally unique(ish)/continuous fields
    maxKappa: number,               // range 1.6 - 5.005, max curvature
    maxMeanSquaredCurve: number,    // range 1.05 - 5.005, ??
    minIntercoilDist: number,       // range epsilon-below-0.09 - 0.4, minimum distance between coils
    // QA ERROR SQUARE ROOT ISSUE? WE SHOULD BE PLOTTING/DISPLAYING SQRT?
    qaError: number,                // stored in log10, -10.94 to -1.07, quasiasymmetry error (no unit)
    gradient: number,               // stored in log10, -12.74 to +12.12, arbitrary convergence measure (no unit)
    aspectRatio: number,            // range 2.5 - 20.03 (no unit)
    minorRadius: number,            // range 0.04996 - 0.363 (M). Minor radius of outermost surface ("minor radius")
                                    // Note somewhere that this is scaled so that major radius is always 1
    volume: number,                 // range 0.049 - 2.42. Volume enclosed by outermost toroidal surface over which QA was optimized. (m^3)
    minCoil2SurfaceDist: number,    // range [0.0999, 0.61]. min distance between coil and outermost optimization surface. (m)
    // OMITTED from underlying data:
    // constraint_success: boolean, // always true; confirm this in preprocessing.
}
export type RecordDict = { [key: number]: StellaratorRecord }
export const GlobalizationMethodNames = ["naive", "TuRBO"]

export type NavigatorDatabase = {
    list: StellaratorRecord[]
    byId: RecordDict
    allIdSet: Set<number>
    // iotasIndex: {[key: number]: Set<number>}
    categoricalIndexes: CategoricalIndexSet
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
