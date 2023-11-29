import { DependentVariables, Fields, IndependentVariables, KnownFields, ToggleableVariables } from "@snTypes/DataDictionary"
import { FilterSettings, StellaratorRecord } from "@snTypes/Types"


// We'd like to chop the plots into a grid based on selected discrete-valued data fields.
// Unfortunately, it's confusing to talk about "rowSplits" and "columnSplits" because the name can be read as either
// "field used to split the row apart" or "field used to split one row from another".
// So we define "fine-split" as making separations *within* rows and "coarse-split" as making separations *between* rows.
// Higher-order groupings might be possible, but we won't implement that until it's requested.
type categorizationCriteria = {
    colorSplit?: ToggleableVariables
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
    data: number[][][][]
    selected: boolean[][][][]
}


export const makeValsFromFieldname = (field: ToggleableVariables, filters: FilterSettings, useAllIfNone?: boolean) => {
    const allValidVals = Fields[field]?.values ?? []
    const splitVals = filters[field].map((v, i) => (v ? allValidVals[i] : undefined)).filter(x => x !== undefined) as unknown as number[]
    return (splitVals.length !== 0 || !useAllIfNone)
        ? splitVals
        : allValidVals
}


export const defaultFieldKey = 'Any'
const makeDefaultedList = (p: {baseList: number[] | undefined, defaultToAll?: boolean, fieldName?: ToggleableVariables | undefined}) => {
    if (p.baseList === undefined || p.baseList.length === 0) {
        return p.defaultToAll
            ? Fields[p.fieldName as unknown as KnownFields]?.values ?? [defaultFieldKey]
            : [defaultFieldKey]
    }
    return p.baseList
}

const makeLookups = (c: categorizationCriteria) => {
    const { colorSplit, fineSplit, coarseSplit } = c

    // TODO: Make fine-split/coloration a separate data series, to support picking continuous-valued variables here
    // (since there's no reason after all this has to be discrete)

    const colorKeys:  {[key: string]: number} = {}
    const fineKeys:   {[key: string]: number} = {}
    const coarseKeys: {[key: string]: number} = {}

    if (fineSplit !== undefined && (fineSplit === coarseSplit)) {
        throw Error(`Data partition criteria must be distinct, but fine-split and coarse-split criterion match (${fineSplit}, ${coarseSplit})`)
    }

    // TODO: Make colors an entirely separate data series and not an index
    const colorVals  = Fields[colorSplit as unknown as KnownFields]?.values ?? [defaultFieldKey]
    const fineVals   = makeDefaultedList({ baseList: c.fineSplitVals })
    const coarseVals = makeDefaultedList({ baseList: c.coarseSplitVals })

    colorVals.forEach((v, i) => colorKeys[`${v}`] = i)
    fineVals.forEach((v, i) => fineKeys[`${v}`] = i)
    coarseVals.forEach((v, i) => coarseKeys[`${v}`] = i)

    return {colorKeys, fineKeys, coarseKeys}
}


const projectToPlottableData = (props: ProjectionCriteria): ProjectedData => {
    const { data, yVar, xVar, markedIds, colorSplit, fineSplit, coarseSplit } = props
    // We're going to be boorish and iterative here, because filtering properly would potentially involve
    // iterating over the entire database ~1000 times.
    // Instead, create a data structure with S x R x C buckets, where S = cardinality of field for colorCriteria,
    // R = cardinality of field for rowCriteria, C = cardinality of field for columnCriteria.
    // Then iterate over the data set once, computing appropriate bucket based on those values &
    // populating the resulting list as a flat list of x, y values based on the chosen fields.

    
    const { colorKeys, fineKeys,coarseKeys } = makeLookups(props)
    
    const buckets: number[][][][] = new Array(Object.keys(coarseKeys).length).fill(0)
        .map(() => new Array(Object.keys(fineKeys).length).fill(0)
            .map(() => new Array(Object.keys(colorKeys).length).fill(0)
                .map(() => [] as number[])))
    const selected: boolean[][][][] = new Array(Object.keys(coarseKeys).length).fill(0)
    .map(() => new Array(Object.keys(fineKeys).length).fill(0)
        .map(() => new Array(Object.keys(colorKeys).length).fill(0)
            .map(() => [] as boolean[])))

    // Precondition: Assume that every row of the data is actually supposed to be there, and we just need to slot
    // them into the right place. Filtering of out-of-scope values should have already taken place.
    data.forEach((record) => {
        const colorIdx  = (colorSplit  ?  colorKeys[record[colorSplit]]  : 0) ?? 0
        const fineIdx   = (fineSplit   ?   fineKeys[record[fineSplit]]   : 0) ?? 0
        const coarseIdx = (coarseSplit ? coarseKeys[record[coarseSplit]] : 0) ?? 0
        buckets[coarseIdx][fineIdx][colorIdx].push((record[xVar]))
        buckets[coarseIdx][fineIdx][colorIdx].push((record[yVar]))
        selected[coarseIdx][fineIdx][colorIdx].push(markedIds?.has(record.id) || false)
    })
    return { data: buckets, selected }
}


export default projectToPlottableData
