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
            <img src={path} alt={`Poincare plot for device ${strId}`} />
        </div>
    )
}

export default PoincarePlot
