import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { filterNc, filterNfp } from '@snState/filter'
import { StellaratorRecord } from '@snTypes/Types'
import { FunctionComponent } from 'react'

type SnTableProps = {
    records: StellaratorRecord[]
    selectionHandler: (model: GridRowSelectionModel) => void
    activeNfp?: number
    activeNc?: number
}

const variableColumnsDefaultWidth = 110

// id, length per hp, legnth total, mean iota, nc per hp, nfp, seed, maxKappa, maxMsc, minDist, qaError, gradient, aspect ratio
const columns: GridColDef[] = [
    // id
    {
        field: 'id',
        headerName: 'ID',
        width: 70,
        description: 'Unique identifier of the design simulation',
        sortable: true,
    },
    // length per hp
    {
        field: 'lengthPerHp',
        headerName: 'HP Length',
        width: 100,
        description: 'Coil length (m) per half-period',
        sortable: true,
    },
    // legnth total
    {
        field: 'lengthTotal',
        headerName: 'Total Length',
        width: 100,
        description: 'Total coil length (m)',
        sortable: true,
    },
    // mean iota
    {
        field: 'iota',
        headerName: 'Mean Iota',
        width: 90,
        description: 'Mean magnetic shear',
        sortable: true,
    },
    // nc per hp
    {
        field: 'ncPerHp',
        headerName: 'Coils/hp',
        width: 80,
        description: 'Coil count per half-period',
        sortable: true,
    },
    // nfp
    {
        field: 'nfp',
        headerName: 'n FP',
        width: 50,
        description: 'Field period count',
        sortable: true,
    },
    // seed
    {
        field: 'seed',
        headerName: 'Seed',
        width: 60,
        description: 'Simulation seed settings',
        sortable: true,
    },
    // maxKappa
    {
        field: 'maxKappa',
        headerName: 'Max Kappa',
        flex: 1,
        minWidth: variableColumnsDefaultWidth,
        description: 'Maximum curvature',
        sortable: true,
    },
    // maxMsc
    {
        field: 'maxMsc',
        headerName: 'Max MSC',
        flex: 1,
        minWidth: variableColumnsDefaultWidth,
        description: 'Max MSC',
        sortable: true,
    },
    // minDist
    {
        field: 'minDist',
        headerName: 'Min dist',
        flex: 1,
        minWidth: variableColumnsDefaultWidth,
        description: 'TKTK',
        sortable: true,
    },
    // qaError
    {
        field: 'qaError',
        headerName: 'QA Error',
        flex: 1,
        minWidth: variableColumnsDefaultWidth,
        description: 'Quasiasymmetry Error',
        sortable: true,
    },
    // gradient
    {
        field: 'gradient',
        headerName: 'Gradient',
        flex: 1,
        minWidth: variableColumnsDefaultWidth,
        description: 'TKTKTK',
        sortable: true,
    },
    // aspect ratio
    {
        field: 'aspectRatio',
        headerName: 'Aspect Ratio',
        flex: 1,
        minWidth: variableColumnsDefaultWidth,
        description: 'TKTKTK',
        sortable: true,
    },
]

const SnTable: FunctionComponent<SnTableProps> = (props: SnTableProps) => {
    const { records, selectionHandler, activeNfp, activeNc } = props
    const filteredRecords = filterNc(filterNfp(records, activeNfp), activeNc)
    const rows = filteredRecords.map(r => {
        return {
            id: r.id,
            lengthPerHp: r.coilLengthPerHp,
            lengthTotal: r.totalCoilLength,
            iota: r.meanIota,
            ncPerHp: r.ncPerHp,
            nfp: r.nfp,
            seed: r.seed,
            maxKappa: r.maxKappa,
            maxMsc: r.maxMsc,
            minDist: r.minDist,
            qaError: (10 ** r.qaError).toExponential(6),
            gradient: (10 ** r.gradient).toExponential(6),
            aspectRatio: r.aspectRatio
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
