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
// DO NOT HARD CODE 60 POINTS PER TUBE--It depends on the # of fourier modes

// --> ANY FLOAT should be eligible for independent axis, ANY VALUE for dependent axis.
// default x: coil length per hp; default y: QA error.

// Log scale: QA error, gradient

// restrictions: 
// curvature, mean squared curvature: not to exceed 5, highlight that line
// minimum intercoil distance: put a line for 0.1 meters


// MAKE SURE IOTA IS THERE!
// iota (rotational transform)

// qa_error:  0 means perfect QA on the volume --> Quasiasymmetry error (directly related to particle losses) (no unit) --> THIS SHOULD BE SQRT OF THE QUANTITY!
// coil_length_per_hp: length of coil used per half period (meters)
// total_coil_length: total coil length used to construct the coils (meters)
// max_kappa: max curvature in the coils of the device (we don't want this above 5 meters^-1) "max curvature" (1/meters)
// max_msc: maximum mean squared curvature of the coils (we don't want this above 5 meters^-2) "max mean squared curvature" (1/meters-squared)
// min_dist: minimum intercoil distance in meters (we don't want this below 10 cm) "minimum intercoil distance" (meters)
// nc_per_hp: number of discrete coils per half period of the device "coils per half period" (unitless)
// nfp: discrete rotational symmetry "Number of field periods" (unitless) 
// aspect_ratio: the aspect ratio of the device. (obvs) (unitless) (note it is using the VMEC definition)
// ID: ID number of the device. (obvs) (unitless)
// globalization_method: the global optimization algorithm I used to get that device, either 0 or 1. 0 = "naive" 1 = "TuRBO"
// minor_radius: the minor radius of the outermost surface "minor radius" (explain that this is scaled so major radius is always 1) (meters)
// N_coil_Fourier: the number of Fourier modes used to represent each modular coil, either 6, or 16. (for plotting, some coils have 60 points, others have 160)
// Nsurfaces: number of surfaces on which quasisymmetry was optimized. --> Should correspond to the # of surfaces in the database
// volume: the volume enclosed by the outermost toroidal surface on which quasisymmetry was optimized. --> in meters cubed.
// gradient: norm of gradient at the final iteration of the optimization algorithm,  indication of how close we are to optimality --> arbitrary, part of optimizer
// constraint_success: boolean on whether the constraints of the optimization problem we all satisfied (this should always be true)

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
