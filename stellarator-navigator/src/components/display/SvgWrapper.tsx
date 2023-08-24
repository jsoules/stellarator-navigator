// Adapted from https://2019.wattenberger.com/blog/react-and-d3
import { ScaleLinear } from "d3"
import { FunctionComponent, useMemo, } from "react"
import { BoundedPlotDimensions, DependentVariableOpt, IndependentVariableOpt, StellaratorRecord } from "../../types/Types"
import HybridSnScatterplot from "./HybridSnScatterplot"
import { plotGutterHorizontal } from "./PlotScaling"

type Props = {
    dims: BoundedPlotDimensions
    data: StellaratorRecord[]
    dependentVar: DependentVariableOpt
    independentVar: IndependentVariableOpt
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


const SvgWrapper: FunctionComponent<Props> = (props: Props) => {
    const { dims, xAxis, yAxis, data, dependentVar, independentVar, highlightedSeries, markedIds, nfpValue, ncPerHpValue, xScale, yScale, clickHandler } = props

    const contentScaleTransform = useMemo(() =>
        `translate(${dims.marginLeft},${dims.marginTop})`,
        [dims.marginLeft, dims.marginTop]
    )

    return (
        <div
            className="Chart__wrapper"
            style={{ height: dims.height + plotGutterHorizontal }}
        >
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
                    <HybridSnScatterplot
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

export default SvgWrapper
