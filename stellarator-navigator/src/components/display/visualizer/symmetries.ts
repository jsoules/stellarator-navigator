import { CoilRecord, ScalarField, SurfaceObject, Vec3, Vec3Field } from '@snTypes/Types'
import { MathNumericType, Matrix, cos, index, matrix, multiply, range, sin } from 'mathjs'
import { SURFACE_SIDE_RESOLUTION } from './geometry'

const coilTransformMatrices: {[key: number]: Matrix[]} = {}
const surfaceTransformMatrices: {[key: number]: Matrix[]} = {}

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
export const applyCoilSymmetries = (coilRecords: CoilRecord[], nfp: number) => {
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
    return coilGroupsWithCurrents.flat() as CoilRecord[]
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
    // BUT for triangulation purposes we need to reverse the elements of the
    // S-symmetry result, and put them before the base instance of that axis.
    const sSymmetricMatrices = surfaceMatrices.map(s => multiply(s, S))
    // For each surface/shell, we have a 3600x3 matrix, just need to reverse by the
    // outer index.
    const resolution_sq = SURFACE_SIDE_RESOLUTION ** 2
    const forwardIndex = index(range(resolution_sq, 2*resolution_sq, 1), range(0, 3))
    const reverseIndex = index(range(resolution_sq - 1, -1, -1), range(0, 3))
    const fullPeriodSurfaceMatrices = surfaceMatrices.map((s, i) => {
        const destinationMatrix = matrix().resize([2 * resolution_sq, 3])
        destinationMatrix.subset(forwardIndex, s)
        destinationMatrix.subset(reverseIndex, sSymmetricMatrices[i])
        return destinationMatrix
    })

    const transforms = surfaceTransformMatrices[nfp]

    const realizedSurfaceMatrices = fullPeriodSurfaceMatrices.map(obj => transforms.map(t => multiply(obj, t)))
    // We care about point ordering for the surface triangulation, and stellarator-symmetry will return
    // the points in a backwards order from what we want to consume, resulting in a discontinuous surface.
    // Think of a number line: if we started with 1, 2, 3, then applying the stellarator-symmetry would
    // yield -1, -2, -3. We want neither 1, 2, 3, -1, -2, -3, nor -1, -2, -3, 1, 2, 3 -- what we actually
    // want is -3, -2, -1, 1, 2, 3.
    // The upshot is, for points generated by the stellarator-symmetry, we need to reverse each major row order
    // and then prepend the result to the original version.
    const fields = realizedSurfaceMatrices.map(s => {
        // outer index: surface
        // inner index: two matrices per rotation
        // action: all matrices should be converted into points, but the even-numbered ones need to have their order
        // reversed and then be prepended to the non-rotated versions. (Even-numbered ones represent the "stellarator symmetry"
        // i.e. a rotation around the X axis--which isn't magic, it's just the result of how we built the transform matrices.)
        const flatPoints = s.map(m => m.valueOf() as MathNumericType[][]).map(row => row.map(point => [...point] as Vec3)).flat()
        const field = new Array(flatPoints.length / 30).fill(0).map((_, i) => {
            return new Array(30).fill(0).map((_, j) => flatPoints[(30 * i) + j])
        }) as Vec3Field
        return field
    })
    const completedSurfaces = fields

    const fullPeriodPointFields = pointValues.map(surfacePoints => {
        const full = []
        full.push(...(surfacePoints.reverse()))
        full.push(...(surfacePoints.reverse()))
        return full
    })
    const pointFields = fullPeriodPointFields.map(surfacePoints => {
        return new Array(nfp).fill(0).map(() => surfacePoints).flat() as ScalarField
    })
    const completedPoints = pointFields
    
    return { surfacePoints: completedSurfaces, pointValues: completedPoints, incomplete: false }
}
