import { SelectChangeEvent } from '@mui/material'
import { Fields, RangeVariables, ToggleableVariables, TripartiteVariables } from '@snTypes/DataDictionary'
import { FilterSettings } from '@snTypes/Types'
import { FunctionComponent } from 'react'
import ToggleableVariableCheckboxGroup from './Checkboxes'
import DependentVariableSelector from './DependentVariableSelector'
import IndependentVariableSelector from './IndependentVariableSelector'
import RangeSlider from './RangeSlider'
import TripartDropdownSelector from './TripartDropdownSelector'


type Callbacks = {
    handleRangeChange: (event: Event, field: RangeVariables, newValue: number | number[]) => void
    handleTripartiteDropdownChange: (field: TripartiteVariables, event: SelectChangeEvent<number>) => void
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

    const tripartDropdowns = Object.values(TripartiteVariables).filter(rv => isNaN(Number(rv)))
        .map(rv => (<TripartDropdownSelector key={rv} field={rv} value={filterSettings[rv] ?? -1} onChange={callbacks.handleTripartiteDropdownChange} />))

    return (
        <div style={{margin: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 100}}>
            <IndependentVariableSelector value={independentVariable} onChange={callbacks.handleIndependentVariableChange} />
            <DependentVariableSelector value={dependentVariable} onChange={callbacks.handleDependentVariableChange} />
            <hr style={{width: "50%" }} />
            {sliders}
            {/* TODO Unify the checkbox template thing by referencing values if it exists */}
            <ToggleableVariableCheckboxGroup
                type={ToggleableVariables.MEAN_IOTA}
                selections={meanIota}
                onChange={callbacks.handleCheckboxChange}
                labels={(Fields[ToggleableVariables.MEAN_IOTA].values ?? []).map(i => `${i}`)}
            />
            <ToggleableVariableCheckboxGroup type={ToggleableVariables.NC_PER_HP} selections={ncPerHp} onChange={callbacks.handleCheckboxChange} />
            <ToggleableVariableCheckboxGroup type={ToggleableVariables.NFP} selections={nfp} onChange={callbacks.handleCheckboxChange} />
            <ToggleableVariableCheckboxGroup type={ToggleableVariables.N_SURFACES} selections={nSurfaces} onChange={callbacks.handleCheckboxChange} />
            {tripartDropdowns}
        </div>
    )

}

export default SelectionControlPanel
