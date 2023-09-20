import { SelectChangeEvent } from '@mui/material'
import { FilterSettings } from '@snTypes/Types'
import { FunctionComponent } from 'react'
import { NcPerHpCheckboxes, NfpCheckboxes } from './Checkboxes'
import CoilLengthPerHpSlider from './CoilLengthPerHpSlider'
import DependentVariableSelector from './DependentVariableSelector'
import IndependentVariableSelector from './IndependentVariableSelector'
import TotalCoilLengthSlider from './TotalCoilLengthSlider'


type Callbacks = {
    handleCoilLengthPerHpChange: (event: Event, newValue: number | number[]) => void
    handleTotalCoilLengthChange: (event: Event, newValue: number | number[]) => void
    handleMeanIotaChange: (event: SelectChangeEvent<string>) => void
    handleDependentVariableChange: (event: SelectChangeEvent) => void
    handleIndependentVariableChange: (event: SelectChangeEvent) => void
    handleNcPerHpCheckboxChange: (index: number, targetState: boolean) => void
    handleNfpCheckboxChange: (index: number, targetState: boolean) => void
}


type Props = {
    filterSettings: FilterSettings,
    callbacks: Callbacks
}

const SelectionControlPanel: FunctionComponent<Props> = (props: Props) => {
    const { filterSettings, callbacks } = props
    const { coilLengthPerHp, totalCoilLength, meanIota, ncPerHp, nfp, dependentVariable, independentVariable } = filterSettings

    return (
        <div style={{margin: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 100}}>
            <CoilLengthPerHpSlider value={coilLengthPerHp} onChange={callbacks.handleCoilLengthPerHpChange}/>
            <TotalCoilLengthSlider value={totalCoilLength} onChange={callbacks.handleTotalCoilLengthChange} />
            <MeanIotaSelector value={`${meanIota}`} onChange={callbacks.handleMeanIotaChange} />
            <NcPerHpCheckboxes selections={ncPerHp} onChange={callbacks.handleNcPerHpCheckboxChange} />
            <NfpCheckboxes selections={nfp} onChange={callbacks.handleNfpCheckboxChange} />
            <hr />
            <IndependentVariableSelector value={independentVariable} onChange={callbacks.handleIndependentVariableChange} />
            <DependentVariableSelector value={dependentVariable} onChange={callbacks.handleDependentVariableChange} />
        </div>
    )

}

export default SelectionControlPanel
