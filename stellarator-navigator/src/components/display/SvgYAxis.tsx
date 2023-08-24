
import { scaleLinear, scaleLog } from "d3"
import { FunctionComponent, useMemo } from "react"
import { BoundedPlotDimensions, DependentVariableOpt } from "../../types/Types"
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
const logDisplayDigits = [1] // TODO: Needs to be more sophisticated: number of displayed digits shuld depend on ??

const clipAvoidanceX = 30
const clipAvoidanceY = 20
const axisLabelOffset = 10

const SvgYAxis: FunctionComponent<AxisProps> = (props: AxisProps) => {
    const { dataRange, canvasRange, type, dims } = props
    const yAxisTransform = useMemo(() => `translate(-${clipAvoidanceX + dims.tickLength}, -${clipAvoidanceY})`, [dims.tickLength])

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
                    "M", clipAvoidanceX, canvasRange[0] + clipAvoidanceY,
                    "h", dims.tickLength,
                    "V", canvasRange[1] + clipAvoidanceY,
                    "h", -dims.tickLength,
                ].join(" ")}
                fill="none"
                stroke="currentColor"
            />
            {ticks.map(({ value, yOffset, label }) => {
                return (
                    <g
                        key={`ytick-${value}`}
                        // transform={`translate(${yOffset}, 0)`}
                        transform={`translate(${dims.tickLength + clipAvoidanceX}, ${yOffset + clipAvoidanceY})`}
                    >
                        <line x2={`-${dims.tickLength}`} stroke="currentColor" />
                        {type === 'qaError' && leadingDigit(value) === 1 && <line x2={dims.boundedWidth} stroke="#cbcbcb" />}
                        <text
                            key={`yticklabel-${value}`}
                            style={{
                                fontSize: `${dims.fontPx}px`,
                                textAnchor: "middle",
                                transform: `translateX(-${clipAvoidanceY}px) translateY(${dims.tickLength/2}px)`
                            }}
                            >
                            { label }
                        </text>
                    </g>
                )
            })}
            <g key="y-axis-label" transform={`translate(-${axisLabelOffset}, ${(dims.boundedHeight / 2) + dims.marginTop})`}>
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
