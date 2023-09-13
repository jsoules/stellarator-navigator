
import { scaleLinear, scaleLog } from "d3"
import { FunctionComponent, useMemo } from "react"
import { BoundedPlotDimensions, DependentVariableOpt } from "../../../types/Types"
import { dependentVariableValidValues } from "./DependentVariableConfig"

type AxisProps = {
    dataRange: number[]
    canvasRange: number[]
    type: DependentVariableOpt
    dims: BoundedPlotDimensions
}

const leadingDigit = (v: number) => {
    return Math.round(v / (10 ** Math.floor(Math.log10(v))))
}
const logDisplayDigits = [1] // TODO: Does this need to be more sophisticated?

// const clipAvoidanceX = 30
// const clipAvoidanceY = 20
// const axisLabelOffset = 10

const SvgYAxis: FunctionComponent<AxisProps> = (props: AxisProps) => {
    const { dataRange, canvasRange, type, dims } = props
    const yAxisTransform = useMemo(() => `translate(-${dims.clipAvoidanceXOffset + dims.tickLength}, -${dims.clipAvoidanceYOffset})`, [dims.clipAvoidanceXOffset, dims.clipAvoidanceYOffset, dims.tickLength])

    // TODO: Customize range!! (or no?)
    const ticks = useMemo(() => {
        const realDataRange = type === 'qaError'
            ? [10 ** dataRange[0], 10 ** dataRange[1]]
            : dataRange
        const yScale = type === 'qaError' ? scaleLog(realDataRange, canvasRange) : scaleLinear(dataRange, canvasRange)
        const height = canvasRange[1] - canvasRange[0]
        const targetTickCount = Math.max(1, Math.floor(height / dims.pixelsPerTick))

        return yScale.ticks(targetTickCount)
        .map(value => ({
            value,
            yOffset: height - yScale(value),
            label: type !== 'qaError'
                    ? value.toFixed(1)
                    : logDisplayDigits.includes(leadingDigit(value)) ? value.toExponential(0) : ''
        }))
    }, [canvasRange, dataRange, type, dims])

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
            {ticks.map(({ value, yOffset, label }) => {
                return (
                    <g
                        key={`ytick-${value}`}
                        transform={`translate(${dims.tickLength + dims.clipAvoidanceXOffset}, ${yOffset + dims.clipAvoidanceYOffset})`}
                    >
                        <line x2={`-${dims.tickLength}`} stroke="currentColor" />
                        {type === 'qaError' && leadingDigit(value) === 1 && <line x2={dims.boundedWidth} stroke="#cbcbcb" />}
                        <text
                            key={`yticklabel-${value}`}
                            style={{
                                fontSize: `${dims.fontPx}px`,
                                textAnchor: "middle",
                                transform: `translateX(-${dims.clipAvoidanceYOffset}px) translateY(${dims.tickLength/2}px)`
                            }}
                            >
                            { label }
                        </text>
                    </g>
                )
            })}
            <g key="y-axis-label" transform={`translate(-${dims.axisLabelOffset}, ${(dims.boundedHeight / 2) + dims.marginTop})`}>
                {/* This seems too simple but also seems to be doing the right thing so, why not? */}
                <text style={{
                    fontSize: `${1.5*dims.fontPx}px`,
                    textAnchor: "middle"
                }} transform="rotate(-90)">
                    {(dependentVariableValidValues.find(v => v.value === type) || {text: 'OOPS'}).text}
                </text>
            </g>
        </g>
    )
}

export default SvgYAxis