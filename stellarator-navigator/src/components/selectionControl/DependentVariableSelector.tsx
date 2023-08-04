
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { Fragment, FunctionComponent } from "react"
import { defaultDependentVariableValue, dependentVariableValidValues } from "./ValidValues"


type Props = {
    value: number | undefined,
    onChange: (evt: SelectChangeEvent<number>) => void
}

const DependentVariableSelector: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props
    const items = dependentVariableValidValues.map(item =>
        <MenuItem key={item.key} value={item.value}>{item.text}</MenuItem>
    )
    
    return (
        <Fragment>
            <Typography id="dependent-variable-selector" gutterBottom>
                Dependent Variable
            </Typography>
            <FormControl fullWidth size="small">
                <Select
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
