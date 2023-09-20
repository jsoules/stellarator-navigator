import { DependentVariableOpt, Fields, IndependentVariableOpt } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions } from "@snTypes/Types"
import { ScaleLinear, scaleLinear } from "d3"
import { useMemo } from "react"
import SvgXAxis from "./SvgXAxis"
import SvgYAxis from "./SvgYAxis"



export const useXScale = (dataDomain: number[], width: number) => {
    const xScale = useMemo(() => {
        return scaleLinear()
            .domain((dataDomain ?? [0, 0]))
            .range([0, width])
    }, [dataDomain, width])
    return xScale
}


export const useYScale = (dataRange: number[], height: number) => {
    const yScale = useMemo(() => {
        const scale = scaleLinear()
            .domain(dataRange)
            .range([0, height])
        return scale
    }, [dataRange, height])
    return yScale
}


type useScalesProps = {
    dependentVar: DependentVariableOpt
    independentVar: IndependentVariableOpt
    dimsIn: BoundedPlotDimensions
}

export const useScales = (props: useScalesProps) => {
    const { dependentVar, independentVar, dimsIn } = props

    // TODO: Configure
    // TODO: AGAIN RESTRICT TO FILTERED VALUES
    const dataDomain = useMemo(() => {
        const baseRange = Fields[independentVar].range
        return [Math.min(0, baseRange[0]), baseRange[1]]
    }, [independentVar])
    const dataRange = useMemo(() => {
        const baseRange = Fields[dependentVar].range
        return [Math.min(0, baseRange[0]), baseRange[1]]
    }, [dependentVar])

    const xScale = useXScale(dataDomain, dimsIn.boundedWidth)
    const yScale = useYScale(dataRange, dimsIn.boundedHeight)

    return [xScale, yScale]
}

type axisProps = {
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never>
    dependentVar: DependentVariableOpt
    independentVar: IndependentVariableOpt
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
