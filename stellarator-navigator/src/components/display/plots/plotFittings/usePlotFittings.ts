import CanvasPlotLabel, { CanvasPlotLabelCallbackType } from "@snComponents/display/plots/plotFittings/CanvasPlotLabel"
import { useCanvasAxes } from "@snComponents/display/plots/plotFittings/PlotAxes"
import { resizeCanvas } from "@snComponents/display/plots/webgl/drawScatter"
import useWebglOffscreenCanvas from "@snComponents/display/plots/webgl/useWebglOffscreenCanvas"
import { DependentVariables, IndependentVariables, ToggleableVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, DataGeometry } from "@snTypes/Types"
import { useCallback, useMemo } from "react"
import { ScatterDataLoaderType } from "../webgl/drawingProgram"


type PlotFittingsProps = {
    dataGeometry: DataGeometry
    plotDimensions: BoundedPlotDimensions
    dependentVariable: DependentVariables
    independentVariable: IndependentVariables
    fineSplitField?: ToggleableVariables
    coarseSplitField?: ToggleableVariables
}

export type PlotFittings = {
    offscreenCtxt: WebGLRenderingContext | null
    canvasXAxis: (c: CanvasRenderingContext2D) => void
    canvasYAxis: (c: CanvasRenderingContext2D) => void
    canvasPlotLabel: CanvasPlotLabelCallbackType
    loadData: ScatterDataLoaderType
}

const usePlotFittings = (props: PlotFittingsProps): PlotFittings => {
    const { dataGeometry, dependentVariable, independentVariable, fineSplitField, coarseSplitField, plotDimensions } = props

    const [canvasXAxis, canvasYAxis] = useCanvasAxes({
        dataGeometry,
        dependentVar: dependentVariable, independentVar: independentVariable,
        dimsIn: plotDimensions
    })

    const canvasPlotLabel: CanvasPlotLabelCallbackType = useCallback((ctxt, vals) => {
        CanvasPlotLabel({dims: plotDimensions, coarseField: coarseSplitField, fineField: fineSplitField}, ctxt, vals)
    }, [coarseSplitField, plotDimensions, fineSplitField])

    const { webglCtxt: offscreenCtxt, loadData } = useWebglOffscreenCanvas(dataGeometry, plotDimensions)
    resizeCanvas({ctxt: offscreenCtxt, width: plotDimensions.boundedWidth, height: plotDimensions.boundedHeight})

    return useMemo(() => ({
        offscreenCtxt,
        loadData,
        canvasXAxis,
        canvasYAxis,
        canvasPlotLabel,
    }), [offscreenCtxt, loadData, canvasXAxis, canvasYAxis, canvasPlotLabel])
}

export default usePlotFittings