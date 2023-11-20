import { DataGeometry } from "@snTypes/Types"
import { useEffect, useMemo } from "react"
import drawScatter from "./drawScatter"


type ScatterData = {
    width: number,
    height: number,
    data: number[][],
    geometry: DataGeometry,
    colorList: number[][]
}


const useOffscreenScatterplot = (props: ScatterData) => {
    const { width, height, data, geometry, colorList } = props
    const offscreen = useMemo(() => new OffscreenCanvas(width, height), [height, width])

    useEffect(() => {
        const gl = offscreen.getContext("webgl")
        if (gl === null) {
            console.log(`Unable to instantiate webgl context.`)
            return
        }
        drawScatter({ glCtxt: gl, geometry, colorList, data })

    }, [offscreen, data, geometry, colorList])

    return offscreen
}


export default useOffscreenScatterplot

