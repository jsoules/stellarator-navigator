import { AxisDescriptor, DescribeAxis, markLineColor } from "./AxisGeometry";


const CanvasYAxis = (props: AxisDescriptor, ctxt: CanvasRenderingContext2D) => {
    const { canvasRange, axisLabel, dims } = props

    const { ticks, markedLine } = DescribeAxis(props)

    ctxt.save()
    ctxt.font = `${dims.fontPx}px sans-serif`
    ctxt.textAlign = "end"
    ctxt.textBaseline = "middle"

    ctxt.beginPath()
    ctxt.moveTo(-dims.tickLength, canvasRange[0])
    ctxt.lineTo(0, canvasRange[0])
    ctxt.lineTo(0, canvasRange[1])
    ctxt.lineTo(-dims.tickLength, canvasRange[1])
    ctxt.stroke()

    ticks.forEach(({ offset, label, majorTick }) => {
        ctxt.beginPath()
        ctxt.moveTo(-dims.tickLength, offset)
        ctxt.lineTo(0, offset)
        ctxt.stroke()
        if (label !== '') {
            ctxt.fillText(label, -2 * dims.tickLength, offset)
        }
        if (majorTick) {
            ctxt.beginPath()
            ctxt.strokeStyle = "#cbcbcb"
            ctxt.moveTo(0, offset)
            ctxt.lineTo(dims.boundedWidth, offset)
            ctxt.stroke()
            ctxt.strokeStyle = "#000000"
        }
    })

    if (markedLine) {
        ctxt.strokeStyle = markLineColor
        ctxt.lineWidth = 2
        ctxt.beginPath()
        ctxt.moveTo(0, markedLine)
        ctxt.lineTo(dims.boundedWidth, markedLine)
        ctxt.stroke()
        ctxt.strokeStyle = "#000000"
        ctxt.lineWidth = 1
    }
    // Label the axis, which requires a rotation that WILL BE DIFFERENT from the SVG version
    console.log(`Draw the axis label ${axisLabel}`)
    ctxt.font = `${1.5*dims.fontPx}px sans-serif`
    ctxt.textAlign = 'center'
    const text = ctxt.measureText(axisLabel)
    const textPosition = [-dims.axisLabelOffset, (dims.boundedHeight/2) + dims.marginTop]
    const textDims = [1.5*dims.fontPx, text.width]
    ctxt.translate(textPosition[0], textPosition[1])
    ctxt.rotate(-(Math.PI / 2))
    ctxt.translate(-textPosition[0], -textPosition[1])
    ctxt.fillText(axisLabel, textDims[0] - dims.axisLabelOffset, textDims[1])
    ctxt.restore()
}

export default CanvasYAxis
