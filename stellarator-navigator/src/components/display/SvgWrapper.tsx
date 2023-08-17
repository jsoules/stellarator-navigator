// Adapted from https://2019.wattenberger.com/blog/react-and-d3
import { scaleLinear } from "d3"
import { FunctionComponent, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DependentVariableOpt, StellaratorRecord } from "../../types/Types"
import { dependentVariableRanges } from "./DependentVariableConfig"
import HybridSnScatterplot from "./HybridSnScatterplot"
import { defaultStyling } from "./PlotDefaults"
import SvgXAxis from "./SvgXAxis"
import SvgYAxis from "./SvgYAxis"

export type PlotDimensions = {
    width?: number
    height?: number
    marginTop: number
    marginRight: number
    marginBottom: number
    marginLeft: number
}

export type BoundedPlotDimensions = PlotDimensions & {
    boundedHeight: number
    boundedWidth: number
}

// TODO: probably some auto-sizing nonsense or something
// actually better: TODO: Rework to use imperatively-set heights, don't bother with the resizeobserver.
// We're not going to keep them around since we have to redo all the work anyway if they resize.

const useChartDimensions = (divRef: MutableRefObject<Element | null>, dims: PlotDimensions) => {
    const dimensions = combineChartDimensions(dims)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
        if (!Array.isArray(entries)) return
        if (!entries.length) return
        const entry = entries[0]
        if (width != entry.contentRect.width)
            setWidth(entry.contentRect.width)
        if (height != entry.contentRect.height)
            setHeight(entry.contentRect.height)
    }, [height, width])

    useEffect(() => {
        if (divRef.current === null) return () => {}
        if (dimensions.width && dimensions.height)
            return () => {} // if dimensions are defined externally, they presumably won't change,
                            // so don't instantiate observer. Hence don't need cleanup code.
                            // TODO: Consider scratching this

        const element = divRef.current
        const resizeObserver = new ResizeObserver(handleResize)
        resizeObserver.observe(element)
        return () => resizeObserver.unobserve(element)
    }, [dimensions, divRef, handleResize])

    const newSettings = combineChartDimensions({
        ...dimensions,
        width: dimensions.width || width,
        height: dimensions.height || height,
    })
    return newSettings
  }

const combineChartDimensions = (dimsIn: PlotDimensions): BoundedPlotDimensions => {
    const parsedDimensions = {
        ...defaultStyling,
        ...dimsIn
        // marginTop: dimsIn.marginTop || 10,
        // marginRight: dimsIn.marginRight || 10,
        // marginBottom: dimsIn.marginBottom || 40,
        // marginLeft: dimsIn.marginLeft || 75,
    }
    return {
        ...parsedDimensions,
        boundedHeight: Math.max(
            (parsedDimensions.height ?? 0)
            - parsedDimensions.marginTop
            - parsedDimensions.marginBottom,
            0,
        ),
        boundedWidth: Math.max(
            (parsedDimensions.width ?? 0)
            - parsedDimensions.marginLeft
            - parsedDimensions.marginRight,
            0,
        ),
    }
}


type Props = {
    requestedDims: PlotDimensions
    data: StellaratorRecord[]
    dependentVar: DependentVariableOpt
    highlightedSeries?: number
    colorMap?: string[]
    useXAxis?: boolean
    useYAxis?: boolean
}

const SvgWrapper: FunctionComponent<Props> = (props: Props) => {
    const { requestedDims, useXAxis, useYAxis, data, dependentVar, highlightedSeries } = props
    // TODO: currently hardcoded to total-length --> change to make it configurable
    const dataDomain = useMemo(() => [0, 120], [])
    const dataRange = useMemo(() => {
        return dependentVariableRanges[dependentVar].range 
    }, [dependentVar])
    // const isLog = useMemo(() => dependentVariableRanges[dependentVar].isLog, [dependentVar])

    const ref = useRef(null)
    const dims = useChartDimensions(ref, requestedDims)

    // TODO: OFFLOAD THIS
    const xScale = useMemo(() => {
        return scaleLinear()
            .domain((dataDomain ?? [0, 0]))
            .range([0, dims.boundedWidth])
    }, [dataDomain, dims.boundedWidth])

    // TODO: MEMOIZE DOMAIN(), RANGE()

    const xAxis = useMemo(() => {
        return useXAxis ?
            <SvgXAxis
                dataDomain={xScale.domain()}
                canvasRange={xScale.range()}
            />
            : <></>
    }, [useXAxis, xScale])

    // TODO: OFFLOAD THIS AGAIN

    // NEEDS TO BE CONDITIONED ON DISPLAYED DATA, probably
    // const yScale = useMemo(() => {
    //     const scale = isLog ? scaleLog() : scaleLinear()
    //     return scale
    //         .domain(dataRange)
    //         .range([0, dims.boundedHeight])
    // }, [dataRange, dims.boundedHeight, isLog])
    const yScale = useMemo(() => {
        const scale = scaleLinear()
            .domain(dataRange)
            .range([0, dims.boundedHeight])
        return scale
    }, [dataRange, dims.boundedHeight])


    const yAxis = useMemo(() => {
        return useYAxis ?
            <SvgYAxis dataRange={yScale.domain()} canvasRange={yScale.range()} type={dependentVar}
            />
            : <></>
    }, [dependentVar, useYAxis, yScale])

    // -------

    const contentScaleTransform = useMemo(() =>
        `translate(${dims.marginLeft},${dims.marginTop})`,
        [dims.marginLeft, dims.marginTop]
    )

    // TODO: Globalize these little offsets, the -6, -36, -20 etc

    const xAxisTransform = useMemo(() => `translate(-6, ${dims.boundedHeight})`, [dims.boundedHeight])
    const yAxisTransform = useMemo(() => `translate(-36, -20)`, [])

    return (
        <div
            className="Chart__wrapper"
            ref={ref}
            style={{ height: "600px" }} // yeah no
        >
            <svg width={dims.width} height={dims.height}>
                <g transform={contentScaleTransform}>
                    <g transform={xAxisTransform}>
                        {xAxis}
                    </g>
                    <g transform={yAxisTransform}>
                        {yAxis}
                    </g>
                    <HybridSnScatterplot
                        data={data}
                        dependentVar={dependentVar}
                        xScale={xScale}
                        yScale={yScale}
                        height={dims.boundedHeight}
                        highlightedSeries={highlightedSeries}
                    />
                </g>
            </svg>
      </div>
    )
}

export default SvgWrapper
