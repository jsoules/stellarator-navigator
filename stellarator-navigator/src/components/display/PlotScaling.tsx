import { ScaleLinear, scaleLinear } from "d3"
import { useMemo } from "react"
import { BoundedPlotDimensions, DependentVariableOpt, IndependentVariableOpt } from "../../types/Types"
import { dependentVariableRanges, independentVariableRanges } from "./DependentVariableConfig"
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
    const dataDomain = useMemo(() => independentVariableRanges[independentVar].range, [independentVar])
    const dataRange = useMemo(() => {
        return dependentVariableRanges[dependentVar].range 
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
const plotGutterVertical = 15
export const plotGutterHorizontal = 15
const minPlotX = 250
const minPlotY = 250
// aspect ratio is width/height
// const minPlotAspect = 0.5
const idealPlotAspect = 1.6
const maxPlotAspect = 2.5

// TODO: Add the font, offsets, etc. for the axes to this
const baseDims = {
    marginTop: 30,
    marginRight: 20,
    marginBottom: 60,
    marginLeft: 80,
}

export const computePerPlotDimensions = (selectedNfps: number, spaceWidth: number, spaceHeight: number): [BoundedPlotDimensions, number] => {
    const colCount =  selectedNfps === 0 ? 5 : selectedNfps
    const availableWidth = spaceWidth - (plotGutterVertical * (colCount + 1)) // gutter's-width margin on either side
    const availableHeight = spaceHeight - plotGutterHorizontal * 2 // apply some margin
    let plotWidth = Math.max(availableWidth / colCount, minPlotX)
    let plotHeight = -1
    // if this width would result in having to scroll for even a single graph, dial the width back
    if (plotWidth/maxPlotAspect > availableHeight) {
        plotWidth = availableHeight * maxPlotAspect
        plotHeight = availableHeight
    } else {
        // Use the height for the ideal aspect ratio, or if that's too short, the min plot height.
        plotHeight = Math.floor(Math.max(plotWidth/idealPlotAspect, minPlotY))
    }
    // TODO: Are there circumstances where we'd need to recorrect this further?
    // We clamp the plot height to minPlotY, which matches minPlotX, so if we hit the clamp,
    // the worst we can do is a square plot. I think we're fine?

    const dims = {
        ...baseDims,
        height: plotHeight,
        width: plotWidth,
        boundedHeight: Math.max(0, plotHeight - baseDims.marginTop - baseDims.marginBottom),
        boundedWidth: Math.max(0, plotWidth - baseDims.marginRight - baseDims.marginLeft),
        tickLength: 6,
        fontPx: 10,
        pixelsPerTick: 30
    }
    
    return [dims, colCount]
}
