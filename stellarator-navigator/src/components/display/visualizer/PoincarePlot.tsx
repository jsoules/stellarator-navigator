// import { Typography } from "@mui/material"
import { KnownPathType } from "@snTypes/DataDictionary"
import makeResourcePath, { getStringId } from "@snUtil/makeResourcePath"
import { FunctionComponent } from "react"

type PoincarePlotProps = {
    id: string
}

const PoincarePlot: FunctionComponent<PoincarePlotProps> = (props: PoincarePlotProps) => {
    const path = makeResourcePath(getStringId(props.id), KnownPathType.POINCARE)
    return (
        <div className="poincareContainer">
            {/* <Typography align="center" fontWeight="bold">Poincaré Plots</Typography> */}
            <img src={path} alt={`Poincare plot for device ${props.id}`} className="poincareContainer" />
        </div>
    )
}

export default PoincarePlot
