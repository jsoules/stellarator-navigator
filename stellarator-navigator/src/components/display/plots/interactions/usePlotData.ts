import projectToPlotReadyData, { ProjectionCriteria, makeValsFromFieldname } from "@snState/projection"
import { ToggleableVariables } from "@snTypes/DataDictionary"
import { FilterSettings, StellaratorRecord } from "@snTypes/Types"
import { useMemo } from "react"
import { PlotColorProps } from "./plotColors"


export type PlotDataSummary = {
    data: number[][][]
    radius: number[][][]
    ids: number[][][]
    colorValues: number[][][]
    fineSplitVals: number[]
    coarseSplitVals: number[]
    coarseSplitField?: ToggleableVariables
    fineSplitField?: ToggleableVariables
}

type plotHookParams = PlotColorProps & {
    records: StellaratorRecord[],
    filterSettings: FilterSettings
}

type plotHookType = (params: plotHookParams) => PlotDataSummary


export const usePlotData: plotHookType = ({records, filterSettings, colorSplit}) => {
    const fineSplit = filterSettings.finePlotSplit
    const coarseSplit = filterSettings.coarsePlotSplit
    const res = useMemo(() => {
        const fineSplitVals = fineSplit === undefined ? [] : makeValsFromFieldname(fineSplit, filterSettings, true)
        const coarseSplitVals = coarseSplit === undefined ? [] : makeValsFromFieldname(coarseSplit, filterSettings)
        const projectionCriteria = {
            data: records,
            yVar: filterSettings.dependentVariable,
            xVar: filterSettings.independentVariable,
            markedIds: filterSettings.markedRecords,
            colorField: colorSplit,
            fineSplit,
            coarseSplit,
            fineSplitVals,
            coarseSplitVals
        } as unknown as ProjectionCriteria // discriminating the types based on the constant boolean is confusing the type parser
        const { data, radius, colorValues, ids } = projectToPlotReadyData(projectionCriteria)
        return { data, radius, ids, colorValues, fineSplitVals, coarseSplitVals, coarseSplitField: coarseSplit, fineSplitField: fineSplit }
    }, [coarseSplit, colorSplit, filterSettings, fineSplit, records])

    return res
}