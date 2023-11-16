import { DependentVariables, Fields, IndependentVariables, KnownFields, ToggleableVariables } from "@snTypes/DataDictionary"
import { StellaratorRecord } from "@snTypes/Types"


// The intent is that the finest split should apply to data points within individual plots; the middle split separates different
// plots in the same row; and the coarsest split separates different rows from each other.
// Unfortunately, it's confusing to talk about "rowSplits" and "columnSplits" because the name can be read as either
// "field used to split the row apart" or "field used to split one row from another".
// So we're just referring to three levels of coarseness.
// Higher-order groupings might be possible, but we won't implement that until it's requested.
type categorizationCriteria = {
    fineSplit?: ToggleableVariables
    medSplit?: ToggleableVariables
    coarseSplit?: ToggleableVariables
}


export type ProjectionCriteria = categorizationCriteria & {
    yVar: DependentVariables
    xVar: IndependentVariables
    data: StellaratorRecord[]
    markedIds?: Set<number>
}    


type ProjectedData = {
    data: number[][][][]
    selectedIndices: number[]
}


const defaultFieldKey = 'Any'


const makeLookups = (c: categorizationCriteria) => {
    const { fineSplit, medSplit, coarseSplit } = c

    const fineKeys:   {[key: string]: number} = {}
    const medKeys:    {[key: string]: number} = {}
    const coarseKeys: {[key: string]: number} = {}

    if (fineSplit !== undefined && (fineSplit === medSplit || fineSplit === coarseSplit)) {
        throw Error(`Data partition criteria must be distinct, but finest criterion ${fineSplit} matches one of middle ${medSplit} or coarse ${coarseSplit}`)
    }
    if (medSplit !== undefined && medSplit === coarseSplit) {
        throw Error(`Data partition criteria must be distinct, but mid-level criterion ${medSplit} matches coarsest criterion ${coarseSplit}`)
    }

    const fineVals   = Fields[fineSplit   as unknown as KnownFields]?.values ?? [defaultFieldKey]
    const medVals    = Fields[medSplit    as unknown as KnownFields]?.values ?? [defaultFieldKey]
    const coarseVals = Fields[coarseSplit as unknown as KnownFields]?.values ?? [defaultFieldKey]

    fineVals.forEach((v, i) => fineKeys[`${v}`] = i)
    medVals.forEach((v, i) => medKeys[`${v}`] = i)
    coarseVals.forEach((v, i) => coarseKeys[`${v}`] = i)

    console.log(`generated fine keys ${JSON.stringify(fineKeys)}, med keys ${JSON.stringify(medKeys)}, coarse keys ${JSON.stringify(coarseKeys)}`)

    return {fineKeys, medKeys, coarseKeys}
}


const projectData = (props: ProjectionCriteria): ProjectedData => {
    const { data, yVar, xVar, markedIds, fineSplit, medSplit, coarseSplit } = props
    // We're going to be boorish and iterative here, because filtering properly would potentially involve
    // iterating over the entire database ~1000 times.
    // Instead, create a data structure with S x R x C buckets, where S = cardinality of field for colorCriteria,
    // R = cardinality of field for rowCriteria, C = cardinality of field for columnCriteria.
    // Then iterate over the data set once, computing appropriate bucket based on those values &
    // populating the resulting list as a flat list of x, y values based on the chosen fields.

    
    const { fineKeys, medKeys, coarseKeys } = makeLookups(props)
    
    const buckets: number[][][][] = new Array(Object.keys(coarseKeys).length).fill(0)
        .map(() => new Array(Object.keys(medKeys).length).fill(0)
            .map(() => new Array(Object.keys(fineKeys).length).fill(0)
                .map(() => [] as number[])))

    // Precondition: We assume that every row is actually supposed to be there, and we just need to slot
    // them into the right place. Filtering of out-of-scope values should have already taken place.
    // TODO: FIX THIS: IT WILL RESULT IN INCLUDING ROWS/COLUMNS WHICH ARE NOT SELECTED
    data.forEach((record, id) => {
        const fineIdx   = (fineSplit   ?   fineKeys[record[fineSplit]]   : 0) ?? 0
        const medIdx    = (medSplit    ?    medKeys[record[medSplit]]    : 0) ?? 0
        const coarseIdx = (coarseSplit ? coarseKeys[record[coarseSplit]] : 0) ?? 0
        buckets[coarseIdx][medIdx][fineIdx].push((record[xVar]))
        buckets[coarseIdx][medIdx][fineIdx].push((record[yVar]))
        if (markedIds && record.id in markedIds) {
            // TODO: Handle marked IDs properly
            console.log(`Found marked id at index ${id}`)
        }
    })
    return { data: buckets, selectedIndices: [] }
}


export default projectData
