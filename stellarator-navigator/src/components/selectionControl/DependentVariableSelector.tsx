
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { DependentVariables, defaultDependentVariableValue, dependentVariableDropdownConfig, getLabel } from "@snTypes/DataDictionary"
import { Fragment, FunctionComponent } from "react"


type Props = {
    value: DependentVariables | undefined,
    onChange: (evt: SelectChangeEvent<DependentVariables>) => void
}

const DependentVariableSelector: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props
    const items = dependentVariableDropdownConfig.map(item => {
        return (<MenuItem key={item.key} value={item.fieldName}>{getLabel({name: item.fieldName, labelType: 'full'})}</MenuItem>)
    })
    
    return (
        <Fragment>
            <Typography id="dependent-variable-selector" gutterBottom>
                Dependent Variable in Plots
            </Typography>
            <FormControl fullWidth size="small">
                <Select<DependentVariables>
                    value={props.value ?? defaultDependentVariableValue}
                    onChange={onChange}
                >
                    {...items}
                </Select>
            </FormControl>
        </Fragment>
    )
}

export default DependentVariableSelector
