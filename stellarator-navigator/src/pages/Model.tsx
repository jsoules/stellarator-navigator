import { FunctionComponent, useContext, useRef } from "react"
import RecordManifest from "../components/display/RecordManifest"
import SimulationView from "../components/display/SimulationView"
import { useCoils, useSurfaces } from "../components/display/fetch3dData"
import { NavigatorContext } from "../state/NavigatorContext"

type ModelProps = {
    id: number | string
}


const Model: FunctionComponent<ModelProps> = (props: ModelProps) => {
    const { id } = props
    const { fetchRecords } = useContext(NavigatorContext)
    const canvasRef = useRef(null)
    const numericId = typeof(id) === "number" ? id : parseInt(id)
    const rec = fetchRecords(new Set([numericId]))[0]
    // const coils = getCoils({ recordId: "63600" })
    const coils = useCoils({ recordId: `${id}` })
    const surfs = useSurfaces({ recordId: `${id}` })
    return (
        <div>
            <div>
                <canvas ref={canvasRef} />
                {/* TODO: Don't restrict this width/height to these values, do something smarter */}
                <SimulationView width={800} height={640} canvasRef={canvasRef} coils={coils} surfs={surfs} />
            </div>
            <RecordManifest rec={rec} />
        </div>
    )
}

export default Model