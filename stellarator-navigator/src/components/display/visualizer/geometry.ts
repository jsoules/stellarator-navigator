import { SupportedColorMap, valueToRgbTriplet } from "@snDisplayComponents/Colormaps"
import { ScalarField, Vec3, Vec3Field } from "@snTypes/Types"
import { useMemo } from "react"
import * as THREE from "three"


export const makeTubes = (coils: Vec3[][]): THREE.TubeGeometry[] => {
    return coils.map(coil => {
        const points = coil.map(c => new THREE.Vector3(...c))
        const curve = new THREE.CatmullRomCurve3(points)
        // path, # tube segments, radius, # radial segments, whether to close the loop
        return new THREE.TubeGeometry(curve, 161, 0.2, 13, true)
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
    const centerX = (extremePts.xmin + extremePts.xmax)/2
    const centerY = (extremePts.ymin + extremePts.ymax)/2
    const centerZ = (extremePts.zmin + extremePts.zmax)/2
    const zSpan = extremePts.zmax - extremePts.zmin

    const center = useMemo(() => new THREE.Vector3(centerX, centerY, centerZ), [centerX, centerY, centerZ])
    const zOffset = useMemo(() => new THREE.Vector3(0, 0, zSpan), [zSpan])

    return useMemo(() => { return { center, zOffset }}, [center, zOffset])
}


// // Note: the below is legacy code and will be deleted before release.
// // I don't believe we need a formal Three.JS bounding box or box model--we are not engaging with it in any
// // sophisticated way--but I didn't want to lose the current state just in case.

// const unitBox = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1))
// const getBoundingBox = (points: Vec3[]) => {
//     if (points.length === 0) return unitBox
//     const xs: number[] = []
//     const ys: number[] = []
//     const zs: number[] = []
//     points.forEach(pt => {
//         xs.push(pt[0])
//         ys.push(pt[1])
//         zs.push(pt[2])
//     })
//     const vmin = ([min(xs), min(ys), min(zs)])
//     const vmax = ([max(xs), max(ys), max(zs)])

//     return new THREE.Box3(new THREE.Vector3(...vmin), new THREE.Vector3(...vmax))
// }

// const min = (a: number[]) => {
//     return a.reduce((prev, current) => (prev < current) ? prev : current, a[0] || 0)
// }

// const max = (a: number[]) => {
//     return a.reduce((prev, current) => (prev > current) ? prev : current, a[0] || 0)
// }

// const bbox = useMemo(() => {
//     return getBoundingBox(coils ? coils.flat() : [])
// }, [coils])

// const center = useMemo(() => {
//     return {x: (bbox.min.x + bbox.max.x) / 2, y: (bbox.min.y + bbox.max.y) / 2, z: (bbox.min.z + bbox.max.z) / 2}
// }, [bbox])

// const zSpan = useMemo(() => {
//     return bbox.max.z - bbox.min.z
// }, [bbox])

// useEffect(() => {
//     if (!camera) return
//     if (!controls) return
//     camera.position.set(viewDims.centerx, viewDims.centery, -1 * (viewDims.centerz + viewDims.zspan * 1.5))
//     controls.target.set(viewDims.centerx, viewDims.centery, viewDims.centerz)
//     // Note: don't depend directly on viewDims; reference might change without changing the scalars
// }, [camera, controls, viewDims.centerx, viewDims.centery, viewDims.centerz, viewDims.zspan])

// const spotlight = useMemo(() => {
//     const spotLight = new THREE.SpotLight( 0xffffff, 7000 );
//     spotLight.position.set( viewDims.centerx, viewDims.centery, -1 * (viewDims.centerz + viewDims.zspan * 2) );
//     return spotLight
// }, [viewDims.centerx, viewDims.centery, viewDims.centerz, viewDims.zspan])

// const spot2 = useMemo(() => {
//     const spotLight = new THREE.SpotLight( 0xffffff, 7000 );
//     spotLight.position.set( viewDims.centerx, viewDims.centery, (viewDims.centerz + viewDims.zspan * 2) );
//     return spotLight
// }, [viewDims.centerx, viewDims.centery, viewDims.centerz, viewDims.zspan])



