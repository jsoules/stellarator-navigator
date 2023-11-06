import { SelectChangeEvent } from '@mui/material'
import { GridRowSelectionModel } from '@mui/x-data-grid'
import { NavigatorStateAction } from '@snState/NavigatorReducer'
import { DependentVariables, IndependentVariables, RangeVariables, ToggleableVariables, TripartiteVariables } from '@snTypes/DataDictionary'
import { NavigatorDispatch } from '@snTypes/Types'
import { Dispatch, useCallback, useMemo } from 'react'

export const defaultTripartiteBothState = -1

const _handleRangeChange = (dispatch: NavigatorDispatch, field: RangeVariables, newRange: number | number[]) => {
    const update: NavigatorStateAction = {
        type: "updateRange",
        field,
        newRange: newRange as number[]
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

const useFilterCallbacks = (dispatch: Dispatch<NavigatorStateAction>) => {
    const handleRangeChange = useCallback((_: Event, field: RangeVariables, newValue: number | number[]) => {
        _handleRangeChange(dispatch, field, newValue)
    }, [dispatch])
    const handleDependentVariableChange = useCallback((event: SelectChangeEvent) => {
        handleDependentVariableChg(dispatch, event)
    }, [dispatch])
    const handleIndependentVariableChange = useCallback((event: SelectChangeEvent) => {
        handleIndependentVariableChg(dispatch, event)
    }, [dispatch])
    const handleCheckboxChange = useCallback((field: ToggleableVariables, index: number, targetState: boolean) => {
        handleCheckboxChangeBase(dispatch, field, index, targetState)
    }, [dispatch])
    const handleTripartiteDropdownChange = useCallback((field: TripartiteVariables, event: SelectChangeEvent<number>) => {
        handleTripartiteDropdownChangeBase(dispatch, field, event)
    }, [dispatch])
    const handleUpdateMarks = useCallback((model: GridRowSelectionModel) => {
        handleUpdateMarkedRecords(dispatch, model)
    }, [dispatch])

    const callbacks = useMemo(() => {
        return {
            handleRangeChange,
            handleCheckboxChange,
            handleTripartiteDropdownChange,
            handleDependentVariableChange,
            handleIndependentVariableChange,
            handleUpdateMarks,
        }
    }, [handleCheckboxChange, handleDependentVariableChange, handleIndependentVariableChange, handleRangeChange, handleTripartiteDropdownChange, handleUpdateMarks])

    return callbacks
}

export default useFilterCallbacks