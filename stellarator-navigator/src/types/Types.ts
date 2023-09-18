import { NavigatorStateAction } from "@snState/NavigatorReducer"
import { DependentVariableOpt, IndependentVariableOpt } from "@snTypes/DataDictionary"
import { Dispatch } from "react"

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

// --> ANY FLOAT should be eligible for independent axis, ANY VALUE for dependent axis.
// default x: coil length per hp; default y: QA error.

// restrictions: 
// curvature, mean squared curvature: not to exceed 5, highlight that line
// minimum intercoil distance: put a line for 0.1 meters


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
    nFourierCoil: number,           // 6 or 16. (Number of Fourier modes (?) used in coil simulation)
    nSurfaces: number,              // # of surfaces over which QA was optimized. (1-7). Shld correspond to surface data.
    // Globally unique(ish) fields
    maxKappa: number,               // range 1.6 - 5.005, max curvature
    maxMeanSquaredCurve: number,    // range 1.05 - 5.005, ??
    minIntercoilDist: number,       // range epsilon-below-0.09 - 0.4, minimum distance between coils
    // QA ERROR SQUARE ROOT ISSUE? WE SHOULD BE PLOTTING/DISPLAYING SQRT?
    qaError: number,                // stored in log10, -10.94 to -1.07, quasiasymmetry error (no unit)
    gradient: number,               // stored in log10, -12.74 to +12.12, arbitrary convergence measure (no unit)
    aspectRatio: number,            // range 2.5 - 20.03 (no unit)
    minorRadius: number,            // range 0.04996 - 0.363 (M). Minor radius of outermost surface ("minor radius")
                                    // Note somewhere that this is scaled so that major radius is always 1
    volume: number,                 // Volume enclosed by outermost toroidal surface over which QA was optimized. (m^3)
    minCoil2SurfaceDist: number,    // min distance between coil and outermost optimization surface. (m)
    // OMITTED from underlying data:
    // constraint_success: boolean, // always true; confirm this in preprocessing.
}
export type RecordDict = { [key: number]: StellaratorRecord }
export const GlobalizationMethodNames = ["naive", "TuRBO"]

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
