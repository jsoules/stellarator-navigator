import { FunctionComponent, useContext } from "react"
import { FilterSettings } from "../types/Types"

import { useAxes, useScales } from "../components/display/plots/PlotScaling"
import SvgWrapper from "../components/display/plots/SvgWrapper"
import { NavigatorContext } from "../state/NavigatorContext"

type Props = {
    s: FilterSettings
}

// If using context, probably don't need to pass in explicitly?
const FilterEcho: FunctionComponent<Props> = () => {
    const { filterSettings, fetchRecords, selection } = useContext(NavigatorContext)
    filterSettings.totalCoilLength = filterSettings.totalCoilLength ?? [-10, -9]
    filterSettings.coilLengthPerHp = filterSettings.coilLengthPerHp ?? [-3, -1]
    const oneSelection = selection.keys().next().value as number
    const records = fetchRecords(new Set([oneSelection]))
    const allRecords = fetchRecords(selection)
    // const dataDomain = useMemo(() => {
    //     return [filterSettings.totalCoilLength[0], filterSettings.totalCoilLength[1]]
    // }, [filterSettings.totalCoilLength])
    const nfp = filterSettings.nfp.findIndex(s => s)
    const nc = filterSettings.ncPerHp.findIndex(s => s)
    const requestedDims = {
        marginTop: 20,
        marginRight: 20,
        marginBottom: 60,
        marginLeft: 80,
        height: 400,
        width: 640,
        boundedHeight: 400 - 20 - 60,
        boundedWidth: 640 - 20 - 80,
        tickLength: 6,
        fontPx: 10,
        pixelsPerTick: 30
    }
    const [xScale, yScale] = useScales({dependentVar: filterSettings.dependentVariable, independentVar: filterSettings.independentVariable, dimsIn: requestedDims})
    const [xAxis, yAxis] = useAxes({
        xScale, yScale,
        dependentVar: filterSettings.dependentVariable, independentVar: filterSettings.independentVariable,
        dims: requestedDims
    })
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
                        data={allRecords}
                        // data={records}
                        dependentVar={filterSettings.dependentVariable}
                        independentVar={filterSettings.independentVariable}
                        xScale={xScale}
                        yScale={yScale}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        dims={requestedDims}
                        nfpValue={nfp}
                        ncPerHpValue={nc === -1 ? undefined : nc}
                        clickHandler={() => {}}
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