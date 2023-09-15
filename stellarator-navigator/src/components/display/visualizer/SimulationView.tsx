import { SupportedColorMap } from '@snDisplayComponents/Colormaps'
import { SurfaceApiResponseObject, Vec3 } from '@snTypes/Types'
import { FunctionComponent, MutableRefObject, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import useSvCamera from './SvCamera'
import useSvControls from './SvControls'
import { ambientLight, spotlights } from './SvLighting'
import { fieldMaterial, grayBackground, tubeMaterial } from './SvMaterials'
import useSvRenderer from './SvRenderer'
import { colorizeSurfaces, makeSurfaces, makeTubes, usePositions } from './geometry'

type Props = {
    width: number
    height: number
    canvasRef: MutableRefObject<null | HTMLCanvasElement>
    colorScheme?: SupportedColorMap
    surfaceChecks?: boolean[]
    coils?: Vec3[][]
    surfs?: SurfaceApiResponseObject
}

type Positions = {
    center: THREE.Vector3,
    zOffset: THREE.Vector3
}

const scene = new THREE.Scene()
scene.background = grayBackground

const SimulationView: FunctionComponent<Props> = (props: Props) => {
    const { width, height, canvasRef, coils, surfs, surfaceChecks, colorScheme } = props
    const canvas = canvasRef.current

    const tubes = useMemo(() => {
        const coilTubes = coils === undefined ? [] : makeTubes(coils)
        const coilMeshes = coilTubes.map(c => new THREE.Mesh(c, tubeMaterial))
        return coilMeshes
    }, [coils])

    const surfaces = useMemo(() => {
        const surfaces = surfs === undefined ? [] : makeSurfaces(surfs.surfacePoints)
        if (surfs !== undefined) {
            colorizeSurfaces(surfaces, surfs.pointValues, colorScheme)
        }
        // TODO: Does memoization break this?
        const surfaceMeshes = surfaces.map(s => new THREE.Mesh(s, fieldMaterial))
        return [...surfaceMeshes]
    }, [colorScheme, surfs])

    const objects = useMemo(() => {
        const displayedSurfaces: THREE.Mesh<THREE.BufferGeometry, THREE.Material>[] = []
        const definiteSurfaces = surfaces ?? []
        const definiteChecks = surfaceChecks ?? []
        definiteChecks.forEach((v, idx) => {
            if (v) {
                displayedSurfaces.push(definiteSurfaces[idx])
            }
        })
        return [...tubes, ...displayedSurfaces]
    }, [tubes, surfaces, surfaceChecks])

    const spots = spotlights
    const positions = usePositions(coils)
    const camera = useSvCamera(width, height)
    const controls = useSvControls(canvas, camera)
    const renderer = useSvRenderer(canvas, width, height)

    useEffect(() => {
        updatePositions(camera, controls, positions, spots)
    }, [camera, controls, positions, positions.center, positions.zOffset, spots])


    useEffect(() => {
        if (!scene) return
        if (!controls) return
        if (!camera) return

        scene.clear()

        scene.add(ambientLight)
        spots.forEach(s => scene.add(s))
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
    }, [renderer, camera, controls, height, objects, width, spots])

    return (
        <></>
    )
}


const updatePositions = (camera: THREE.PerspectiveCamera, controls: OrbitControls | undefined, positions: Positions, spots: THREE.SpotLight[] ) => {
    if (!camera) return
    if (!controls) return
    controls.target.copy(positions.center)
    camera.position.copy(positions.center).addScaledVector(positions.zOffset, -1.5)
    // TODO: some more sophisticated logic for spotlighting?
    spots[0].position.copy(positions.center).setZ(-50)
    spots[1].position.copy(positions.center).setZ(50)
}


export default SimulationView