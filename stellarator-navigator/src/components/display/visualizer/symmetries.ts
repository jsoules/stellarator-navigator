import { CoilRecord, ScalarField, SurfaceObject, Vec3, Vec3Field } from '@snTypes/Types'
import { MathNumericType, Matrix, concat, cos, index, matrix, multiply, range, reshape, sin } from 'mathjs'
import { SURFACE_SIDE_RESOLUTION } from './geometry'

const coilTransformMatrices: Record<number, Matrix[]> = {}
const surfaceTransformMatrices: Record<number, Matrix[]> = {}

const S = matrix([[1, 0, 0], [0, -1, 0], [0, 0, -1] ])
// Create an array of 5 elements. Each element should be an array of length (index + 1),
// whose contents are (0 ... index) * 2pi/(index + 1), i.e. the angles of rotational
// symmetry that would give you a complete revolution when there are n units per half-period.
// (Note that's *half* period; we have to fill in the second half of the period using the
// "stellarator symmetry", a 180-degree rotation around the X axis.)
// This computes the angles of rotational symmetry (over the Z axis) for one half-period for
// a device with n symmetries per half-period.
const angleFractionsPerNfp = new Array(5).fill(1)
    .map((_, i) => (
        new Array(i + 1).fill(1).map((_, j) => (j) * -2 * Math.PI / (i + 1))
    ))

// For the coils, for each of the angles of z-axis rotational symmetry, we need two transform matrices.
// One gives the rotated values of the base coils in their proper orientation at that rotation;
// the other is the "stellarator symmetry" i.e. a reflection over the y & z axes (or 180-degree
// rotation around x) that fills in the second half of the period.
// For coils, we do this as two separate matrices, because we want to keep the coils separate.
// To find the transforms, map R over the computed angle fractions for that NFP value.
angleFractionsPerNfp.map((v, i) => {
    coilTransformMatrices[i + 1] = v.map(angle => {
        const R = matrix([[cos(angle), -sin(angle), 0],
                          [sin(angle),  cos(angle), 0],
                          [         0,           0, 1]])
        const RFlipped = multiply(R, S)
        return [R, RFlipped]
    }).flat()
})


// For surfaces, because of the way the surface points are represented, the accounting for the proper order
// in which to stitch them together (in the triangulation step) becomes challenging if we do the "stellarator"
// (180-degree-x-axis-rotational) symmetry separate from the "period count" (n angles per half-period,
// rotational-about-y-axis) symmetry. So instead we'll expand the half period to a full period once, and then
// rotate the result. It also helps that while the coils need to be kept separate, for the surfaces we're
// actually trying to fuse them.
angleFractionsPerNfp.map((v, i) => {
    surfaceTransformMatrices[i + 1] = v.map(angle =>
        matrix([[cos(angle), -sin(angle), 0],
                [sin(angle),  cos(angle), 0],
                [         0,           0, 1]]))
})


/**
 * Expand a device's coils across the full stellarator ring.
 * 
 * @param inputCoils The coils for one half-period, arranged as an array of
 * 3-vector points, in sequence.
 * @param nfp The number of field periods, aka number of rotational symmetries.
 * @returns A new set of coils that completes the full ring around the Z axis,
 * properly oriented to honor both types of symmetry. Each coil can still be
 * plotted individually. If there were k coils in the input set, there will be
 * 2 * k * nfp coils in the resulting output.
 */
export const applyCoilSymmetries = (coilRecords: CoilRecord[], nfp: number): CoilRecord[] => {
    // Each coil is represented as 161 points in x-y-z space making a loop.
    // Step 1: convert our array of 3-vector 161-point loops into an array of N [coils] matrices,
    // each 161 [point-count] x 3 [x,y,z]
    const inputsAsMatrices = coilRecords.map(record => 
        matrix(record.coil.map(pt => [...pt]))
    )
    // Step 2: apply transformations to matrix to create the missing coils
    const transforms = coilTransformMatrices[nfp]
    // The mult gives us a list of transformed coil groups based on the original input coil:
    const realizedCoilMatrixSets = inputsAsMatrices.map(obj => transforms.map(t => multiply(obj, t)))
    // For each of these groups, convert each of the [2 * nfp * ncPerHp] result matrices back into
    // an array of 161 Vec3s, then wrap that back into a CoilApiResponseRecord so that it has the correct current.
    // Finally, flatten the overall result and return.
    const coilGroupsWithCurrents = realizedCoilMatrixSets.map((matrixGroup, groupIndex) =>
        matrixGroup.map((coilMatrix) => {
            const pts = (coilMatrix.valueOf() as MathNumericType[][]).map(v => [v[0], v[1], v[2]] as Vec3)
            return { coil: pts, current: coilRecords[groupIndex].current } as CoilRecord
        })
    )
    return coilGroupsWithCurrents.flat()
}

/**
 * Hook to expand a device's surfaces across the full stellarator ring.
 * 
 * @param inputSurfaceObject The base surfaces (numbering 1-6) and scalar surface values;
 * surfaces are represented as a 30 x 30 field of 3-vector points, and scalar values are
 * represented as 30 x 30 scalar values.
 * @param nfp Number of field periods, aka number of rotational symmetries.
 * @returns A new SurfaceApiResponseObject containing the same number of surfaces and
 * scalar surface values, but with each surface (and its values) extended per the appropriate
 * symmetries so that it covers the entire stellarator ring.
 */
export const applySurfaceSymmetries = (inputSurfaceObject: SurfaceObject, nfp: number): SurfaceObject => {
    const {surfacePoints, pointValues} = inputSurfaceObject
    // Step 1: convert the fields--again, a 60x60 grid of 3-vector points--to matrices & flatten to 3600
    const surfaceMatrices = surfacePoints.map((field) => matrix(field.flat().map(v => [...v])))

    // Notion: we're only given a half-period. We need to make it the full
    // period by applying the "stellarator symmetry", i.e. a rotation around the
    // x axis. (The other symmetries are rotational around the Z axis.)
    // This will give us a full period, which can then be the base unit for the
    // z-axis surface rotations.
    // We care about point ordering for the surface triangulation, and stellarator-symmetry will return
    // the points in a backwards order from what we want to consume, resulting in a discontinuous surface.
    // For triangulation purposes we need to reverse the elements of the
    // S-symmetry result, and put them before the base instance of that axis.
    // The stellarator symmetry by default returns the points in backwards order from what we
    // want: in a 1d case, if we rotate each point in [1, 2, 3] around the origin, we'd get
    // [-1, -2, -3]. But we actually want neither [1, 2, 3, -1, -2, -3] nor 
    // [-1, -2, -3, 1, 2, 3] --> we have to invert the order of the elements in the rotation
    // as well.
    //
    // But we're actually rotating a 2d list of points, and to continue numbering properly for
    // triangulation purposes, we have to reverse the ordering of *both* those dimensions.
    // [Contextually, the surface is a tube. The major dimension divides the tube into cross-sectional
    // slices; the minor dimension is the points going around the circumference for any slice.]
    //
    // To see this, draw diagonal lines on a piece of paper and roll it into a tube. Note that in
    // original position, the lines go (for instance) toward the origin. Rotate the tube around the
    // x-axis. Note that in the resulting position, the lines go away from the origin. This
    // indicates that he circumferential points are being visited in the opposite order from in
    // the right position.
    // 
    // To correct this and make one large full-period tube, you have to change the ordering of
    // both the cross-sectional slice (outer dimension) and circumferential points (inner dimension),
    // which we accomplish by just reversing the flattened matrix.
    const sSymmetricMatrices = surfaceMatrices.map(s => multiply(s, S))
    // For each surface/shell, we have a 3600x3 matrix (flat points x a 3-vector per point), so we
    // just need to reverse by the outer index. (We don't want to change the x, y, z.)
    // Create a destination matrix to hold the full-period geometry & indices to read it in
    // forward and backward:
    const resolution_sq = SURFACE_SIDE_RESOLUTION ** 2
    const forwardIndex = index(range(resolution_sq, 2*resolution_sq, 1), range(0, 3))
    const reverseIndex = index(range(resolution_sq - 1, -1, -1), range(0, 3))
    // Now for each matrix of full-period surfaces, copy the "right" matrix in forward
    // from the midpoint, and the rotated matrix in backward from the midpoint.
    const fullPeriodSurfaceMatrices = surfaceMatrices.map((s, i) => {
        const destinationMatrix = matrix().resize([2 * resolution_sq, 3])
        destinationMatrix.subset(forwardIndex, s)
        destinationMatrix.subset(reverseIndex, sSymmetricMatrices[i])
        return destinationMatrix
    })

    const transforms = surfaceTransformMatrices[nfp]
    const realizedSurfaceMatrices = fullPeriodSurfaceMatrices.map(obj => transforms.map(t => multiply(obj, t)))

    // Now reshape those (1d x R3-point) matrices into (2d x R3).
    const completedSurfaces = realizedSurfaceMatrices.map(s => {
        // each shell/surface has N matrices (one per full-period geometry), in flattened format.
        // Need to concat them before reshaping to X x Y x R3.
        const flatMatrix = concat(...s, 0) as Matrix
        return reshape(flatMatrix, [-1, SURFACE_SIDE_RESOLUTION, 3]).valueOf() as unknown as Vec3Field
    })

    // recall that the surface points are already a ScalarField, i.e. number[][], or 2-d matrix.
    // Also, the ordering of *all* points in both dimensions of the Surface was reversed.
    // So we need to reverse the ordering of all points in both dimensions.
    const fullPeriodPointFields = pointValues.map(surfacePoints => {
        const reversed = reshape(matrix([...surfacePoints].flat().reverse()),
                                 [SURFACE_SIDE_RESOLUTION, SURFACE_SIDE_RESOLUTION]
                                ).valueOf() as ScalarField
        return [...reversed, ...surfacePoints]
    })
    // This may be unnecessary
    const pointFields = fullPeriodPointFields.map(fullPeriodSurfacePoints => {
        return new Array(nfp).fill(0).map(() => fullPeriodSurfacePoints).flat() as ScalarField
    })
    const completedPoints = pointFields
    
    return { surfacePoints: completedSurfaces, pointValues: completedPoints, incomplete: false }
}
