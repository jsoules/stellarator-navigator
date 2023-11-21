import { BoundedPlotDimensions } from "@snTypes/Types"
import { FunctionComponent, useEffect, useRef, } from "react"
import { plotGutterHorizontal, plotGutterVertical } from "./PlotScaling"
import drawScatter, { dotMargin } from "./webgl/drawScatter"

type Props = {
    dims: BoundedPlotDimensions
    data: number[][]
    highlightedSeries?: number
    colorMap?: string[]
    canvasXAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasYAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasPlotLabel: (ctxt: CanvasRenderingContext2D) => void
    markedIds?: Set<number>
    nfpValue: number
    ncPerHpValue?: number
    clickHandler: (nfp: number, nc?: number) => void
    scatterCtxt: WebGLRenderingContext | null
    loadData: (data: number[][]) => void
}


const CanvasPlotWrapper: FunctionComponent<Props> = (props: Props) => {
    const { dims, data, canvasYAxis, canvasXAxis, canvasPlotLabel, scatterCtxt, loadData } = props
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        // TODO: NEED TO ATTACH A CLICK HANDLER TO THE CANVAS ELEMENT
        // TODO: AND ALSO WRITE A DRAG HANDLER FOR DRAG-ZOOM
        const ctxt = canvasRef.current?.getContext("2d")
        if (!canvasRef.current || !ctxt) return
        ctxt.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        canvasPlotLabel(ctxt)
        ctxt.save()
        ctxt.translate(dims.marginLeft, dims.marginRight)
        canvasXAxis(ctxt)
        canvasYAxis(ctxt)
        if (scatterCtxt !== null) {
            loadData(data)
            const vertexCount = data.reduce((t: number, c) => t + c.length, 0)
            drawScatter({glCtxt: scatterCtxt, vertexCount })
            ctxt.drawImage(scatterCtxt.canvas, -dotMargin, -dotMargin)
        }
        ctxt.restore()
    }, [canvasPlotLabel, canvasXAxis, canvasYAxis, data, dims.marginLeft, dims.marginRight, loadData, scatterCtxt])

    return (
        <div
            style={{ height: dims.height + plotGutterHorizontal, marginLeft: plotGutterVertical/2, marginRight: plotGutterVertical/2 }}
        >
            {/* TODO -- add accessibility by providing fallback content inside the (non-singelton) canvas tag */}
            <canvas ref={canvasRef} width={dims.width} height={dims.height}></canvas>
      </div>
    )
}

export default CanvasPlotWrapper
