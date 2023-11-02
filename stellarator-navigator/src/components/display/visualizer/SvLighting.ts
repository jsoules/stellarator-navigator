import * as THREE from 'three';

export const ambientLight = new THREE.AmbientLight( 0xe0e0e0, 2.0 )
export const spotlights = [
    new THREE.SpotLight( 0xffffff, 5000 ),
    new THREE.SpotLight( 0xffffff, 5000 ),
    // new THREE.PointLight( 0xffffff, 10 )
    // NOTE: Spotlights had been at 5000 intensity, +/- 50 units from Z axis--in case we want to roll back to that
]

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

