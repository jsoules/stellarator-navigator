import { Grid } from "@mui/material"
import { GridRowSelectionModel } from "@mui/x-data-grid"
import HrBar from "@snComponents/HrBar"
import OpenSelectedButton from "@snComponents/display/OpenSelected"
import SnTable from "@snDisplayComponents/SnTable"
import { computePerPlotDimensions, useAxes, useScales } from "@snPlots/PlotScaling"
import PlotWrapper from "@snPlots/PlotWrapper"
import { useOnClickPlot } from "@snPlots/interactions"
import { NavigatorContext } from "@snState/NavigatorContext"
import { DependentVariables, IndependentVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, FilterSettings, StellaratorRecord } from "@snTypes/Types"
import { ScaleLinear } from "d3"
import { FunctionComponent, useContext, useEffect, useMemo, useState } from "react"

type Props = {
    filters: FilterSettings
    selectionHandler: (model: GridRowSelectionModel) => void
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

const internalMargin = 20
const PlotGrid: FunctionComponent<Props> = (props: Props) => {
    const { filters, selectionHandler, width, height } = props
    const [activeNfp, setActiveNfp] = useState(1)
    const [activeNc, setActiveNc] = useState<number | undefined>(undefined)
    const plotClickHandler = useOnClickPlot(setActiveNfp, setActiveNc)

    // Fetch data
    const { fetchRecords, selection } = useContext(NavigatorContext)
    const allRecords = useMemo(() => fetchRecords(selection), [fetchRecords, selection])

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
    
    // TODO: Improved handling of SnTable records; don't redo the filter?
    const ncs = filters.ncPerHp.map((v, i) => (v ? i + 1 : void {})).filter(x => x !== undefined) as unknown as number[]
    const rows = (ncs.length === 0 ? [undefined] : ncs).map(
        nc => <Row
            key={`row-${nc}`}
            data={allRecords}
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

    return (
        <div style={{ margin: internalMargin }}>
            <Grid container>
                {rows}
            </Grid>
            <div>Current filter settings return {allRecords.length} devices.</div>

            <HrBar />
            <SnTable records={allRecords} selectionHandler={selectionHandler} activeNfp={activeNfp} activeNc={activeNc} />
            <div className="padded">
                <OpenSelectedButton markedIds={marks} />
            </div>
        </div>
    )
}

export default PlotGrid 