import { Checkbox, FormControlLabel, Typography } from "@mui/material"
import { ToggleableVariables, getLabel } from "@snTypes/DataDictionary"
import { FunctionComponent } from "react"

type Props = {
    type: ToggleableVariables
    selections: boolean[]
    labels?: string[]
    onChange: (type: ToggleableVariables, i: number, targetState: boolean) => void
}

const CheckboxTemplate: FunctionComponent<Props> = (props: Props) => {
    const { selections, onChange, type, labels } = props
    const id = `${type}-checkboxes`
    const desc = getLabel({name: type, labelType: 'full'})
    const checkCount = selections.filter(v => v).length
    const allChecked = checkCount === selections.length
    // TODO: line break in some reasonable way?

    const allCheckbox = selections.length > 1
        ? (
            <div key="allSelect">
                <FormControlLabel
                    label="(toggle all)"
                    control={
                        <Checkbox
                            style={{ padding: 1, transform: 'scale(0.8)' }}
                            onClick={() => onChange(type, -1, !allChecked)}
                            checked={allChecked}
                            indeterminate={(checkCount > 0) && !allChecked}
                        />
                    }
                />
            </div>
        ) : (<></>)

    return (
        <div style={{paddingLeft: 8, paddingTop: 15}}>
            <Typography id={id} gutterBottom>
                {desc}
            </Typography>
            { allCheckbox }
            {
                selections.map((v, i) => (
                    <span key={i + 1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    style={{ padding: 1, transform: 'scale(0.8)' }}
                                    onClick={() => onChange(type, i, !v)}
                                    checked={v}
                                />
                            }
                            label={labels ? labels[i] : i + 1}
                        />
                    </span>
                ))
            }
        </div>
    )
}


export default CheckboxTemplate