import { SelectChangeEvent } from '@mui/material'
import { SupportedColorMap, SupportedColorPalette } from '@snComponents/display/Colormaps'
import { ColorPropsAction, PlotColorProps, useUpdateColorSchemeCallback, useUpdateColorVariableCallback } from '@snComponents/display/plots/interactions/plotColors'
import HrBar from '@snComponents/general/HrBar'
import { Fields, RangeVariables, ToggleableVariables, TripartiteVariables, fieldIsCategorical } from '@snTypes/DataDictionary'
import { FilterSettings } from '@snTypes/Types'
import { Dispatch, FunctionComponent } from 'react'
import ToggleableVariableCheckboxGroup from './Checkboxes'
import RangeSlider from './RangeSlider'
import TripartDropdownSelector from './TripartDropdownSelector'
import VariableSelector from './VariableSelectDropdown'


type Callbacks = {
    handleRangeChange: (event: Event, field: RangeVariables, newValue: number | number[]) => void
    handleTripartiteDropdownChange: (field: TripartiteVariables, event: SelectChangeEvent<number>) => void
    handleDependentVariableChange: (event: SelectChangeEvent) => void
    handleIndependentVariableChange: (event: SelectChangeEvent) => void
    handleCoarseVariableChange: (event: SelectChangeEvent) => void
    handleFineVariableChange: (event: SelectChangeEvent) => void
    handleCheckboxChange: (type: ToggleableVariables, index: number, targetState: boolean) => void
}


type Props = {
    filterSettings: FilterSettings,
    callbacks: Callbacks,
    colorProps: PlotColorProps,
    colorChgDispatcher: Dispatch<ColorPropsAction>
}

const SelectionControlPanel: FunctionComponent<Props> = (props: Props) => {
    const { filterSettings, callbacks, colorChgDispatcher } = props
    const { meanIota, ncPerHp, nfp, dependentVariable, independentVariable, coarsePlotSplit, finePlotSplit, nSurfaces } = filterSettings
    const { colorSplit, style } = props.colorProps

    const colorVarCallback = useUpdateColorVariableCallback(colorChgDispatcher)
    const colorSchemeCallback = useUpdateColorSchemeCallback(colorChgDispatcher)

    const sliders = Object.values(RangeVariables).filter(rv => isNaN(Number(rv)))
        .map(rv => (<RangeSlider key={rv} field={rv} value={filterSettings[rv]} onChange={callbacks.handleRangeChange} />))

    const tripartDropdowns = Object.values(TripartiteVariables).filter(rv => isNaN(Number(rv)))
        .map(rv => (<TripartDropdownSelector key={rv} field={rv} value={filterSettings[rv] ?? -1} onChange={callbacks.handleTripartiteDropdownChange} />))

    const styleSelector = fieldIsCategorical(colorSplit)
        ? <VariableSelector value={style as SupportedColorPalette} onChange={colorSchemeCallback} type="ColorStyleDiscrete" />
        : <VariableSelector value={style as SupportedColorMap} onChange={colorSchemeCallback} type="ColorStyleContinuous" />

    return (
        <div className="ControlPanelWrapper">
            <VariableSelector value={independentVariable} onChange={callbacks.handleIndependentVariableChange} type="Independent" />
            <VariableSelector value={dependentVariable} onChange={callbacks.handleDependentVariableChange} type="Dependent" />
            <HrBar />
            <VariableSelector value={colorSplit} onChange={colorVarCallback} type="ColorVariable" />
            {styleSelector}
            <HrBar />
            <VariableSelector value={coarsePlotSplit} onChange={callbacks.handleCoarseVariableChange} type="CoarseSplit" />
            <VariableSelector value={finePlotSplit} onChange={callbacks.handleFineVariableChange} type="FineSplit" />
            <HrBar />
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
