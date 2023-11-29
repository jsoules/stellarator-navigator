import SnTable from "@snComponents/display/SnTable"
import { useDataGeometry } from "@snComponents/display/plots/PlotScaling"
import { HrBar } from "@snComponents/general"
import useFilterCallbacks from "@snControlComponents/SelectionControlCallbacks"
import SelectionControlPanel from "@snControlComponents/SelectionControlPanel"
import { NavigatorStateAction } from "@snState/NavigatorReducer"
import projectToPlottableData, { makeValsFromFieldname } from "@snState/projection"
import { ToggleableVariables } from "@snTypes/DataDictionary"
import { FilterSettings, StellaratorRecord } from "@snTypes/Types"
import useWindowDimensions from "@snUtil/useWindowDimensions"
import { Dispatch, FunctionComponent, useMemo } from "react"
import Splitter from "../components/Splitter"
import PlotGrid from "./PlotGrid"


const splitterInitialPosition = 500
const splitterWidthRolloff = 30

export type PlotDataSummary = {
    data: number[][][][]
    selected: boolean[][][][]
    fineSplitVals: number[]
    coarseSplitVals: number[]
    coarseSplitField?: ToggleableVariables
    fineSplitField?: ToggleableVariables
}
type plotHookType = (records: StellaratorRecord[],
                    filters: FilterSettings,
                    colorSplit: ToggleableVariables,
                    fineSplit: ToggleableVariables,
                    coarseSplit: ToggleableVariables) => PlotDataSummary

const usePlotData: plotHookType = (records, filters, colorSplit, fineSplit, coarseSplit) => {
    const res = useMemo(() => {
        const fineSplitVals = makeValsFromFieldname(fineSplit, filters, true)
        const coarseSplitVals = makeValsFromFieldname(coarseSplit, filters)
        const projectionCriteria = {
            data: records,
            yVar: filters.dependentVariable,
            xVar: filters.independentVariable,
            markedIds: filters.markedRecords,
            colorSplit,
            fineSplit,
            coarseSplit,
            fineSplitVals,
            coarseSplitVals
        }
        const { data, selected } = projectToPlottableData(projectionCriteria)
        return { data, selected, fineSplitVals, coarseSplitVals, coarseSplitField: coarseSplit, fineSplitField: fineSplit }
    }, [coarseSplit, colorSplit, filters, fineSplit, records])

    return res
}


type OverviewProps = {
    records: StellaratorRecord[]
    dispatch: Dispatch<NavigatorStateAction>
    filterSettings: FilterSettings
}

const Overview: FunctionComponent<OverviewProps> = (props: OverviewProps) => {
    const { records, dispatch, filterSettings } = props
    const {width, height} = useWindowDimensions()
    const callbacks = useFilterCallbacks(dispatch)
    const selectionUpdate = callbacks.handleUpdateMarks

    // Note: was height - 40, may need to reinstate to allow room for a banner
    const effectiveHeight = useMemo(() => height, [height])
    const effectiveWidth = useMemo(() => width - 40, [width])

    const plotDataSummary = usePlotData(records, filterSettings, ToggleableVariables.NC_PER_HP, ToggleableVariables.NFP, ToggleableVariables.NC_PER_HP)
    const dataGeometry = useDataGeometry(filterSettings)

    return (
        <div className="MainWindow ForceLightMode" style={{width: effectiveWidth, height: effectiveHeight}}>
            <Splitter
                width={width - splitterWidthRolloff}
                height={effectiveHeight}
                initialPosition={splitterInitialPosition}
            >
                <div>
                    <SelectionControlPanel filterSettings={filterSettings} callbacks={callbacks} />
                </div>
                <div>
                    <PlotGrid
                        width={width - splitterInitialPosition - splitterWidthRolloff}
                        height={effectiveHeight}
                        selectedRecords={records}
                        plotDataSummary={plotDataSummary}
                        dataGeometry={dataGeometry}
                        dependentVariable={filterSettings.dependentVariable}
                        independentVariable={filterSettings.independentVariable}
                        plotClickHandler={callbacks.handleUpdateSplitFieldValues}
                    />
                    <HrBar />
                    <SnTable
                        records={records}
                        markedIds={filterSettings.markedRecords}
                        selectionHandler={selectionUpdate}
                        filterCriteria={[filterSettings.coarsePlotSplit, filterSettings.finePlotSplit]}
                        filterValues={[filterSettings.coarsePlotSelectedValue, filterSettings.finePlotSelectedValue]}
                    />
                </div>
            </Splitter>
        </div>
    )
}

export default Overview