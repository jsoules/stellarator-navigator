import { useEffect, useMemo, useState } from "react"
import * as THREE from "three"
// import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils'
import { ScalarField, SurfaceApiResponseObject, Vec3, Vec3Field } from "../../types/Types"
import { valueToRgbTriplet } from "./Colormaps"

type apiRequestProps = {
    recordId: string
}

const CurvesEndpoint = "http://127.0.0.1:5000/api/curves/"
const SurfacesEndpoint = "http://127.0.0.1:5000/api/surfaces/"


// const makeFilePath = (recordId: string): string => {
//     const prefix = recordId.substring(0, recordId.length - 3)
//     return (`../../../database/curves/${prefix}/curves${recordId}.txt`)
// }


// const reshape = <T>(arr: T[], size: number) => {
//     return arr.reduce((newArray: T[][], value: T, idx: number) => {
//         idx % size === 0 ? newArray.push([value]) : newArray[newArray.length -1].push(value)
//         return newArray
//     }, [])
// }


// Actually we're doing this server-side
// const reshapeVec3Records = (raw: number[][]): Vec3[][] => {
//     // Okay, so assume we can get the data files to load as number arrays, delimited by line break.
//     // This should give 60 records of length 3*n, where n is the number of coils per half-period.
//     // These are flattened: x0 y0 z0 x1 y1 z1 ... xn yn zn.
//     // What we want to return is an array of arrays of Vec3, where each array is the circuit of ONE loop.
//     // i.e. de-flatten the records, then slice by column.
//     const vec3ized = raw.map(row => reshape(row, 3) as unknown as Vec3[])
//     // vec3ized is now X rows of N Vec3-points, where the Xth row is the Xth point of one coil,
//     // and N is the total number of coils per half-period.
//     // So basically we need to transpose it. There are one-liners for this
//     // (see https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript),
//     // but hopefully this is a trifle more legible:
//     const coilCount = vec3ized[0].length
//     const coils = Array.from({length: coilCount}, () => [] as Vec3[])
//     vec3ized.forEach(row => {
//         row.forEach((point, i) => coils[i].push(point))
//     })
//     // coils should now be N lists of X (usually 60) points each that represent all the points
//     // in one coil/loop. However, we want to add the first element as the last element to create
//     // a closed loop just to be sure. (We might be able to do this in Three as well, but...)
//     coils.forEach(loop => loop.push(loop[0]))
//     return coils
// }


export const useCoils = (props: apiRequestProps) => {
    const { recordId } = props
    const [ coils, setCoils ] = useState([])
    useEffect(() => {
        fetch(`${CurvesEndpoint}${recordId}`)
            .then((response) => response.json())
            // .then((response) => {console.log(response); return response.json()})
            .then((coilData) => {
                // console.log(coilData)
                coilData.forEach((coil: Vec3[]) => coil.push(coil[0]))
                setCoils(coilData)
                // console.log(wrapped)
                // setCoils(coilData)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [recordId])
    return useMemo(() => coils, [coils])
}


export const getTubes = (coils: Vec3[][], makeRed?: boolean): THREE.Mesh[] => {
    const meshes: THREE.Mesh[] = []
    // const material = new THREE.MeshBasicMaterial({ color: 0xe0e0e0 })
    const material = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 })
    const redMat = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    coils.forEach(coil => {
        const points = coil.map(c => new THREE.Vector3(...c))
        const curve = new THREE.CatmullRomCurve3(points)
        // path, # tube segments, radius, # radial segments, whether to close the loop
        const geometry = new THREE.TubeGeometry(curve, 61, 0.2, 13, true)
        const mesh = new THREE.Mesh( geometry, makeRed ? redMat : material )
        meshes.push(mesh)
    })
    return meshes
}


export const useSurfaces = (props: apiRequestProps) => {
    const { recordId } = props
    const [ response, setResponse ] = useState({} as SurfaceApiResponseObject)

    useEffect(() => {
        fetch(`${SurfacesEndpoint}${recordId}`)
            .then((response) => response.json())
            .then((surfObj) => {
                // console.log(surfObj)
                const surface: SurfaceApiResponseObject = {
                    surfacePoints: surfObj.surfacePoints,
                    pointValues: surfObj.pointValues
                }
                setResponse(surface)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [recordId])
    return useMemo(() => response, [response])
}


const triangulateField = (width: number, height: number): number[] => {
    return Array(height - 1).fill(0).map((_, h) => {
      return Array(width - 1).fill(0).map((__, w) => {
        const rowOffset = width * h
        const x = rowOffset + w
        // return [x, x+1, x+width, x+1, x+width, x+width+1]
        return [x, x+1, x+width, x+1, x+width + 1, x+width]
      })
    }).flat().flat()
}
    

export const getSurfaces = (surfacePoints: Vec3Field[], pointValues: ScalarField[]) => {
    if (surfacePoints === undefined || pointValues === undefined) return []

    // For each surface (if any), we'll create a BufferGeometry and add the
    // 30 x 30 x [x, y, z] data to that geometry as "known vertices".
    // We map those points to surfaces by using two triangles per 4-point neighborhood,
    // to create a mapping that says point (x, y) is adjacent to points (x, y+1) and
    // (x + 1, y) (see the triangulateField function).
    // Then give it a white mesh with vertex coloring per the pointValues parameter.
    
    const surfaces = surfacePoints.map((field, idx) => {
        const surfaceGeometry = new THREE.BufferGeometry()
        const vertices = new Float32Array(field.flat().flat())
        const indices = triangulateField(30, 30)

        surfaceGeometry.setIndex(indices)
        surfaceGeometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3 ))


        if (idx === 5) {
            console.log(`vertex values:\n${pointValues[idx]}`)
        }
        const color = new Float32Array((pointValues[idx].flat().map(v => valueToRgbTriplet(v, 'plasma'))).flat())
        surfaceGeometry.setAttribute('color', new THREE.BufferAttribute(color, 3))

        // this line probably does nothing as I'm already using indexed
        const sg = BufferGeometryUtils.mergeVertices(surfaceGeometry)
        sg.computeVertexNormals()  // todo: does this actually do anything?
        surfaceGeometry.computeVertexNormals()

        // const material = new THREE.MeshPhongMaterial({
        const material = new THREE.MeshStandardMaterial({
            color: 'white',
            flatShading: false,
            side: THREE.DoubleSide,
            // side: THREE.FrontSide,
            vertexColors: true,
            wireframe: false
        })
        
        // const mesh = new THREE.Mesh(sg, material)
        const mesh = new THREE.Mesh(surfaceGeometry, material)
        return mesh
    })
    
    return surfaces
}
