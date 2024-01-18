import { SupportedColorMap } from '@snDisplayComponents/Colormaps'
import { CoilRecord, SurfaceObject } from '@snTypes/Types'
import { FunctionComponent, MutableRefObject, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import useSvCamera from './SvCamera'
import useSvControls from './SvControls'
import { ambientLight, spotlights } from './SvLighting'
import { fieldMaterial, getScaledTubeMaterial, grayBackground, tubeMaterial } from './SvMaterials'
import useSvRenderer from './SvRenderer'
import { colorizeSurfaces, makeSurfaces, makeTubes, usePositions } from './geometry'

type Props = {
    width: number
    height: number
    canvasRef: MutableRefObject<null | HTMLCanvasElement>
    colorScheme?: SupportedColorMap
    surfaceChecks?: boolean[]
    coils?: CoilRecord[]
    surfs?: SurfaceObject
    displayedPeriods?: number
    showCurrents?: boolean
}

type Positions = {
    center: THREE.Vector3,
    zOffset: THREE.Vector3,
    xSpan: number,
    ySpan: number
}

const scene = new THREE.Scene()
scene.background = grayBackground


const SimulationView: FunctionComponent<Props> = (props: Props) => {
    const { width, height, canvasRef, coils, surfs, surfaceChecks, colorScheme, displayedPeriods, showCurrents } = props
    const canvas = canvasRef.current

    const tubes = useMemo(() => {
        const coilTubes = coils === undefined ? [] : makeTubes(coils.map(r => r.coil))
        const currents = coils === undefined ? [] : coils.map(r => r.current)
        const coilMeshes = showCurrents
            ? coilTubes.map((c, i) => new THREE.Mesh(c, getScaledTubeMaterial(currents[i], 'blueOrange')))
            : coilTubes.map(c => new THREE.Mesh(c, tubeMaterial))
        return coilMeshes
    }, [coils, showCurrents])

    const surfaces = useMemo(() => {
        const surfaces = surfs === undefined ? [] : makeSurfaces(surfs.surfacePoints, displayedPeriods)
        if (surfs !== undefined) {
            colorizeSurfaces(surfaces, surfs.pointValues, colorScheme)
        }
        const surfaceMeshes = surfaces.map(s => new THREE.Mesh(s, fieldMaterial))
        return [...surfaceMeshes]
    }, [colorScheme, displayedPeriods, surfs])

    const objects = useMemo(() => {
        const displayedSurfaces: THREE.Mesh<THREE.BufferGeometry, THREE.Material>[] = []
        const definiteChecks = surfaceChecks ?? []
        surfaces.length > 0 && definiteChecks.forEach((v, idx) => {
            if (v) {
                displayedSurfaces.push(surfaces[idx])
            }
        })
        return [...tubes, ...displayedSurfaces]
    }, [tubes, surfaces, surfaceChecks])

    const focalPositions = usePositions(coils?.map(c => c.coil))
    const camera = useSvCamera(width, height)
    const controls = useSvControls(canvas, camera)
    const renderer = useSvRenderer(canvas, width, height)

    useEffect(() => {
        updatePositions(camera, controls, focalPositions, spotlights)
    }, [camera, controls, focalPositions, focalPositions.center, focalPositions.zOffset])

    useEffect(() => {
        return makeScene(controls, camera, spotlights, objects, renderer)
    }, [height, width, controls, camera, objects, renderer])
    return (
        <></>
    )
}


type Light = THREE.SpotLight | THREE.PointLight
const zUnit = new THREE.Vector3(0, 0, -1)
const updatePositions = (camera: THREE.PerspectiveCamera, controls: OrbitControls | undefined, positions: Positions, spots: Light[] ) => {
    if (!controls) return
    controls.target.copy(positions.center)
    // We'd like to position the camera so the full width of the largest span (x or y) is in view. Since the camera's field-of-view
    // is 60 degrees, it will see 2 * sin(30) * Z in the x & y directions. But 2 sin(30 degrees) = 1.
    // So with W being the max of (xspan, yspan), set:
    //   camera z-position = center - zOffset/2 - W
    // because:
    //   - zOffset/2 puts us even with the lowest observed point, and
    //   - if W = 2 sin(30) * Z --> Z = W, and we put the camera in the negative Z direction.
    // However, since the geometries we actually work with put the x/y extrema closer to the Z-center, the above gives a bit too much
    // margin--especially when drawing into a non-square viewport. So use 0.25*Zspan instead of 0.5.
    camera.position.copy(positions.center).addScaledVector(positions.zOffset, -0.25).addScaledVector(zUnit, Math.max(positions.xSpan, positions.ySpan))
    // TODO: some more sophisticated logic for spotlighting?
    spots[0].position.copy(positions.center).setZ(-50)
    spots[1].position.copy(positions.center).setZ(50)
}


const makeScene = (controls: OrbitControls | undefined, camera: THREE.PerspectiveCamera, spots: Light[], objects: THREE.Mesh[], renderer: THREE.WebGLRenderer) => {
    if (!controls) return

    scene.clear()

    scene.add(ambientLight)
    spots.forEach(s => scene.add(s))
    objects.forEach(obj => {
        scene.add(obj)
    })
    
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
}


export default SimulationView