import { SupportedColorMap, valueToRgbTriplet } from "@snDisplayComponents/Colormaps"
import { ScalarField, Vec3, Vec3Field } from "@snTypes/Types"
import { useMemo } from "react"
import * as THREE from "three"

export const SURFACE_SIDE_RESOLUTION = 60

export const makeTubes = (coils: Vec3[][]): THREE.TubeGeometry[] => {
    if (coils.length === 0) return []
    // if (coils.some(c => c === undefined)) return [] TODO REMOVE
    return coils.map(coil => {
        const points = coil.map(c => new THREE.Vector3(...c))
        const curve = new THREE.CatmullRomCurve3(points, true)
        // path, # tube segments, radius, # radial segments, whether to close the loop
        return new THREE.TubeGeometry(curve, 161, 0.2, 13, true)
    })
}

const triangulateField = (width: number, height: number): number[] => {
    return Array(height - 1).fill(0).map((_, h) => {
      return Array(width - 1).fill(0).map((__, w) => {
        const rowOffset = width * h
        const x = rowOffset + w
        // we need to make clear to the system that this surface actually is a tube.
        // Without the "width - 2" check, we connect a flat surface where the first and
        // last vertices happen to occupy the same physical space, but there is no surface
        // connecting them: this creates a sharp seam which should be rounded.
        // It's "-2" because we don't actually care about the repeated point in the data.
        // If that repeated point should ever go away, we'd want to make this -1 instead.
        if (w === width - 2) {
            return [x, rowOffset, x+width, rowOffset, rowOffset+width, x+width]
        }
        return [x, x+1, x+width, x+1, x+width + 1, x+width]
      })
    }).flat(2)
}


export const makeSurfaces = (surfacePoints: Vec3Field[], periods: number = 1) => {
    // if (surfacePoints === undefined) return [] TODO REMOVE
    if (surfacePoints.length === 0) return []

    // For each surface, create a BufferGeometry and add the
    // 30 x 30 x [x, y, z] data to that geometry as "known vertices".
    // Then map those points into surfaces by using two triangles per 4-point neighborhood,
    // to create a mapping that says point (x, y) is adjacent to points (x, y+1) and
    // (x + 1, y) (see the triangulateField function).
    
    const surfaces = surfacePoints.map((field) => {
        const surfaceGeometry = new THREE.BufferGeometry()
        const vertices = new Float32Array(field.flat(2))
        const indices = triangulateField(SURFACE_SIDE_RESOLUTION * periods, SURFACE_SIDE_RESOLUTION)

        surfaceGeometry.setIndex(indices)
        surfaceGeometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3 ))
        surfaceGeometry.computeVertexNormals()

        return surfaceGeometry
    })
    
    return surfaces
}


export const colorizeSurfaces = (surfaces: THREE.BufferGeometry[], scalars: ScalarField[], colormap: SupportedColorMap = SupportedColorMap.VIRIDIS) => {
    // if (scalars === undefined || surfaces === undefined) return [] TODO REMOVE
    if (scalars.length === 0 || surfaces.length === 0) return []

    surfaces.forEach((s, idx) => {
        const vertexColors = new Float32Array((scalars[idx].flat().map(v => valueToRgbTriplet(v, colormap))).flat())
        s.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3))
        return s
    })

    return surfaces
}



type BoundingPoints = {
    xmin: number
    ymin: number
    zmin: number
    xmax: number
    ymax: number
    zmax: number
}

const unitBox: BoundingPoints = {
    xmin: 0,
    ymin: 0,
    zmin: 0,
    xmax: 1,
    ymax: 1,
    zmax: 1
}

const useBoundingBox = (points: Vec3[]): BoundingPoints => {
    return useMemo(() => {
        if (points.length === 0) return unitBox

        const xs: number[] = []
        const ys: number[] = []
        const zs: number[] = []
        points.forEach(p => {
            xs.push(p[0])
            ys.push(p[1])
            zs.push(p[2])
        })
        return {
            xmin: Math.min(...xs),
            ymin: Math.min(...ys),
            zmin: Math.min(...zs),
            xmax: Math.max(...xs),
            ymax: Math.max(...ys),
            zmax: Math.max(...zs)
        }        
    }, [points])
}


export const usePositions = (coils?: Vec3[][]) => {
    // It's probably not necessary to split the memoization like this,
    // but I'm concerned about substantively-equal-but-referentially-distinct
    // repeated calls, which I'm attempting to cut off here.
    const extremePts = useBoundingBox(coils ? coils.flat() : [])
    const xSpan = (extremePts.xmax - extremePts.xmin)
    const ySpan = (extremePts.ymax - extremePts.ymin)
    const centerX = (extremePts.xmin + extremePts.xmax)/2
    const centerY = (extremePts.ymin + extremePts.ymax)/2
    const centerZ = (extremePts.zmin + extremePts.zmax)/2
    const zSpan = extremePts.zmax - extremePts.zmin

    const center = useMemo(() => new THREE.Vector3(centerX, centerY, centerZ), [centerX, centerY, centerZ])
    const zOffset = useMemo(() => new THREE.Vector3(0, 0, zSpan), [zSpan])

    return useMemo(() => { return { center, zOffset, xSpan, ySpan }}, [center, xSpan, ySpan, zOffset])
}
