import { DependentVariables, Fields, IndependentVariables, RangeVariables, defaultDependentVariableValue, defaultIndependentVariableValue, getEnumVals } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, FilterSettings } from "@snTypes/Types"
import { ScaleLinear, scaleLinear } from "d3"
import { useMemo } from "react"
import SvgXAxis from "./SvgXAxis"
import SvgYAxis from "./SvgYAxis"


const useScale = (dataRange: number[], physicalRange: number) => {
    const scale = useMemo(() => {
        return scaleLinear()
            .domain(dataRange)
            .range([0, physicalRange])
    }, [dataRange, physicalRange])
    return scale
}


type useScalesProps = {
    filters: FilterSettings
    dimsIn: BoundedPlotDimensions
}

export const useScales = (props: useScalesProps) => {
    const { filters, dimsIn } = props
    const independentVar = filters?.independentVariable ?? defaultIndependentVariableValue
    const dependentVar = filters?.dependentVariable ?? defaultDependentVariableValue
    const rangeVals = getEnumVals(RangeVariables)

    const { low: iLow, high: iHigh } = getExtrema(filters, independentVar, rangeVals.includes(independentVar))
    const { low: dLow, high: dHigh } = getExtrema(filters, dependentVar, rangeVals.includes(dependentVar))

    const dataDomain = useMemo(() => {
        return [iLow, iHigh]
    }, [iHigh, iLow])
    const dataRange = useMemo(() => {
        return [dLow, dHigh]
    }, [dHigh, dLow])

    const xScale = useScale(dataDomain, dimsIn.boundedWidth)
    const yScale = useScale(dataRange, dimsIn.boundedHeight)

    return [xScale, yScale]
}


const getExtrema = (filters: FilterSettings, field: IndependentVariables | DependentVariables, validRangeField: boolean) => {
    const baseRange = Fields[field].range
    const range = (validRangeField ? (filters[field] ?? []) : baseRange) as number[]
    const low = baseRange[0] === range[0] ? Math.min(0, range[0]) : range[0]
    const high = range[1]
    return ({low, high})
}


type axisProps = {
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never>
    dependentVar: DependentVariables
    independentVar: IndependentVariables
    dims: BoundedPlotDimensions
}

export const useAxes = (props: axisProps) => {
    const { xScale, yScale, dependentVar, independentVar, dims, } = props
    const xAxis = useMemo(() => {
        return <SvgXAxis
                    dataDomain={xScale.domain()}
                    canvasRange={xScale.range()}
                    dims={dims}
                    type={independentVar}
                />
    }, [xScale, dims, independentVar])

    const yAxis = useMemo(() => {
        return <SvgYAxis
                    dataRange={yScale.domain()} 
                    canvasRange={yScale.range()}
                    type={dependentVar}
                    dims={dims}
                />
    }, [dependentVar, yScale, dims])

    return [xAxis, yAxis]
}


// TODO: These will be tweaked
export const plotGutterVertical = 15
export const plotGutterHorizontal = 15
const minPlotX = 250
const minPlotY = 250
// aspect ratio is width/height (I'm talking about the plot aspect ratio here, not the quantity in the data)
// const minPlotAspect = 0.5 // this turns out not to matter--we don't need to fill vertical space
const idealPlotAspect = 1.4
const maxPlotAspect = 2.5

// TODO: Add SvgYAxis (clipAvoidanceX, clipAvoidanceY, axisLabelOffset) and SvgXAxis (clipAvoidanceOffset) to this
// and make them proportional to the other hard-coded values for consistent styling
const fontPx = 10
const baseDims = {
    marginTop: 30,
    marginRight: 20,
    marginBottom: 60,
    marginLeft: 80,
    tickLength: 6,
    fontPx,
    pixelsPerTick: 3 * fontPx,
    clipAvoidanceXOffset: 30,
    clipAvoidanceYOffset: 20,
    axisLabelOffset: 15,
}

export const computePerPlotDimensions = (selectedNfps: number, spaceWidth: number, spaceHeight: number): [BoundedPlotDimensions, number] => {
    const colCount =  selectedNfps === 0 ? 5 : selectedNfps
    const availableWidth = spaceWidth - (plotGutterVertical * (colCount + 1)) // gutter's-width margin on either side
    const availableHeight = spaceHeight - plotGutterHorizontal * 2 // apply some margin
    let plotWidth = Math.max(availableWidth / colCount, minPlotX)
    let plotHeight = -1
    // if this width would result in vertical scroll for even a single graph, dial the width back
    if (plotWidth/maxPlotAspect > availableHeight) {
        plotWidth = availableHeight * maxPlotAspect
        plotHeight = availableHeight
    } else {
        // Use the height for the ideal aspect ratio, or if that's too short, the min plot height.
        plotHeight = Math.floor(Math.max(plotWidth/idealPlotAspect, minPlotY))
    }
    // We clamp the plot height to minPlotY, which matches minPlotX, so if we hit the clamp,
    // the worst we can do is make a square plot. So we'll never force an aspect ratio that's too low.

    const dims = {
        ...baseDims,
        height: plotHeight,
        width: plotWidth,
        boundedHeight: Math.max(0, plotHeight - baseDims.marginTop - baseDims.marginBottom),
        boundedWidth: Math.max(0, plotWidth - baseDims.marginRight - baseDims.marginLeft),
    }
    
    return [dims, colCount]
}
