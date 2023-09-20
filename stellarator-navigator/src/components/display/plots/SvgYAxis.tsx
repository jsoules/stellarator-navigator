
import { DependentVariableOpt, Fields, getLabel, } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions } from "@snTypes/Types"
import { scaleLinear, scaleLog } from "d3"
import { FunctionComponent, useMemo } from "react"

type AxisProps = {
    dataRange: number[]
    canvasRange: number[]
    type: DependentVariableOpt
    dims: BoundedPlotDimensions
}

// if I had 100 ticks and we went from 10 to 20, I'd be fine with 1 digit. That's because we cover 10 before the decimal, and 100 / 10 <= 10.
// If I had 100 ticks and we went from 5 to 10, I'd be in trouble, because 100 / 5 = 20, which means more than 10 ticks per big-unit step.
// If I had 100 ticks and we went from 4.5 to 6, that's 6-4.5 = 2.5, 100 / 2.5 = 40, def need 2
// 
// So what I really want to know is ticks / range, ceil(log10(that)).

const leadingDigit = (v: number) => {
    return Math.round(v / (10 ** Math.floor(Math.log10(v))))
}
const logDisplayDigits = [1] // TODO: Does this need to be more sophisticated?

const SvgYAxis: FunctionComponent<AxisProps> = (props: AxisProps) => {
    const { dataRange, canvasRange, type, dims } = props
    const isLog = Fields[type].isLog
    const yAxisTransform = useMemo(() => `translate(-${dims.clipAvoidanceXOffset + dims.tickLength}, -${dims.clipAvoidanceYOffset})`, [dims.clipAvoidanceXOffset, dims.clipAvoidanceYOffset, dims.tickLength])
    const markLineColor = "#1f77b4" // should be equivalent to the tableau blue that was the default

    // TODO: Customize range!! (or no?)
    const yScale = useMemo(() => {
        const realDataRange = isLog
            ? [10 ** dataRange[0], 10 ** dataRange[1]]
            : dataRange
        return isLog ? scaleLog(realDataRange, canvasRange) : scaleLinear(dataRange, canvasRange)
    }, [canvasRange, dataRange, isLog])

    const canvasHeight = useMemo(() => {
        return canvasRange[1] - canvasRange[0]
    }, [canvasRange])

    const ticks = useMemo(() => {
        // TODO: See if we need to adjust log-label logic once we can zoom in and might all be in one band
        const targetTickCount = Math.max(1, Math.floor(canvasHeight / dims.pixelsPerTick))
        const baseTicks = yScale.ticks(targetTickCount)
        // if we're on the log scale, we don't care about this--we don't label every tick then
        // for an actual linear scale, we want to make sure we print only decimal places that might change
        // So basically, figure out how many gaps (total ticks - 1) we have for each unit of the data range,
        // take the log-base-10 of that, and round up for fractions
        const digits = isLog ? 1 : Math.max(0, Math.ceil(Math.log10((baseTicks.length - 1) / (dataRange[1] - dataRange[0]))))

        return baseTicks
            .map(value => ({
                value,
                yOffset: canvasHeight - yScale(value),
                label: isLog
                        ? logDisplayDigits.includes(leadingDigit(value)) ? value.toExponential(0) : ''
                        : value.toFixed(digits)
            }))
    }, [canvasHeight, dims.pixelsPerTick, yScale, isLog, dataRange])

    const markedLineY = useMemo(() => {
        const mark = Fields[type].markedValue
        if (mark === undefined) return undefined
        const markedValue = isLog ? 10 ** mark : mark
        return canvasHeight - yScale(markedValue)
    }, [canvasHeight, isLog, type, yScale])

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
                        {isLog && leadingDigit(value) === 1 && <line x2={dims.boundedWidth} stroke="#cbcbcb" />}
                        {!isLog && <line x2={dims.boundedWidth} stroke="#cbcbcb" />}
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
            {markedLineY && (
                <g
                    key={"markedLine"}
                    transform={`translate(${dims.tickLength + dims.clipAvoidanceXOffset}, ${markedLineY + dims.clipAvoidanceYOffset})`}
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
                    {getLabel({name: type, labelType: 'plot'})}
                </text>
            </g>
        </g>
    )
}

export default SvgYAxis
