import { FunctionComponent, useMemo } from "react"
import { AxisDescriptor, DescribeAxis } from "./AxisGeometry"

const SvgXAxis: FunctionComponent<AxisDescriptor> = (props: AxisDescriptor) => {
    const { canvasRange, dims, axisLabel } = props
    const { ticks } = DescribeAxis(props)

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
            {ticks.map(({ value, offset, label }) => (
                <g
                    key={`xtick-${value}`}
                    transform={`translate(${offset + dims.clipAvoidanceXOffset}, 0)`}
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
                        { label }
                    </text>
                </g>
            ))}
            <g key="x-axis-label" transform={`translate(${(dims.boundedWidth / 2) + dims.clipAvoidanceXOffset}, 0)`}>
                <text style={{
                    fontSize: `${1.5*dims.fontPx}px`,
                    textAnchor: "middle",
                    transform: `translateY(${4 * dims.fontPx}px)`
                }}>
                    {axisLabel}
                </text>
            </g>
        </g>
    )
}

export default SvgXAxis
