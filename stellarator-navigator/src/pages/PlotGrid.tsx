import { Grid } from "@mui/material"
import { GridRowSelectionModel } from "@mui/x-data-grid"
import { Tol, convertHexToRgb3Vec } from "@snComponents/display/Colormaps"
import OpenSelectedButton from "@snComponents/display/OpenSelected"
import CanvasPlotLabel, { CanvasPlotLabelCallbackType } from "@snComponents/display/plots/CanvasPlotLabel"
import CanvasPlotWrapper from "@snComponents/display/plots/CanvasPlotWrapper"
import { resizeCanvas } from "@snComponents/display/plots/webgl/drawScatter"
import initProgram from "@snComponents/display/plots/webgl/drawingProgram"
import HrBar from "@snComponents/general/HrBar"
import SnTable from "@snDisplayComponents/SnTable"
import { computePerPlotDimensions, useCanvasAxes, useDataGeometry, useScales } from "@snPlots/PlotScaling"
import { useOnClickPlot } from "@snPlots/interactions"
import projectData from "@snState/projection"
import { ToggleableVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, FilterSettings, StellaratorRecord } from "@snTypes/Types"
import { nfpValidValues } from "@snTypes/ValidValues"
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"

const internalMargin = 20

type Props = {
    filters: FilterSettings
    selectionHandler: (model: GridRowSelectionModel) => void
    selectedRecords: StellaratorRecord[]
    width: number
    height: number
}


const getSelectedNfps = (filters: FilterSettings): number[] => {
    const _nfps = (filters.nfp.map((v, i) => (v ? i + 1 : void {}))).filter(x => x !== undefined) as unknown as number[]
    if (_nfps === undefined) throw Error("UNDEFINED NFPS IN getSelectedNfps")
    const nfps = _nfps.length === 0 ? nfpValidValues : _nfps
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


type CanvasRowProps = {
    colSpan: number
    markedIds?: Set<number> // FIXME
    nfps: number[]  // FIXME
    nc?: number     // FIXME
    clickHandler: (nfp: number, nc?: number) => void
    canvasXAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasYAxis: (ctxt: CanvasRenderingContext2D) => void
    canvasPlotLabel: CanvasPlotLabelCallbackType
    dims: BoundedPlotDimensions
    data: number[][][]
    scatterCtxt: WebGLRenderingContext | null
    loadData: (data: number[][]) => void
}

const CanvasRow: FunctionComponent<CanvasRowProps> = (props: CanvasRowProps) => {
    const { data, colSpan, nfps, nc, canvasXAxis, canvasYAxis, canvasPlotLabel, dims, markedIds, clickHandler, scatterCtxt, loadData } = props

    return <Grid container item>
        {nfps.map((nfp, idx) => {
            return (
                <Grid item xs={colSpan} key={`${nfp}`}>
                    <CanvasPlotWrapper
                        key={`${nfp}-${nc}`}
                        data={data[idx]}
                        dims={dims}
                        canvasXAxis={canvasXAxis}
                        canvasYAxis={canvasYAxis}
                        canvasPlotLabel={canvasPlotLabel}
                        markedIds={markedIds}
                        nfpValue={nfp}
                        ncPerHpValue={nc}
                        clickHandler={clickHandler}
                        scatterCtxt={scatterCtxt}
                        loadData={loadData}
                    />
                </Grid>
            )
        })}
    </Grid>
}

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
    const marks = useMemo(() => filters.markedRecords, [filters])

    const dataGeometry = useDataGeometry(filters)
    const ncs = filters.ncPerHp.map((v, i) => (v ? i + 1 : void {})).filter(x => x !== undefined) as unknown as number[]

    // TODO: CLEAN THIS UP
    const [canvasXAxis, canvasYAxis] = useCanvasAxes({
        xScale, yScale,
        dependentVar: filters.dependentVariable, independentVar: filters.independentVariable,
        dims
    })
    // TODO: Label probably also needs to depend on the criteria and current value of same
    const canvasPlotLabel: CanvasPlotLabelCallbackType = useCallback((ctxt, vals) => {
        CanvasPlotLabel({dims, coarseField: ToggleableVariables.NC_PER_HP, medField: ToggleableVariables.NFP}, ctxt, vals)
    }, [dims])

    const projectionCriteria = {
        yVar: filters.dependentVariable,
        xVar: filters.independentVariable,
        data: selectedRecords,
        fineSplit: ToggleableVariables.NC_PER_HP, // field to use to color data series
        medSplit: ToggleableVariables.NFP,        // field to use to separate plots within a row
        coarseSplit: ToggleableVariables.NC_PER_HP, // field to use to separate plots into different rows
        fineSplitVals: ncs,
        medSplitVals: nfps,
        coarseSplitVals: ncs
    }
    const { data: canvasData } = projectData(projectionCriteria)

    // TODO: Do refactor this all out somewhere else
    // TODO: Do something about cutting off at the right margin--give it a little bit more space without messing up the scale
    const offscreenCanvas = useMemo(() => new OffscreenCanvas(10, 10), [])
    const webglCtxt = useMemo(() => offscreenCanvas.getContext("webgl"), [offscreenCanvas])
    resizeCanvas({ctxt: webglCtxt, width: dims.boundedWidth, height: dims.boundedHeight})
    // TODO: Allow changing color palette
    const colorList = useMemo(() => (Tol).map(c => convertHexToRgb3Vec(c)), [])
    const configureCanvas = useMemo(() => initProgram(webglCtxt), [webglCtxt])
    const loadData = useMemo(() => configureCanvas(colorList, dataGeometry, dims.boundedWidth, dims.boundedHeight),
        [configureCanvas, colorList, dataGeometry, dims.boundedWidth, dims.boundedHeight])


    const canvasRows = ((ncs?.length ?? 0) === 0 ? [undefined] : ncs).map(
        (nc, idx) => <CanvasRow
            key={`row-${nc}`}
            nfps={nfps}
            markedIds={marks}
            colSpan={0}
            nc={nc}
            clickHandler={plotClickHandler}
            canvasXAxis={canvasXAxis}
            canvasYAxis={canvasYAxis}
            canvasPlotLabel={canvasPlotLabel}
            data={canvasData[idx]} // TODO: FIX THIS, don't hard-code NC as coarse split
            dims={dims}
            scatterCtxt={webglCtxt}
            loadData={loadData}
        />
    )

    return (
        <div style={{ margin: internalMargin }}>
            <div style={{ paddingBottom: 10 }}>Current filter settings return {selectedRecords.length} devices.</div>
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