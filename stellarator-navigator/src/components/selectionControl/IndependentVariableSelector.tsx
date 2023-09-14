
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { defaultIndependentVariableValue, independentVariableValidValues } from "@snPlots/DependentVariableConfig"
import { IndependentVariableOpt } from "@snTypes/Types"
import { FunctionComponent } from "react"


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
