import { SelectChangeEvent } from '@mui/material'
import { GridRowSelectionModel } from '@mui/x-data-grid'
import { FacetSplitType, NavigatorStateAction } from '@snState/NavigatorReducer'
import { DependentVariables, IndependentVariables, RangeVariables, ToggleableVariables, TripartiteVariables } from '@snTypes/DataDictionary'
import { NavigatorDispatch } from '@snTypes/Types'
import { Dispatch, useCallback, useMemo } from 'react'

export const defaultTripartiteBothState = -1
export const defaultFacetNoneState = 0

const _handleRangeChange = (dispatch: NavigatorDispatch, field: RangeVariables, newRange: number | number[]) => {
    const update: NavigatorStateAction = {
        type: "updateRange",
        field,
        newRange: newRange as number[]
    }
    dispatch(update)
}


const _handleRangesChange = (dispatch: NavigatorDispatch, fields: RangeVariables[], newRanges: number[][]) => {
    const update: NavigatorStateAction = {
        type: "updateRanges",
        fields,
        newRanges
    }
    dispatch(update)
}


const _handleRangeReset = (dispatch: NavigatorDispatch, field: RangeVariables) => {
    const update: NavigatorStateAction = {
        type: "resetRange",
        field
    }
    dispatch(update)
}


export const handleDependentVariableChg = (dispatch: NavigatorDispatch, event: SelectChangeEvent) => {
    const update: NavigatorStateAction = {
        type: 'updateDependentVariable',
        newValue: event.target.value as unknown as DependentVariables
    }
    dispatch(update)
}

export const handleIndependentVariableChg = (dispatch: NavigatorDispatch, event: SelectChangeEvent) => {
    const update: NavigatorStateAction = {
        type: 'updateIndependentVariable',
        newValue: event.target.value as unknown as IndependentVariables
    }
    dispatch(update)
}

const _facetVariableHandlerFactory = (target: FacetSplitType) => {
    return (dispatch: NavigatorDispatch, event: SelectChangeEvent) => {
        const update: NavigatorStateAction = {
            type: 'updatePlotSplits',
            target,
            newSplit: event.target.value as unknown as ToggleableVariables | undefined
        }
        dispatch(update)
    }
}

export const _handleCoarseVariableChange = _facetVariableHandlerFactory('coarse')
export const _handleFineVariableChange = _facetVariableHandlerFactory('fine')

export const handleCheckboxChangeBase = (dispatch: NavigatorDispatch, field: ToggleableVariables, index: number, targetState: boolean) => {
    const update: NavigatorStateAction = {
        type: "updateCheckField",
        field: field,
        index: index,
        targetState
    }
    dispatch(update)
}

export const handleTripartiteDropdownChangeBase = (dispatch: NavigatorDispatch, field: TripartiteVariables, event: SelectChangeEvent<number>) => {
    // const newValue = parseInt(event.target.value)
    const newValue = event.target.value as number
    const update: NavigatorStateAction = {
        type: 'updateTripartiteField',
        field: field,
        newValue: newValue === defaultTripartiteBothState ? undefined : newValue
    }
    dispatch(update)
}

export const handleUpdateMarkedRecords = (dispatch: NavigatorDispatch, model: GridRowSelectionModel) => {
    const selections = new Set<number>(model as unknown as number[])
    const update: NavigatorStateAction = {
        type: 'updateMarkedRecords',
        newSelections: selections
    }
    dispatch(update)
}

// TODO: Add handler for updating the selected fields for coarse and fine plot splits

export const _handleUpdateFocusedPlotIndices = (dispatch: NavigatorDispatch, coarseVal: number | undefined, fineVal: number | undefined) => {
    const newVals = [coarseVal, fineVal]
    const update: NavigatorStateAction = {
        type: 'updateFocusedPlotIndices',
        newValues: newVals
    }
    dispatch(update)
}

// TODO: Relocate this
export type PlotClickCallbackType = (coarsevVal: number | undefined, fineVal: number | undefined) => void
export type RangesChangeCallbackType = (fields: RangeVariables[], newValues: number[][]) => void

const useFilterCallbacks = (dispatch: Dispatch<NavigatorStateAction>) => {
    const handleRangeChange = useCallback((_: Event, field: RangeVariables, newValue: number | number[]) => {
        _handleRangeChange(dispatch, field, newValue)
    }, [dispatch])
    const handleRangesChange: RangesChangeCallbackType = useCallback((fields: RangeVariables[], newValues: number[][]) => {
        _handleRangesChange(dispatch, fields, newValues)
    }, [dispatch])
    const handleRangeReset = useCallback((field: RangeVariables) => _handleRangeReset(dispatch, field), [dispatch])
    const handleDependentVariableChange = useCallback((event: SelectChangeEvent) => {
        handleDependentVariableChg(dispatch, event)
    }, [dispatch])
    const handleIndependentVariableChange = useCallback((e: SelectChangeEvent) => handleIndependentVariableChg(dispatch, e), [dispatch])
    const handleCoarseVariableChange = useCallback((e: SelectChangeEvent) => _handleCoarseVariableChange(dispatch, e), [dispatch])
    const handleFineVariableChange = useCallback((e: SelectChangeEvent) => _handleFineVariableChange(dispatch, e), [dispatch])
    const handleCheckboxChange = useCallback((field: ToggleableVariables, index: number, targetState: boolean) => {
        handleCheckboxChangeBase(dispatch, field, index, targetState)
    }, [dispatch])
    const handleTripartiteDropdownChange = useCallback((field: TripartiteVariables, event: SelectChangeEvent<number>) => {
        handleTripartiteDropdownChangeBase(dispatch, field, event)
    }, [dispatch])
    const handleUpdateMarks = useCallback((model: GridRowSelectionModel) => {
        handleUpdateMarkedRecords(dispatch, model)
    }, [dispatch])
    const handleUpdateFocusedPlotIndices = useCallback((coarseVal: number | undefined, fineVal: number | undefined) => {
        _handleUpdateFocusedPlotIndices(dispatch, coarseVal, fineVal)
    }, [dispatch])

    const callbacks = useMemo(() => {
        return {
            handleRangeChange,
            handleRangesChange,
            handleRangeReset,
            handleCheckboxChange,
            handleTripartiteDropdownChange,
            handleDependentVariableChange,
            handleIndependentVariableChange,
            handleCoarseVariableChange,
            handleFineVariableChange,
            handleUpdateMarks,
            handleUpdateFocusedPlotIndices
        }
    }, [handleCheckboxChange, handleDependentVariableChange, handleIndependentVariableChange, handleRangeChange, handleRangesChange, handleRangeReset, handleTripartiteDropdownChange, handleUpdateMarks, handleUpdateFocusedPlotIndices, handleCoarseVariableChange, handleFineVariableChange])

    return callbacks
}

export default useFilterCallbacks