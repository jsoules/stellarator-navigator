import { Slider, Typography } from "@mui/material"
import { Fragment, FunctionComponent } from "react"
import { coilLengthPerHpValidValues } from "../../constants/ValidValues"

const marks = coilLengthPerHpValidValues.map(v => {return {value: v, label: ""}})


type Props = {
    value: number[] | undefined,
    onChange: (event: Event, newValue: number | number[]) => void
}

const minValue = Math.min(...coilLengthPerHpValidValues)
const maxValue = Math.max(...coilLengthPerHpValidValues)

const CoilLengthPerHpSlider: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props
    const value = props.value ?? [minValue, maxValue]

    return (
        <Fragment>
            <Typography id="coil-length-per-hp-slider" gutterBottom>
                Coil Length Per Half-Period
            </Typography>
            <Slider
                getAriaLabel={() => 'Coil length per hp'}
                value={value}
                onChange={onChange}
                valueLabelDisplay="auto"
                marks={marks}
                step={null}
                min={minValue}
                max={maxValue}
            />
        </Fragment>
    )
}

export default CoilLengthPerHpSlider
