import { Slider, Typography } from "@mui/material"
import { Fields, RangeVariables, getLabel } from "@snTypes/DataDictionary"
import { Fragment, FunctionComponent, useCallback } from "react"

type Props = {
    field: RangeVariables,
    value: number[] | undefined,
    onChange: (event: Event, field: RangeVariables, newValue: number | number[]) => void
}

const RangeSlider: FunctionComponent<Props> = (props: Props) => {
    const { field, onChange } = props
    const changeHandler = useCallback((event: Event, newValue: number | number[]) => {
        return onChange(event, field, newValue)
    }, [field, onChange])
    const fieldDesc = Fields[field]
    const marks = fieldDesc.values ? fieldDesc.values.map(v => { return {value: v, label: ""} }) : undefined
    const step = marks ? null : (fieldDesc.range[1] - fieldDesc.range[0])/250

    // const valueLabelFormat = fieldDesc.isLog ? (v: number) => `${10 ** v}` : (v: number) => `${v}`
    const valueLabelFormat = fieldDesc.isLog ? (v: number) => `${(10 ** v).toExponential(3)}` : undefined

    const value = props.value ?? fieldDesc.range
    const label = getLabel({name: field, labelType: 'long'})

    return (
        <Fragment>
            <Typography id="coil-length-per-hp-slider" gutterBottom>
                { label }
            </Typography>
            <Slider
                getAriaLabel={() => label}
                value={value}
                getAriaValueText={valueLabelFormat}
                valueLabelFormat={valueLabelFormat}
                onChange={changeHandler}
                valueLabelDisplay="auto"
                marks={marks}
                step={step}
                min={fieldDesc.range[0]}
                max={fieldDesc.range[1]}
            />
        </Fragment>
    )
}



// scale={calculateValue}

export default RangeSlider

  
