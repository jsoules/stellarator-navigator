import { SelectChangeEvent } from '@mui/material'
import { FunctionComponent } from 'react'
import { NavigatorStateAction } from '../../state/NavigatorReducer'
import { DependentVariableOpt, FilterSettings, NavigatorDispatch } from '../../types/Types'
import CoilLengthPerHpSlider from './CoilLengthPerHpSlider'
import DependentVariableSelector from './DependentVariableSelector'
import MeanIotaSelector from './MeanIotaSelector'
import NcPerHpCheckboxes from './NcPerHpCheckboxes'
import NfpCheckboxes from './NfpCheckboxes'
import TotalCoilLengthSlider from './TotalCoilLengthSlider'
import { parseDependentVariableValues } from './ValidValues'


// qa error range 2e-11 to 4e-2 --> do we need a log scale?
// max kappa 1.5 - 4.4
// max msc 1.8 - 5.005
// min dist epsilon-below-0.1 - 0.3
// gradient 2.5e-14 - 0.1

type Callbacks = {
    handleCoilLengthPerHpChange: (newValue: number | number[]) => void
    handleTotalCoilLengthChange: (newValue: number | number[]) => void
    handleMeanIotaChange: (event: SelectChangeEvent) => void
    handleDependentVariableChange: (event: SelectChangeEvent) => void
    handleNcPerHpCheckboxChange: (index: number) => void
    handleNfpCheckboxChange: (index: number) => void
}


type Props = {
    filterSettings: FilterSettings,
    callbacks: Callbacks
}

export const handleCoilLengthChange = (dispatch: NavigatorDispatch, type: 'updateCoilLengthPerHp' | 'updateTotalCoilLength', newValue: number | number[]) => {
    const update: NavigatorStateAction = {
        type: type,
        coilLength: newValue as number[]
    }
    dispatch(update)
}

export const handleMeanIotaChg = (dispatch: NavigatorDispatch, event: SelectChangeEvent) => {
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

export const handleCheckboxChange = (dispatch: NavigatorDispatch, type: 'updateNfp' | 'updateNcPerHp', index: number) => {
    const update: NavigatorStateAction = {
        type: type,
        toggleIndex: index
    }
    dispatch(update)
}

const SelectionControlPanel: FunctionComponent<Props> = (props: Props) => {
    const { filterSettings } = props
    const { coilLengthPerHp, totalCoilLength, meanIota, ncPerHp, nfp, dependentVariable } = filterSettings

    return (
        <div style={{paddingLeft: 20, paddingRight: 20, paddingTop: 100}}>
            <CoilLengthPerHpSlider value={coilLengthPerHp} onChange={() => {}}/>
            <TotalCoilLengthSlider value={totalCoilLength} onChange={() => {}} />
            <MeanIotaSelector value={meanIota} onChange={() => {}} />
            <NcPerHpCheckboxes selections={ncPerHp} onChange={() => {}} />
            <NfpCheckboxes selections={nfp} onChange={() => {}} />
            <hr />
            <DependentVariableSelector value={parseDependentVariableValues(dependentVariable)} onChange={() => {}} />
        </div>
    )

}

export default SelectionControlPanel
