import { Dispatch, SetStateAction, useCallback } from "react"

export const useOnClickPlot = (setActiveNfp: Dispatch<SetStateAction<number>>, setActiveNc: Dispatch<SetStateAction<number | undefined>>) => {
    return useCallback((nfp: number, nc?: number) => {
        setActiveNfp(nfp)
        setActiveNc(nc)
    }, [setActiveNc, setActiveNfp])
}

// export const getOnClickPlot = (nfp: number, ncPerHp?: number) => {
//     console.log(`Click received for plot: ${nfp}-${ncPerHp}`)
// }

export const onHoverDot = (id: number) => {
    console.log(`Hovered ${id}`)
}

export const onHoverOff = (id: number) => {
    console.log(`Stopped hovering ${id}`)
}

export const onClickDot = (id: number) => {
    console.log(`Clicked dot for record ${id}`)
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

