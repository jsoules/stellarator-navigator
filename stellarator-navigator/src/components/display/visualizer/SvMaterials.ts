
import { SupportedColorMap, valueToRgbTriplet } from '@snDisplayComponents/Colormaps';
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

// We're not going to fuss over trying to cache the materials,
// because we expect O(10) curves per device, so the savings
// would likely be minimal
export const getScaledTubeMaterial = (value: number, scheme: SupportedColorMap): THREE.MeshPhongMaterial => {
    const rgb = valueToRgbTriplet(value, scheme)
    return new THREE.MeshPhongMaterial({ color: new THREE.Color(rgb[0], rgb[1], rgb[2]) })
}