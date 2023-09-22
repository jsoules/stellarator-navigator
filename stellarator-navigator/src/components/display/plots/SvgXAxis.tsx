// adapted from https://2019.wattenberger.com/blog/react-and-d3

import { IndependentVariables, getLabel } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions } from "@snTypes/Types"
import { scaleLinear } from "d3"
import { FunctionComponent, useMemo } from "react"

type AxisProps = {
    dataDomain: number[],
    canvasRange: number[],
    type: IndependentVariables,
    dims: BoundedPlotDimensions
}

const SvgXAxis: FunctionComponent<AxisProps> = (props: AxisProps) => {
    const { dataDomain, canvasRange, dims, type } = props
    
    const ticks = useMemo(() => {
        const xScale = scaleLinear()
            .domain(dataDomain)
            .range(canvasRange)
        const width = canvasRange[1] - canvasRange[0]
        const pixelsPerTick = 30
        const targetTickCount = Math.max(1, Math.floor(width / pixelsPerTick))

        return xScale.ticks(targetTickCount)
            .map(value => ({
                value,
                xOffset: xScale(value)
            }))
    }, [canvasRange, dataDomain])

    const transform = useMemo(() => `translate(-${dims.clipAvoidanceXOffset}, ${dims.boundedHeight})`, [dims.clipAvoidanceXOffset, dims.boundedHeight])

    return (
        <g transform={transform} key="x-axis">
            <path
                d={[
                    "M", dims.clipAvoidanceXOffset+canvasRange[0], dims.tickLength,
                    "v", -dims.tickLength,
                    "H", dims.clipAvoidanceXOffset+canvasRange[1],
                    "v", dims.tickLength,
                ].join(" ")}
                fill="none"
                stroke="currentColor"
            />
            {ticks.map(({ value, xOffset }) => (
                <g
                    key={`xtick-${value}`}
                    transform={`translate(${xOffset + dims.clipAvoidanceXOffset}, 0)`}
                >
                    <line
                        y2={`${dims.tickLength}`}
                        stroke="currentColor"
                    />
                    <text
                        key={value}
                        style={{
                            fontSize: `${dims.fontPx}px`,
                            textAnchor: "middle",
                            transform: `translateY(${2 * dims.fontPx}px)`
                    }}>
                        {/* TODO -- Format to limit decimals/digit count */}
                        { value }
                    </text>
                </g>
            ))}
            <g key="x-axis-label" transform={`translate(${(dims.boundedWidth / 2) + dims.clipAvoidanceXOffset}, 0)`}>
                <text style={{
                    fontSize: `${1.5*dims.fontPx}px`,
                    textAnchor: "middle",
                    transform: `translateY(${4 * dims.fontPx}px)`
                }}>
                    {getLabel({name: type, labelType: 'plot'})}
                </text>
            </g>
        </g>
    )
}

export default SvgXAxis
