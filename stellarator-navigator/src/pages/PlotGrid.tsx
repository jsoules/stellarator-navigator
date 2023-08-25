import { Grid } from "@mui/material"
import { GridRowSelectionModel } from "@mui/x-data-grid"
import { ScaleLinear } from "d3"
import { FunctionComponent, useContext, useMemo, useState } from "react"
import { computePerPlotDimensions, useAxes, useScales } from "../components/display/PlotScaling"
import SnTable from "../components/display/SnTable"
import SvgWrapper from "../components/display/SvgWrapper"
import { useOnClickPlot } from "../components/display/interactions"
import { NavigatorContext } from "../state/NavigatorContext"
import { BoundedPlotDimensions, DependentVariableOpt, FilterSettings, IndependentVariableOpt, StellaratorRecord } from "../types/Types"

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


type RowProps = {
    data: StellaratorRecord[]
    dependentVar: DependentVariableOpt
    independentVar: IndependentVariableOpt
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
                    <SvgWrapper
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
    const [dims, colCount] = useMemo(() => computePerPlotDimensions(nfps.length, width, height), [height, nfps.length, width])

    // TODO: Filter data domain?
    // const dataDomain = useMemo(() => [filters.totalCoilLength[0], filters.totalCoilLength[1]], [filters.totalCoilLength])

    // Scales & Axes
    const [xScale, yScale] = useScales({dependentVar: filters.dependentVariable, independentVar: filters.independentVariable, dimsIn: dims})
    const [xAxis, yAxis] = useAxes({
        xScale, yScale,
        dependentVar: filters.dependentVariable, independentVar: filters.independentVariable,
        dims
    })
    const marks = useMemo(() => filters.markedRecords, [filters])
    
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
        <div style={{ margin: 20 }}>
            <Grid container>
                {rows}
            </Grid>
            Currently each plot is {dims.width} x {dims.height} with {nfps.length} ({colCount}) columns.

            Will need to work out how to display the 3D--we probably need to convert
            everything to something more three.js-friendly.
            <hr style={{width: "75%"}} />
            <SnTable records={allRecords} selectionHandler={selectionHandler} activeNfp={activeNfp} activeNc={activeNc} />
        </div>
    )
}

export default PlotGrid 