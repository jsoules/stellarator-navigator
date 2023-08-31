import { Checkbox, FormControlLabel, Typography } from "@mui/material"
import { FunctionComponent } from "react"

type Props = {
    selections: boolean[]
    onChange: (i: number, targetState: boolean) => void
}

export const NcPerHpCheckboxes: FunctionComponent<Props> = (props: Props) => {
    return CheckboxTemplate({ ...props, type: 'nc' })
}


export const NfpCheckboxes: FunctionComponent<Props> = (props: Props) => {
    return CheckboxTemplate({ ...props, type: 'nfp' })
}


type TemplateProps = Props & {
    type: 'nc' | 'nfp'
}


const ncId = "nc-per-hp-checkboxes"
const ncDesc = "Coil Count per Half-Period (NC per HP)"

const nfpId = 'nfp-checkboxes'
const nfpDesc = "Field Period Count (NFP)"

const CheckboxTemplate: FunctionComponent<TemplateProps> = (props: TemplateProps) => {
    const { selections, onChange, type } = props

    // TODO: line break in some reasonable way?
    const desc = type === 'nc' ? ncDesc : nfpDesc
    const id = type === 'nc' ? ncId : nfpId

    return (
        <div style={{paddingLeft: 8, paddingTop: 15}}>
            <Typography id={id} gutterBottom>
                {desc}
            </Typography>
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


export default NcPerHpCheckboxes