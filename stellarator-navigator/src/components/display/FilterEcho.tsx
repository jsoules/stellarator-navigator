import { FunctionComponent } from "react"
import { FilterSettings } from "../../types/Types"

type Props = {
    s: FilterSettings
}

const FilterEcho: FunctionComponent<Props> = (props: Props) => {
    const { s } = props
    return (
        <div>
            <div>
                <span>Coil Length Per HP:</span>
                <span>{s.coilLengthPerHp}</span>
            </div>
            <div>
                <span>Coil Length (Total):</span>
                <span>{s.totalCoilLength}</span>
            </div>
            <div>
                <span>Mean Iota:</span>
                <span>{s.meanIota}</span>
            </div>
            <div>
                <span>NC Per HP:</span>
                <span>{s.ncPerHp}</span>
            </div>
            <div>
                <span>NFP:</span>
                <span>{s.nfp}</span>
            </div>
            <div>
                <span>Dependent Variable:</span>
                <span>{s.dependentVariable}</span>
            </div>
        </div>
    )
}

export default FilterEcho