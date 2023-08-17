import { FunctionComponent, useContext } from "react"
import { FilterSettings } from "../types/Types"

import SvgWrapper from "../components/display/SvgWrapper"
import { NavigatorContext } from "../state/NavigatorContext"

type Props = {
    s: FilterSettings
}

const FilterEcho: FunctionComponent<Props> = (props: Props) => {
    const { s } = props
    s.coilLengthPerHp = s.coilLengthPerHp ?? [-3, -1]
    s.totalCoilLength = s.totalCoilLength ?? [-10, -9]
    const { filterSettings, fetchRecords, selection } = useContext(NavigatorContext)
    const oneSelection = selection.keys().next().value as number
    const records = fetchRecords(new Set([oneSelection]))
    const allRecords = fetchRecords(selection)
    return (
        <div>
            <div>
                <span>Database info:</span>
                <ul>
                    <li>Current selection contains {selection.size} items</li>
                    <li>First such item: {JSON.stringify(records[0])}</li>
                    <li>Total records: {allRecords.length}</li>
                </ul>
                <div>
                    <SvgWrapper
                        useXAxis={true}
                        useYAxis={true}
                        data={allRecords}
                        // data={records}
                        // dependentVar={"maxMsc"}
                        dependentVar={filterSettings.dependentVariable}
                        requestedDims={{
                            marginTop: 20,
                            marginRight: 60,
                            marginBottom: 20,
                            marginLeft: 40
                        }}
                    />
                </div>
            </div>
            <div>
                <span>Coil Length Per HP:</span>
                <span>{filterSettings.coilLengthPerHp[0]} - {filterSettings.coilLengthPerHp[1]}</span>
            </div>
            <div>
                <span>Coil Length (Total):</span>
                <span>{filterSettings.totalCoilLength[0]} - {filterSettings.totalCoilLength[1]}</span>
            </div>
            <div>
                <span>Mean Iota:</span>
                <span>{filterSettings.meanIota}</span>
            </div>
            <div>
                <span>NC Per HP:</span>
                <ul>{filterSettings.ncPerHp.map((v, i) => <li key={`${i}-ncPerHp`}>{i+1}: {`${v}`}</li>)}</ul>
            </div>
            <div>
                <span>NFP:</span>
                <ul>{filterSettings.nfp.map((v, i) => <li key={`${i}-nfp`}>{i+1}: {`${v}`}</li>)}</ul>
            </div>
            <div>
                <span>Dependent Variable:</span>
                <span>{filterSettings.dependentVariable}</span>
            </div>
        </div>
    )
}

export default FilterEcho