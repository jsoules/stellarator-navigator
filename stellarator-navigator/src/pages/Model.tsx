import { FunctionComponent, useContext } from "react"
import RecordManifest from "../components/display/RecordManifest"
import { NavigatorContext } from "../state/NavigatorContext"
// import { StellaratorRecord } from "../types/Types"

type ModelProps = {
    id: number | string
    // record: StellaratorRecord
}


const Model: FunctionComponent<ModelProps> = (props: ModelProps) => {
    // const { id, record } = props
    const { id } = props
    const { fetchRecords } = useContext(NavigatorContext)
    const numericId = typeof(id) === "number" ? id : parseInt(id)
    const rec = fetchRecords(new Set([numericId]))[0]
    return (
        <div>
            // TODO CANVAS
            <RecordManifest rec={rec} />
        </div>
    )
}

export default Model