import { Checkbox, FormControlLabel, Typography } from "@mui/material"
import { getLabel } from "@snTypes/DataDictionary"
import { FunctionComponent } from "react"

type Props = {
    selections: boolean[]
    onChange: (i: number, targetState: boolean) => void
}

// TODO: drop the extra exports, trim this

export const NcPerHpCheckboxes: FunctionComponent<Props> = (props: Props) => {
    return CheckboxTemplate({ ...props, type: 'ncPerHp' })
}


export const NfpCheckboxes: FunctionComponent<Props> = (props: Props) => {
    return CheckboxTemplate({ ...props, type: 'nfp' })
}


type TemplateProps = Props & {
    type: 'ncPerHp' | 'nfp'
}


const CheckboxTemplate: FunctionComponent<TemplateProps> = (props: TemplateProps) => {
    const { selections, onChange, type } = props
    const id = `${type}-checkboxes`
    const desc = getLabel({name: type, labelType: 'long'})

    // TODO: line break in some reasonable way?
    // const desc = type === 'nc' ? ncDesc : nfpDesc
    // const id = type === 'nc' ? ncId : nfpId

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