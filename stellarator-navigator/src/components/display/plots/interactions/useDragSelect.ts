import { BoundedPlotDimensions } from "@snTypes/Types"
import React, { useCallback, useReducer } from "react"
import { defaultDragSelectState, dragSelectReducer } from "./dragSelectReducer"
import { getEventPoint } from "./mouseInteractions"

export type DragMouseupHandlerType = (e: React.MouseEvent) => { passed: boolean, rect?: number[] }

const useDragSelect = (dims: BoundedPlotDimensions) => {
    const [dragSelectState, dragSelectStateDispatch] = useReducer(dragSelectReducer, defaultDragSelectState)

    const boundedGetEventPoint = useCallback((e: React.MouseEvent) => {
        const pt = getEventPoint(e)
        if (dims?.boundedHeight === undefined || dims?.boundedWidth === undefined) return pt
        return [Math.min(Math.max(pt[0], dims.marginLeft), dims.boundedWidth + dims.marginLeft),
               Math.min(Math.max(pt[1], dims.marginTop), dims.boundedHeight + dims.marginTop)]
    }, [dims?.boundedHeight, dims?.boundedWidth, dims?.marginLeft, dims?.marginTop])

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!e.buttons) return
        dragSelectStateDispatch({
            type: "DRAG_MOUSE_MOVE",
            point: boundedGetEventPoint(e)
        })
    }, [boundedGetEventPoint])


    const onMouseDown = useCallback((e: React.MouseEvent) => {
        dragSelectStateDispatch({
            type: "DRAG_MOUSE_DOWN",
            point: boundedGetEventPoint(e)
        })
    }, [boundedGetEventPoint])


    const onMouseUp = useCallback((e: React.MouseEvent) => {
        const returnVal = {
            passed: !dragSelectState.isActive,
            rect: dragSelectState.dragRect
        }
        dragSelectStateDispatch({
            type: 'DRAG_MOUSE_UP',
            point: boundedGetEventPoint(e)
        })
        return returnVal
    }, [boundedGetEventPoint, dragSelectState.dragRect, dragSelectState.isActive])

    return { onMouseMove, onMouseDown, onMouseUp, dragSelectState }
}

export const repaintDragSelection = (ctxt: CanvasRenderingContext2D, dragRect: number[] | undefined, isActive: boolean) => {
    ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height)
    if (isActive && dragRect) {
        const rect = dragRect
        ctxt.fillStyle = 'rgba(196, 196, 196, 0.5)'
        ctxt.fillRect(rect[0], rect[1], rect[2], rect[3])
    }
}

export default useDragSelect
