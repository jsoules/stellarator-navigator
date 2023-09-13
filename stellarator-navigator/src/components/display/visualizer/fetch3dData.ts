import { useEffect, useMemo, useState } from "react"
import * as THREE from "three"
import { ScalarField, SurfaceApiResponseObject, Vec3, Vec3Field } from "../../../types/Types"
import { SupportedColorMap, valueToRgbTriplet } from "../Colormaps"

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
            .then((coilData) => {
                coilData.forEach((coil: Vec3[]) => coil.push(coil[0]))
                setCoils(coilData)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [recordId])
    return useMemo(() => coils, [coils])
}


export const makeTubes = (coils: Vec3[][]): THREE.TubeGeometry[] => {
    return coils.map(coil => {
        const points = coil.map(c => new THREE.Vector3(...c))
        const curve = new THREE.CatmullRomCurve3(points)
        // path, # tube segments, radius, # radial segments, whether to close the loop
        return new THREE.TubeGeometry(curve, 61, 0.2, 13, true)
    })
}


export const useSurfaces = (props: apiRequestProps) => {
    const { recordId } = props
    const [ response, setResponse ] = useState({} as SurfaceApiResponseObject)

    useEffect(() => {
        fetch(`${SurfacesEndpoint}${recordId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`API endpoint did not return data:\n${response.status} ${response.statusText}`)
                }
                return response.json()
            })
            .then((surfObj) => {
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
        return [x, x+1, x+width, x+1, x+width + 1, x+width]
      })
    }).flat().flat()
}
    

export const makeSurfaces = (surfacePoints: Vec3Field[]) => {
    if (surfacePoints === undefined) return []

    // For each surface, create a BufferGeometry and add the
    // 30 x 30 x [x, y, z] data to that geometry as "known vertices".
    // Then map those points into surfaces by using two triangles per 4-point neighborhood,
    // to create a mapping that says point (x, y) is adjacent to points (x, y+1) and
    // (x + 1, y) (see the triangulateField function).
    
    const surfaces = surfacePoints.map((field) => {
        const surfaceGeometry = new THREE.BufferGeometry()
        const vertices = new Float32Array(field.flat().flat())
        const indices = triangulateField(30, 30)

        surfaceGeometry.setIndex(indices)
        surfaceGeometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3 ))
        surfaceGeometry.computeVertexNormals()

        return surfaceGeometry
    })
    
    return surfaces
}


export const colorizeSurfaces = (surfaces: THREE.BufferGeometry[], scalars: ScalarField[], colormap: SupportedColorMap = 'viridis') => {
    if (scalars === undefined) return []

    surfaces.forEach((s, idx) => {
        const vertexColors = new Float32Array((scalars[idx].flat().map(v => valueToRgbTriplet(v, colormap))).flat())
        s.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3))
        return s
    })

    return surfaces
}

