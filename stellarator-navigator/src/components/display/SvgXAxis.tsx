// adapted from https://2019.wattenberger.com/blog/react-and-d3

import { scaleLinear } from "d3"
import { FunctionComponent, useMemo } from "react"

type AxisProps = {
    dataDomain: number[],
    canvasRange: number[]
}

const SvgXAxis: FunctionComponent<AxisProps> = (props: AxisProps) => {
    const { dataDomain, canvasRange } = props
    
    const ticks = useMemo(() => {
        const xScale = scaleLinear()
            .domain(dataDomain)
            .range(canvasRange)
        const width = canvasRange[1] - canvasRange[0]
        const pixelsPerTick = 30
        const targetTickCount = Math.max(1, Math.floor(width / pixelsPerTick))

        return xScale.ticks(targetTickCount)
            .map(value => ({
                value,
                xOffset: xScale(value)
            }))
    }, [canvasRange, dataDomain])

    return (
        <svg>
            <path
                d={[
                    "M", 6+canvasRange[0], 6,
                    "v", -6,
                    "H", 6+canvasRange[1],
                    "v", 6,
                ].join(" ")}
                fill="none"
                stroke="currentColor"
            />
            {ticks.map(({ value, xOffset }) => (
                <g
                    key={`xtick-${value}`}
                    transform={`translate(${xOffset + 6}, 0)`}
                >
                    <line
                        y2="6"
                        stroke="currentColor"
                    />
                    <text
                        key={value}
                        style={{
                            fontSize: "10px",
                            textAnchor: "middle",
                            transform: "translateY(20px)"
                    }}>
                        {/* TODO -- Format to limit decimals/digit count */}
                        { value }
                    </text>
                </g>
            ))}
        </svg>
    )
}

export default SvgXAxis
