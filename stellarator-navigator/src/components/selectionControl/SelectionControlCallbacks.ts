import { SelectChangeEvent } from '@mui/material'
import { Dispatch, useCallback, useMemo } from 'react'
import { NavigatorStateAction } from '../../state/NavigatorReducer'
import { DependentVariableOpt, NavigatorDispatch } from '../../types/Types'

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

export const handleCheckboxChange = (dispatch: NavigatorDispatch, type: 'updateNfp' | 'updateNcPerHp', index: number, targetState: boolean) => {

    const update: NavigatorStateAction = {
        type: type,
        index: index,
        targetState
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
    const handleNcPerHpCheckboxChange = useCallback((index: number, targetState: boolean) => {
        handleCheckboxChange(dispatch, 'updateNcPerHp', index, targetState)
    }, [dispatch])
    const handleNfpCheckboxChange = useCallback((index: number, targetState: boolean) => {
        handleCheckboxChange(dispatch, 'updateNfp', index, targetState)
    }, [dispatch])

    const callbacks = useMemo(() => {
        return {
            handleCoilLengthPerHpChange,
            handleTotalCoilLengthChange,
            handleMeanIotaChange,
            handleDependentVariableChange,
            handleNcPerHpCheckboxChange,
            handleNfpCheckboxChange
        }
    }, [handleCoilLengthPerHpChange, handleDependentVariableChange, handleMeanIotaChange, handleNcPerHpCheckboxChange, handleNfpCheckboxChange, handleTotalCoilLengthChange])

    return callbacks
}

export default useFilterCallbacks