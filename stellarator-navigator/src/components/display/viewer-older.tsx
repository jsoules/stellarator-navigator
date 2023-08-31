// below adapted (heavily) from https://github.com/magland/volumeview/blob/be55b7a9b6c78c24aa45310bd2e30f01f4269a26/gui/src/FourPanelView/Scene3DPanelView/Scene3DPanelView.tsx#L3

import { FunctionComponent, MutableRefObject, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { DoubleSide } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // TODO: update this import
import { Vec3 } from '../../types/Types';
// see https://github.com/magland/volumeview/blob/be55b7a9b6c78c24aa45310bd2e30f01f4269a26/gui/src/VolumeViewData.ts#L158
// import { WorkspaceGrid, WorkspaceSurface, WorkspaceSurfaceScalarField, WorkspaceSurfaceVectorField } from 'VolumeViewData';

// export type SurfaceData = {
//     surface: WorkspaceSurface
//     scalarField?: WorkspaceSurfaceScalarField
//     vectorField?: WorkspaceSurfaceVectorField
// }

type Props = {
    // grid?: WorkspaceGrid
    focusPosition?: Vec3    // TODO: Just use the native THREE.Vector3?
    // surfacesData: SurfaceData[]
    surfaceScalarDataRange: [number, number]
    width: number
    height: number
    canvasRef: MutableRefObject<null | HTMLCanvasElement>
}

// const addThreePointLights = (camera: THREE.PerspectiveCamera, test: boolean = false, extentX: number, extentY: number, extentZ: number) => {
//     // A traditional three-light setup has the main shadow-generating light, or key light,
//     // slightly above the camera and at an angle ~30-45 degrees to the subject;
//     // the fill light comes from the other side and is softer and is trying to ensure shadows aren't
//     // too dramatic;
//     // then a rim light opposite the camera provides additional highlights to the object edges.
//     // The key light should be the brightest light source.
//     // Adding these to the camera ensures they'll always be relative to the camera position and
//     // use its coordinate system.
//     const colors = test ? [0xff0000, 0x0000ff, 0x00ff00] : [0xffffff, 0xffffff, 0xffffff]
//     const keyLight = new THREE.SpotLight(colors[0], .5)
//     const fillLight = new THREE.DirectionalLight(colors[1], .4)
//     const rimLight = new THREE.DirectionalLight(colors[2], .3)
//     ;[keyLight, fillLight, rimLight].forEach(l => camera.add(l))
//     keyLight.position.set(1.5 * extentX, 0.5 * extentY, 0)
//     fillLight.position.set(-1.5 * extentX, 0.5 * extentY, 0)
//     rimLight.position.set(0, 0.2 * extentY, -1 * extentZ)
//     rimLight.target = camera
// }

// NOTE: It looks like the current implementation in Mayavi just uses straight lines to connect the points.
// So any curve pattern is probably acceptable--let's try the centrifugal, but can fallback to line if
// the scientists like that better.

const unitBox = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1))

const vecSum = (...args: Vec3[]) => {
    return args.reduce((acc, curr) => {
        return [acc[0] + curr[0], acc[1] + curr[1], acc[2] + curr[2]]
    }, [0, 0, 0])
}

// The "geometry" contains the stuff we actually want to draw
// a "mesh" is a geometry with an applied surface/material
// TODO: planeMesh, lineMesh, surfaceMesh are exported just to keep the linter happy while I figure this thing out
// they shouldn't be. Either delete, or use them somewhere
export const planeMesh = (p0: Vec3, v1: Vec3, v2: Vec3, normal: Vec3, color: string, opts: {transparent: boolean, opacity: number}) => {
    const material = new THREE.MeshBasicMaterial( {
        color,
        side: DoubleSide,
        opacity: opts.opacity,
        transparent: opts.transparent
    })

    const geometry = new THREE.BufferGeometry()

    const indices: number[] = []
    const vertices = []
    const normals: number[] = []

    vertices.push(...p0)
    normals.push(...normal)
    vertices.push(...vecSum(p0, v1))
    normals.push(...normal)
    // vertices.push(p0[0] + v1[0] + v2[0], p0[1] + v1[1] + v2[1], p0[2] + v1[2] + v2[2])
    vertices.push(...vecSum(p0, v1, v2))
    normals.push(...normal)
    vertices.push(...vecSum(p0, v2))
    normals.push(...normal)

    indices.push(0, 1, 2)
    indices.push(0, 2, 3)
    
    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) )
    geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) )
    return new THREE.Mesh( geometry, material )
}

export const lineMesh = (p1: Vec3, p2: Vec3, color: string) => {
    const material = new THREE.LineBasicMaterial({
        color
    });
    
    const points = [
        new THREE.Vector3(p1[0], p1[1], p1[2]),
        new THREE.Vector3(p2[0], p2[1], p2[2])
    ]
    
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const line = new THREE.Line( geometry, material );
    return line
}

export const surfaceMesh = (vertices: number[][], faces: number[][], scalarData: number[] | undefined, scalarDataRange: [number, number]) => {
    const material = new THREE.MeshPhongMaterial( {
        color: 'white',
        flatShading: true,
        side: DoubleSide,
        vertexColors: scalarData ? true : false
    })

    const geometry = new THREE.BufferGeometry()

    const indices0: number[] = [] // faces
    const vertices0 = []

    for (const v of vertices) {
        vertices0.push(v[0], v[1], v[2])
    }
    for (const f of faces) {
        indices0.push(f[0], f[1], f[2])
    }
    
    geometry.setIndex( indices0 );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices0, 3 ) )
    geometry.computeVertexNormals()

    if (scalarData) {
        const color = new Float32Array(3 * vertices.length)
        for (let i = 0; i < vertices.length; i++) {
            const rgb = colorForValue((scalarData[i] - scalarDataRange[0]) / (scalarDataRange[1] - scalarDataRange[0]))
            color[i * 3 + 0] = rgb[0]
            color[i * 3 + 1] = rgb[1]
            color[i * 3 + 2] = rgb[2]
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
    }

    const obj = new THREE.Mesh( geometry, material )
    return obj
}

const Scene3DPanelView: FunctionComponent<Props> = (props: Props) => {
    // const { grid, focusPosition, surfacesData, surfaceScalarDataRange, scene3DOpts, width, height } = props
    // const { focusPosition, surfaceScalarDataRange, width, height } = props
    const { width, height, canvasRef } = props
    const [container, setContainer] = useState<HTMLDivElement | null>(null)
    // TODO: Might be better to pass in an external Canvas as part of the props, and then use that Canvas ref
    // in the renderer constructor. This avoids a lot of the DOM management that happens when the renderer creates its own.
    // https://threejs.org/manual/#en/fundamentals search for "look up the canvas"

    const scene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color( 0x000000 );
        return scene
    }, [])

    const objects = useMemo(() => {
        const objects: THREE.Object3D[] = []

        // If we are displaying a grid (defined as an x/y/z, count of gridlines, and gridline separation distance), then draw it
        // if ((grid) && (focusPosition)) {
        //     const p0 = [grid.x0, grid.y0, grid.z0]
        //     const p1 = [grid.x0 + grid.dx * grid.Nx, grid.y0 + grid.dy * grid.Ny, grid.z0 + grid.dz * grid.Nz]
        //     const focusPoint: [number, number, number] = [grid.x0 + focusPosition[0] * grid.dx, grid.y0 + focusPosition[1] * grid.dy, grid.z0 + focusPosition[2] * grid.dz]

        //     const opts = {opacity: scene3DOpts.referencePlanesOpacity, transparent: scene3DOpts.transparentReferencePlanes}
        //     const planeXY = planeMesh([p0[0], p0[1], focusPoint[2]], [p1[0] - p0[0], 0, 0], [0, p1[1] - p0[1], 0], [0, 0, 1], 'rgb(120, 120, 150)', opts)
        //     const planeXZ = planeMesh([p0[0], focusPoint[1], p0[2]], [p1[0] - p0[0], 0, 0], [0, 0, p1[2] - p0[2]], [0, 1, 0], 'rgb(120, 150, 120)', opts)
        //     const planeYZ = planeMesh([focusPoint[0], p0[1], p0[2]], [0, p1[1] - p0[1], 0], [0, 0, p1[2] - p0[2]], [1, 0, 0], 'rgb(150, 120, 120)', opts)
        //     const lineX = lineMesh(focusPoint, [grid.x0 + grid.Nx * grid.dx * 1.3, focusPoint[1], focusPoint[2]], 'red')
        //     const lineY = lineMesh(focusPoint, [focusPoint[0], grid.y0 + grid.Ny * grid.dy * 1.3, focusPoint[2]], 'green')
        //     const lineZ = lineMesh(focusPoint, [focusPoint[0], focusPoint[1], grid.z0 + grid.Nz * grid.dz * 1.3], 'blue')

            
        //     if (scene3DOpts.showReferencePlanes) {
        //         objects.push(planeXY, planeXZ, planeYZ)
        //     }
        //     if (scene3DOpts.showReferenceLines) {
        //         objects.push(lineX, lineY, lineZ)
        //     }
        // }

        // for (const X of surfacesData) {
        //     objects.push(
        //         surfaceMesh(X.surface.vertices, X.surface.faces, X.scalarField?.data, surfaceScalarDataRange)
        //     )
        // }
        return objects
    // }, [focusPosition, grid, surfacesData, scene3DOpts, surfaceScalarDataRange])
    }, [])

    // const bbox = useMemo(() => {
    //     if (grid) {
    //         const p0 = [grid.x0, grid.y0, grid.z0]
    //         const p1 = [grid.x0 + grid.dx * grid.Ny, grid.y0 + grid.dy * grid.Ny, grid.z0 + grid.dz * grid.Nz]
    //         return new THREE.Box3(new THREE.Vector3(p0[0], p0[1], p0[2]), new THREE.Vector3(p1[0], p1[1], p1[2]))
    //     }
    //     else {
    //         return getBoundingBoxForSurfaces(surfacesData.map(x => (x.surface)))
    //     }
    // }, [grid, surfacesData])

    // TODO: give this thing something to bound
    const bbox = useMemo(() => {
        return getBoundingBox([])
    }, [])

    const camera = useMemo(() => {
        if (!container) return undefined
        // field-of-view (vertical, in degrees); aspect ratio; near; far -- defines camera frustum
        // TODO: adjust the near/far values to something more reasonable compared to the sizes in our dataset
        const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 100000 )
        const pointLight = new THREE.PointLight(0xffffff, 0.7)
        camera.add(pointLight)
        return camera
    }, [container, width, height])

    const controls = useMemo(() => {
        if (!container) return undefined
        if (!camera) return undefined
        const controls = new OrbitControls( camera, container )
        return controls
    }, [camera, container])

    const center = useMemo(() => {
        return {x: (bbox.min.x + bbox.max.x) / 2, y: (bbox.min.y + bbox.max.y) / 2, z: (bbox.min.z + bbox.max.z) / 2}
    }, [bbox])

    const zSpan = useMemo(() => {
        return bbox.max.z - bbox.min.z
    }, [bbox])

    useEffect(() => {
        if (!camera) return
        if (!controls) return
        camera.position.set(center.x, center.y, center.z + zSpan * 3)
        controls.target.set(center.x, center.y, center.z)
    }, [center.x, center.y, center.z, zSpan, camera, controls]) // important to not pass in center, because reference will change whenever bbox reference changes

    const renderer = useMemo(() => {
        const canvas = canvasRef.current === null ? undefined : canvasRef.current
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize( width, height );
        return renderer
    }, [canvasRef, width, height])

    useEffect(() => {
        if (!scene) return
        if (!container) return
        if (!controls) return
        if (!camera) return

        scene.clear()

        while (container.firstChild) container.removeChild(container.firstChild)
        container.appendChild(renderer.domElement)
        
        objects.forEach(obj => scene.add(obj))
        
        scene.add(camera)

        const render = () => {
            renderer.render( scene, camera );
        }
        controls.addEventListener( 'change', render );
        controls.update()
        render()

        return () => {
            controls.removeEventListener('change', render)
        }
    }, [renderer, camera, container, controls, height, objects, width, scene])

    return (
        <div ref={setContainer} />
    )
}

const getBoundingBox = (points: Vec3[]) => {
    if (points.length === 0) return unitBox
    const xs: number[] = []
    const ys: number[] = []
    const zs: number[] = []
    points.forEach(pt => {
        xs.push(pt[0])
        ys.push(pt[1])
        zs.push(pt[2])
    })
    const vmin = ([min(xs), min(ys), min(zs)])
    const vmax = ([max(xs), max(ys), max(zs)])

    return new THREE.Box3(new THREE.Vector3(...vmin), new THREE.Vector3(...vmax))
}

// const getBoundingBoxForSurfaces = (surfaces: WorkspaceSurface[]) => {
//     const mins: [number, number, number][] = []
//     const maxs: [number, number, number][] = []
//     for (let S of surfaces) {
//         mins.push([min(S.vertices.map(v => (v[0]))), min(S.vertices.map(v => (v[1]))), min(S.vertices.map(v => (v[2])))])
//         maxs.push([max(S.vertices.map(v => (v[0]))), max(S.vertices.map(v => (v[1]))), max(S.vertices.map(v => (v[2])))])
//     }
//     if (mins.length === 0) {
//         return new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1))
//     }

//     const vmin = [min(mins.map(a => a[0])), min(mins.map(a => a[1])), min(mins.map(a => a[2]))]
//     const vmax = [max(maxs.map(a => a[0])), max(maxs.map(a => a[1])), max(maxs.map(a => a[2]))]
//     return new THREE.Box3(new THREE.Vector3(vmin[0], vmin[1], vmin[2]), new THREE.Vector3(vmax[0], vmax[1], vmax[2]))
// }

const min = (a: number[]) => {
    return a.reduce((prev, current) => (prev < current) ? prev : current, a[0] || 0)
}

const max = (a: number[]) => {
    return a.reduce((prev, current) => (prev > current) ? prev : current, a[0] || 0)
}

const colorForValue = (v: number) => {
    const v2 = Math.min(1, Math.max(0, v))
    const r = v2
    const g = 0.5
    const b = 1 - v2

    return [r, g, b]
}

export default Scene3DPanelView