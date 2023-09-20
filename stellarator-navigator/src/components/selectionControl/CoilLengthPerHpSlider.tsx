import { Slider, Typography } from "@mui/material"
import { getLabel } from "@snTypes/DataDictionary"
import { coilLengthPerHpValidValues } from "@snTypes/ValidValues"
import { Fragment, FunctionComponent } from "react"

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
    const label = getLabel({name: 'coilLengthPerHp', labelType: 'long'})

    return (
        <Fragment>
            <Typography id="coil-length-per-hp-slider" gutterBottom>
                { label }
            </Typography>
            <Slider
                getAriaLabel={() => label}
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
