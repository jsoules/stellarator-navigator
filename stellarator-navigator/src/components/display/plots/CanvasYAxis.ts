import { BoundedPlotDimensions } from "@snTypes/Types";
import { AxisDescriptor, DescribeAxis, TickDescriptor, markLineColor } from "./AxisGeometry";

const lightStrokeStyle = "#cbcbcb"


const drawAxisSpine = (ctxt: CanvasRenderingContext2D, canvasRange: number[], tickLength: number) => {
    ctxt.beginPath()
    ctxt.moveTo(-tickLength, canvasRange[0])
    ctxt.lineTo(0, canvasRange[0])
    ctxt.lineTo(0, canvasRange[1])
    ctxt.lineTo(-tickLength, canvasRange[1])
    ctxt.stroke()

}

const drawTick = (tick: TickDescriptor, ctxt: CanvasRenderingContext2D, tickLength: number, boundedWidth: number) => {
    const { offset, label, majorTick } = tick
    const originalStrokeStyle = ctxt.strokeStyle
    ctxt.beginPath()
    ctxt.moveTo(-tickLength, offset)
    ctxt.lineTo(0, offset)
    ctxt.stroke()
    if (label !== '') {
        ctxt.fillText(label, -2 * tickLength, offset)
    }
    if (majorTick) {
        ctxt.beginPath()
        ctxt.strokeStyle = lightStrokeStyle
        ctxt.moveTo(0, offset)
        ctxt.lineTo(boundedWidth, offset)
        ctxt.stroke()
        // We may do this several times, no need to go through a full save/restore
        ctxt.strokeStyle = originalStrokeStyle
    }
}


const drawMarkedLine = (ctxt: CanvasRenderingContext2D, markedLine: number, boundedWidth: number) => {
    ctxt.save()
    ctxt.strokeStyle = markLineColor
    ctxt.lineWidth = 2
    ctxt.beginPath()
    ctxt.moveTo(0, markedLine)
    ctxt.lineTo(boundedWidth, markedLine)
    ctxt.stroke()
    ctxt.restore()
}


const drawAxisLabel = (ctxt: CanvasRenderingContext2D, dims: BoundedPlotDimensions, axisLabel: string) => {
    ctxt.save()
    ctxt.font = `${1.5*dims.fontPx}px sans-serif`
    ctxt.textAlign = 'center'
    ctxt.textBaseline = 'bottom'
    // TODO: Simplify the following.
    // Currently the x-position is a lot of legacy nonsense, because the SVG version has several layers of
    // composed transitions and the chosen (standard) offsets depend on it being cumulative.
    // At the very least we can simplify the names...
    // As for the y-position, remember we're already in a transpose that accounts for the margins.
    const textPosition = [-(dims.axisLabelOffset + dims.clipAvoidanceXOffset + dims.tickLength), (dims.boundedHeight/2)]
    ctxt.translate(textPosition[0], textPosition[1])
    ctxt.rotate(-(Math.PI / 2))
    ctxt.translate(-textPosition[0], -textPosition[1])
    ctxt.fillText(axisLabel, textPosition[0], textPosition[1])
    ctxt.restore()
}


const CanvasYAxis = (props: AxisDescriptor, ctxt: CanvasRenderingContext2D) => {
    const { canvasRange, axisLabel, dims } = props
    const { ticks, markedLine } = DescribeAxis(props)

    ctxt.save()
    drawAxisSpine(ctxt, canvasRange, dims.tickLength)
    
    ctxt.font = `${dims.fontPx}px sans-serif`
    ctxt.textAlign = "end"
    ctxt.textBaseline = "middle"
    ticks.forEach(tick => drawTick(tick, ctxt, dims.tickLength, dims.boundedWidth))

    if (markedLine) {
        drawMarkedLine(ctxt, markedLine, dims.boundedWidth)
    }
    
    drawAxisLabel(ctxt, dims, axisLabel)
    ctxt.restore()
}

export default CanvasYAxis
