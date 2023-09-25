
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { Fields, GlobalizationMethodNames, KnownFields, TripartiteVariables, getLabel } from "@snTypes/DataDictionary"
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
    const labels = ((field as unknown as KnownFields) === KnownFields.GLOBALIZATION_METHOD) ? GlobalizationMethodNames : vals
    const cb = useCallback((evt: SelectChangeEvent<number>) => onChange(field, evt), [field, onChange])

    const bothItem = <MenuItem key={-1} value={defaultTripartiteBothState}>Any</MenuItem>
    const items = [
        bothItem,
        ...vals.map((v, idx) =>
        <MenuItem key={idx} value={v}>{labels[idx]}</MenuItem>
    )]
    
    return (
        <div style={{ paddingBottom: 10 }}>
            <Typography id="independent-variable-selector" gutterBottom>
                {getLabel({name: field, labelType: 'long'})}
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
