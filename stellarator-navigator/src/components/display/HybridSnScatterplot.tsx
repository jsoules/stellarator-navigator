import { ScaleLinear, ScaleLogarithmic, scaleOrdinal, ScaleOrdinal } from "d3"
import { FunctionComponent } from "react"
import { DependentVariableOpt, StellaratorRecord } from "../../types/Types"
import { WongCBFriendly } from "./Colormaps"


type ScatterplotProps = {
    data: StellaratorRecord[]
    dependentVar: DependentVariableOpt
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never> | ScaleLogarithmic<number, number, never>
    height: number
    highlightedSeries?: number
    colormap?: string[]
}

// NOTE: THIS WOULD REQUIRE REFFING THE DOTS
// --> So we would do it instead with props passed through to the dots
//  // Highlight the specie that is hovered
//  const highlight = function(event,d){

//     selected_specie = d.Species

//     d3.selectAll(".dot")
//       .transition()
//       .duration(200)
//       .style("fill", "lightgrey")
//       .attr("r", 3)

//     d3.selectAll("." + selected_specie)
//       .transition()
//       .duration(200)
//       .style("fill", color(selected_specie))
//       .attr("r", 7)
//   }

type dotProps = {
    rec: StellaratorRecord
    yVar: DependentVariableOpt
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never> | ScaleLogarithmic<number, number, never>
    height: number
    colors: ScaleOrdinal<string, string, never>
}

const Dot: FunctionComponent<dotProps> = (props: dotProps) => {
    const { rec, yVar, colors, xScale, yScale, height } = props
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
    // console.log(`point ${rec.id} ${height} ${y} cy ${height - y}`)
    return <circle
        cx={xScale(rec.totalCoilLength)}
        cy={(height - y)}
        fill={colors(`${rec.seed}`)}
        r="4"
        onClick={() => console.log(`Clicked id ${rec.id}`)}
    />
}


const HybridSnScatterplot: FunctionComponent<ScatterplotProps> = (props: ScatterplotProps) => {
    const { colormap, data, xScale, yScale, height, dependentVar } = props
    if (data === undefined || data.length === 0) return <></>
    const _colors = (colormap ?? WongCBFriendly) as string[]
    const color = scaleOrdinal()
        .domain(['0', '1', '2', '3', '4', '5', '6', '7'])
        .range(_colors) as ScaleOrdinal<string, string, never>
    const dots = data.map(rec => (<Dot rec={rec} yVar={dependentVar} colors={color} xScale={xScale} yScale={yScale} height={height}/>))
    return dots
}

export default HybridSnScatterplot
