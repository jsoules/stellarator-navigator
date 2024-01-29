import { Slider, Typography } from "@mui/material"
import { Fields, RangeVariables, getLabel } from "@snTypes/DataDictionary"
import { FunctionComponent, useCallback } from "react"
import ResetRangeButton from "./ResetRangeButton"

type Props = {
    field: RangeVariables,
    value: number[] | undefined,
    onChange: (event: Event, field: RangeVariables, newValue: number | number[]) => void,
    onReset: (field: RangeVariables) => void
}

const RangeSlider: FunctionComponent<Props> = (props: Props) => {
    const { field, onChange, onReset } = props
    const changeHandler = useCallback((event: Event, newValue: number | number[]) => {
        return onChange(event, field, newValue)
    }, [field, onChange])
    const fieldDesc = Fields[field]
    const marks = fieldDesc.values ? fieldDesc.values.map(v => { return {value: v, label: ""} }) : undefined
    const step = marks ? null : (fieldDesc.range[1] - fieldDesc.range[0])/256
    const changeScale = step === null ? 1 : Math.max(0, -1 * (Math.floor(Math.log10(step))))

    const valueLabelFormat = step === null
        ? undefined
        : fieldDesc.isLog
            ? (v: number) => (10 ** v).toExponential(3)
            : (v: number) => v.toFixed(changeScale)

    const value = props.value ?? fieldDesc.range
    const label = getLabel({name: field, labelType: 'full'})

    return (
        <div className="sliderWrapper">
            {/* TODO: Not sure I love the font weight options here... */}
            <Typography id={`${label}-slider`} fontWeight="450" className="rangeLabel" gutterBottom>
                { label }
            </Typography>
            <ResetRangeButton field={field} onReset={onReset} />
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
        </div>
    )
}


export default RangeSlider
