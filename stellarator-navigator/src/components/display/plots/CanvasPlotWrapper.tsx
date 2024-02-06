import { BoundedPlotDimensions } from "@snTypes/Types"
import { FunctionComponent, useEffect, useRef, } from "react"
import { useComposedMouseupHandler } from "./interactions/mouseInteractions"
import useDragSelect, { repaintDragSelection } from "./interactions/useDragSelect"
import { plotGutterHorizontal, plotGutterVertical } from "./layout/PlotScaling"
import { PlotFittings } from "./plotFittings/usePlotFittings"
import drawScatter, { dotMargin } from "./webgl/drawScatter"


type Props = {
    dims: BoundedPlotDimensions
    data: number[]
    dotSizes: number[]
    colorValuesRgb: number[]
    highlightedSeries?: number
    colorMap?: string[]
    fineValue?: number
    coarseValue?: number
    isFocus?: boolean
    plotFittings: PlotFittings
    mouseHandler: (e: React.MouseEvent) => void
    dragResolver: (rect: number[]) => void
}


const CanvasPlotWrapper: FunctionComponent<Props> = (props: Props) => {
    const { dims, data, dotSizes, colorValuesRgb, plotFittings, mouseHandler, dragResolver, fineValue, coarseValue } = props
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const dragCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const { onMouseUp, onMouseDown, onMouseMove, dragSelectState } = useDragSelect(dims)
    const composedMouseupHandler = useComposedMouseupHandler(onMouseUp, mouseHandler, dragResolver)

    useEffect(() => {
        const ctxt = canvasRef.current?.getContext("2d")
        if (!canvasRef.current || !ctxt) return
        ctxt.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        plotFittings.canvasPlotLabel(ctxt, {coarseVal: coarseValue, fineVal: fineValue})
        ctxt.save()
        ctxt.translate(dims.marginLeft, dims.marginTop)
        plotFittings.canvasXAxis(ctxt)
        plotFittings.canvasYAxis(ctxt)
        if (plotFittings.offscreenCtxt !== null) {
            plotFittings.loadData(data, dotSizes, colorValuesRgb)
            // const vertexCount = data.reduce((t: number, c) => t + c.length, 0)
            const vertexCount = data.length/2
            drawScatter({glCtxt: plotFittings.offscreenCtxt, vertexCount })
            ctxt.drawImage(plotFittings.offscreenCtxt.canvas, -dotMargin, -dotMargin)
        }
        ctxt.restore()
    }, [coarseValue, colorValuesRgb, data, dims.marginLeft, dims.marginTop, fineValue, dotSizes])
    useEffect(() => {
        const ctxt = dragCanvasRef.current?.getContext("2d")
        if (!dragCanvasRef.current || !ctxt) return
        repaintDragSelection(ctxt, dragSelectState.dragRect, (dragSelectState.isActive ?? false))
    }, [dragSelectState.dragRect, dragSelectState.isActive])

    return (
        <div
            style={{ 
                // height: dims.height,
                marginBottom: plotGutterHorizontal/2,
                marginTop: plotGutterHorizontal/2,
                marginLeft: plotGutterVertical/2,
                marginRight: plotGutterVertical/2,
                position: "relative"
            }}
            // TODO: also go to unhighlighted if the data table is hidden
            className={props.isFocus ? 'highlightedPlot' : 'unhighlightedPlot'}
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
            <div className="plotCaption">N = {data.length/2}</div>
      </div>
    )
}

export default CanvasPlotWrapper
