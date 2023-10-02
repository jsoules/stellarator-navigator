// import { Typography } from "@mui/material"
import useResourcePath, { KnownPathType, getStringId } from "@snUtil/useResourcePath"
import { FunctionComponent } from "react"

type PoincarePlotProps = {
    id: number
}

const PoincarePlot: FunctionComponent<PoincarePlotProps> = (props: PoincarePlotProps) => {
    const strId = getStringId(props.id)
    const path = useResourcePath(strId, KnownPathType.POINCARE)
    return (
        <div className="poincareContainer">
            {/* <Typography align="center" fontWeight="bold">Poincaré Plots</Typography> */}
            <img src={path} alt={`Poincare plot for device ${strId}`} className="poincareContainer" />
        </div>
    )
}

export default PoincarePlot
