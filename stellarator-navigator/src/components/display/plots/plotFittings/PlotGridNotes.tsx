import { DependentVariables, fieldMarkedValueDesc } from "@snTypes/DataDictionary";
import { FunctionComponent, PropsWithChildren } from "react";

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


export const OverallHitCount: FunctionComponent<PropsWithChildren<OverallHitCountProps>> = (props: PropsWithChildren<OverallHitCountProps>) => (
    <div className="plotGridNote">
        {props.children}
        <span className="plotGridNoteText">Current filter settings return {props.hits} devices.</span>
    </div>
)

