import { BoundedPlotDimensions } from "@snTypes/Types"
import { ScaleLinear, scaleLinear, scaleLog } from "d3"

export const markLineColor = "#1f77b4" // should be equivalent to the tableau blue that was the default

export type AxisDescriptor = {
    dataRange: number[],
    canvasRange: number[],
    dims: BoundedPlotDimensions,
    axisLabel: string,
    isLog?: boolean,
    isY?: boolean,
    markedValue?: number,
}


type TicksData = {
    canvasSpan: number
    pixelsPerTick: number
    scale: ScaleLinear<number, number, never>
    isLog?: boolean
    isY?: boolean
    dataLow?: number
    dataHigh?: number
}


const getBaseTicks = (props: TicksData) => {
    const { canvasSpan, pixelsPerTick, scale } = props
    const targetTickCount = Math.max(1, Math.floor(canvasSpan / pixelsPerTick))
    const baseTicks = scale.ticks(targetTickCount)
    return baseTicks
}


const getFixedDigits = (props: TicksData, tickCount: number) => {
    // For a linear scale, we want to make sure we print only decimal places that might change.
    // So count the gaps (total ticks - 1) in each unit of the data range, take log-10, and round up for fractions
    const { dataHigh, dataLow} = props
    if (dataHigh === undefined || dataLow === undefined) return 1 // default for x-axis (we'll ignore it)
    const dataRange = dataHigh - dataLow
    return Math.max(0, Math.ceil(Math.log10((tickCount - 1) / dataRange)))
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
        if (slice.length < 7) {
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


const computeTicks = (props: TicksData) => {
    const { scale, canvasSpan, isLog, isY } = props
    const baseTicks = getBaseTicks(props)
    const fixedDigits = isLog ? 1 : getFixedDigits(props, baseTicks.length)
    const ticksToLabel = isLog ? computeTicksToLabel(baseTicks) : []
    return baseTicks.map((value, i) => ({
        value,
        offset: isY ? canvasSpan - scale(value) : scale(value),
        label: isLog
            ? ticksToLabel.includes(i)
                ? value.toExponential(1)
                : ''
            : value.toFixed(fixedDigits),
        majorTick: !isLog || ticksToLabel.includes(i)
    }))
}


const computeMarkedLine = (props: TicksData, markValue?: number) => {
    const { canvasSpan, scale, isLog, isY } = props
    if (markValue === undefined) return undefined
    const mark = isLog ? 10 ** markValue : markValue
    const effectivePosition = scale(mark)
    return effectivePosition < 0
        ? undefined
        : isY ? canvasSpan - effectivePosition : effectivePosition
}


export const DescribeAxis = (props: AxisDescriptor) => {
    const { isLog, isY, dataRange, canvasRange, dims, markedValue } = props
    const scale = isLog
        ? scaleLog([10 ** dataRange[0], 10 ** dataRange[1]], canvasRange)
        : scaleLinear(dataRange, canvasRange)
    const canvasSpan = canvasRange[1] - canvasRange[0]

    const data = {
        canvasSpan,
        pixelsPerTick: dims.pixelsPerTick,
        scale: scale,
        isLog,
        dataLow: dataRange[0],
        dataHigh: dataRange[1],
        isY
    }
    const ticks = computeTicks(data)
    const markedLine = computeMarkedLine(data, markedValue)

    return { ticks, markedLine }
}
