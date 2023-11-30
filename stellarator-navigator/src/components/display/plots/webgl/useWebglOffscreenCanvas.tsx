import initProgram from "@snComponents/display/plots/webgl/drawingProgram"
import { BoundedPlotDimensions, DataGeometry } from "@snTypes/Types"
import { useMemo } from "react"


const useWebglOffscreenCanvas = (dataGeometry: DataGeometry, dims: BoundedPlotDimensions) => {
    const { webglCtxt, configureCanvas } = useMemo(() => {
        const offscreenCanvas = new OffscreenCanvas(10, 10)
        const webglCtxt = offscreenCanvas.getContext("webgl")
        const configureCanvas = initProgram(webglCtxt)
        return { webglCtxt, configureCanvas }
    }, [])
    const loadData = useMemo(() => configureCanvas(dataGeometry, dims.boundedWidth, dims.boundedHeight),
        [configureCanvas, dataGeometry, dims.boundedWidth, dims.boundedHeight])
    return { webglCtxt, loadData }
}

export default useWebglOffscreenCanvas 