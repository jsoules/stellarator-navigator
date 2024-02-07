import { SupportedColorMap, valueToRgbTriplet } from "@snComponents/display/Colormaps"
import CanvasXAxis from "@snComponents/display/plots/plotFittings/CanvasXAxis"
import { DependentVariables, Fields, getLabel } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions } from "@snTypes/Types"
import { FunctionComponent, useCallback, useEffect, useRef } from "react"


type ColorBarProps = {
    field: DependentVariables
    style: SupportedColorMap
    visRange: number[]
}

// TODO: Restrict the width of this thing
// TODO: How committed are we to these hard-coded dimensions.

const barContentHeight = 20
const barContentWidth = 460
const fontPx = 10
const baseDims = {
    marginTop: 10,
    marginBottom: 45,
    marginRight: 20,
    marginLeft: 20,
    tickLength: 6,
    fontPx: fontPx,
    pixelsPerTick: 3 * fontPx,
    height: barContentHeight + 10 + 45,
    width: barContentWidth + 20 + 20,
    axisLabelOffset: 15,
}
const dims: BoundedPlotDimensions = {...baseDims,
    boundedHeight: baseDims.height - baseDims.marginTop - baseDims.marginBottom,
    boundedWidth: baseDims.width - baseDims.marginLeft - baseDims.marginRight,
    clipAvoidanceXOffset: 0,
    clipAvoidanceYOffset: 0
}


const drawObs = (c: CanvasRenderingContext2D, x: number, width: number, scheme: SupportedColorMap) => {
    const rgb = valueToRgbTriplet(x / width, scheme)
    const color = rgb.map(v => Math.floor(255 * v))
    c.strokeStyle = `rgb(${color[0]} ${color[1]} ${color[2]})`
    c.beginPath()
    c.moveTo(x, barContentHeight)
    c.lineTo(x, 0)
    c.stroke()
}



const ColorBar: FunctionComponent<ColorBarProps> = (props: ColorBarProps) => {
    const { field, visRange, style } = props
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const baseline = useCallback((c: CanvasRenderingContext2D) => {
        const axisLabel = getLabel({name: field, labelType: 'plot' })
        CanvasXAxis({
            dataRange: visRange,
            canvasRange: [0, dims.boundedWidth],
            axisLabel,
            isLog: Fields[field].isLog,
            markedValue: undefined,
            dims
        }, c)
    }, [visRange, field])

    useEffect(() => {
        const ctxt = canvasRef.current?.getContext("2d")
        if (!canvasRef.current || !ctxt) return
        ctxt.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctxt.save()
        ctxt.translate(dims.marginLeft, dims.marginTop)
        baseline(ctxt)
        // TODO: actually draw the color bar
        for(let i = 0; i <= barContentWidth; i++) {
            drawObs(ctxt, i, barContentWidth, style)
        }
        ctxt.restore()
    }, [baseline, style])

    return <div>
        <div className="legendHeader">Color Bar</div>
        <canvas ref={canvasRef} width={`${dims.width}px`} height={`${dims.height}px`}>
            Color bar for the continuous-valued variable used to color the above plots.
        </canvas>
    </div>
}

export default ColorBar
