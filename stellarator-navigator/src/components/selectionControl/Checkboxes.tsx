import SnCheckboxGroup from "@snComponents/SnCheckboxGroup"
import { ToggleableVariables, getLabel } from "@snTypes/DataDictionary"
import { FunctionComponent, useCallback } from "react"

type Props = {
    type: ToggleableVariables
    selections: boolean[]
    labels?: string[]
    onChange: (type: ToggleableVariables, i: number, targetState: boolean) => void
}


const ToggleableVariableCheckboxGroup: FunctionComponent<Props> = (props: Props) => {
    const { type, selections, labels, onChange } = props
    const handleChange = useCallback((i: number, targetState: boolean) => onChange(type, i, targetState), [onChange, type])
    const id = `${type}-checkboxes`
    const desc = getLabel({name: type, labelType: 'full'})
    return SnCheckboxGroup({desc, id, selections, onChange: handleChange, labels})
}

export default ToggleableVariableCheckboxGroup
