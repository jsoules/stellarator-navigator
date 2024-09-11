import { NavigatorStateAction } from "@snState/NavigatorReducer"
import { CategoricalIndexedFields, DependentVariables, IndependentVariables, ToggleableVariables } from "@snTypes/DataDictionary"
import { Dispatch } from "react"

export type FilterSettings = {
    coilLengthPerHp: number[]
    totalCoilLength: number[]
    totalCoilLengthThresh: number[]
    meanIota: boolean[]
    ncPerHp: boolean[]
    nfp: boolean[]
    nSurfaces: boolean[]
    maxKappa: number[]
    maxMeanSquaredCurve: number[]
    minIntercoilDist: number[]
    qsError: number[]
    aspectRatio: number[]
    minorRadius: number[]
    volume: number[]
    minCoil2SurfaceDist: number[]
    meanElongation: number[]
    maxElongation: number[]
    nFourierCoil?: number
    helicity?: number
    dependentVariable: DependentVariables
    independentVariable: IndependentVariables
    coarsePlotSplit?: ToggleableVariables
    finePlotSplit?: ToggleableVariables
    coarsePlotSelectedValue?: number
    finePlotSelectedValue?: number
    database: NavigatorDatabase | undefined
    records: StellaratorRecord[]
    recordIds: Set<number>
    markedRecords: Set<number>
}

// --> ANY FLOAT should be eligible for dependent axis, ANY VALUE for independent axis.
// EXCEPT GRADIENT we just won't plot that


// See also the further explanations/notes in DataDictionary.ts
export type StellaratorRecord = {
    // PK
    id: number,                     // 952 - 2,793,242. 7 digits.
    // Categorical fields
    // Note: coil lengths are technically categorical but we mark them as continuous in the the
    // data dictionary because there's like 80 possible values
    coilLengthPerHp: number,        // range 2.4-60.epsilon. Length of coil used per half-period (meters)
    totalCoilLength: number,        // range 19.2 - 120.1. Total length of coil used to construct coils (m)
    totalCoilLengthThresh: number,  // threshold for total coil length. Many values; range 19.2 - 120.0
    meanIota: number,               // range 0.1 - 4.5, 54 distinct values
    ncPerHp: number,                // range 1-13, coil count per half-period
    nfp: number,                    // range 1-8, field period count
    nFourierCoil: number,           // 6 or 16. (Number of Fourier modes used in coil simulation)
    helicity: number,               // 0 or 1. 0: QA--Quasiaxisymmetric (original); 1: QH--quasi-helically symmetric (devices added post-2024.01)
    nSurfaces: number,              // # of surfaces over which QS was optimized. (1-7). Shld correspond to surface data.
    // Globally unique(ish)/continuous fields
    maxKappa: number,               // range 1.7 - 19.55, max curvature
    maxMeanSquaredCurve: number,    // range 1.21 - 35.05, ??
    minIntercoilDist: number,       // range 0.09 - 0.38, minimum distance between coils
    qsError: number,                // stored in log10, -5.47 to -0.4, quasiasymmetry error (no unit)
    // gradient: number,               // stored in log10, -12.74 to +12.12, arbitrary convergence measure (no unit)  // removed as of 2024.01 export
    aspectRatio: number,            // range 2.7 - 24.6 (no unit)
    minorRadius: number,            // range 0.0413 - 0.356 (M). Minor radius of outermost surface ("minor radius")
                                    // Note somewhere that this is scaled so that major radius is always 1
    volume: number,                 // range 0.034 - 2.42. Volume enclosed by outermost toroidal surface over which QS was optimized. (m^3)
    minCoil2SurfaceDist: number,    // range [0.0999, 0.685]. min distance between coil and outermost optimization surface. (m)
    meanElongation: number,         // range [1, 66]. 
    maxElongation: number,          // range [1.1, 313.2].
    // Weird ones
    message: string,                // descriptor of analysis: as "[Naive | TuRBO], [global | fine] scan"
    iotaProfile: number[],          // array of nSurfaces+2 length, each element a rotational transform value (y-axis of iota profile plot)
    tfProfile: number[],            // array of nSurfaces+2 length, each element a normalized toriodal flux value (x-axis of iota profile plot)
                                    // both are unitless and tfProfile should be constrained to lie on (0, 1)
    surfaceTypes: string[]          // array of nSurfaces+1 length, each element's values in ("exact", "ls")
}
export type RecordDict = Record<number, StellaratorRecord>

export type NavigatorDatabase = {
    list: StellaratorRecord[]
    byId: RecordDict
    allIdSet: Set<number>
    categoricalIndexes: CategoricalIndexSet
}

export type CategoricalIndexSet = {[key in CategoricalIndexedFields]: NumericIndex}
export type NumericIndex = Record<number, Set<number>>

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

export type DataGeometry = {
    xmin: number,
    xmax: number,
    ymin: number,
    ymax: number
}

export type Vec3 = [number, number, number]

export type Vec3Field = Vec3[][]

export type ScalarField = number[][]

export type CoilRecord = {
    coil: Vec3[],
    current: number
}

export type SurfaceObject = {
    surfacePoints: Vec3Field[],
    pointValues: ScalarField[],
    incomplete: boolean
}
