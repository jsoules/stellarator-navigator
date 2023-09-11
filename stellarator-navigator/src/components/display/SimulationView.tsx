// below adapted (heavily) from https://github.com/magland/volumeview/blob/be55b7a9b6c78c24aa45310bd2e30f01f4269a26/gui/src/FourPanelView/Scene3DPanelView/Scene3DPanelView.tsx#L3

import { FunctionComponent, MutableRefObject, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SurfaceApiResponseObject, Vec3 } from '../../types/Types';
import { getSurfaces, getTubes } from './fetch3dData';
// see https://github.com/magland/volumeview/blob/be55b7a9b6c78c24aa45310bd2e30f01f4269a26/gui/src/VolumeViewData.ts#L158

type Props = {
    focusPosition?: Vec3    // TODO: Just use the native THREE.Vector3?
    width: number
    height: number
    canvasRef: MutableRefObject<null | HTMLCanvasElement>
    coils?: Vec3[][]
    surfs?: SurfaceApiResponseObject
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

const SimulationView: FunctionComponent<Props> = (props: Props) => {
    const { width, height, canvasRef, coils, surfs } = props

    const canvas = canvasRef.current

    const scene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.background = grayBackground
        return scene
    }, [])

    const objects = useMemo(() => {
        const coilTubes = coils === undefined ? [] : getTubes(coils)
        const surfaces = surfs === undefined ? [] : getSurfaces(surfs.surfacePoints, surfs.pointValues)
        // TODO: Does memoization break this
        if (surfaces) {
            return [...coilTubes, ...surfaces]
        }
        return [...coilTubes]
    }, [coils, surfs])


    const bbox = useMemo(() => {
        return getBoundingBox(coils ? coils.flat() : [])
    }, [coils])

    const camera = useMemo(() => {
        if (canvas === null) return undefined
        // field-of-view (vertical, in degrees); aspect ratio; near; far -- defines camera frustum
        const camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 100 )
        const pointLight = new THREE.PointLight(0xffffff, 100)
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

const min = (a: number[]) => {
    return a.reduce((prev, current) => (prev < current) ? prev : current, a[0] || 0)
}

const max = (a: number[]) => {
    return a.reduce((prev, current) => (prev > current) ? prev : current, a[0] || 0)
}

export default SimulationView