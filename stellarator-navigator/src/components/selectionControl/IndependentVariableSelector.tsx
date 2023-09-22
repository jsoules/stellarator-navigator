
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { IndependentVariables, defaultIndependentVariableValue, getLabel, independentVariableDropdownConfig } from "@snTypes/DataDictionary"
import { FunctionComponent } from "react"


type Props = {
    value: IndependentVariables | undefined,
    onChange: (evt: SelectChangeEvent<IndependentVariables>) => void
}

const IndependentVariableSelector: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props
    const items = independentVariableDropdownConfig.map(item =>
        <MenuItem key={item.key} value={item.fieldName}>{getLabel({name: item.fieldName, labelType: 'long'})}</MenuItem>
    )
    
    return (
        <div style={{ paddingBottom: 10 }}>
            <Typography id="independent-variable-selector" gutterBottom>
                Independent Variable in Plots
            </Typography>
            <FormControl fullWidth size="small">
                <Select<IndependentVariables>
                    value={props.value ?? defaultIndependentVariableValue}
                    onChange={onChange}
                >
                    {...items}
                </Select>
            </FormControl>
        </div>
    )
}

export default IndependentVariableSelector
