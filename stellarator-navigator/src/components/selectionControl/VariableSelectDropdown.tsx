import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { DefaultColorMap, DefaultColorPalette, MapsConfig, PalettesConfig, SupportedColorMap, SupportedColorPalette } from "@snComponents/display/Colormaps"
import { DependentVariables, IndependentVariables, ToggleableVariables, colorationVariableDropdownConfig, dependentVariableDropdownConfig, getLabel, independentVariableDropdownConfig, toggleableVariableDropdownConfig } from "@snTypes/DataDictionary"
import { defaultCoarsePlotSplit, defaultDependentVariableValue, defaultFinePlotSplit, defaultIndependentVariableValue, defaultPlotColorSplit } from "@snTypes/Defaults"
import { FunctionComponent } from "react"
import { defaultFacetNoneState } from "./SelectionControlCallbacks"

type chgFn<T> = (evt: SelectChangeEvent<T>) => void
type baseProps<T> = {
    value?: T
    onChange: chgFn<T>
}

// Sadly, discriminated type unions in typescript are not straightforward
type dependentProps = baseProps<DependentVariables> & {type: 'Dependent'}
type independentProps = baseProps<IndependentVariables> & {type: 'Independent'}
type facetProps = baseProps<ToggleableVariables> & {type: 'CoarseSplit' | 'FineSplit'}
type colorSplitProps = baseProps<DependentVariables | ToggleableVariables> & {type: 'ColorVariable'}
type colorStylePropsDiscrete = baseProps<SupportedColorPalette> & {type: 'ColorStyleDiscrete'}
type colorStylePropsContinuous = baseProps<SupportedColorMap> & {type: 'ColorStyleContinuous'}

type Props = dependentProps | independentProps | facetProps | colorSplitProps | colorStylePropsDiscrete | colorStylePropsContinuous
type PropsTypes = Props['type']

const materialize = (type: PropsTypes) => {
    switch (type) {
        case "Dependent":
            return {
                desc: `${type} Variable in Plots`,
                itemSource: dependentVariableDropdownConfig,
                defaultVal: defaultDependentVariableValue,
                isColorStyle: false,
                addNoneItem: false,
            }
        case "Independent":
            return {
                desc: `${type} Variable in Plots`,
                itemSource: independentVariableDropdownConfig,
                defaultVal: defaultIndependentVariableValue,
                isColorStyle: false,
                addNoneItem: false,
            }
        case "CoarseSplit":
            return {
                desc: "Facet per-row variable",
                itemSource: toggleableVariableDropdownConfig,
                defaultVal: defaultCoarsePlotSplit,
                isColorStyle: false,
                addNoneItem: true,
            }
        case "FineSplit":
            return {
                desc: "Facet per-column variable",
                itemSource: toggleableVariableDropdownConfig,
                defaultVal: defaultFinePlotSplit,
                isColorStyle: false,
                addNoneItem: true,
            }
        case "ColorVariable":
            return {
                desc: "Coloration Variable in Plots",
                itemSource: colorationVariableDropdownConfig,
                defaultVal: defaultPlotColorSplit,
                isColorStyle: false,
                addNoneItem: false,
            }
        case "ColorStyleDiscrete":
            return {
                desc: "Plot Color Scheme",
                itemSource: PalettesConfig,
                defaultVal: DefaultColorPalette,
                isColorStyle: true,
                addNoneItem: false,
            }
        case "ColorStyleContinuous":
            return {
                desc: "Plot Color Scheme",
                itemSource: MapsConfig,
                defaultVal: DefaultColorMap,
                isColorStyle: true,
                addNoneItem: false,
            }
        default:
            throw Error("Unsupported selector type.")
    }
}


const makeItem = (key: number, fieldName: string) => {
    return  <MenuItem key={key} value={fieldName}>
                {getLabel({name: fieldName, labelType: 'full'})}
            </MenuItem>
}


const makeStyleItem = (key: number, value: string) => {
    return <MenuItem key={key} value={value}>{value}</MenuItem>
}



// There may be a neater way to do this with generics, but this is clean enough for now
const makeSelect = (props: Props) => {
    const { itemSource, defaultVal, isColorStyle, addNoneItem } = materialize(props.type)
    const items = isColorStyle
        ? itemSource.map(item => (makeStyleItem(item.key, item.value)))
        : itemSource.map(item => (makeItem(item.key, item.value)))
    const noneItem = <MenuItem key={defaultFacetNoneState} value={'undefined'}>None</MenuItem>
    const noneableItems = addNoneItem
        ? [noneItem, ...items]
        : items
    return (
        <Select<typeof defaultVal>
            value={props.value ?? defaultVal}
            onChange={props.onChange as chgFn<typeof defaultVal>}
        >
            {...noneableItems}
        </Select>
    )
}


const VariableSelector: FunctionComponent<Props> = (props: Props) => {
    const { desc } = materialize(props.type)
    return (
        <div className="dropdownWrapper">
            <Typography id={`${props.type}-variable-selector`} fontWeight="550" gutterBottom>
                {desc}
            </Typography>
            <FormControl fullWidth size="small">
                {makeSelect(props)}
            </FormControl>
        </div>
    )
}

export default VariableSelector
