import { FunctionComponent, useMemo } from "react"
import { AxisDescriptor, DescribeAxis, markLineColor } from "./AxisGeometry"

const SvgYAxis: FunctionComponent<AxisDescriptor> = (props: AxisDescriptor) => {
    const { canvasRange, axisLabel, dims } = props
    const yAxisTransform = useMemo(() =>
        `translate(-${dims.clipAvoidanceXOffset + dims.tickLength}, -${dims.clipAvoidanceYOffset})`,
        [dims.clipAvoidanceXOffset, dims.clipAvoidanceYOffset, dims.tickLength]
    )
    const { ticks, markedLine } = DescribeAxis(props)

    return (
        <g transform={yAxisTransform} key="y-axis">
            <path
                d={[
                    "M", dims.clipAvoidanceXOffset, canvasRange[0] + dims.clipAvoidanceYOffset,
                    "h", dims.tickLength,
                    "V", canvasRange[1] + dims.clipAvoidanceYOffset,
                    "h", -dims.tickLength,
                ].join(" ")}
                fill="none"
                stroke="currentColor"
            />
            {ticks.map(({ value, offset, label, majorTick }) => {
                return (
                    <g
                        key={`ytick-${value}`}
                        transform={`translate(${dims.tickLength + dims.clipAvoidanceXOffset}, ${offset + dims.clipAvoidanceYOffset})`}
                    >
                        <line x2={`-${dims.tickLength}`} stroke="currentColor" />
                        {majorTick && <line x2={dims.boundedWidth} stroke="#cbcbcb" />}
                        <text
                            key={`yticklabel-${value}`}
                            style={{
                                fontSize: `${dims.fontPx}px`,
                                textAnchor: "end",
                                transform: `translateX(-${dims.tickLength*2}px) translateY(${dims.tickLength/2}px)`
                            }}
                        >
                            { label }
                        </text>
                    </g>
                )
            })}
            {markedLine && (
                <g
                    key={"markedLine"}
                    transform={`translate(${dims.tickLength + dims.clipAvoidanceXOffset}, ${markedLine + dims.clipAvoidanceYOffset})`}
                >
                    <line x2={dims.boundedWidth} stroke={markLineColor} strokeWidth="2" />
                </g>
            )}
            <g key="y-axis-label" transform={`translate(-${dims.axisLabelOffset}, ${(dims.boundedHeight / 2) + dims.marginTop})`}>
                {/* This seems too simple but also seems to be doing the right thing so, why not? */}
                <text style={{
                    fontSize: `${1.5*dims.fontPx}px`,
                    textAnchor: "middle"
                }} transform="rotate(-90)">
                    {axisLabel}
                </text>
            </g>
        </g>
    )
}

export default SvgYAxis
