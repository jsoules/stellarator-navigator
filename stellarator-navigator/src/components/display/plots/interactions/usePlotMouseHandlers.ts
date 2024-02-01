import { PlotClickCallbackType, RangesChangeCallbackType } from "@snComponents/selectionControl/SelectionControlCallbacks"
import { DependentVariables, IndependentVariables, RangeVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, DataGeometry } from "@snTypes/Types"
import { useCallback } from "react"
import { usePixelToDataConversions } from "../layout/PlotScaling"
import { useMouseHandlerFactory, usePointContainsClickFn } from "./mouseInteractions"


type ResolveRangeChangeProps = {
    interpretClick: (clickX: number, clickY: number) => number[],
    independentVariable: IndependentVariables,
    dependentVariable: DependentVariables,
    resolveRangeChangeHandler: RangesChangeCallbackType
}

const ResolveRangeChange = (rect: number[], contextProps: ResolveRangeChangeProps) => {
    const { interpretClick, independentVariable, dependentVariable, resolveRangeChangeHandler } = contextProps
    const dataUL = interpretClick(rect[0], rect[1])
    const dataLR = interpretClick(rect[0] + rect[2], rect[1] + rect[3])
    const dataX = [dataUL[0], dataLR[0]]
    const dataY = [dataLR[1], dataUL[1]]
    const useX = Object.values(RangeVariables).includes(independentVariable as unknown as RangeVariables)
    const useY = Object.values(RangeVariables).includes(dependentVariable as unknown as RangeVariables)
    if (!useX && !useY) {
        // This can't happen with current rules since all dependent variables are range-type.
        // But we'll leave the check in for future-proofing.
        console.warn("Neither axis is a range: not updating from drag selection.")
        return
    }
    const fields: RangeVariables[] = []
    const newValues: number[][] = []
    if (useX) {
        fields.push(independentVariable as unknown as RangeVariables)
        newValues.push(dataX)
    }
    if (useY) {
        fields.push(dependentVariable as unknown as RangeVariables)
        newValues.push(dataY)
    }
    resolveRangeChangeHandler(fields, newValues)
}


type MouseHandlerConfigurationProps = {
    dims: BoundedPlotDimensions,
    dataGeometry: DataGeometry,
    plotClickHandler: PlotClickCallbackType,
    resolveRangeChangeHandler: RangesChangeCallbackType,
    independentVariable: IndependentVariables,
    dependentVariable: DependentVariables
}


const usePlotMouseHandlers = (props: MouseHandlerConfigurationProps) => {
    const { plotClickHandler, resolveRangeChangeHandler, independentVariable, dependentVariable } = props
    const { interpretClick, xDataPerPixel, yDataPerPixel } = usePixelToDataConversions(props.dims, props.dataGeometry)
    const pointClickChecker = usePointContainsClickFn(xDataPerPixel, yDataPerPixel)
    const mouseHandlerFactory = useMouseHandlerFactory({plotClickHandler, interpretClick, pointClickChecker})
    const resolveRangeChange = useCallback((rect: number[]) =>
        ResolveRangeChange(rect, {
            interpretClick,
            resolveRangeChangeHandler,
            independentVariable,
            dependentVariable
        }), [dependentVariable, independentVariable, interpretClick, resolveRangeChangeHandler])
    return { mouseHandlerFactory, resolveRangeChange }
}


export default usePlotMouseHandlers
