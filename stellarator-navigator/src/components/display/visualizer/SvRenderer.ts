import { useMemo } from 'react'
import * as THREE from 'three'

const useSvRenderer = (canvas: HTMLCanvasElement | null, width: number, height: number) => {
    return useMemo(() => {
        const _canvas = canvas ?? undefined
        const renderer = new THREE.WebGLRenderer({ canvas: _canvas });
        renderer.setSize( width, height );
        return renderer
    }, [canvas, width, height])
}

export default useSvRenderer
