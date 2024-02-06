import { dotMargin } from "@snComponents/display/plots/webgl/drawScatter"
import { DependentVariables, Fields, IndependentVariables, KnownFields, ToggleableVariables, fieldIsCategorical } from "@snTypes/DataDictionary"
import { FilterSettings, StellaratorRecord } from "@snTypes/Types"


// We'd like to chop the plots into a grid based on selected discrete-valued data fields.
// Unfortunately, it's confusing to talk about "rowSplits" and "columnSplits" because the name can be read as either
// "field used to split the row apart" or "field used to split one row from another".
// So we define "fine-split" as making separations *within* rows and "coarse-split" as making separations *between* rows.
// Higher-order groupings might be possible, but we won't implement that until it's requested.
type categorizationCriteria = {
    colorField?: DependentVariables | ToggleableVariables
    fineSplit?: ToggleableVariables
    fineSplitVals?: number[]
    coarseSplit?: ToggleableVariables
    coarseSplitVals?: number[]
}

export type ProjectionCriteria = categorizationCriteria & {
    yVar: DependentVariables
    xVar: IndependentVariables
    data: StellaratorRecord[]
    markedIds?: Set<number>
}    


type ProjectedData = {
    data: number[][][]
    radius: number[][][]
    colorValues: number[][][]
    ids: number[][][]
}


export const makeValsFromFieldname = (field: ToggleableVariables | undefined, filters: FilterSettings, includeAllIfNone?: boolean) => {
    if (field === undefined) return []
    const allValidVals = Fields[field]?.values ?? []
    const splitVals = (filters[field] ?? []).map((v, i) => (v ? allValidVals[i] : undefined)).filter(x => x !== undefined) as unknown as number[]
    return includeAllIfNone && splitVals.length === 0 ? allValidVals : splitVals
}


export const defaultFieldKey = 'Any'
const makeDefaultedList = (p: {baseList: number[] | undefined, defaultToAll?: boolean, fieldName?: ToggleableVariables | undefined}) => {
    if (p.baseList === undefined || p.baseList.length === 0) {
        return p.defaultToAll
            ? Fields[p.fieldName as unknown as KnownFields].values ?? [defaultFieldKey]
            : [defaultFieldKey]
    }
    return p.baseList
}

const makeLookups = (c: categorizationCriteria) => {
    // const { fineSplit, coarseSplit, colorField } = c
    const { colorField } = c

    const fineKeys:   Record<string, number> = {}
    const coarseKeys: Record<string, number> = {}
    const colorKeys:  Record<string, number> = {}

    // Actually this isn't a good idea, as it's likely to occur as a transition state when changing values or axes
    // if (fineSplit !== undefined && (fineSplit === coarseSplit)) {
    //     throw Error(`Data partition criteria must be distinct, but fine-split and coarse-split criterion match (${fineSplit}, ${coarseSplit})`)
    // }

    const fineVals   = makeDefaultedList({ baseList: c.fineSplitVals })
    const coarseVals = makeDefaultedList({ baseList: c.coarseSplitVals })
    const colorFieldIsCategorical = fieldIsCategorical(colorField)
    const colorVals  = colorFieldIsCategorical ? makeDefaultedList({ baseList: undefined, defaultToAll: true, fieldName: colorField as ToggleableVariables }) : []

    fineVals.forEach((v, i) => fineKeys[`${v}`] = i)
    coarseVals.forEach((v, i) => coarseKeys[`${v}`] = i)
    colorVals.forEach((v, i) => colorKeys[`${v}`] = i)

    return { fineKeys, coarseKeys, colorKeys }
}


const projectToPlotReadyData = (props: ProjectionCriteria): ProjectedData => {
    const { data, yVar, xVar, markedIds, colorField, fineSplit, coarseSplit } = props
    // We're going to be boorish and iterative here, because filtering properly would potentially involve
    // iterating over the entire database ~1000 times.
    // Instead, create a data structure with S x R x C buckets, where S = cardinality of field for colorCriteria,
    // R = cardinality of field for rowCriteria, C = cardinality of field for columnCriteria.
    // Then iterate over the data set once, computing appropriate bucket based on those values &
    // populating the resulting list as a flat list of x, y values based on the chosen fields.

    
    const { fineKeys, coarseKeys, colorKeys } = makeLookups(props)
    const colorFieldIsCategorical = fieldIsCategorical(colorField)
    
    const buckets: number[][][] = new Array(Object.keys(coarseKeys).length).fill(0)
        .map(() => new Array(Object.keys(fineKeys).length).fill(0)
            .map(() => [] as number[]))
    const radius: number[][][] = new Array(Object.keys(coarseKeys).length).fill(0)
        .map(() => new Array(Object.keys(fineKeys).length).fill(0)
            .map(() => [] as number[]))
    const ids: number[][][] = new Array(Object.keys(coarseKeys).length).fill(0)
        .map(() => new Array(Object.keys(fineKeys).length).fill(0)
            .map(() => [] as number[]))
    const colorValues: number[][][] = new Array(Object.keys(coarseKeys).length).fill(0)
        .map(() => new Array(Object.keys(fineKeys).length).fill(0)
            .map(() => [] as number[]))

    // Precondition: Assume that every row of the data is actually supposed to be there, and we just need to slot
    // them into the right place. Filtering of out-of-scope values should have already taken place.
    data.forEach((record) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const fineIdx   = (fineSplit   ?   fineKeys[record[fineSplit]]   : 0) ?? 0
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const coarseIdx = (coarseSplit ? coarseKeys[record[coarseSplit]] : 0) ?? 0
        const isSelected = markedIds?.has(record.id) ?? false
        buckets[coarseIdx][fineIdx].push(record[xVar])
        buckets[coarseIdx][fineIdx].push(record[yVar])
        radius[coarseIdx][fineIdx].push(isSelected ? dotMargin : dotMargin / 2)
        ids[coarseIdx][fineIdx].push(record.id)
        if (colorFieldIsCategorical) {
            colorValues[coarseIdx][fineIdx].push(colorField === undefined ? 1 : colorKeys[record[colorField]])
        } else {
            colorValues[coarseIdx][fineIdx].push(colorField === undefined ? 1 : record[colorField])
        }
    })
    return { data: buckets, radius, colorValues, ids }
}


export default projectToPlotReadyData
