import { Slider, Typography } from "@mui/material"
import { totalCoilLengthValidValues } from "@snTypes/ValidValues"
import { Fragment, FunctionComponent } from "react"

const marks = totalCoilLengthValidValues.map(v => {return {value: v, label: ""}}) // was `${v}`


type Props = {
    value: number[] | undefined,
    onChange: (event: Event, newValue: number | number[]) => void
}

const minValue = Math.min(...totalCoilLengthValidValues)
const maxValue = Math.max(...totalCoilLengthValidValues)


const TotalCoilLengthSlider: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props
    const value = props.value ?? [Math.min(...totalCoilLengthValidValues), Math.max(...totalCoilLengthValidValues)]

    return (
        <Fragment>
            <Typography id="total-coil-length-slider" gutterBottom>
                Total Coil Length
            </Typography>
            <Slider
                getAriaLabel={() => 'Total coil length'}
                value={value}
                onChange={onChange}
                valueLabelDisplay="auto"
                marks={marks}
                min={minValue}
                max={maxValue}
            />
        </Fragment>
    )
}

export default TotalCoilLengthSlider
