import { Fields, KnownFields, ToggleableVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions } from "@snTypes/Types"

type plotLabelProps = {
    dims: BoundedPlotDimensions
    coarseField?: ToggleableVariables
    fineField?: ToggleableVariables
}

type fieldVals = {
    coarseVal?: number
    fineVal?: number
}

export type CanvasPlotLabelCallbackType = (ctxt: CanvasRenderingContext2D, vals: fieldVals) => void


const CanvasPlotLabel = (props: plotLabelProps, ctxt: CanvasRenderingContext2D, vals: fieldVals) => {
    const { dims, coarseField, fineField } = props
    const { coarseVal, fineVal } = vals
    const coarseDesc = (Fields[coarseField as unknown as KnownFields]?.shortLabel ?? '')
    const medDesc = (Fields[fineField as unknown as KnownFields]?.shortLabel ?? '')
    const coarseBlurb = coarseDesc === '' ? '' : `${coarseDesc}: ${coarseVal ?? 'Any'}`
    const medBlurb = medDesc === '' ? '' : `${medDesc}: ${fineVal ?? 'Any'}`
    const text = (coarseBlurb !== '' && medBlurb !== '') ? `${coarseBlurb}; ${medBlurb}` : `${coarseBlurb}${medBlurb}`
    ctxt.save()
    ctxt.font = `${1.7*dims.fontPx}px sans-serif`
    ctxt.textAlign = "center"
    const mid = dims.marginLeft + dims.boundedWidth / 2
    const y = 1.7*dims.fontPx
    ctxt.fillText(text, mid, y)
    ctxt.restore()
}

export default CanvasPlotLabel
