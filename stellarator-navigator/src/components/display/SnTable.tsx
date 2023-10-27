import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { filterTo } from '@snState/filter'
import { Fields, GlobalizationMethodNames, KnownFields, ToggleableVariables } from '@snTypes/DataDictionary'
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
const displayed = fieldnames.filter(fn => Fields[fn as KnownFields].displayInTable)
const fixedWidthFields = displayed.filter(fn => Fields[fn as KnownFields].tableColumnWidth !== undefined)
const varWidthFields = displayed.filter(fn => Fields[fn as KnownFields].tableColumnWidth === undefined)

const fixedWidthCols: GridColDef[] = fixedWidthFields.map(f => {
    const fieldDef = Fields[f as KnownFields]
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
    const fieldDef = Fields[f as KnownFields]
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


const SnTable: FunctionComponent<SnTableProps> = (props: SnTableProps) => {
    const { records, selectionHandler, activeNfp, activeNc } = props
    
    const filters: {[key in ToggleableVariables]?: number | undefined} = {}
    filters[ToggleableVariables.NFP] = activeNfp
    filters[ToggleableVariables.NC_PER_HP] = activeNc
    const filteredRecords = filterTo(records, filters)

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
            minCoil2SurfaceDist: r.minCoil2SurfaceDist.toFixed(5),
            elongation: r.elongation.toFixed(4),
            // shear: r.shear.toFixed(5)
        }
    })

    return (
        <div className="overviewTable">
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
