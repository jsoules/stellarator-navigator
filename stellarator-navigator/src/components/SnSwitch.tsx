import { FormControlLabel, Switch, Typography } from '@mui/material'
import { FunctionComponent } from 'react'

type SwitchProps = {
    header: string,
    label: string,
    checked: boolean,
    handleChange: (targetState: boolean) => void
}


const SnSwitch: FunctionComponent<SwitchProps> = (props: SwitchProps) => {
    const { checked, handleChange, header, label } = props

    return (
        <div className="sliderWrapper">
            <Typography fontWeight="bold">
                {header}
            </Typography>
            <FormControlLabel
                control={
                    <Switch
                        checked={checked}
                        onChange={() => handleChange(!checked)}
                        // size="small"
                    />
                }
                label={label}
            />
        </div>
    )
}

export default SnSwitch
