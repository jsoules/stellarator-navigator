import { BoundedPlotDimensions } from "@snTypes/Types"
import { FunctionComponent, useEffect, useRef, } from "react"
import { CanvasPlotLabelCallbackType } from "./CanvasPlotLabel"
import { plotGutterHorizontal, plotGutterVertical } from "./PlotScaling"
import drawScatter, { dotMargin } from "./webgl/drawScatter"
import { ScatterDataLoaderType } from "./webgl/drawingProgram"

type Props = {
    dims: BoundedPlotDimensions
    data: number[][]
    sizes: number[][]
    highlightedSeries?: number
    colorMap?: string[]
    canvasXAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasYAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasPlotLabel: CanvasPlotLabelCallbackType
    fineValue?: number
    coarseValue?: number
    clickHandler: () => void
    scatterCtxt: WebGLRenderingContext | null
    loadData: ScatterDataLoaderType
}


const CanvasPlotWrapper: FunctionComponent<Props> = (props: Props) => {
    const { dims, data, sizes, canvasYAxis, canvasXAxis, canvasPlotLabel, scatterCtxt, clickHandler, loadData, fineValue, coarseValue } = props
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        // TODO: NEED TO ATTACH A CLICK HANDLER TO THE CANVAS ELEMENT --> that handles clicking the dots, i.e. has to be more
        // advanced than the one that gets passed in which just adjusts the table
        // TODO: AND ALSO WRITE A DRAG HANDLER FOR DRAG-ZOOM
        const ctxt = canvasRef.current?.getContext("2d")
        if (!canvasRef.current || !ctxt) return
        ctxt.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        canvasPlotLabel(ctxt, {coarseVal: coarseValue, fineVal: fineValue})
        ctxt.save()
        ctxt.translate(dims.marginLeft, dims.marginRight)
        canvasXAxis(ctxt)
        canvasYAxis(ctxt)
        if (scatterCtxt !== null) {
            // Assertions: should never happen
            if (data === undefined) throw Error("Data undefined")
            if (data.some(d => d === undefined)) throw Error("Data contains undefined elements")
            loadData(data, sizes)
            const vertexCount = data.reduce((t: number, c) => t + c.length, 0)
            drawScatter({glCtxt: scatterCtxt, vertexCount })
            ctxt.drawImage(scatterCtxt.canvas, -dotMargin, -dotMargin)
        }
        ctxt.restore()
    }, [canvasPlotLabel, canvasXAxis, canvasYAxis, coarseValue, data, dims.marginLeft, dims.marginRight, fineValue, loadData, scatterCtxt, sizes])

    return (
        <div
            style={{ height: dims.height + plotGutterHorizontal, marginLeft: plotGutterVertical/2, marginRight: plotGutterVertical/2 }}
        >
            <canvas ref={canvasRef} width={dims.width} height={dims.height} onClick={clickHandler}>
                Scatterplot displaying devices which conform to the specified filters.
            </canvas>
      </div>
    )
}

export default CanvasPlotWrapper
