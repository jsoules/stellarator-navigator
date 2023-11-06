// import { Typography } from "@mui/material"
import { KnownPathType, makeResourcePath } from "@snUtil/useResourcePath"
import { FunctionComponent } from "react"

type PoincarePlotProps = {
    id: string
}

const PoincarePlot: FunctionComponent<PoincarePlotProps> = (props: PoincarePlotProps) => {
    const path = makeResourcePath(props.id, KnownPathType.POINCARE)
    return (
        <div className="poincareContainer">
            {/* <Typography align="center" fontWeight="bold">Poincaré Plots</Typography> */}
            <img src={path} alt={`Poincare plot for device ${props.id}`} className="poincareContainer" />
        </div>
    )
}

export default PoincarePlot
