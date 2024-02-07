import { PlotClickCallbackType, RangesChangeCallbackType } from "@snComponents/selectionControl/SelectionControlCallbacks"
import { DependentVariables, IndependentVariables, RangeVariables } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, DataGeometry } from "@snTypes/Types"
import { useCallback } from "react"
import { ClickToDataCallbackType, usePixelToDataConversions } from "../layout/PlotScaling"
import { onClickDot } from "./dotInteractions"
import { DragMouseupHandlerType } from "./useDragSelect"


export const getEventPoint = (e: React.MouseEvent): [number, number] => {
    const boundingRect = e.currentTarget.getBoundingClientRect()
    const point: [number, number] = [e.clientX - boundingRect.x, e.clientY - boundingRect.y]
    return point
}

type useClickHandlerFactoryProps = {
    interpretClick: ClickToDataCallbackType
    pointClickChecker: PointContainsClickFnType
    plotClickHandler: PlotClickCallbackType
}
type perGraphClickProps = {
    coarseValue?: number,
    fineValue?: number,
    data: number[],
    radius: number[],
    ids: number[]
}
// NOTE: Theoretically we could do something more interesting for checking clicks, but back-of-envelope suggests
// that without random access to the data element list, building something like a kd-tree will never pencil out:
// the overhead to construct the data structure is too high. Better to just iterate each time.
export const useMouseHandlerFactory = (props: useClickHandlerFactoryProps) => {
    const { plotClickHandler, interpretClick, pointClickChecker } = props

    return useCallback((props: perGraphClickProps) => {
        const { coarseValue, fineValue, data, radius, ids } = props
        const overallPlotClick = () => plotClickHandler(coarseValue, fineValue)

        return (e: React.MouseEvent) => {
            const [clickX, clickY] = getEventPoint(e)
            const [dataX, dataY] = interpretClick(clickX, clickY)
            // Look up the id of the nearest point and do onClikcDot for that id
            const id = ids.find((_, idx) => pointClickChecker(dataX, dataY, data[2*idx], data[2*idx + 1], radius[idx]**2))
            if (id === undefined) {
                overallPlotClick()
            } else {
                onClickDot(id)
            }
        }
    }, [interpretClick, plotClickHandler, pointClickChecker])
}


type PointContainsClickFnType = (testX: number, testY: number, pointX: number, pointY: number, radiusSq: number) => boolean
export const usePointContainsClickFn = (xRatio: number, yRatio: number): PointContainsClickFnType => {
    return useCallback((testX: number, testY: number, pointX: number, pointY: number, radiusSq: number) => {
        return ((((testX - pointX)/xRatio) ** 2) +
                (((testY - pointY)/yRatio) ** 2)) < radiusSq
    }, [xRatio, yRatio])
}


type mouseHandlerType = (e: React.MouseEvent) => void
type dragResolverType = (rect: number[]) => void
export type MouseupHandlerType = (dragMouseupHandler: DragMouseupHandlerType, clickHandler: mouseHandlerType, dragResolver: dragResolverType) => mouseHandlerType
export const useComposedMouseupHandler: MouseupHandlerType = (dragMouseupHandler, clickHandler, dragResolver) => {
    const composedFunction = useCallback((e: React.MouseEvent) => {
        const dragResult = dragMouseupHandler(e)
        if (dragResult.passed) {
            clickHandler(e)
        } else {
            if (dragResult.rect !== undefined) {
                dragResolver(dragResult.rect)
                // console.log(`WE SHOULD UPDATE THE DISPLAYED DIMENSIONS NOW`)
            }
        }
    }, [clickHandler, dragMouseupHandler, dragResolver])
    return composedFunction
}


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
    plotDimensions: BoundedPlotDimensions,
    dataGeometry: DataGeometry,
    plotClickHandler: PlotClickCallbackType,
    resolveRangeChangeHandler: RangesChangeCallbackType,
    independentVariable: IndependentVariables,
    dependentVariable: DependentVariables
}

export type MouseHandlers = {
    mouseHandlerFactory: (props: perGraphClickProps) => (e: React.MouseEvent) => void
    resolveRangeChange: (rect: number[]) => void
}


const usePlotMouseHandlers = (props: MouseHandlerConfigurationProps): MouseHandlers => {
    const { plotClickHandler, resolveRangeChangeHandler, independentVariable, dependentVariable, plotDimensions } = props
    const { interpretClick, xDataPerPixel, yDataPerPixel } = usePixelToDataConversions(plotDimensions, props.dataGeometry)
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


