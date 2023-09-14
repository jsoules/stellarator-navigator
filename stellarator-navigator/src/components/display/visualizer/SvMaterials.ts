
import * as THREE from 'three';

export const grayBackground = new THREE.Color( 0x444444 )
export const fieldMaterial = new THREE.MeshStandardMaterial({
    color: 'white',
    flatShading: false,
    side: THREE.DoubleSide,
    // side: THREE.FrontSide,
    vertexColors: true,
    wireframe: false
})
export const tubeMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 })
// a useful alternative for testing
export const redTubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 })

