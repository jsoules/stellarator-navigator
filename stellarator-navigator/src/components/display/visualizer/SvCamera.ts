import { useMemo } from 'react'
import * as THREE from 'three'


const useSvCamera = (width: number, height: number) => {
    return useMemo(() => {
        // field-of-view (vertical, in degrees); aspect ratio; near; far -- defines camera frustum
        const camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 100 )
        const pointLight = new THREE.PointLight(0xffffff, 10)
        camera.add(pointLight)
        return camera
    }, [width, height])
}

export default useSvCamera
