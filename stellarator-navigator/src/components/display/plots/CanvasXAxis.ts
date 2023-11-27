import { BoundedPlotDimensions } from "@snTypes/Types"
import { AxisDescriptor, DescribeAxis, TickDescriptor } from "./AxisGeometry"

// TODO: Consider unifying this with the y-axis drawing--may or may not be worthwhile
// --> actually if we used rotations, we could probably draw axes at arbitrary angles...
// --> that sounds super gimmicky and not actually helpful!

const drawAxisSpine = (ctxt: CanvasRenderingContext2D, canvasRange: number[], tickLength: number) => {
    ctxt.beginPath()
    ctxt.moveTo(canvasRange[0], tickLength)
    ctxt.lineTo(canvasRange[0], 0)
    ctxt.lineTo(canvasRange[1], 0)
    ctxt.lineTo(canvasRange[1], tickLength)
    ctxt.stroke()
}


const drawTick = (tick: TickDescriptor, ctxt: CanvasRenderingContext2D, tickLength: number) => {
    const { offset, label } = tick
    ctxt.beginPath()
    ctxt.moveTo(offset, 0)
    ctxt.lineTo(offset, tickLength)
    ctxt.stroke()
    // 2x ticklength is a bit of kludge; consider doing something better
    if (label !== '') {
        ctxt.fillText(label, offset, 2 * tickLength)
    }
}


const drawAxisLabel = (ctxt: CanvasRenderingContext2D, dims: BoundedPlotDimensions, axisLabel: string) => {
    ctxt.font = `${1.5 * dims.fontPx}px sans-serif`
    ctxt.fillText(axisLabel, dims.boundedWidth/2, 3 * dims.fontPx)
}


const CanvasXAxis = (props: AxisDescriptor, ctxt: CanvasRenderingContext2D) => {
    const { canvasRange, axisLabel, dims } = props
    const { ticks } = DescribeAxis(props)

    ctxt.save()
    // wrap everything in a transform of boundedHeight so we can draw at 0 and get the
    // proper x-axis location. Note we should already be in a transform that applies
    // the top margin.
    ctxt.translate(0, dims.boundedHeight)
    drawAxisSpine(ctxt, canvasRange, dims.tickLength)

    ctxt.font = `${dims.fontPx}px sans-serif`
    ctxt.textAlign = 'center'
    ctxt.textBaseline = 'top'
    ticks.forEach(tick => drawTick(tick, ctxt, dims.tickLength))

    drawAxisLabel(ctxt, dims, axisLabel)
    ctxt.restore()
}

export default CanvasXAxis
