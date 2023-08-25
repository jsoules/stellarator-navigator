import { SelectChangeEvent } from '@mui/material'
import { FunctionComponent } from 'react'
import { FilterSettings } from '../../types/Types'
import CoilLengthPerHpSlider from './CoilLengthPerHpSlider'
import DependentVariableSelector from './DependentVariableSelector'
import IndependentVariableSelector from './IndependentVariableSelector'
import MeanIotaSelector from './MeanIotaSelector'
import NcPerHpCheckboxes from './NcPerHpCheckboxes'
import NfpCheckboxes from './NfpCheckboxes'
import TotalCoilLengthSlider from './TotalCoilLengthSlider'


// qa error range 2e-11 to 4e-2 --> do we need a log scale?
// max kappa 1.5 - 4.4
// max msc 1.8 - 5.005
// min dist epsilon-below-0.1 - 0.3
// gradient 2.5e-14 - 0.1
// aspect ratio 2.852 - 20.022

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
