import { Grid } from "@mui/material"
import { makeColors } from "@snComponents/display/Colormaps"
import CanvasPlotWrapper from "@snComponents/display/plots/CanvasPlotWrapper"
import { MouseHandlers } from "@snComponents/display/plots/interactions/mouseInteractions"
import { PlotColorProps } from "@snComponents/display/plots/interactions/plotColors"
import { PlotDataSummary } from "@snComponents/display/plots/interactions/usePlotData"
import { PlotFittings } from "@snComponents/display/plots/plotFittings/usePlotFittings"
import { BoundedPlotDimensions, DataGeometry } from "@snTypes/Types"
import { FunctionComponent } from "react"


export type PlotGridProps = {
    plotDataSummary: PlotDataSummary
    dataGeometry: DataGeometry
    plotDimensions: BoundedPlotDimensions
    mouseHandlers: MouseHandlers
    plotFittings: PlotFittings
    plotColorProps: PlotColorProps
    focusCoarseValue?: number
    focusFineValue?: number
}

// TODO: Further simplify this to avoid passing so many props around, both into here and into CanvasPlotWrapper
const PlotGrid: FunctionComponent<PlotGridProps> = (props: PlotGridProps) => {
    const { plotDimensions, mouseHandlers, plotFittings, focusCoarseValue, focusFineValue } = props
    const { data, radius, ids, fineSplitVals, coarseSplitVals } = props.plotDataSummary
    const resolvedCoarseVals = (coarseSplitVals.length) === 0 ? [undefined] : coarseSplitVals
    const resolvedFineVals = (fineSplitVals.length) === 0 ? [undefined] : fineSplitVals
    const colorsRgb = makeColors({values: props.plotDataSummary.colorValues, scheme: props.plotColorProps.style, range: props.plotDataSummary.colorFieldRange})
        .map(c => c.map(f => f.map(triplet => [...triplet, 1.0]).flat()))

    const canvasRows = resolvedCoarseVals.map((coarseValue, coarseIdx) => (
            <Grid container item key={`${coarseValue}`}>
                { resolvedFineVals.map((fineValue, fineIdx) => {
                    const mouseHandler = mouseHandlers.mouseHandlerFactory({
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
                                dims={plotDimensions}
                                fineValue={fineValue}
                                coarseValue={coarseValue}
                                isFocus={coarseValue === focusCoarseValue && fineValue === focusFineValue}
                                plotFittings={plotFittings}

                                mouseHandler={mouseHandler}
                                dragResolver={mouseHandlers.resolveRangeChange}
                            />
                        </Grid>
                    )})
                }
            </Grid>
        )
    )

    return (
        <div>
            <Grid container>
                {canvasRows}
            </Grid>
        </div>
    )
}

export default PlotGrid 