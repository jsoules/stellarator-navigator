export type DragSelectState = {
    isActive?: boolean      // If dragging is currently active
    dragAnchor?: number[]   // The position where dragging began (in canvas units)
    dragPosition?: number[] // Position where dragging ends (in canvas units/pixels)
    dragRect?: number[]     // Selected area (pixels) [0],[1] for upper-left x,y; [2],[3] for width & height.
}

export type DragSelectAction = {
    type: 'DRAG_MOUSE_DOWN'
    point: number[]
} | {
    type: "DRAG_MOUSE_UP"
    point: number[]
} | {
// This is not currently implemented, as it's a no-op: we don't want to interfere.
// But it could be used to e.g. cancel a drag that leaves the available area.
//     type: "DRAG_MOUSE_LEAVE"
// } | {
    type: "DRAG_MOUSE_MOVE"
    point: number[]
}

export const defaultDragSelectState = {
    isActive: false,
    dragAnchor: undefined,
    dragPosition: undefined,
    dragRect: undefined
}

export const dragSelectReducer = (state: DragSelectState, action: DragSelectAction): DragSelectState => {
    switch (action.type) {
        case "DRAG_MOUSE_DOWN": {
            return anchorDrag(action.point)
        }
        case "DRAG_MOUSE_UP": {
            return endDrag()
        }
        case "DRAG_MOUSE_MOVE": {
            if (!state.dragAnchor) return state // don't trigger an update every time user moves the mouse
            return handleMove(state, action.point)
        }
        default: {
            throw new Error("Unreachable: invalid action type for drag select reducer.")
        }
    }
}


const anchorDrag = (point: number[]): DragSelectState => {
    return {
        isActive: false,
        dragAnchor: [...point],
        dragPosition: [...point],
        dragRect: undefined
    }
}


const endDrag = (): DragSelectState => defaultDragSelectState


const handleMove = (s: DragSelectState, point: number[]): DragSelectState => {
    const dragAnchor = s.dragAnchor as number[] // caller should have checked for nullity
    const newDragRect = [
        Math.min(dragAnchor[0], point[0]),
        Math.min(dragAnchor[1], point[1]),
        Math.abs(dragAnchor[0] - point[0]),
        Math.abs(dragAnchor[1] - point[1])
    ]
    if (s.isActive || newDragRect[2] >= 10 || newDragRect[3] >= 10) {
        // if we were active, or we've moved past a threshold pixel size, track drag rect
        return { ...s, isActive: true, dragRect: newDragRect, dragPosition: point }
    }
    // not dragging and haven't moved a threshold distance: no state update.
    return s
}

