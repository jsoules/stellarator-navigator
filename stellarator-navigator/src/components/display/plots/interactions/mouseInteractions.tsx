import { PlotClickCallbackType } from "@snComponents/selectionControl/SelectionControlCallbacks"
import { useCallback } from "react"
import { ClickToDataCallbackType } from "../layout/PlotScaling"
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
