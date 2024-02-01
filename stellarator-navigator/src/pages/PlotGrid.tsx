import { Grid } from "@mui/material"
import { makeColors } from "@snComponents/display/Colormaps"
import CanvasPlotWrapper from "@snComponents/display/plots/CanvasPlotWrapper"
import { PlotColorProps } from "@snComponents/display/plots/interactions/plotColors"
import { PlotDataSummary } from "@snComponents/display/plots/interactions/usePlotData"
import usePlotMouseHandlers from "@snComponents/display/plots/interactions/usePlotMouseHandlers"
import { computePerPlotDimensions } from "@snComponents/display/plots/layout/PlotScaling"
import usePlotFittings from "@snComponents/display/plots/layout/usePlotFittings"
import { MarkedValueDesc, OverallHitCount } from "@snComponents/display/plots/plotFittings/PlotGridNotes"
import { PlotClickCallbackType } from "@snComponents/selectionControl/SelectionControlCallbacks"
import { DependentVariables, IndependentVariables, RangeVariables } from "@snTypes/DataDictionary"
import { DataGeometry, StellaratorRecord } from "@snTypes/Types"
import { FunctionComponent, useMemo } from "react"

export const internalMargin = 20


export type PlotGridProps = {
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

// TODO: Further simplify this to avoid passing so many props around, both into here and into CanvasPlotWrapper
const PlotGrid: FunctionComponent<PlotGridProps> = (props: PlotGridProps) => {
    const { selectedRecords, dependentVariable, width, height, } = props
    const { data, radius, ids, fineSplitVals, coarseSplitVals } = props.plotDataSummary
    const resolvedCoarseVals = (coarseSplitVals.length) === 0 ? [undefined] : coarseSplitVals
    const resolvedFineVals = (fineSplitVals.length) === 0 ? [undefined] : fineSplitVals
    const colCount = resolvedFineVals.length
    const [dims] = useMemo(() => computePerPlotDimensions(colCount, width - 2*internalMargin, height), [colCount, height, width])
    const colorsRgb = makeColors({values: props.plotDataSummary.colorValues, scheme: props.plotColorProps.style})
        .map(c => c.map(f => f.map(triplet => [...triplet, 1.0]).flat()))
    const { mouseHandlerFactory, resolveRangeChange } = usePlotMouseHandlers({dims, ...props })
    const plotFittings = usePlotFittings(props, dims)

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
                                fineValue={fineValue}
                                coarseValue={coarseValue}
                                plotFittings={plotFittings}

                                mouseHandler={mouseHandler}
                                dragResolver={resolveRangeChange}
                            />
                        </Grid>
                    )})
                }
            </Grid>
        )
    )

    return (
        <div>
            <OverallHitCount hits={selectedRecords.length} />
            <Grid container>
                {canvasRows}
            </Grid>
            <MarkedValueDesc dependentVariable={dependentVariable} />
        </div>
    )
}

export default PlotGrid 