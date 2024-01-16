import { BoundedPlotDimensions } from "@snTypes/Types"
import { FunctionComponent, useEffect, useRef, } from "react"
import { CanvasPlotLabelCallbackType } from "./CanvasPlotLabel"
import { plotGutterHorizontal, plotGutterVertical } from "./PlotScaling"
import { useComposedMouseupHandler } from "./interactions/mouseInteractions"
import useDragSelect, { repaintDragSelection } from "./interactions/useDragSelect"
import drawScatter, { dotMargin } from "./webgl/drawScatter"
import { ScatterDataLoaderType } from "./webgl/drawingProgram"

type Props = {
    dims: BoundedPlotDimensions
    data: number[]
    dotSizes: number[]
    colorValuesRgb: number[]
    highlightedSeries?: number
    colorMap?: string[]
    canvasXAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasYAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasPlotLabel: CanvasPlotLabelCallbackType
    fineValue?: number
    coarseValue?: number
    mouseHandler: (e: React.MouseEvent) => void
    dragResolver: (rect: number[]) => void
    scatterCtxt: WebGLRenderingContext | null
    loadData: ScatterDataLoaderType
}


const CanvasPlotWrapper: FunctionComponent<Props> = (props: Props) => {
    const { dims, data, dotSizes, colorValuesRgb, canvasYAxis, canvasXAxis, canvasPlotLabel, scatterCtxt, mouseHandler, dragResolver, loadData, fineValue, coarseValue } = props
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const dragCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const { onMouseUp, onMouseDown, onMouseMove, dragSelectState } = useDragSelect(dims)
    const composedMouseupHandler = useComposedMouseupHandler(onMouseUp, mouseHandler, dragResolver)

    useEffect(() => {
        const ctxt = canvasRef.current?.getContext("2d")
        if (!canvasRef.current || !ctxt) return
        ctxt.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        canvasPlotLabel(ctxt, {coarseVal: coarseValue, fineVal: fineValue})
        ctxt.save()
        ctxt.translate(dims.marginLeft, dims.marginTop)
        canvasXAxis(ctxt)
        canvasYAxis(ctxt)
        if (scatterCtxt !== null) {
            // Assertions: should never happen
            if (data === undefined) throw Error("Data undefined")
            if (data.some(d => d === undefined)) throw Error("Data contains undefined elements")
            loadData(data, dotSizes, colorValuesRgb)
            // const vertexCount = data.reduce((t: number, c) => t + c.length, 0)
            const vertexCount = data.length/2
            drawScatter({glCtxt: scatterCtxt, vertexCount })
            ctxt.drawImage(scatterCtxt.canvas, -dotMargin, -dotMargin)
        }
        ctxt.restore()
    }, [canvasPlotLabel, canvasXAxis, canvasYAxis, coarseValue, colorValuesRgb, data, dims.marginLeft, dims.marginTop, fineValue, loadData, scatterCtxt, dotSizes])
    useEffect(() => {
        const ctxt = dragCanvasRef.current?.getContext("2d")
        if (!dragCanvasRef.current || !ctxt) return
        repaintDragSelection(ctxt, dragSelectState.dragRect, (dragSelectState.isActive || false))
    }, [dragSelectState.dragRect, dragSelectState.isActive])

    return (
        <div
            style={{ height: dims.height,
                marginBottom: plotGutterHorizontal/2,
                marginTop: plotGutterHorizontal/2,
                marginLeft: plotGutterVertical/2,
                marginRight: plotGutterVertical/2,
                position: "relative"
            }}
            onMouseDown={onMouseDown}
            onMouseUp={composedMouseupHandler}
            onMouseMove={onMouseMove}
        >
            <canvas ref={canvasRef} width={dims.width} height={dims.height}>
                Scatterplot displaying devices which conform to the specified filters.
            </canvas>
            <canvas ref={dragCanvasRef} width={dims.width} height={dims.height}
                style={{top: 0, left: 0, position: 'absolute'}}>
                Canvas overlay displaying drag selection.
            </canvas>
      </div>
    )
}

export default CanvasPlotWrapper
