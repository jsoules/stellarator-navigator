// below adapted (heavily) from https://github.com/magland/volumeview/blob/be55b7a9b6c78c24aa45310bd2e30f01f4269a26/gui/src/FourPanelView/Scene3DPanelView/Scene3DPanelView.tsx#L3

import { FunctionComponent, MutableRefObject, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Vec3 } from '../../types/Types';
import { getTubes } from './fetch3dData';
// see https://github.com/magland/volumeview/blob/be55b7a9b6c78c24aa45310bd2e30f01f4269a26/gui/src/VolumeViewData.ts#L158

type Props = {
    focusPosition?: Vec3    // TODO: Just use the native THREE.Vector3?
    width: number
    height: number
    canvasRef: MutableRefObject<null | HTMLCanvasElement>
    coils?: Vec3[][]
    // apiCoils?: Vec3[][]
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


const unitBox = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1))
const grayBackground = new THREE.Color( 0x444444 )

// const vecSum = (...args: Vec3[]) => {
//     return args.reduce((acc, curr) => {
//         return [acc[0] + curr[0], acc[1] + curr[1], acc[2] + curr[2]]
//     }, [0, 0, 0])
// }


const Scene3DPanelView: FunctionComponent<Props> = (props: Props) => {
    const { width, height, canvasRef, coils } = props

    const canvas = canvasRef.current

    const scene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.background = grayBackground
        return scene
    }, [])

    const objects = useMemo(() => {
        // const objects: THREE.Object3D[] = [] // I don't know what this was about

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
        const coilTubes = coils === undefined ? [] : getTubes(coils)
        // const apiTubes = apiCoils === undefined ? [] : getTubes(apiCoils, true)
        return [...coilTubes]
    // }, [focusPosition, grid, surfacesData, scene3DOpts, surfaceScalarDataRange])
    }, [coils])

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

    const bbox = useMemo(() => {
        return getBoundingBox(coils ? coils.flat() : [])
    }, [coils])

    const camera = useMemo(() => {
        if (canvas === null) return undefined
        // field-of-view (vertical, in degrees); aspect ratio; near; far -- defines camera frustum
        const camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 100 )
        const pointLight = new THREE.PointLight(0xffffff, 1000)
        camera.add(pointLight)
        return camera
    }, [canvas, width, height])

    const controls = useMemo(() => {
        if (canvas === null) return undefined
        if (!camera) return undefined
        const controls = new OrbitControls( camera, canvas )
        return controls
    }, [camera, canvas])

    const center = useMemo(() => {
        return {x: (bbox.min.x + bbox.max.x) / 2, y: (bbox.min.y + bbox.max.y) / 2, z: (bbox.min.z + bbox.max.z) / 2}
    }, [bbox])

    const zSpan = useMemo(() => {
        return bbox.max.z - bbox.min.z
    }, [bbox])

    useEffect(() => {
        if (!camera) return
        if (!controls) return
        camera.position.set(center.x, center.y, -1 * (center.z + zSpan * 1.5))
        controls.target.set(center.x, center.y, center.z)
        console.log(`camera position: ${center.x} ${center.y} ${-1 * (center.z + zSpan * 2)}`)
    }, [center.x, center.y, center.z, zSpan, camera, controls]) // important to not pass in center, because reference will change whenever bbox reference changes

    const ambientLight = useMemo(() => {
        return new THREE.AmbientLight( 0xe0e0e0, 1.0 )
    }, [])

    const spotlight = useMemo(() => {
        const spotLight = new THREE.SpotLight( 0xffffff, 1000 );
        spotLight.position.set( center.x, center.y, -1 * (center.z + zSpan * 2) );
        return spotLight
    }, [center.x, center.y, center.z, zSpan])

    const renderer = useMemo(() => {
        const _canvas = canvas === null ? undefined : canvas
        const renderer = new THREE.WebGLRenderer({ canvas: _canvas });
        renderer.setSize( width, height );
        return renderer
    }, [canvas, width, height])

    useEffect(() => {
        if (!scene) return
        if (!controls) return
        if (!camera) return

        scene.clear()

        scene.add(ambientLight)
        scene.add(spotlight)

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
    }, [renderer, camera, controls, height, objects, width, scene, ambientLight, spotlight])

    return (
        <></>
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

export default Scene3DPanelView