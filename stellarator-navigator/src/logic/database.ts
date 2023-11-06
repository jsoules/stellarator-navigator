import { CategoricalIndexedFields, Fields, KnownFields } from "@snTypes/DataDictionary"
import { CategoricalIndexSet, NavigatorDatabase, NumericIndex, RecordDict, StellaratorRecord } from "@snTypes/Types"

export type fieldType = number | string | string[] | number[]

export type RawData = {
    columns: string[],
    index: number[],
    data: fieldType[][]
}

export enum RawFields {
    ID                     = 'ID',
    COIL_LENGTH_PER_HP     = 'coil_length_per_hp',
    TOTAL_COIL_LENGTH      = 'total_coil_length',
    MEAN_IOTA              = 'mean_iota',
    NC_PER_HP              = 'nc_per_hp',
    NFP                    = 'nfp',
    N_FOURIER_COIL         = 'Nfourier_coil',
    NSURFACES              = 'Nsurfaces',
    MAX_KAPPA              = 'max_kappa',
    MAX_MEAN_SQUARED_CURVE = 'max_msc',
    MIN_INTERCOIL_DIST     = 'min_coil2coil_dist',
    QA_ERROR               = 'qa_error',
    GRADIENT               = 'gradient',
    ASPECT_RATIO           = 'aspect_ratio',
    MINOR_RADIUS           = 'minor_radius',
    VOLUME                 = 'volume',
    MIN_COIL_TO_SURFACE_DIST = 'min_coil2surface_dist',
    MEAN_ELONGATION        = 'mean_elongation',
    MAX_ELONGATION         = 'max_elongation',
    MESSAGE                = 'message',       // one of "Naive, fine scan", "Naive, global scan", "TuRBO, fine scan", "TuRBO, global scan"
    IOTA_PROFILE           = 'iota_profile',  // array of nSurfaces+1 numbers
    TF_PROFILE             = 'tf_profile',    // array of nSurfaces+1 numbers
    SURFACE_TYPES          = 'surface_types', // array of nSurfaces + 1 length, each element's values one of "exact", "ls"
}

export type rawObject = {[key in RawFields]: fieldType}

type jigRow = { raw: RawFields, order: number, objectField: KnownFields }

// It's easier, and probably not even any brittler, to just ignore the column names listed in the json file
// and use the known values for the column names directly. But, when we pull individual records,
// it's more reliable to match up the field names. The recordJig creates a matching between the two sets.

const recordJig: jigRow[] = [
    { raw: RawFields.QA_ERROR,                 order:  0, objectField: KnownFields.QA_ERROR                 },
    { raw: RawFields.COIL_LENGTH_PER_HP,       order:  1, objectField: KnownFields.COIL_LENGTH_PER_HP       },
    { raw: RawFields.TOTAL_COIL_LENGTH,        order:  2, objectField: KnownFields.TOTAL_COIL_LENGTH        },
    { raw: RawFields.MEAN_IOTA,                order:  3, objectField: KnownFields.MEAN_IOTA                },
    { raw: RawFields.MAX_KAPPA,                order:  4, objectField: KnownFields.MAX_KAPPA                },
    { raw: RawFields.MAX_MEAN_SQUARED_CURVE,   order:  5, objectField: KnownFields.MAX_MEAN_SQUARED_CURVE   },
    { raw: RawFields.MIN_INTERCOIL_DIST,       order:  6, objectField: KnownFields.MIN_INTERCOIL_DIST       },
    { raw: RawFields.NC_PER_HP,                order:  7, objectField: KnownFields.NC_PER_HP                },
    { raw: RawFields.NFP,                      order:  8, objectField: KnownFields.NFP                      },
    { raw: RawFields.GRADIENT,                 order:  9, objectField: KnownFields.GRADIENT                 },
    { raw: RawFields.ASPECT_RATIO,             order: 10, objectField: KnownFields.ASPECT_RATIO             },
    { raw: RawFields.ID,                       order: 11, objectField: KnownFields.ID                       },
    { raw: RawFields.MINOR_RADIUS,             order: 12, objectField: KnownFields.MINOR_RADIUS             },
    { raw: RawFields.N_FOURIER_COIL,           order: 13, objectField: KnownFields.N_FOURIER_COIL           },
    { raw: RawFields.NSURFACES,                order: 14, objectField: KnownFields.NSURFACES                },
    { raw: RawFields.VOLUME,                   order: 15, objectField: KnownFields.VOLUME                   },
    { raw: RawFields.MIN_COIL_TO_SURFACE_DIST, order: 16, objectField: KnownFields.MIN_COIL_TO_SURFACE_DIST },
    { raw: RawFields.MEAN_ELONGATION,          order: 17, objectField: KnownFields.MEAN_ELONGATION          },
    { raw: RawFields.MAX_ELONGATION,           order: 18, objectField: KnownFields.MAX_ELONGATION           },
    { raw: RawFields.MESSAGE,                  order: 19, objectField: KnownFields.MESSAGE                  },
    { raw: RawFields.IOTA_PROFILE,             order: 20, objectField: KnownFields.IOTA_PROFILE             },
    { raw: RawFields.TF_PROFILE,               order: 21, objectField: KnownFields.TF_PROFILE               },
    { raw: RawFields.SURFACE_TYPES,            order: 22, objectField: KnownFields.SURFACE_TYPES            },
]

export const makeRecordFromObject = (rawRecord: rawObject): StellaratorRecord => {
    const record = {} as {[field in KnownFields]: fieldType}
    recordJig.forEach(field => { record[field.objectField] = rawRecord[field.raw] })
    return record as StellaratorRecord
}

const makeRecordFromRow = (row: fieldType[]): StellaratorRecord => {
    const record = {} as {[field in KnownFields]: fieldType}
    recordJig.forEach(field => record[field.objectField] = row[field.order])
    return record as StellaratorRecord
}

export const makeDatabase = (rawData: RawData) => {
    const data = rawData.data
    const dataList = data.map((row) => makeRecordFromRow(row))

    const dataDict: RecordDict = {}

    dataList.forEach(entry => {
        dataDict[entry.id] = entry
    })

    const categoricalFieldIndexes: CategoricalIndexSet = {
        'meanIota': {},
        'ncPerHp': {},
        'nfp': {},
        'nFourierCoil': {},
        'nSurfaces': {}
    }

    const categoricalFields = Object.keys(categoricalFieldIndexes) as CategoricalIndexedFields[]
    categoricalFields.forEach(k => {
        const vals = Fields[k].values
        if (vals === undefined) {
            throw Error(`Bad value in indexes-keys: ${k}`)
        }
        const key = k as keyof StellaratorRecord
        const idx: NumericIndex = {}
        vals.forEach(v => {
            idx[v] = new Set(dataList.filter(row => row[key] === v).map(row => row.id))
        })
        categoricalFieldIndexes[k] = idx
    })


    const database: NavigatorDatabase = {
        list: dataList,
        byId: dataDict,
        allIdSet: new Set(dataList.map(r => r.id)),
        //---Indexes
        categoricalIndexes: categoricalFieldIndexes
    }

    return database
}
