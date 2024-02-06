import { SupportedColorMap, SupportedColorPalette } from "@snComponents/display/Colormaps"
import SnTable from "@snComponents/display/SnTable"
import usePlotMouseHandlers from "@snComponents/display/plots/interactions/mouseInteractions"
import { defaultPlotColorProps, plotColorReducer } from "@snComponents/display/plots/interactions/plotColors"
import { usePlotData } from "@snComponents/display/plots/interactions/usePlotData"
import { computePerPlotDimensions, useDataGeometry } from "@snComponents/display/plots/layout/PlotScaling"
import ColorBar from "@snComponents/display/plots/legends/colorBar"
import PlotLegend from "@snComponents/display/plots/legends/plotLegend"
import { MarkedValueDesc, OverallHitCount } from "@snComponents/display/plots/plotFittings/PlotGridNotes"
import usePlotFittings from "@snComponents/display/plots/plotFittings/usePlotFittings"
import { HrBar } from "@snComponents/general"
import SelectionControlDrawer from "@snComponents/selectionControl/SelectionControlDrawer"
import ShowFiltersButton from "@snComponents/selectionControl/ShowFiltersButton"
import useFilterCallbacks from "@snControlComponents/SelectionControlCallbacks"
import SelectionControlPanel from "@snControlComponents/SelectionControlPanel"
import { NavigatorStateAction } from "@snState/NavigatorReducer"
import { DependentVariables, ToggleableVariables, fieldIsCategorical } from "@snTypes/DataDictionary"
import { FilterSettings, StellaratorRecord } from "@snTypes/Types"
import useWindowDimensions from "@snUtil/useWindowDimensions"
import { Dispatch, FunctionComponent, useMemo, useReducer, useState } from "react"
import PlotGrid from "./PlotGrid"


const drawerWidth = 500
const drawerClosedLeftMargin = 15
// const splitterWidthRolloff = 30
export const plotGridInternalMargin = 20


type OverviewProps = {
    records: StellaratorRecord[]
    dispatch: Dispatch<NavigatorStateAction>
    filterSettings: FilterSettings
}


const usePerPlotDimensions = (width: number, height: number, colCount: number) => {
    const _width = width - 2 * plotGridInternalMargin
    const _colCount = Math.max(1, colCount)
    return useMemo(() => (
        computePerPlotDimensions(_colCount, _width, height)
    ), [width, height, colCount])
}


const Overview: FunctionComponent<OverviewProps> = (props: OverviewProps) => {
    const { records, filterSettings } = props
    const {width, height} = useWindowDimensions()
    const [plotColorProps, plotColorPropsDispatch] = useReducer(plotColorReducer, defaultPlotColorProps)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const callbacks = useFilterCallbacks(props.dispatch)

    // Note: was height - 40, may need to reinstate to allow room for a banner
    // const effectiveHeight = useMemo(() => height, [height])
    const effectiveWidth = useMemo(() => width - 40, [width])
    
    
    // TODO: Can we further compress this logic preamble?
    const plotDataSummary = usePlotData({ ...props, ...plotColorProps})
    const dataGeometry = useDataGeometry(filterSettings)
    const contentDivLeftMargin = drawerOpen ? drawerWidth : drawerClosedLeftMargin
    const [plotDimensions] = usePerPlotDimensions(width - contentDivLeftMargin, height, plotDataSummary.fineSplitVals.length)
    const fittingsBase = {
        plotDimensions,
        dataGeometry,
        independentVariable: filterSettings.independentVariable,
        dependentVariable: filterSettings.dependentVariable
    }
    const mouseHandlers = usePlotMouseHandlers({
        ...fittingsBase,
        plotClickHandler: callbacks.handleUpdateFocusedPlotIndices,
        resolveRangeChangeHandler: callbacks.handleRangesChange,
    })
    const plotFittings = usePlotFittings({
        ...fittingsBase,
        fineSplitField: filterSettings.finePlotSplit,
        coarseSplitField: filterSettings.coarsePlotSplit
    })
    // TODO: Separate this out to reduce imports
    const legend = fieldIsCategorical(plotColorProps.colorSplit)    // if undefined, will be false
        ?   <PlotLegend
                var={plotColorProps.colorSplit as ToggleableVariables}
                style={plotColorProps.style as SupportedColorPalette}
                filters={filterSettings}
            />
        :   <ColorBar
                field={plotColorProps.colorSplit as DependentVariables}
                style={plotColorProps.style as SupportedColorMap}
                visRange={filterSettings[plotColorProps.colorSplit] as number[]}
            />
    

    return (
        <div
            className="MainWindow ForceLightMode"
            // style={{width: effectiveWidth, height: effectiveHeight}}
            style={{width: effectiveWidth}}
        >
            {/* <Splitter
                width={width - splitterWidthRolloff}
                height={effectiveHeight}
                initialPosition={splitterInitialPosition}
            > */}
                {/* <div> */}
                <SelectionControlDrawer
                    open={drawerOpen}
                    changeOpenState={setDrawerOpen}
                    width={drawerWidth}
                >
                    <SelectionControlPanel
                        filterSettings={filterSettings}
                        callbacks={callbacks}
                        colorProps={plotColorProps}
                        colorChgDispatcher={plotColorPropsDispatch}
                    />
                </SelectionControlDrawer>
                {/* </div> */}
                    <ShowFiltersButton openState={drawerOpen} changeOpenState={setDrawerOpen} />
                <div
                    // onClick={toggleControlDrawer(setDrawerOpen, false)}
                    // onKeyDown={toggleControlDrawer(setDrawerOpen, false)}
                    // className="plotGrid"
                    style={{
                        marginLeft: `${contentDivLeftMargin}px`
                    }}
                >
                    <OverallHitCount hits={records.length} />
                    <PlotGrid
                        plotDataSummary={plotDataSummary}
                        dataGeometry={dataGeometry}
                        plotDimensions={plotDimensions}
                        mouseHandlers={mouseHandlers}
                        plotFittings={plotFittings}
                        plotColorProps={plotColorProps}
                        focusCoarseValue={filterSettings.coarsePlotSelectedValue}
                        focusFineValue={filterSettings.finePlotSelectedValue}
                    />
                    {legend}
                    <MarkedValueDesc dependentVariable={filterSettings.dependentVariable} />
                    <HrBar />
                    <SnTable
                        records={records}
                        markedIds={filterSettings.markedRecords}
                        selectionHandler={callbacks.handleUpdateMarks}
                        filterCriteria={[filterSettings.coarsePlotSplit, filterSettings.finePlotSplit]}
                        filterValues={[filterSettings.coarsePlotSelectedValue, filterSettings.finePlotSelectedValue]}
                    />
                </div>
            {/* </Splitter> */}
        </div>
    )
}

export default Overview