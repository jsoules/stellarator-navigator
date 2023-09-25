
import { DependentVariables, Fields, getLabel, } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions } from "@snTypes/Types"
import { ScaleLinear, scaleLinear, scaleLog } from "d3"
import { FunctionComponent, useMemo } from "react"

type AxisProps = {
    dataRange: number[]
    canvasRange: number[]
    type: DependentVariables
    dims: BoundedPlotDimensions
}


const computeTicksToLabel = (allTicks: number[]) => {
    // For log scale, ticks will cluster at the upper ends of each order of magnitude.
    // We solve this not by a number-based rule, but by just trying to get a good split
    // among the available number of ticks for each OOM. Empirically this seems to look
    // fine if we label ~ one in five ticks per OOM.
    // Note this returns the *indices* of the labels to display.

    const oom = (x: number) => Math.floor(Math.log10(x))
    const oomTransitions = allTicks
        .map((v, i) =>
            (i === 0 || oom(v) !== oom(allTicks[i - 1])
                ? i
                : undefined))
        .filter(x => x !== undefined) as number[]

    const allLabeledTicks = oomTransitions.map((v, i) => {
        const slice = allTicks.slice(v, oomTransitions[i + 1])
        if (slice.length < 5) {
            return [v]
        }
        if (slice.length < 10) {
            return [v, v + Math.floor(slice.length / 4)]
        }
        if (slice.length < 17) {
            return [v, v + Math.floor(slice.length / 3), v + Math.ceil(slice.length/2)]
        }
        // This doesn't really come up
        return [v, v + Math.floor(slice.length / 4), v + Math.floor(slice.length / 2), v + Math.ceil(3 * slice.length / 5)]
    }).flat()

    return allLabeledTicks
}


const useTicks = (canvasHeight: number, pixelsPerTick: number, dataLow: number, dataHigh: number, yScale: ScaleLinear<number, number, never>, isLog: boolean) => {
    return useMemo(() => {
        const targetTickCount = Math.max(1, Math.floor(canvasHeight / pixelsPerTick))
        const baseTicks = yScale.ticks(targetTickCount)
        // For a linear scale, we want to make sure we print only decimal places that might change.
        // So count the gaps (total ticks - 1) in each unit of the data range, take log-10, and round up for fractions
        const fixedDigits = isLog ? 1 : Math.max(0, Math.ceil(Math.log10((baseTicks.length - 1) / (dataHigh - dataLow))))
        const ticksToLabel = isLog ? computeTicksToLabel(baseTicks) : []
        return baseTicks
            .map((value, i) => ({
                value,
                yOffset: canvasHeight - yScale(value),
                label: isLog
                    ? ticksToLabel.includes(i)
                        ? value.toExponential(1)
                        : ''
                    : value.toFixed(fixedDigits),
                majorTick: !isLog || ticksToLabel.includes(i)
            }))
        },
        [canvasHeight, pixelsPerTick, yScale, isLog, dataHigh, dataLow]
    )
}


const useMarkedYLine = (canvasHeight: number, isLog: boolean, type: DependentVariables, yScale: ScaleLinear<number, number, never>) => {
    return useMemo(() => {
        const mark = Fields[type].markedValue
        if (mark === undefined) return undefined
        const markedValue = isLog ? 10 ** mark : mark
        const realizedY = canvasHeight - yScale(markedValue)
        return realizedY >= 0 ? realizedY : undefined
    }, [canvasHeight, isLog, type, yScale])
}


const SvgYAxis: FunctionComponent<AxisProps> = (props: AxisProps) => {
    const { dataRange, canvasRange, type, dims } = props
    const isLog = Fields[type].isLog
    const yAxisTransform = useMemo(() =>
        `translate(-${dims.clipAvoidanceXOffset + dims.tickLength}, -${dims.clipAvoidanceYOffset})`,
        [dims.clipAvoidanceXOffset, dims.clipAvoidanceYOffset, dims.tickLength]
    )
    const markLineColor = "#1f77b4" // should be equivalent to the tableau blue that was the default
    
    const yScale = useMemo(() => {
        return isLog
            ? scaleLog([10 ** dataRange[0], 10 ** dataRange[1]], canvasRange)
            : scaleLinear(dataRange, canvasRange)
    }, [canvasRange, dataRange, isLog])

    const canvasHeight = useMemo(() => {
        return canvasRange[1] - canvasRange[0]
    }, [canvasRange])

    const ticks = useTicks(canvasHeight, dims.pixelsPerTick, dataRange[0], dataRange[1], yScale, isLog)
    const markedLineY = useMarkedYLine(canvasHeight, isLog, type, yScale)

    // The SVG construction is pretty hairy--consider functionalizing out at some point
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
            {ticks.map(({ value, yOffset, label, majorTick }) => {
                return (
                    <g
                        key={`ytick-${value}`}
                        transform={`translate(${dims.tickLength + dims.clipAvoidanceXOffset}, ${yOffset + dims.clipAvoidanceYOffset})`}
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
