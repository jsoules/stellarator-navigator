
import { scaleLinear, scaleLog } from "d3"
import { FunctionComponent, useMemo } from "react"
import { DependentVariableOpt } from "../../types/Types"

type AxisProps = {
    dataRange: number[]
    canvasRange: number[]
    type: DependentVariableOpt
}

const leadingDigit = (v: number) => {
    return Math.round(v / (10 ** Math.floor(Math.log10(v))))
}
const logDisplayDigits = [1] // TODO: Needs to be more sophisticated: number of displayed digits shuld depend on 

const SvgYAxis: FunctionComponent<AxisProps> = (props: AxisProps) => {
    const { dataRange, canvasRange, type } = props

    // TODO: harmonize with x-ticks code
    // TODO: Customize range!! (or no?)
    const pixelsPerTick = 30
    const ticks = useMemo(() => {
        const realDataRange = type === 'qaError'
            ? [10 ** dataRange[0], 10 ** dataRange[1]]
            : canvasRange
        const yScale = type === 'qaError' ? scaleLog(realDataRange, canvasRange) : scaleLinear(dataRange, canvasRange)
        const height = canvasRange[1] - canvasRange[0]
        const targetTickCount = Math.max(1, Math.floor(height / pixelsPerTick))

        return yScale.ticks(targetTickCount)
        .map(value => ({
            value,
            yOffset: height - yScale(value),
            label: type !== 'qaError'
                    ? value.toFixed(1)
                    : logDisplayDigits.includes(leadingDigit(value)) ? value.toExponential(0) : ''
        }))

        // if (!useLog) {
        //     return yScale.ticks(targetTickCount)
        //         .map(value => ({
        //             value,
        //             yOffset: height - yScale(value)
        //         }))
        // }
        // const format = yScale.tickFormat(4)
        // return yScale.ticks(targetTickCount).map(format).map()
    }, [canvasRange, dataRange, type])

    // const powerOfTwo = (v: number) => Number.isInteger(Math.log2(Math.round(v / (10 ** Math.floor(Math.log10(v))))))
    
    // const logDisplayDigits = [8, 2, 4] // TODO: Needs to be more sophisticated: number of displayed digits shuld depend on 

    return (
        <svg>
            <path
                d={[
                    "M", 30, canvasRange[0] + 20,
                    "h", 6,
                    "V", canvasRange[1] + 20,
                    "h", -6,
                ].join(" ")}
                fill="none"
                stroke="currentColor"
            />
            {ticks.map(({ value, yOffset, label }) => {
                return (
                    <g
                        key={`ytick-${value}`}
                        // transform={`translate(${yOffset}, 0)`}
                        transform={`translate(36, ${yOffset + 20})`}
                    >
                        <line x2="-6" stroke="currentColor"
                        />
                        {/* // TODO: FIX WIDTH FOR GRIDLINE */}
                        {type === 'qaError' && leadingDigit(value) === 1 && <line x2="600" stroke="#cbcbcb" />}
                        <text
                            key={`yticklabel-${value}`}
                            style={{
                                fontSize: "10px",
                                textAnchor: "middle",
                                transform: "translateX(-20px) translateY(3px)"
                            }}
                            >
                            { label }
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

export default SvgYAxis
