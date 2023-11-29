import { Grid } from "@mui/material"
import { Tol, convertHexToRgb3Vec } from "@snComponents/display/Colormaps"
import CanvasPlotLabel, { CanvasPlotLabelCallbackType } from "@snComponents/display/plots/CanvasPlotLabel"
import CanvasPlotWrapper from "@snComponents/display/plots/CanvasPlotWrapper"
import { dotMargin, resizeCanvas } from "@snComponents/display/plots/webgl/drawScatter"
import initProgram from "@snComponents/display/plots/webgl/drawingProgram"
import { computePerPlotDimensions, useCanvasAxes } from "@snPlots/PlotScaling"
import { DependentVariables, IndependentVariables, ToggleableVariables } from "@snTypes/DataDictionary"
import { DataGeometry, StellaratorRecord } from "@snTypes/Types"
import { FunctionComponent, useCallback, useMemo } from "react"
import { PlotDataSummary } from "./Overview"

const internalMargin = 20


type Props = {
    width: number
    height: number
    selectedRecords: StellaratorRecord[]
    plotDataSummary: PlotDataSummary
    dataGeometry: DataGeometry
    dependentVariable: DependentVariables
    independentVariable: IndependentVariables
    plotClickHandler: (coarseValue: number | undefined, fineValue: number | undefined) => void
}


const PlotGrid: FunctionComponent<Props> = (props: Props) => {
    const { dataGeometry, selectedRecords, width, height, plotDataSummary, plotClickHandler, dependentVariable, independentVariable } = props
    const { data, selected, fineSplitVals, coarseSplitVals } = plotDataSummary

    const [dims] = useMemo(() => computePerPlotDimensions(fineSplitVals.length, width - 2*internalMargin, height), [height, fineSplitVals.length, width])
    const [canvasXAxis, canvasYAxis] = useCanvasAxes({
        dataGeometry,
        dependentVar: dependentVariable, independentVar: independentVariable,
        dimsIn: dims
    })
    const canvasPlotLabel: CanvasPlotLabelCallbackType = useCallback((ctxt, vals) => {
        CanvasPlotLabel({dims, coarseField: ToggleableVariables.NC_PER_HP, fineField: ToggleableVariables.NFP}, ctxt, vals)
    }, [dims])
    const sizes = selected.map(i => i.map(j => j.map(k => k.map(l => l ? dotMargin : dotMargin / 2))))

    // TODO: Do refactor this all out somewhere else
    // TODO: Allow changing color palette
    const colorList = useMemo(() => (Tol).map(c => convertHexToRgb3Vec(c)), [])
    const offscreenCanvas = useMemo(() => new OffscreenCanvas(10, 10), [])
    const webglCtxt = useMemo(() => offscreenCanvas.getContext("webgl"), [offscreenCanvas])
    const configureCanvas = useMemo(() => initProgram(webglCtxt), [webglCtxt])
    const loadData = useMemo(() => configureCanvas(colorList, dataGeometry, dims.boundedWidth, dims.boundedHeight),
        [configureCanvas, colorList, dataGeometry, dims.boundedWidth, dims.boundedHeight])
    resizeCanvas({ctxt: webglCtxt, width: dims.boundedWidth, height: dims.boundedHeight})

    const resolvedCoarseVals = (coarseSplitVals?.length ?? 0) === 0 ? [undefined] : coarseSplitVals
    const resolvedFineVals = (fineSplitVals?.length ?? 0) === 0 ? [undefined] : fineSplitVals
    const canvasRows = resolvedCoarseVals.map((coarseValue, coarseIdx) => (
            <Grid container item key={`${coarseValue}`}>
                { resolvedFineVals.map((fineValue, fineIdx) => (
                        <Grid item xs={0} key={`${fineValue}`}>
                            <CanvasPlotWrapper
                                key={`${coarseValue}-${fineValue}`}
                                data={data[coarseIdx][fineIdx]}
                                sizes={sizes[coarseIdx][fineIdx]}
                                dims={dims}
                                canvasXAxis={canvasXAxis}
                                canvasYAxis={canvasYAxis}
                                canvasPlotLabel={canvasPlotLabel}
                                fineValue={fineValue}
                                coarseValue={coarseValue}
                                clickHandler={() => plotClickHandler(coarseValue, fineValue)}
                                scatterCtxt={webglCtxt}
                                loadData={loadData}
                            />
                        </Grid>
                    ))
                }
            </Grid>
        )
    )

    return (
        <div style={{ margin: internalMargin }}>
            <div style={{ paddingBottom: 10 }}>Current filter settings return {selectedRecords.length} devices.</div>
            <Grid container>
                {canvasRows}
            </Grid>
        </div>
    )
}

export default PlotGrid 