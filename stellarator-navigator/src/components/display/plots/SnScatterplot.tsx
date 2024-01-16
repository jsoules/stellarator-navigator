import { Tol } from "@snDisplayComponents/Colormaps"
import { StellaratorRecord } from "@snTypes/Types"
import { ScaleLinear, ScaleLogarithmic, ScaleOrdinal, scaleOrdinal } from "d3"
import { FunctionComponent } from "react"
// import { onClickDot, onHoverDot, onHoverOff } from "./interactions"
import { filterTo } from "@snState/filter"
import { DependentVariables, IndependentVariables, ToggleableVariables } from "@snTypes/DataDictionary"
import { onClickDot } from "./interactions/dotInteractions"


type ScatterplotProps = {
    data: StellaratorRecord[]
    dependentVar: DependentVariables
    independentVar: IndependentVariables
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
    yVar: DependentVariables
    xVar: IndependentVariables
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never> | ScaleLogarithmic<number, number, never>
    height: number
    colors: ScaleOrdinal<string, string, never>
    isMarked?: boolean
}


const Dot: FunctionComponent<dotProps> = (props: dotProps) => {
    const { rec, yVar, xVar, colors, xScale, yScale, height, isMarked } = props
    if (rec === undefined) return <></>

    const y = yScale(rec[yVar])
    if (isNaN(height - y)) {
        console.warn(`issue with record ${JSON.stringify(rec)} y was ${y}`)
    }
    return <circle
        key={`${rec.id}`}
        cx={xScale(rec[xVar])}
        cy={(height - y)}
        fill={colors(`${rec.ncPerHp}`)}
        r={isMarked ? "8" : "4"}
        onClick={() => onClickDot(rec.id)}
        // onMouseEnter={() => onHoverDot(rec.id)}
        // onMouseLeave={() => onHoverOff(rec.id)}
    />
}


const SnScatterplot: FunctionComponent<ScatterplotProps> = (props: ScatterplotProps) => {
    const { colormap, data, xScale, yScale, height, markedIds, dependentVar, independentVar, nfpValue, ncPerHpValue } = props
    if (data === undefined || data.length === 0) return <></>
    const _colors = (colormap ?? Tol) as string[]
    const color = scaleOrdinal()
        .domain(Array(_colors.length).fill(0).map((_, i) => `${i}`))
        .range(_colors) as ScaleOrdinal<string, string, never>

    const filters: {[key in ToggleableVariables]?: number | undefined} = {}
    filters[ToggleableVariables.NFP] = nfpValue
    filters[ToggleableVariables.NC_PER_HP] = ncPerHpValue
    const filteredData = filterTo(data, filters)

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

export default SnScatterplot
