import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { filterNc, filterNfp } from '@snState/filter'
import { Fields, GlobalizationMethodNames } from '@snTypes/DataDictionary'
import { StellaratorRecord } from '@snTypes/Types'
import { FunctionComponent } from 'react'

type SnTableProps = {
    records: StellaratorRecord[]
    selectionHandler: (model: GridRowSelectionModel) => void
    activeNfp?: number
    activeNc?: number
}

const variableColumnsDefaultWidth = 110

const fieldnames = Object.keys(Fields)
const fixedWidthFields = fieldnames.filter(fn => Fields[fn].tableColumnWidth !== undefined)
const varWidthFields = fieldnames.filter(fn => Fields[fn].tableColumnWidth === undefined)

const fixedWidthCols: GridColDef[] = fixedWidthFields.map(f => {
    const fieldDef = Fields[f]
    const unitSuffix = fieldDef.unit === undefined ? '' : ` (${fieldDef.unit})`
    return {
        field: f,
        headerName: fieldDef.shortLabel,
        width: fieldDef.tableColumnWidth,
        description: fieldDef.description + unitSuffix,
        sortable: true
    }
})

const varWidthCols: GridColDef[] = varWidthFields.map(f => {
    const fieldDef = Fields[f]
    const unitSuffix = fieldDef.unit === undefined ? '' : ` (${fieldDef.unit})`
    return {
        field: f,
        headerName: fieldDef.shortLabel,
        description: fieldDef.description + unitSuffix,
        flex: 1,
        minWidth: variableColumnsDefaultWidth,
        sortable: true
    }
})

// TODO: improve hardcoding of field names

const SnTable: FunctionComponent<SnTableProps> = (props: SnTableProps) => {
    const { records, selectionHandler, activeNfp, activeNc } = props
    const filteredRecords = filterNc(filterNfp(records, activeNfp), activeNc)
    const columns = [...fixedWidthCols, ...varWidthCols]
    const rows = filteredRecords.map(r => {
        return {
            id: r.id,
            coilLengthPerHp: r.coilLengthPerHp,
            totalCoilLength: r.totalCoilLength,
            meanIota: r.meanIota,
            ncPerHp: r.ncPerHp,
            nfp: r.nfp,
            globalizationMethod: GlobalizationMethodNames[r.globalizationMethod],
            nFourierCoil: r.nFourierCoil,
            nSurfaces: r.nSurfaces,
            maxKappa: r.maxKappa.toFixed(5),
            maxMeanSquaredCurve: r.maxMeanSquaredCurve.toFixed(5),
            minIntercoilDist: r.minIntercoilDist.toFixed(5),
            qaError: (10 ** r.qaError).toExponential(4),
            gradient: (10 ** r.gradient).toExponential(4),
            aspectRatio: r.aspectRatio.toFixed(1),
            minorRadius: r.minorRadius.toFixed(3),
            volume: r.volume.toFixed(5),
            minCoil2SurfaceDist: r.minCoil2SurfaceDist.toFixed(5)
        }
    })
    // TODO: row selection feature slows down the UI something pretty fierce.
    // Can we fix it? Should we maybe omit it?

    return (
        <div style={{ height: 600, width: "100%" }}>
            <DataGrid
                columns={columns}
                rows={rows}
                onRowSelectionModelChange={(newRowSelectionModel) => {selectionHandler(newRowSelectionModel)}}
                checkboxSelection
                // can add initialState, pagination model, page size options
            />
        </div>
    )
}

export default SnTable
