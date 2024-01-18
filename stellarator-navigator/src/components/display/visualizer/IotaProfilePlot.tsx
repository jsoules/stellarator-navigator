import useBestFitLine from "@snUtil/useBestFitLine"
import { ScaleLinear, scaleLinear } from "d3"
import { FunctionComponent, useMemo } from "react"
import { baseDims } from "../plots/PlotScaling"
import SvgXAxis from "../plots/SvgXAxis"
import SvgYAxis from "../plots/SvgYAxis"


type Props = {
    iotaProfile: number[],
    tfProfile: number[],
    meanIota: number,
    width: number,
    height: number,
    // dims: BoundedPlotDimensions
}


const getRange = (dataSeries: number[]) => {
    const range = [Math.min(...dataSeries), Math.max(...dataSeries)]
    return { range }
}

const fontPx = 10

const contentScaleTransform = `translate(${baseDims.marginLeft},${baseDims.marginTop})`


const useTitleGroup = (width: number) => {
    return useMemo(() =>
        <g transform={`translate(${baseDims.marginLeft + width/2}, ${1.7*fontPx})`}>
            <text
                style={{
                    fontSize: `${1.7*fontPx}px`,
                    textAnchor: "middle"
                }}
            >
                Iota Profile
            </text>
        </g>
    , [width])
}


type LinearScale = ScaleLinear<number, number>
const useIotaContent = (iotaProf: number[], tfProf: number[], canvasHeight: number, xScale: LinearScale, yScale: LinearScale) => {

    const dots = useMemo(() => (
        tfProf.map((v, i) => {
            const x = xScale(v)
            const y = yScale(iotaProf[i])
            return <circle
                key={`dot-${i}`}
                cx={x}
                cy={canvasHeight - y}
                fill={'#000000'}
                r="4"
            />
        })
    ), [canvasHeight, iotaProf, tfProf, xScale, yScale])

    const data = tfProf.map((v, i) => [v, iotaProf[i]])
    const {slope, intercept} = useBestFitLine(data)
    const line = useMemo(() => {
        const nativeX1 = xScale.domain()[0]
        const nativeX2 = xScale.domain()[1]
        const realizedY1 = yScale(intercept + (slope * nativeX1))
        const realizedY2 = yScale(intercept + (nativeX2 * slope))

        // Constrain those to what's actually on the canvas
        // nativeX1, nativeX2 are presumptively on-canvas
        // so if either realized Y is negative or exceeds canvasHeight, we need to recompute the X that would correspond to the boundary.
        // TK -- wait until confirmation from AG
        
        return <line
                    key={`BestFitLine`}
                    x1={xScale(nativeX1)}
                    y1={canvasHeight - realizedY1}
                    x2={xScale(nativeX2)}
                    y2={canvasHeight - realizedY2}
                    stroke="black" />
    }, [canvasHeight, intercept, slope, xScale, yScale])

    return [line, dots]
}


const IotaProfilePlot: FunctionComponent<Props> = (props: Props) => {
    const { iotaProfile, tfProfile, width, height, meanIota } = props
    // const { xRange, yRange } = getRanges(iotaProfile)
    // const xSpan = xRange[1] - xRange[0]
    const { range } = getRange(iotaProfile)
    const ySpan = range[1] - range[0]
    // const broadXrange = useMemo(() => [Math.max(0, xRange[0] - xSpan * .2), xRange[1] + xSpan * .2], [xRange, xSpan])
    const broadXrange = useMemo(() => [0, 1], [])
    const broadYrange = useMemo(() => [Math.max(0, range[0] - ySpan * .2), range[1] + ySpan * .2], [range, ySpan])
    const boundedDims = useMemo(() => ({
        ...baseDims,
        height,
        boundedHeight: Math.max(0, height - baseDims.marginTop - baseDims.marginBottom),
        width,
        boundedWidth: Math.max(0, width - baseDims.marginRight - baseDims.marginLeft)
    }), [height, width])
    const xScale = useMemo(() => {
        return scaleLinear()
            .domain(broadXrange)
            .range([0, boundedDims.boundedWidth])
    }, [boundedDims.boundedWidth, broadXrange])
    const yScale = useMemo(() => {
        return scaleLinear()
            .domain(broadYrange)
            .range([0, boundedDims.boundedHeight])
    }, [boundedDims.boundedHeight, broadYrange])

    const xAxis = useMemo(() => <SvgXAxis
                                    dataRange={xScale.domain()}
                                    canvasRange={xScale.range()}
                                    dims={boundedDims}
                                    axisLabel="Normalized toroidal flux"
                                    isLog={false}
                                    isY={false}
                                />,
        [boundedDims, xScale])
    const yAxis = useMemo(() => <SvgYAxis
                                    dataRange={yScale.domain()}
                                    canvasRange={yScale.range()}
                                    axisLabel="Rotational transform value"
                                    isLog={false}
                                    markedValue={meanIota}
                                    dims={boundedDims}
                                    isY={true}
                                />,
        [boundedDims, meanIota, yScale])
    return (
        <div
            className="iotaProfileWrapper"
            style={{ width, height }}
        >
            <svg width={width} height={height}>
                {useTitleGroup(boundedDims.boundedWidth)}
                <g transform={contentScaleTransform}>
                    {xAxis}
                    {yAxis}
                    {useIotaContent(iotaProfile, tfProfile, boundedDims.boundedHeight, xScale, yScale)}
                </g>
            </svg>
        </div>)
}

export default IotaProfilePlot
