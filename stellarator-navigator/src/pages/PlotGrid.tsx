import { Grid } from "@mui/material"
import { makeColors } from "@snComponents/display/Colormaps"
import CanvasPlotLabel, { CanvasPlotLabelCallbackType } from "@snComponents/display/plots/CanvasPlotLabel"
import CanvasPlotWrapper from "@snComponents/display/plots/CanvasPlotWrapper"
import { dotMargin, resizeCanvas } from "@snComponents/display/plots/webgl/drawScatter"
import useWebglOffscreenCanvas from "@snComponents/display/plots/webgl/useWebglOffscreenCanvas"
import { computePerPlotDimensions, useCanvasAxes } from "@snPlots/PlotScaling"
import { DependentVariables, IndependentVariables } from "@snTypes/DataDictionary"
import { DataGeometry, StellaratorRecord } from "@snTypes/Types"
import { FunctionComponent, useCallback, useMemo } from "react"
import { PlotDataSummary } from "./Overview"

export const internalMargin = 20


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
    const { data, selected, colorValues, fineSplitField, coarseSplitField, fineSplitVals, coarseSplitVals } = plotDataSummary

    const [dims] = useMemo(() => computePerPlotDimensions(fineSplitVals.length, width - 2*internalMargin, height), [height, fineSplitVals.length, width])
    const [canvasXAxis, canvasYAxis] = useCanvasAxes({
        dataGeometry,
        dependentVar: dependentVariable, independentVar: independentVariable,
        dimsIn: dims
    })
    const canvasPlotLabel: CanvasPlotLabelCallbackType = useCallback((ctxt, vals) => {
        CanvasPlotLabel({dims, coarseField: coarseSplitField, fineField: fineSplitField}, ctxt, vals)
    }, [coarseSplitField, dims, fineSplitField])
    const sizes = selected.map(i => i.map(j => j.map(k => k ? dotMargin : dotMargin / 2)))

    // TODO: Expose UI for changing color palette
    const colorsRgb = makeColors({isContinuous: false, values: colorValues, scheme: "Tol"})
    // Here's an example of what this looks like for continuous values
    // const colorsRgb = makeColors({isContinuous: true, values: colorValues, scheme: "plasma"})
    const { webglCtxt, loadData } = useWebglOffscreenCanvas(dataGeometry, dims)
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
                                colorValuesRgb={colorsRgb[coarseIdx][fineIdx]}
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
        <div>
            <div style={{ paddingBottom: 10 }}>Current filter settings return {selectedRecords.length} devices.</div>
            <Grid container>
                {canvasRows}
            </Grid>
        </div>
    )
}

export default PlotGrid 