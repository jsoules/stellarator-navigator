import { DependentVariables, IndependentVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, StellaratorRecord } from "@snTypes/Types"
import { ScaleLinear } from "d3"
// import { FunctionComponent, useEffect, useMemo, useRef, } from "react"
import { FunctionComponent, useEffect, useRef, } from "react"
import { plotGutterHorizontal, plotGutterVertical } from "./PlotScaling"

type Props = {
    dims: BoundedPlotDimensions
    data: StellaratorRecord[]
    dependentVar: DependentVariables
    independentVar: IndependentVariables
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never>
    highlightedSeries?: number
    colorMap?: string[]
    xAxis?: JSX.Element
    yAxis?: JSX.Element
    canvasXAxis: () => void
    canvasYAxis: (ctxt: CanvasRenderingContext2D) => void
    // This is technically a logic concern, however we'd like to use it to label the plots.
    // If we keep the logic internal, we can ensure that being passed wrong data does not
    // result in a plot which is incorrectly labeled.
    markedIds?: Set<number>
    nfpValue: number
    ncPerHpValue?: number
    clickHandler: (nfp: number, nc?: number) => void
}


const CanvasPlotWrapper: FunctionComponent<Props> = (props: Props) => {
    const { dims, canvasYAxis, canvasXAxis, nfpValue, ncPerHpValue } = props
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    // const contentScaleTransform = useMemo(() =>
    //     `translate(${dims.marginLeft},${dims.marginTop})`,
    //     [dims.marginLeft, dims.marginTop]
    // )

    useEffect(() => {
        const ctxt = canvasRef.current?.getContext("2d")
        if (!canvasRef.current || !ctxt) return
        ctxt.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        // Do title --> TODO: extract this and pass in a la the x and y axes?
        ctxt.save()
        ctxt.font = `${1.7*dims.fontPx}px sans-serif`
        ctxt.textAlign = "center"
        const mid = dims.marginLeft + dims.boundedWidth / 2
        const y = 1.7*dims.fontPx
        ctxt.fillText(`NFP = ${nfpValue}; NC/HP = ${ncPerHpValue ?? 'All'}`, mid, y)
        ctxt.restore()
        ctxt.save()
        ctxt.translate(dims.marginLeft, dims.marginTop)
        canvasXAxis()
        canvasYAxis(ctxt)
        ctxt.restore()
    }, [canvasXAxis, canvasYAxis, dims.boundedWidth, dims.fontPx, dims.marginLeft, dims.marginTop, ncPerHpValue, nfpValue])

    return (
        <div
            style={{ height: dims.height + plotGutterHorizontal, marginLeft: plotGutterVertical/2, marginRight: plotGutterVertical/2 }}
        >
            {/* TODO -- add accessibility by providing fallback content inside the (non-singelton) canvas tag */}
            <canvas ref={canvasRef} width={dims.width} height={dims.height}></canvas>
            {/* DO THIS PROPERLY -- Label should be its own component at this point */}
            {/* <svg width={dims.width} height={dims.height} onClick={() => clickHandler(nfpValue, ncPerHpValue)}>
                <g transform={contentScaleTransform} key="plot-content">
                    {xAxis}
                    {yAxis}
                    SCATTERPLOT --> this is where we care about the content-scale transform probably
                </g>
            </svg> */}
      </div>
    )
}

export default CanvasPlotWrapper
