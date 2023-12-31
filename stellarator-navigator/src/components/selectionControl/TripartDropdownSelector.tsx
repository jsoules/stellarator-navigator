
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { Fields, TripartiteVariables, getLabel } from "@snTypes/DataDictionary"
import { FunctionComponent, useCallback } from "react"
import { defaultTripartiteBothState } from "./SelectionControlCallbacks"


type Props = {
    field: TripartiteVariables,
    value: number | undefined,
    onChange: (field: TripartiteVariables, evt: SelectChangeEvent<number>) => void
}

const TripartDropdownSelector: FunctionComponent<Props> = (props: Props) => {
    const { field, value, onChange } = props
    const vals = (Fields[field].values) ?? []
    const labels = vals
    const cb = useCallback((evt: SelectChangeEvent<number>) => onChange(field, evt), [field, onChange])

    const bothItem = <MenuItem key={-1} value={defaultTripartiteBothState}>Any</MenuItem>
    const items = [
        bothItem,
        ...vals.map((v, idx) =>
        <MenuItem key={idx} value={v}>{labels[idx]}</MenuItem>
    )]
    
    return (
        <div className="dropdownWrapper">
            <Typography id="independent-variable-selector" gutterBottom>
                {getLabel({name: field, labelType: 'full'})}
            </Typography>
            <FormControl fullWidth size="small">
                <Select<number>
                    value={value ?? defaultTripartiteBothState}
                    onChange={cb}
                >
                    {...items}
                </Select>
            </FormControl>
        </div>
    )
}

export default TripartDropdownSelector
