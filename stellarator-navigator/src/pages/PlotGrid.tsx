import { Grid } from "@mui/material"
import { GridRowSelectionModel } from "@mui/x-data-grid"
import OpenSelectedButton from "@snComponents/display/OpenSelected"
import CanvasPlotLabel from "@snComponents/display/plots/CanvasPlotLabel"
import CanvasPlotWrapper from "@snComponents/display/plots/CanvasPlotWrapper"
import HrBar from "@snComponents/general/HrBar"
import SnTable from "@snDisplayComponents/SnTable"
import { computePerPlotDimensions, useAxes, useCanvasAxes, useDataGeometry, useScales } from "@snPlots/PlotScaling"
import PlotWrapper from "@snPlots/PlotWrapper"
import { useOnClickPlot } from "@snPlots/interactions"
import projectData from "@snState/projection"
import { DependentVariables, IndependentVariables, ToggleableVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, DataGeometry, FilterSettings, StellaratorRecord } from "@snTypes/Types"
import { ScaleLinear } from "d3"
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"

type Props = {
    filters: FilterSettings
    selectionHandler: (model: GridRowSelectionModel) => void
    selectedRecords: StellaratorRecord[]
    width: number
    height: number
}


const getSelectedNfps = (filters: FilterSettings): number[] => {
    const _nfps = (filters.nfp.map((v, i) => (v ? i + 1 : void {}))).filter(x => x !== undefined) as unknown as number[]
    const nfps = _nfps.length === 0 ? [1, 2, 3, 4, 5] : _nfps
    return nfps
}


const rectifySelectedTable = (activeNc: number | undefined, activeNfp: number, ncChecks: boolean[], nfps: number[]) => {
    const firstNc = ncChecks.findIndex(x => x) + 1
    const activeNcGood = (activeNc !== undefined) && ncChecks[activeNc - 1]

    const targetNc = firstNc === 0
        ? undefined
        : activeNcGood ? activeNc : firstNc

    const targetNfp = nfps.includes(activeNfp) ? activeNfp : nfps[0]

    return { targetNc, targetNfp }
}


type RowProps = {
    data: StellaratorRecord[]
    dependentVar: DependentVariables
    independentVar: IndependentVariables
    dims: BoundedPlotDimensions
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never>
    xAxis?: JSX.Element
    yAxis?: JSX.Element
    nfps: number[]
    nc?: number
    markedIds?: Set<number>
    colSpan: number
    clickHandler: (nfp: number, nc?: number) => void
}

const Row: FunctionComponent<RowProps> = (props: RowProps) => {
    const { data, dependentVar, independentVar, dims, xScale, yScale, xAxis, yAxis, nfps, nc, markedIds, colSpan, clickHandler } = props

    return <Grid container item>
        {nfps.map(nfp => {
            return (
                <Grid item xs={colSpan} key={`${nfp}`}>
                    <PlotWrapper
                        key={`${nfp}-${nc}`}
                        data={data}
                        dependentVar={dependentVar}
                        independentVar={independentVar}
                        xScale={xScale}
                        yScale={yScale}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        dims={dims}
                        markedIds={markedIds}
                        nfpValue={nfp}
                        ncPerHpValue={nc}
                        clickHandler={clickHandler}
                    />
                </Grid>
        )})}
    </Grid>
}

type CanvasRowProps = RowProps & {
    canvasXAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasYAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasPlotLabel: (ctxt: CanvasRenderingContext2D) => void
    geometry: DataGeometry
    dims: BoundedPlotDimensions
    realData: number[][][]
}

const CanvasRow: FunctionComponent<CanvasRowProps> = (props: CanvasRowProps) => {
    const { realData, colSpan, nfps, nc, geometry, canvasXAxis, canvasYAxis, canvasPlotLabel, dims, markedIds, clickHandler } = props

    return <Grid container item>
        {nfps.map((nfp, i) => {
            return (
                <Grid item xs={colSpan} key={`${nfp}`}>
                    <CanvasPlotWrapper
                        key={`${nfp}-${nc}`}
                        data={realData[i]}
                        dims={dims}
                        canvasXAxis={canvasXAxis}
                        canvasYAxis={canvasYAxis}
                        canvasPlotLabel={canvasPlotLabel}
                        geometry={geometry}
                        markedIds={markedIds}
                        nfpValue={nfp}
                        ncPerHpValue={nc}
                        clickHandler={clickHandler}
                    />
                </Grid>
            )
        })}
    </Grid>
}

const internalMargin = 20
const PlotGrid: FunctionComponent<Props> = (props: Props) => {
    const { filters, selectionHandler, selectedRecords, width, height } = props
    const [activeNfp, setActiveNfp] = useState(1)
    const [activeNc, setActiveNc] = useState<number | undefined>(undefined)
    const plotClickHandler = useOnClickPlot(setActiveNfp, setActiveNc)

    // Compute dimensions
    const nfps = getSelectedNfps(filters)
    const [dims] = useMemo(() => computePerPlotDimensions(nfps.length, width - 2*internalMargin, height), [height, nfps.length, width])

    useEffect(() => {
        const { targetNc, targetNfp } = rectifySelectedTable(activeNc, activeNfp, filters.ncPerHp, nfps)
        if (activeNc !== targetNc) {
            setActiveNc(targetNc)
        }
        if (activeNfp !== targetNfp) {
            setActiveNfp(targetNfp)
        }
    }, [activeNc, activeNfp, filters.ncPerHp, nfps])

    // Scales & Axes
    const [xScale, yScale] = useScales({filters, dimsIn: dims})
    const [xAxis, yAxis] = useAxes({
        xScale, yScale,
        dependentVar: filters.dependentVariable, independentVar: filters.independentVariable,
        dims
    })
    const marks = useMemo(() => filters.markedRecords, [filters])

    const dataGeometry = useDataGeometry(filters)
    
    // TODO: Improved handling of SnTable records; don't redo the filter?
    const ncs = filters.ncPerHp.map((v, i) => (v ? i + 1 : void {})).filter(x => x !== undefined) as unknown as number[]
    const rows = (ncs.length === 0 ? [undefined] : ncs).map(
        nc => <Row
            key={`row-${nc}`}
            data={selectedRecords}
            dependentVar={filters.dependentVariable}
            independentVar={filters.independentVariable}
            dims={dims}
            xScale={xScale}
            yScale={yScale}
            xAxis={xAxis}
            yAxis={yAxis}
            nfps={nfps}
            markedIds={marks}
            colSpan={0}
            nc={nc}
            clickHandler={plotClickHandler}
        />
    )

    // TODO: CLEAN THIS UP
    const [canvasXAxis, canvasYAxis] = useCanvasAxes({
        xScale, yScale,
        dependentVar: filters.dependentVariable, independentVar: filters.independentVariable,
        dims
    })
    // TODO: Label probably also needs to depend on the criteria and current value of same
    const canvasPlotLabel = useCallback((ctxt: CanvasRenderingContext2D) => {
        CanvasPlotLabel({dims}, ctxt)
    }, [dims])

    const projectionCriteria = {
        yVar: filters.dependentVariable,
        xVar: filters.independentVariable,
        data: selectedRecords,
        fineSplit: ToggleableVariables.NC_PER_HP, // field to use to color data series
        medSplit: ToggleableVariables.NFP         // field to use to separate plots within a row
    }
    const { data: canvasData } = projectData(projectionCriteria)

    const canvasRows = (ncs.length === 0 ? [undefined] : ncs).map(
        nc => <CanvasRow
            key={`row-${nc}`}
            data={selectedRecords}
            // CUT THESE
            dependentVar={filters.dependentVariable}
            independentVar={filters.independentVariable}
            xScale={xScale}
            yScale={yScale}
            xAxis={xAxis}
            yAxis={yAxis}
            // TO AT LEAST HERE
            nfps={nfps}
            markedIds={marks}
            colSpan={0}
            nc={nc}
            clickHandler={plotClickHandler}
            canvasXAxis={canvasXAxis}
            canvasYAxis={canvasYAxis}
            canvasPlotLabel={canvasPlotLabel}
            realData={canvasData[0]}
            geometry={dataGeometry}
            dims={dims}
        />
    )

    return (
        <div style={{ margin: internalMargin }}>
            <div>Current filter settings return {selectedRecords.length} devices.</div>
            <Grid container>
                {rows}
            </Grid>
            <Grid container>
                {canvasRows}
            </Grid>
            <HrBar />
            <SnTable records={selectedRecords} selectionHandler={selectionHandler} activeNfp={activeNfp} activeNc={activeNc} />
            <div className="padded">
                <OpenSelectedButton markedIds={marks} />
            </div>
        </div>
    )
}

export default PlotGrid 