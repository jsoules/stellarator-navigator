import { Button, Tooltip } from '@mui/material'
import { RangeVariables, getLabel } from '@snTypes/DataDictionary'
import { FunctionComponent } from 'react'

type ResetRangeProps = {
    field: RangeVariables,
    onReset: (field: RangeVariables) => void
}

const ResetRangeButton: FunctionComponent<ResetRangeProps> = (props: ResetRangeProps) => {
    const { field, onReset } = props
    return (
        <span className="rangeResetButton">
            <Tooltip
                title={`Reset ${getLabel({name: field, labelType: "short"})}`}
                placement="left-end"
            >
                <Button
                    variant="text"
                    size="small"
                    onClick={ () => onReset(field) }
                >
                    Reset
                </Button>
            </Tooltip>
        </span>
    )
}

export default ResetRangeButton
