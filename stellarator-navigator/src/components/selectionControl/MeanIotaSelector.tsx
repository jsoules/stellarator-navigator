
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { getLabel } from "@snTypes/DataDictionary"
import { meanIotaSentinelValue, meanIotaValidValues } from "@snTypes/ValidValues"
import { Fragment, FunctionComponent } from "react"


type Props = {
    value: string | undefined,
    onChange: (evt: SelectChangeEvent<string>) => void
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
                {getLabel({name: 'meanIota', labelType: 'long'})}
            </Typography>
            <FormControl fullWidth size="small">
                <Select<string>
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
