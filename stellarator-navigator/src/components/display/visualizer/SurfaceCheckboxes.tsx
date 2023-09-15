import { Checkbox, FormControlLabel, Typography } from "@mui/material"
import { FunctionComponent } from "react"

type Props = {
    selections: boolean[]
    onChange: (i: number, targetState: boolean) => void
}


const SurfaceCheckboxes: FunctionComponent<Props> = (props: Props) => {
    const { selections, onChange } = props
    const checkCount = selections.filter(v => v).length
    const allChecked = checkCount === selections.length

    const allCheckbox = selections.length > 1
        ? (
            <div key="allSelect">
                <FormControlLabel
                    label="(toggle all)"
                    control={
                        <Checkbox
                            style={{ padding: 1, transform: 'scale(0.8)' }}
                            onClick={() => onChange(-1, !allChecked)}
                            checked={allChecked}
                            indeterminate={(checkCount > 0) && !allChecked}
                        />
                    }
                />
            </div>
        ) : (<></>)

    return selections.length === 0 ? <></> :
        (<div style={{paddingLeft: 8 }}>
            <Typography id="SurfaceCheckboxes" fontWeight="bold">
                Surfaces to display
            </Typography>
            { allCheckbox }
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


export default SurfaceCheckboxes