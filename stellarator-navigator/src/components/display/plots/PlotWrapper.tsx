import { DependentVariables, IndependentVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, StellaratorRecord } from "@snTypes/Types"
import { ScaleLinear } from "d3"
import { FunctionComponent, useMemo, } from "react"
import { plotGutterHorizontal, plotGutterVertical } from "./PlotScaling"
import SnScatterplot from "./SnScatterplot"

type Props = {
    dims: BoundedPlotDimensions
    data: StellaratorRecord[]
    dependentVar: DependentVariables
    independentVar: IndependentVariables
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never>
    highlightedSeries?: number
    colorMap?: string[]
    xAxis?: JSX.Element
    yAxis?: JSX.Element
    // This is technically a logic concern, however we'd like to use it to label the plots.
    // If we keep the logic internal, we can ensure that being passed wrong data does not
    // result in a plot which is incorrectly labeled.
    markedIds?: Set<number>
    nfpValue: number
    ncPerHpValue?: number
    clickHandler: (nfp: number, nc?: number) => void
}


const PlotWrapper: FunctionComponent<Props> = (props: Props) => {
    const { dims, xAxis, yAxis, data, dependentVar, independentVar, highlightedSeries, markedIds, nfpValue, ncPerHpValue, xScale, yScale, clickHandler } = props

    const contentScaleTransform = useMemo(() =>
        `translate(${dims.marginLeft},${dims.marginTop})`,
        [dims.marginLeft, dims.marginTop]
    )

    return (
        <div
            style={{ height: dims.height + plotGutterHorizontal, marginLeft: plotGutterVertical/2, marginRight: plotGutterVertical/2 }}
        >
            {/* DO THIS PROPERLY -- Label should be its own component at this point */}
            <svg width={dims.width} height={dims.height} onClick={() => clickHandler(nfpValue, ncPerHpValue)}>
                <g transform={`translate(${dims.marginLeft + dims.boundedWidth / 2}, ${1.7*dims.fontPx})`} key="plot-label">
                    <text
                        style={{
                            fontSize: `${1.7*dims.fontPx}px`,
                            textAnchor: "middle",
                        }}
                    >
                        NFP = {nfpValue}; NC/HP = {ncPerHpValue ?? 'All'}
                    </text>
                </g>
                <g transform={contentScaleTransform} key="plot-content">
                    {xAxis}
                    {yAxis}
                    <SnScatterplot
                        key={`plot-${nfpValue}-${ncPerHpValue}`}
                        data={data}
                        dependentVar={dependentVar}
                        independentVar={independentVar}
                        xScale={xScale}
                        yScale={yScale}
                        height={dims.boundedHeight}
                        markedIds={markedIds}
                        highlightedSeries={highlightedSeries}
                        nfpValue={nfpValue}
                        ncPerHpValue={ncPerHpValue}
                    />
                </g>
            </svg>
      </div>
    )
}

export default PlotWrapper
