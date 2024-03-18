import { DependentVariables, Fields, IndependentVariables, RangeVariables, getEnumVals } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, DataGeometry, FilterSettings } from "@snTypes/Types"
import { useCallback, useMemo } from "react"


export const useDataGeometry = (filters: FilterSettings): DataGeometry => {
    const independentVar = filters.independentVariable
    const dependentVar = filters.dependentVariable
    const rangeVals = getEnumVals(RangeVariables)

    const { low: xmin, high: xmax } = getExtrema(filters, independentVar, rangeVals.includes(independentVar))
    const { low: ymin, high: ymax } = getExtrema(filters, dependentVar, rangeVals.includes(dependentVar))
    return useMemo(() => ({ xmin, xmax, ymin, ymax }), [xmax, xmin, ymax, ymin])
}


const getExtrema = (filters: FilterSettings, field: IndependentVariables | DependentVariables, validRangeField: boolean) => {
    const baseRange = Fields[field].range
    const range = (validRangeField ? (filters[field] ?? []) : baseRange) as number[]
    const low = baseRange[0] === range[0] ? Math.min(0, range[0]) : range[0]
    const high = range[1]
    return ({low, high})
}


// TODO: These may be tweaked
export const plotGutterVertical = 15
export const plotGutterHorizontal = 30
const minPlotX = 270
const minPlotY = 270
// aspect ratio is width/height (I'm talking about the plot aspect ratio here, not the quantity in the data)
// const minPlotAspect = 0.5 // this turns out not to matter--we don't need to fill vertical space
const idealPlotAspect = 1.4
const maxPlotAspect = 2.5
const MaxPlotHeightFraction = 0.66  // upper bound on how much window space the plots are allocated
// TODO query: set a max width?

// TODO: Add SvgYAxis (clipAvoidanceX, clipAvoidanceY, axisLabelOffset) and SvgXAxis (clipAvoidanceOffset) to this
// and make them proportional to the other hard-coded values for consistent styling
const fontPx = 10
export const baseDims = {
    // marginTop: 30,
    marginTop: 40,
    marginRight: 20,
    marginBottom: 45,
    marginLeft: 80,
    tickLength: 6,
    fontPx,
    pixelsPerTick: 3 * fontPx,
    clipAvoidanceXOffset: 30,
    clipAvoidanceYOffset: 20,
    axisLabelOffset: 15,
}


export const computePerPlotDimensions = (colCount: number, spaceWidth: number, spaceHeight: number): [BoundedPlotDimensions, number] => {
    const availableWidth = spaceWidth - (plotGutterVertical * (colCount + 1)) // gutter's-width margin on either side
    const availableHeight = (spaceHeight - plotGutterHorizontal * 2) * MaxPlotHeightFraction // apply some margin
    let plotWidth = Math.max(availableWidth / colCount, minPlotX)
    let plotHeight = -1
    // if this width would result in vertical scroll for even a single graph, dial the width back
    if (plotWidth/maxPlotAspect > availableHeight) {
        plotWidth = availableHeight * maxPlotAspect
        plotHeight = availableHeight
    } else {
        // Use the height for the ideal aspect ratio, or if that's too short, the min plot height.
        plotHeight = Math.floor(Math.min(plotWidth/idealPlotAspect, Math.max(availableHeight, minPlotY)))
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


export type ClickToDataCallbackType = (clickX: number, clickY: number) => number[]
export const usePixelToDataConversions = (dims: BoundedPlotDimensions, dataGeometry: DataGeometry) => {
    const chartXSpan = dims.boundedWidth
    const chartYSpan = dims.boundedHeight
    const dataXSpan = dataGeometry.xmax - dataGeometry.xmin
    const dataYSpan = dataGeometry.ymax - dataGeometry.ymin

    const xDataPerPixel = dataXSpan / chartXSpan
    const yDataPerPixel = dataYSpan / chartYSpan

    const interpretClick: ClickToDataCallbackType = useCallback((clickX: number, clickY: number) => {
        const dataX = ((clickX - dims.marginLeft) * xDataPerPixel) + dataGeometry.xmin
        const dataY = dataGeometry.ymax - ((clickY - dims.marginTop) * yDataPerPixel)
        return [dataX, dataY]
    }, [dataGeometry.xmin, dataGeometry.ymax, dims.marginLeft, dims.marginTop, xDataPerPixel, yDataPerPixel])


    return { interpretClick, xDataPerPixel, yDataPerPixel }
}
