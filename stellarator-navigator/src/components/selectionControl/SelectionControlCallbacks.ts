import { SelectChangeEvent } from '@mui/material'
import { GridRowSelectionModel } from '@mui/x-data-grid'
import { NavigatorStateAction } from '@snState/NavigatorReducer'
import { DependentVariableOpt, IndependentVariableOpt, NavigatorDispatch } from '@snTypes/Types'
import { Dispatch, useCallback, useMemo } from 'react'

export const handleCoilLengthChange = (dispatch: NavigatorDispatch, type: 'updateCoilLengthPerHp' | 'updateTotalCoilLength', newValue: number | number[]) => {
    const update: NavigatorStateAction = {
        type: type,
        coilLength: newValue as number[]
    }
    dispatch(update)
}

export const handleMeanIotaChg = (dispatch: NavigatorDispatch, event: SelectChangeEvent<string>) => {
    const update: NavigatorStateAction = {
        type: 'updateMeanIota',
        newIota: parseFloat(event.target.value)
    }
    dispatch(update)
}

export const handleDependentVariableChg = (dispatch: NavigatorDispatch, event: SelectChangeEvent) => {
    const update: NavigatorStateAction = {
        type: 'updateDependentVariable',
        newValue: event.target.value as unknown as DependentVariableOpt
    }
    dispatch(update)
}

export const handleIndependentVariableChg = (dispatch: NavigatorDispatch, event: SelectChangeEvent) => {
    const update: NavigatorStateAction = {
        type: 'updateIndependentVariable',
        newValue: event.target.value as unknown as IndependentVariableOpt
    }
    dispatch(update)
}

export const handleCheckboxChange = (dispatch: NavigatorDispatch, type: 'updateNfp' | 'updateNcPerHp', index: number, targetState: boolean) => {
    const update: NavigatorStateAction = {
        type: type,
        index: index,
        targetState
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
    const handleCoilLengthPerHpChange = useCallback((_: Event, newValue: number | number[]) => {
        handleCoilLengthChange(dispatch, 'updateCoilLengthPerHp', newValue)
    }, [dispatch])
    const handleTotalCoilLengthChange = useCallback((_: Event, newValue: number | number[]) => {
        handleCoilLengthChange(dispatch, 'updateTotalCoilLength', newValue)
    }, [dispatch])
    const handleMeanIotaChange = useCallback((event: SelectChangeEvent<string>) => {
        handleMeanIotaChg(dispatch, event)
    }, [dispatch])
    const handleDependentVariableChange = useCallback((event: SelectChangeEvent) => {
        handleDependentVariableChg(dispatch, event)
    }, [dispatch])
    const handleIndependentVariableChange = useCallback((event: SelectChangeEvent) => {
        handleIndependentVariableChg(dispatch, event)
    }, [dispatch])
    const handleNcPerHpCheckboxChange = useCallback((index: number, targetState: boolean) => {
        handleCheckboxChange(dispatch, 'updateNcPerHp', index, targetState)
    }, [dispatch])
    const handleNfpCheckboxChange = useCallback((index: number, targetState: boolean) => {
        handleCheckboxChange(dispatch, 'updateNfp', index, targetState)
    }, [dispatch])
    const handleUpdateMarks = useCallback((model: GridRowSelectionModel) => {
        handleUpdateMarkedRecords(dispatch, model)
    }, [dispatch])

    const callbacks = useMemo(() => {
        return {
            handleCoilLengthPerHpChange,
            handleTotalCoilLengthChange,
            handleMeanIotaChange,
            handleDependentVariableChange,
            handleIndependentVariableChange,
            handleNcPerHpCheckboxChange,
            handleNfpCheckboxChange,
            handleUpdateMarks,
        }
    }, [handleCoilLengthPerHpChange, handleDependentVariableChange, handleIndependentVariableChange, handleMeanIotaChange,
        handleNcPerHpCheckboxChange, handleNfpCheckboxChange, handleTotalCoilLengthChange, handleUpdateMarks])

    return callbacks
}

export default useFilterCallbacks