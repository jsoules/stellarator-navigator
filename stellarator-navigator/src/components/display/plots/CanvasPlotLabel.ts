import { Fields, KnownFields, ToggleableVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions } from "@snTypes/Types"

type plotLabelProps = {
    dims: BoundedPlotDimensions
    coarseField?: ToggleableVariables
    medField?: ToggleableVariables
    // TODO: Pass in and print out the filtering values
}

type fieldVals = {
    coarseVal?: number
    medVal?: number
}

export type CanvasPlotLabelCallbackType = (ctxt: CanvasRenderingContext2D, vals: fieldVals) => void


const CanvasPlotLabel = (props: plotLabelProps, ctxt: CanvasRenderingContext2D, vals: fieldVals) => {
    const { dims, coarseField, medField } = props
    const { coarseVal, medVal } = vals
    const coarseDesc = Fields[coarseField as unknown as KnownFields]?.shortLabel ?? ''
    const medDesc = Fields[medField as unknown as KnownFields]?.shortLabel ?? ''
    const coarseBlurb = coarseDesc === '' ? '' : `${coarseDesc}: ${coarseVal === undefined ? 'Any' : coarseVal}`
    const medBlurb = medDesc === '' ? '' : `${medDesc}: ${medVal === undefined ? 'Any' : medVal}`
    const text = (coarseBlurb !== '' && medBlurb !== '') ? `${coarseBlurb}; ${medBlurb}` : `${coarseBlurb}${medBlurb}`
    ctxt.save()
    ctxt.font = `${1.7*dims.fontPx}px sans-serif`
    ctxt.textAlign = "center"
    const mid = dims.marginLeft + dims.boundedWidth / 2
    const y = 1.4*dims.fontPx
    // TODO: THIS SHOULD BE GENERALIZED FOR THE SELECTED ROW/COLUMN VARS
    ctxt.fillText(text, mid, y)
    ctxt.restore()
}

export default CanvasPlotLabel
