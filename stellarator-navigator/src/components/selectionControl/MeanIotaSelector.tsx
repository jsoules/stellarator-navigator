
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { Fragment, FunctionComponent } from "react"
import { meanIotaSentinelValue, meanIotaValidValues } from "./ValidValues"


type Props = {
    value: number | undefined,
    onChange: (evt: SelectChangeEvent<number>) => void
}

const MeanIotaSelector: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props
    const items = [
        <MenuItem key={meanIotaSentinelValue} value={meanIotaSentinelValue}>Any</MenuItem>,
        ...meanIotaValidValues.map((v, i) => {
            return (
                <MenuItem key={i + 1} value={v}>{v}</MenuItem>
            )
        })]

    return (
        <Fragment>
            <Typography id="mean-iota-selector" gutterBottom>
                Mean Iota
            </Typography>
            <FormControl fullWidth size="small">
                <Select
                    value={props.value ?? meanIotaSentinelValue}
                    onChange={onChange}
                >
                    {...items}
                </Select>
            </FormControl>
        </Fragment>
    )
}

export default MeanIotaSelector
