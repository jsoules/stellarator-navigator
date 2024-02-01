import { DependentVariables, fieldMarkedValueDesc } from "@snTypes/DataDictionary";
import { FunctionComponent } from "react";

type MarkedValueProps = {
    dependentVariable: DependentVariables
}

export const MarkedValueDesc: FunctionComponent<MarkedValueProps> = (props: MarkedValueProps) => {
    const markedValueDesc = fieldMarkedValueDesc(props.dependentVariable)
    return markedValueDesc === undefined
        ? <></>
        : <div className="plotGridNote">{markedValueDesc}</div>

}


type OverallHitCountProps = {
    hits: number
}


export const OverallHitCount: FunctionComponent<OverallHitCountProps> = (props: OverallHitCountProps) => (
    <div className="plotGridNote">Current filter settings return {props.hits} devices.</div>
)

