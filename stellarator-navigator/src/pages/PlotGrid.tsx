import { Grid } from "@mui/material"
import { makeColors } from "@snComponents/display/Colormaps"
import CanvasPlotLabel, { CanvasPlotLabelCallbackType } from "@snComponents/display/plots/CanvasPlotLabel"
import CanvasPlotWrapper from "@snComponents/display/plots/CanvasPlotWrapper"
import { useMouseHandlerFactory, usePointContainsClickFn } from "@snComponents/display/plots/interactions/mouseInteractions"
import { PlotColorProps } from "@snComponents/display/plots/interactions/plotColors"
import { PlotDataSummary } from "@snComponents/display/plots/interactions/usePlotData"
import { resizeCanvas } from "@snComponents/display/plots/webgl/drawScatter"
import useWebglOffscreenCanvas from "@snComponents/display/plots/webgl/useWebglOffscreenCanvas"
import { PlotClickCallbackType } from "@snComponents/selectionControl/SelectionControlCallbacks"
import { computePerPlotDimensions, useCanvasAxes, usePixelToDataConversions } from "@snPlots/PlotScaling"
import { DependentVariables, IndependentVariables, RangeVariables, fieldMarkedValueDesc, fieldValuesCount } from "@snTypes/DataDictionary"
import { DataGeometry, StellaratorRecord } from "@snTypes/Types"
import { FunctionComponent, useCallback, useMemo } from "react"

export const internalMargin = 20


type Props = {
    width: number
    height: number
    selectedRecords: StellaratorRecord[]
    plotDataSummary: PlotDataSummary
    dataGeometry: DataGeometry
    dependentVariable: DependentVariables
    independentVariable: IndependentVariables
    plotColorProps: PlotColorProps
    plotClickHandler: PlotClickCallbackType
    resolveRangeChangeHandler: (fields: RangeVariables[], newValues: number[][]) => void
}


const PlotGrid: FunctionComponent<Props> = (props: Props) => {
    const { dataGeometry, selectedRecords, width, height, plotClickHandler, resolveRangeChangeHandler, dependentVariable, independentVariable } = props
    const { data, radius, ids, colorValues, fineSplitField, coarseSplitField, fineSplitVals, coarseSplitVals } = props.plotDataSummary
    const { style } = props.plotColorProps

    const markedValueDesc = fieldMarkedValueDesc(dependentVariable)
    const markedValueExplanation = markedValueDesc === undefined
        ? <></>
        : <div style={{ paddingTop: 10, paddingBottom: 10 }}>{markedValueDesc}</div>

    // All this logic probably belongs elsewhere
    const colCount = useMemo(() => 
        fineSplitVals.length === 0 ? fieldValuesCount(fineSplitField) : fineSplitVals.length,
    [fineSplitVals.length, fineSplitField])
    const [dims] = useMemo(() => computePerPlotDimensions(colCount, width - 2*internalMargin, height), [height, fineSplitVals.length, width])
    const [canvasXAxis, canvasYAxis] = useCanvasAxes({
        dataGeometry,
        dependentVar: dependentVariable, independentVar: independentVariable,
        dimsIn: dims
    })

    const canvasPlotLabel: CanvasPlotLabelCallbackType = useCallback((ctxt, vals) => {
        CanvasPlotLabel({dims, coarseField: coarseSplitField, fineField: fineSplitField}, ctxt, vals)
    }, [coarseSplitField, dims, fineSplitField])

    const colorsRgb = makeColors({values: colorValues, scheme: style})
        .map(c => c.map(f => f.map(triplet => [...triplet, 1.0]).flat()))
    const { webglCtxt, loadData } = useWebglOffscreenCanvas(dataGeometry, dims)
    resizeCanvas({ctxt: webglCtxt, width: dims.boundedWidth, height: dims.boundedHeight})
    const { interpretClick, xDataPerPixel, yDataPerPixel } = usePixelToDataConversions(dims, dataGeometry)
    const pointClickChecker = usePointContainsClickFn(xDataPerPixel, yDataPerPixel)
    const mouseHandlerFactory = useMouseHandlerFactory({plotClickHandler, interpretClick, pointClickChecker})
    const resolveRangeChange = useCallback((rect: number[]) => {
        const dataUL = interpretClick(rect[0], rect[1])
        const dataLR = interpretClick(rect[0] + rect[2], rect[1] + rect[3])
        const dataX = [dataUL[0], dataLR[0]]
        const dataY = [dataLR[1], dataUL[1]]
        const useX = Object.values(RangeVariables).includes(independentVariable as unknown as RangeVariables)
        const useY = Object.values(RangeVariables).includes(dependentVariable as unknown as RangeVariables)
        if (!useX && !useY) {
            // This can't happen with current rules since all dependent variables are range-type.
            // But we'll leave the check in for future-proofing.
            console.warn("Neither axis is a range: not updating from drag selection.")
            return
        }
        const fields: RangeVariables[] = []
        const newValues: number[][] = []
        if (useX) {
            fields.push(independentVariable as unknown as RangeVariables)
            newValues.push(dataX)
        }
        if (useY) {
            fields.push(dependentVariable as unknown as RangeVariables)
            newValues.push(dataY)
        }
        resolveRangeChangeHandler(fields, newValues)
    }, [dependentVariable, independentVariable, interpretClick, resolveRangeChangeHandler])

    const resolvedCoarseVals = (coarseSplitVals.length) === 0 ? [undefined] : coarseSplitVals
    const resolvedFineVals = (fineSplitVals.length) === 0 ? [undefined] : fineSplitVals
    const canvasRows = resolvedCoarseVals.map((coarseValue, coarseIdx) => (
            <Grid container item key={`${coarseValue}`}>
                { resolvedFineVals.map((fineValue, fineIdx) => {
                    const mouseHandler = mouseHandlerFactory({
                        coarseValue,
                        fineValue,
                        data: data[coarseIdx][fineIdx],
                        radius: radius[coarseIdx][fineIdx],
                        ids: ids[coarseIdx][fineIdx]
                    })
                    return (
                        <Grid item xs={0} key={`${fineValue}`}>
                            <CanvasPlotWrapper
                                key={`${coarseValue}-${fineValue}`}
                                data={data[coarseIdx][fineIdx]}
                                dotSizes={radius[coarseIdx][fineIdx]}
                                colorValuesRgb={colorsRgb[coarseIdx][fineIdx]}
                                dims={dims}
                                canvasXAxis={canvasXAxis}
                                canvasYAxis={canvasYAxis}
                                canvasPlotLabel={canvasPlotLabel}
                                fineValue={fineValue}
                                coarseValue={coarseValue}
                                mouseHandler={mouseHandler}
                                dragResolver={resolveRangeChange}
                                scatterCtxt={webglCtxt}
                                loadData={loadData}
                            />
                        </Grid>
                    )})
                }
            </Grid>
        )
    )

    return (
        <div>
            <div style={{ paddingTop: 10, paddingBottom: 10 }}>Current filter settings return {selectedRecords.length} devices.</div>
            <Grid container>
                {canvasRows}
            </Grid>
            {markedValueExplanation}
        </div>
    )
}

export default PlotGrid 