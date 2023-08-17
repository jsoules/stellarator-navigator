// import * as d3 from "d3"
import { FunctionComponent } from "react"
import { DependentVariableOpt, StellaratorRecord } from "../../types/Types"
import { PlotDimensions } from "./SvgWrapper"


type ScatterplotProps = {
    data: StellaratorRecord[]
    dependentVar: DependentVariableOpt
    style: PlotDimensions
    // TODO: something about color palette
}

//   // Color scale: give me a specie name, I return a color
//   const color = d3.scaleOrdinal()
//     .domain(["setosa", "versicolor", "virginica" ])
//     .range([ "#440154ff", "#21908dff", "#fde725ff"])

// NOTE: THIS WILL REQUIRE REFFING THE DOTS
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
// 
// NOTE TO SELF: Need to change the render order so the highlighted species/element
// is drawn last (highest Z)


const SnScatterplot: FunctionComponent<ScatterplotProps> = (props: ScatterplotProps) => {
    console.log(`${props === undefined}`)
    return (<svg>

    </svg>)
}

export default SnScatterplot
