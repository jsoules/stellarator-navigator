import { Checkbox, FormControlLabel, Typography } from "@mui/material"
import { FunctionComponent } from "react"

type BaseProps = {
    desc: string
    id: string
    selections: boolean[]
    onChange: (i: number, targetState: boolean) => void
    labels?: string[]
}


const SnCheckboxGroup: FunctionComponent<BaseProps> = (props: BaseProps) => {
    const { selections, onChange, desc, id, labels } = props
    const checkCount = selections.filter(v => v).length
    const allChecked = checkCount === selections.length
    // TODO: line break in some reasonable way?

    const allCheckbox = selections.length > 1
        ? (
            <div key="allSelect">
                <FormControlLabel
                    label="(toggle all)"
                    control={
                        <Checkbox
                            className="checkboxItem"
                            onClick={() => onChange(-1, !allChecked)}
                            checked={allChecked}
                            indeterminate={(checkCount > 0) && !allChecked}
                        />
                    }
                />
            </div>
        ) : (<></>)

    return selections.length === 0 ? <></> : (
        <div className="checkboxGroup" id={`${id}-checkboxes`}>
            <Typography id={id} fontWeight="bold">
                {desc}
            </Typography>
            { allCheckbox }
            {
                selections.map((v, i) => (
                    <span key={i + 1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    className="checkboxItem"
                                    onClick={() => onChange(i, !v)}
                                    checked={v}
                                />
                            }
                            label={labels ? labels[i] : i + 1}
                        />
                    </span>
                ))
            }
        </div>
    )
}

export default SnCheckboxGroup
