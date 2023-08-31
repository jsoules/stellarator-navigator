import { FunctionComponent, useContext, useRef } from "react"
import RecordManifest from "../components/display/RecordManifest"
import { useCoils } from "../components/display/fetch3dData"
import Scene3DPanelView from "../components/display/viewer"
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
    const apiCoils = useCoils({ recordId: `${id}` })
    return (
        <div>
            <div>
                <canvas ref={canvasRef} />
                {/* TODO: Don't restrict this width/height to these values, do something smarter */}
                <Scene3DPanelView width={800} height={640} canvasRef={canvasRef} coils={apiCoils} />
            </div>
            <RecordManifest rec={rec} />
        </div>
    )
}

export default Model