import { SelectChangeEvent } from '@mui/material'
import { Fields, RangeVariables, ToggleableVariables } from '@snTypes/DataDictionary'
import { FilterSettings } from '@snTypes/Types'
import { FunctionComponent } from 'react'
import CheckboxTemplate from './Checkboxes'
import DependentVariableSelector from './DependentVariableSelector'
import IndependentVariableSelector from './IndependentVariableSelector'
import RangeSlider from './RangeSlider'


type Callbacks = {
    handleRangeChange: (event: Event, field: RangeVariables, newValue: number | number[]) => void
    handleDependentVariableChange: (event: SelectChangeEvent) => void
    handleIndependentVariableChange: (event: SelectChangeEvent) => void
    handleCheckboxChange: (type: ToggleableVariables, index: number, targetState: boolean) => void
}


type Props = {
    filterSettings: FilterSettings,
    callbacks: Callbacks
}

const SelectionControlPanel: FunctionComponent<Props> = (props: Props) => {
    const { filterSettings, callbacks } = props
    const { meanIota, ncPerHp, nfp, dependentVariable, independentVariable, nSurfaces } = filterSettings

    const sliders = Object.values(RangeVariables).filter(rv => isNaN(Number(rv)))
        .map(rv => (<RangeSlider key={rv} field={rv} value={filterSettings[rv]} onChange={callbacks.handleRangeChange} />))

    return (
        <div style={{margin: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 100}}>
            {sliders}
            {/* <RangeSlider field={RangeVariables.COIL_LENGTH_PER_HP} value={filterSettings[RangeVariables.COIL_LENGTH_PER_HP]} onChange={callbacks.handleRangeChange} />
            <RangeSlider field={RangeVariables.TOTAL_COIL_LENGTH} value={filterSettings[RangeVariables.TOTAL_COIL_LENGTH]} onChange={callbacks.handleRangeChange} />
            <RangeSlider field={RangeVariables.TOTAL_COIL_LENGTH} value={filterSettings[RangeVariables.TOTAL_COIL_LENGTH]} onChange={callbacks.handleRangeChange} />
            <RangeSlider field={RangeVariables.TOTAL_COIL_LENGTH} value={filterSettings[RangeVariables.TOTAL_COIL_LENGTH]} onChange={callbacks.handleRangeChange} />
            <RangeSlider field={RangeVariables.TOTAL_COIL_LENGTH} value={filterSettings[RangeVariables.TOTAL_COIL_LENGTH]} onChange={callbacks.handleRangeChange} />
            <RangeSlider field={RangeVariables.TOTAL_COIL_LENGTH} value={filterSettings[RangeVariables.TOTAL_COIL_LENGTH]} onChange={callbacks.handleRangeChange} />
            <RangeSlider field={RangeVariables.TOTAL_COIL_LENGTH} value={filterSettings[RangeVariables.TOTAL_COIL_LENGTH]} onChange={callbacks.handleRangeChange} />
            <RangeSlider field={RangeVariables.TOTAL_COIL_LENGTH} value={filterSettings[RangeVariables.TOTAL_COIL_LENGTH]} onChange={callbacks.handleRangeChange} />
            <RangeSlider field={RangeVariables.TOTAL_COIL_LENGTH} value={filterSettings[RangeVariables.TOTAL_COIL_LENGTH]} onChange={callbacks.handleRangeChange} />
            <RangeSlider field={RangeVariables.TOTAL_COIL_LENGTH} value={filterSettings[RangeVariables.TOTAL_COIL_LENGTH]} onChange={callbacks.handleRangeChange} /> */}
            {/* TODO Unify the checkbox template thing by referencing values if it exists */}
            <CheckboxTemplate
                type={ToggleableVariables.MEAN_IOTA}
                selections={meanIota}
                onChange={callbacks.handleCheckboxChange}
                labels={(Fields[ToggleableVariables.MEAN_IOTA].values ?? []).map(i => `${i}`)}
            />
            <CheckboxTemplate type={ToggleableVariables.NC_PER_HP} selections={ncPerHp} onChange={callbacks.handleCheckboxChange} />
            <CheckboxTemplate type={ToggleableVariables.NFP} selections={nfp} onChange={callbacks.handleCheckboxChange} />
            <CheckboxTemplate type={ToggleableVariables.N_SURFACES} selections={nSurfaces} onChange={callbacks.handleCheckboxChange} />
            <hr />
            <IndependentVariableSelector value={independentVariable} onChange={callbacks.handleIndependentVariableChange} />
            <DependentVariableSelector value={dependentVariable} onChange={callbacks.handleDependentVariableChange} />
        </div>
    )

}

export default SelectionControlPanel
