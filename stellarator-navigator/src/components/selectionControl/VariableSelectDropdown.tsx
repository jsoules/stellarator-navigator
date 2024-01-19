import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { DependentVariables, IndependentVariables, defaultDependentVariableValue, defaultIndependentVariableValue, dependentVariableDropdownConfig, getLabel, independentVariableDropdownConfig } from "@snTypes/DataDictionary"
import { FunctionComponent } from "react"

type chgFn<T> = (evt: SelectChangeEvent<T>) => void
// type item<T> = { key: number, fieldName: T }
type baseProps<T> = {
    value?: T
    onChange: chgFn<T>
}

type dependentProps = baseProps<DependentVariables> & {type: 'Dependent'}
type independentProps = baseProps<IndependentVariables> & {type: 'Independent'}

type Props = dependentProps | independentProps
type PropsTypes = Props['type']
// type allowedTypes = DependentVariables | IndependentVariables

const materialize = (type: PropsTypes) => {
    switch (type) {
        case "Dependent":
            return {
                desc: `${type} Variable in Plots`,
                itemSource: dependentVariableDropdownConfig,
                defaultVal: defaultDependentVariableValue
            }
        case "Independent":
            return {
                desc: `${type} Variable in Plots`,
                itemSource: independentVariableDropdownConfig,
                defaultVal: defaultIndependentVariableValue
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


// There may be a neater way to do this with generics, but this is clean enough for now
const makeSelect = (props: Props) => {
    const { itemSource, defaultVal } = materialize(props.type)
    const items = itemSource.map(item => (makeItem(item.key, item.fieldName)))
    return (
        <Select<typeof defaultVal>
            value={props.value ?? defaultVal}
            onChange={props.onChange as chgFn<typeof defaultVal>}
        >
            {...items}
        </Select>
    )
}


const VariableSelector: FunctionComponent<Props> = (props: Props) => {
    const { desc } = materialize(props.type)
    return (
        <div className="dropdownWrapper">
            <Typography id={`${props.type}-variable-selector`} gutterBottom>
                {desc}
            </Typography>
            <FormControl fullWidth size="small">
                {makeSelect(props)}
            </FormControl>
        </div>
    )
}

export default VariableSelector
