import projectToPlotReadyData, { ProjectionCriteria, makeValsFromFieldname } from "@snState/projection"
import { ToggleableVariables, fieldIsCategorical } from "@snTypes/DataDictionary"
import { FilterSettings, StellaratorRecord } from "@snTypes/Types"
import { useMemo } from "react"
import { PlotColorProps } from "./plotColors"


export type PlotDataSummary = {
    data: number[][][]
    radius: number[][][]
    ids: number[][][]
    colorValues: number[][][]
    colorFieldRange: number[]
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
        const fineSplitVals = makeValsFromFieldname(fineSplit, filterSettings)
        const coarseSplitVals = makeValsFromFieldname(coarseSplit, filterSettings)
        const projectionCriteria: ProjectionCriteria = {
            data: records,
            yVar: filterSettings.dependentVariable,
            xVar: filterSettings.independentVariable,
            markedIds: filterSettings.markedRecords,
            colorField: colorSplit,
            fineSplit,
            coarseSplit,
            fineSplitVals,
            coarseSplitVals
        }
        const { data, radius, colorValues, ids } = projectToPlotReadyData(projectionCriteria)
        const colorFieldRange: number[] = fieldIsCategorical(colorSplit)
            ? []
            : filterSettings[colorSplit] as number[]
        return { data, radius, ids, colorValues, fineSplitVals, coarseSplitVals, coarseSplitField: coarseSplit, fineSplitField: fineSplit, colorFieldRange }
    }, [coarseSplit, colorSplit, filterSettings, fineSplit, records])

    return res
}
