
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { FunctionComponent } from "react"
import { IndependentVariableOpt } from "../../types/Types"
import { defaultIndependentVariableValue, independentVariableValidValues } from "../display/DependentVariableConfig"


type Props = {
    value: IndependentVariableOpt | undefined,
    onChange: (evt: SelectChangeEvent<IndependentVariableOpt>) => void
}

const IndependentVariableSelector: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props
    const items = independentVariableValidValues.map(item =>
        <MenuItem key={item.key} value={item.value}>{item.text}</MenuItem>
    )
    
    return (
        <div style={{ paddingBottom: 10 }}>
            <Typography id="dependent-variable-selector" gutterBottom>
                Independent Variable in Plots
            </Typography>
            <FormControl fullWidth size="small">
                <Select<IndependentVariableOpt>
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
