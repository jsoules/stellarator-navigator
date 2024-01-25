import SnTable from "@snComponents/display/SnTable"
import { useDataGeometry } from "@snComponents/display/plots/PlotScaling"
import { defaultPlotColorProps, plotColorReducer } from "@snComponents/display/plots/interactions/plotColors"
import { usePlotData } from "@snComponents/display/plots/interactions/usePlotData"
import { HrBar } from "@snComponents/general"
import useFilterCallbacks from "@snControlComponents/SelectionControlCallbacks"
import SelectionControlPanel from "@snControlComponents/SelectionControlPanel"
import { NavigatorStateAction } from "@snState/NavigatorReducer"
import { FilterSettings, StellaratorRecord } from "@snTypes/Types"
import useWindowDimensions from "@snUtil/useWindowDimensions"
import { Dispatch, FunctionComponent, useMemo, useReducer } from "react"
import Splitter from "../components/Splitter"
import PlotGrid from "./PlotGrid"


const splitterInitialPosition = 500
const splitterWidthRolloff = 30


type OverviewProps = {
    records: StellaratorRecord[]
    dispatch: Dispatch<NavigatorStateAction>
    filterSettings: FilterSettings
}

const Overview: FunctionComponent<OverviewProps> = (props: OverviewProps) => {
    const { records, filterSettings } = props
    const {width, height} = useWindowDimensions()
    const [plotColorProps, plotColorPropsDispatch] = useReducer(plotColorReducer, defaultPlotColorProps)
    const callbacks = useFilterCallbacks(props.dispatch)
    const selectionUpdate = callbacks.handleUpdateMarks

    // Note: was height - 40, may need to reinstate to allow room for a banner
    const effectiveHeight = useMemo(() => height, [height])
    const effectiveWidth = useMemo(() => width - 40, [width])

    const plotDataSummary = usePlotData({ ...props, ...plotColorProps})
    const dataGeometry = useDataGeometry(filterSettings)

    return (
        <div className="MainWindow ForceLightMode" style={{width: effectiveWidth, height: effectiveHeight}}>
            <Splitter
                width={width - splitterWidthRolloff}
                height={effectiveHeight}
                initialPosition={splitterInitialPosition}
            >
                <div>
                    <SelectionControlPanel
                        filterSettings={filterSettings}
                        callbacks={callbacks}
                        colorProps={plotColorProps}
                        colorChgDispatcher={plotColorPropsDispatch}
                    />
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
                        plotColorProps={plotColorProps}
                        plotClickHandler={callbacks.handleUpdateFocusedPlotIndices}
                        resolveRangeChangeHandler={callbacks.handleRangesChange}
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