import { DataGeometry } from "@snTypes/Types"
import { useEffect, useMemo } from "react"
import drawScatter from "./drawScatter"


type ScatterData = {
    width: number,
    height: number,
    data: number[][],
    geometry: DataGeometry
}


const useOffscreenScatterplot = (props: ScatterData) => {
    const { width, height, data, geometry } = props
    const offscreen = useMemo(() => new OffscreenCanvas(width, height), [height, width])

    useEffect(() => {
        const gl = offscreen.getContext("webgl")
        if (gl === null) {
            console.log(`Unable to instantiate webgl context.`)
            return
        }
        drawScatter({ glCtxt: gl, geometry, data })

    }, [offscreen, data, geometry])

    return offscreen
}


export default useOffscreenScatterplot

