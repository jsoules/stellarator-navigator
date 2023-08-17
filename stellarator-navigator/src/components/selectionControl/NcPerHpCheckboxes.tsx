import { Checkbox, FormControlLabel, Typography } from "@mui/material"
import { FunctionComponent } from "react"

type Props = {
    selections: boolean[]
    onChange: (i: number, targetState: boolean) => void
}

const NcPerHpCheckboxes: FunctionComponent<Props> = (props: Props) => {
    const { selections, onChange } = props

    // TODO: Line-break these in some reasonable way

    return (
        <div style={{paddingLeft: 8, paddingTop: 15}}>
            <Typography id="nc-per-hp-checkboxes" gutterBottom>
                Coil Count per Half-Period (NC per HP)
            </Typography>
            {
                selections.map((v, i) => (
                    <span key={i + 1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    style={{ padding: 1, transform: 'scale(0.8)' }}
                                    onClick={() => onChange(i, !v)}
                                    checked={v}
                                />
                            }
                            label={i + 1}
                        />
                    </span>
                ))
            }
        </div>
    )
}


export default NcPerHpCheckboxes