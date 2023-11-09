import { FunctionComponent } from "react"

type Props = {
    width?: number | string
}

const defaultWidth = "75%"

const HrBar: FunctionComponent<Props> = (props: Props) => {
    const { width } = props

    return <div className="hrWrapper">
        <hr style={{width: width ?? defaultWidth}} />
    </div>
}

export default HrBar
