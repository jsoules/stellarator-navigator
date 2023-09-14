import { useMemo } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const useSvControls = (canvas: HTMLCanvasElement | null, camera: THREE.PerspectiveCamera | undefined) => {
    return useMemo(() => {
        if (canvas === null) return undefined
        if (!camera) return undefined
        const controls = new OrbitControls( camera, canvas )
        return controls
    }, [camera, canvas])
}

export default useSvControls
