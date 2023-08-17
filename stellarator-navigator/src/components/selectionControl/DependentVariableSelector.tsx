
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { Fragment, FunctionComponent } from "react"
import { DependentVariableOpt } from "../../types/Types"
import { defaultDependentVariableValue, dependentVariableValidValues } from "../display/DependentVariableConfig"


type Props = {
    value: DependentVariableOpt | undefined,
    onChange: (evt: SelectChangeEvent<DependentVariableOpt>) => void
}

const DependentVariableSelector: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props
    const items = dependentVariableValidValues.map(item =>
        <MenuItem key={item.key} value={item.value}>{item.text}</MenuItem>
    )
    
    return (
        <Fragment>
            <Typography id="dependent-variable-selector" gutterBottom>
                Dependent Variable in Plots
            </Typography>
            <FormControl fullWidth size="small">
                <Select<DependentVariableOpt>
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
