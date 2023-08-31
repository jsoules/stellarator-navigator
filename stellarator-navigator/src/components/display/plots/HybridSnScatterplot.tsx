import { ScaleLinear, ScaleLogarithmic, scaleOrdinal, ScaleOrdinal } from "d3"
import { FunctionComponent } from "react"
import { filterNc, filterNfp } from "../../../logic/filter"
import { DependentVariableOpt, IndependentVariableOpt, StellaratorRecord } from "../../../types/Types"
import { WongCBFriendly } from "../Colormaps"
// import { onClickDot, onHoverDot, onHoverOff } from "./interactions"
import { onClickDot } from "./interactions"


type ScatterplotProps = {
    data: StellaratorRecord[]
    dependentVar: DependentVariableOpt
    independentVar: IndependentVariableOpt
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never> | ScaleLogarithmic<number, number, never>
    height: number
    markedIds?: Set<number>
    highlightedSeries?: number
    colormap?: string[]
    nfpValue?: number
    ncPerHpValue?: number
}


type dotProps = {
    rec: StellaratorRecord
    yVar: DependentVariableOpt
    xVar: IndependentVariableOpt
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never> | ScaleLogarithmic<number, number, never>
    height: number
    colors: ScaleOrdinal<string, string, never>
    isMarked?: boolean
}


const Dot: FunctionComponent<dotProps> = (props: dotProps) => {
    const { rec, yVar, xVar, colors, xScale, yScale, height, isMarked } = props
    if (rec === undefined) return <></>

    let y = 0
    switch (yVar) {
        case "maxKappa":
            y = yScale(rec.maxKappa)
            break
        case "maxMsc":
            y = yScale(rec.maxMsc)
            break
        case "minDist":
            y = yScale(rec.minDist)
            break
        case "qaError":
            y = yScale(rec.qaError)
            break
        default: y = 0
    }
    if (isNaN(height - y)) {
        console.log(`issue with record ${JSON.stringify(rec)} y was ${y}`)
    }
    return <circle
        key={`${rec.id}`}
        cx={xScale(xVar === 'total' ? rec.totalCoilLength : rec.coilLengthPerHp)}
        cy={(height - y)}
        fill={colors(`${rec.seed}`)}
        r={isMarked ? "8" : "4"}
        onClick={() => onClickDot(rec.id)}
        // onMouseEnter={() => onHoverDot(rec.id)}
        // onMouseLeave={() => onHoverOff(rec.id)}
    />
}


const HybridSnScatterplot: FunctionComponent<ScatterplotProps> = (props: ScatterplotProps) => {
    const { colormap, data, xScale, yScale, height, markedIds, dependentVar, independentVar, nfpValue, ncPerHpValue } = props
    if (data === undefined || data.length === 0) return <></>
    const _colors = (colormap ?? WongCBFriendly) as string[]
    const color = scaleOrdinal()
        .domain(['0', '1', '2', '3', '4', '5', '6', '7'])
        .range(_colors) as ScaleOrdinal<string, string, never>
    const filteredData = filterNc(filterNfp(data, nfpValue), ncPerHpValue)
    const dots = filteredData.map(rec => (
        <Dot key={`dot-${rec.id}`}
            rec={rec}
            yVar={dependentVar}
            xVar={independentVar}
            colors={color}
            xScale={xScale}
            yScale={yScale}
            height={height}
            isMarked={markedIds?.has(rec.id)}
        />))
    return dots
}

export default HybridSnScatterplot
