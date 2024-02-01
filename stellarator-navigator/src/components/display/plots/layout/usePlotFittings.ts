import { PlotGridProps } from "@snComponents/PlotGrid"
import { useCanvasAxes } from "@snComponents/display/plots/layout/PlotAxes"
import CanvasPlotLabel, { CanvasPlotLabelCallbackType } from "@snComponents/display/plots/plotFittings/CanvasPlotLabel"
import { resizeCanvas } from "@snComponents/display/plots/webgl/drawScatter"
import useWebglOffscreenCanvas from "@snComponents/display/plots/webgl/useWebglOffscreenCanvas"
import { BoundedPlotDimensions } from "@snTypes/Types"
import { useCallback, useMemo } from "react"
import { ScatterDataLoaderType } from "../webgl/drawingProgram"


export type PlotFittings = {
    offscreenCtxt: WebGLRenderingContext | null
    canvasXAxis: (c: CanvasRenderingContext2D) => void
    canvasYAxis: (c: CanvasRenderingContext2D) => void
    canvasPlotLabel: CanvasPlotLabelCallbackType
    loadData: ScatterDataLoaderType
}

const usePlotFittings = (props: PlotGridProps, dims: BoundedPlotDimensions): PlotFittings => {
    const { dataGeometry, dependentVariable, independentVariable } = props
    const { fineSplitField, coarseSplitField } = props.plotDataSummary

    const [canvasXAxis, canvasYAxis] = useCanvasAxes({
        dataGeometry,
        dependentVar: dependentVariable, independentVar: independentVariable,
        dimsIn: dims
    })

    const canvasPlotLabel: CanvasPlotLabelCallbackType = useCallback((ctxt, vals) => {
        CanvasPlotLabel({dims, coarseField: coarseSplitField, fineField: fineSplitField}, ctxt, vals)
    }, [coarseSplitField, dims, fineSplitField])

    const { webglCtxt: offscreenCtxt, loadData } = useWebglOffscreenCanvas(dataGeometry, dims)
    resizeCanvas({ctxt: offscreenCtxt, width: dims.boundedWidth, height: dims.boundedHeight})

    return useMemo(() => ({
        offscreenCtxt,
        loadData,
        canvasXAxis,
        canvasYAxis,
        canvasPlotLabel,
    }), [offscreenCtxt, loadData, canvasXAxis, canvasYAxis, canvasPlotLabel])
}

export default usePlotFittings