import { BoundedPlotDimensions } from "@snTypes/Types"

type plotLabelProps = {
    dims: BoundedPlotDimensions
    // TODO: Pass in and print out the filtering values
}

const CanvasPlotLabel = (props: plotLabelProps, ctxt: CanvasRenderingContext2D) => {
    const { dims } = props
    ctxt.save()
    ctxt.font = `${1.7*dims.fontPx}px sans-serif`
    ctxt.textAlign = "center"
    const mid = dims.marginLeft + dims.boundedWidth / 2
    const y = 1.7*dims.fontPx
    // TODO: THIS SHOULD BE GENERALIZED FOR THE SELECTED ROW/COLUMN VARS
    ctxt.fillText(`NFP = WHATEVER; NC/HP = WHATEVER`, mid, y)
    ctxt.restore()
}

export default CanvasPlotLabel
