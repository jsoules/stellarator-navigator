import { Checkbox, FormControlLabel, Typography } from "@mui/material"
import { FunctionComponent } from "react"

type Props = {
    value: boolean
    onChange: (targetState: boolean) => void
}


const ShowFullRingCheckbox: FunctionComponent<Props> = (props: Props) => {
    const { value, onChange } = props

    return (
        <div style={{paddingLeft: 8 }}>
            <Typography id="showFullRingCheck" fontWeight="bold">
                Device display
            </Typography>
            <FormControlLabel
                control={
                    <Checkbox
                        style={{ padding: 1, transform: 'scale(0.8)' }}
                        onClick={() => onChange(!value)}
                        checked={value}
                    />
                }
                label="Show complete device?"
            />
        </div>)
}


export default ShowFullRingCheckbox