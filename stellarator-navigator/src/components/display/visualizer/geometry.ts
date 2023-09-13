import * as THREE from "three"
import { ScalarField, Vec3, Vec3Field } from "../../../types/Types"
import { SupportedColorMap, valueToRgbTriplet } from "../Colormaps"


export const makeTubes = (coils: Vec3[][]): THREE.TubeGeometry[] => {
    return coils.map(coil => {
        const points = coil.map(c => new THREE.Vector3(...c))
        const curve = new THREE.CatmullRomCurve3(points)
        // path, # tube segments, radius, # radial segments, whether to close the loop
        return new THREE.TubeGeometry(curve, 61, 0.2, 13, true)
    })
}


const triangulateField = (width: number, height: number): number[] => {
    return Array(height - 1).fill(0).map((_, h) => {
      return Array(width - 1).fill(0).map((__, w) => {
        const rowOffset = width * h
        const x = rowOffset + w
        return [x, x+1, x+width, x+1, x+width + 1, x+width]
      })
    }).flat().flat()
}
    

export const makeSurfaces = (surfacePoints: Vec3Field[]) => {
    if (surfacePoints === undefined) return []

    // For each surface, create a BufferGeometry and add the
    // 30 x 30 x [x, y, z] data to that geometry as "known vertices".
    // Then map those points into surfaces by using two triangles per 4-point neighborhood,
    // to create a mapping that says point (x, y) is adjacent to points (x, y+1) and
    // (x + 1, y) (see the triangulateField function).
    
    const surfaces = surfacePoints.map((field) => {
        const surfaceGeometry = new THREE.BufferGeometry()
        const vertices = new Float32Array(field.flat().flat())
        const indices = triangulateField(30, 30)

        surfaceGeometry.setIndex(indices)
        surfaceGeometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3 ))
        surfaceGeometry.computeVertexNormals()

        return surfaceGeometry
    })
    
    return surfaces
}


export const colorizeSurfaces = (surfaces: THREE.BufferGeometry[], scalars: ScalarField[], colormap: SupportedColorMap = 'viridis') => {
    if (scalars === undefined) return []

    surfaces.forEach((s, idx) => {
        const vertexColors = new Float32Array((scalars[idx].flat().map(v => valueToRgbTriplet(v, colormap))).flat())
        s.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3))
        return s
    })

    return surfaces
}


