import { Dispatch } from "react"
import { NavigatorStateAction } from "../state/NavigatorReducer"

export type DependentVariableOpt = 'maxKappa' | 'maxMsc' | 'minDist' | 'qaError'

export type FilterSettings = {
    coilLengthPerHp: number[] | undefined
    totalCoilLength: number[] | undefined
    meanIota: number,
    ncPerHp: boolean[],
    nfp: boolean[],
    dependentVariable: DependentVariableOpt,
}

export type StellaratorRecord = unknown
export type RecordDict = { [key: number]: StellaratorRecord }

export type NavigatorDispatch = Dispatch<NavigatorStateAction>

export type NavigatorContextType = {
    filterSettings: FilterSettings
    selection: Set<number>   // TODO: maybe remove this
    dispatch: React.Dispatch<NavigatorStateAction>
    fetchRecords: (ids: Set<number>) => RecordDict
}

export type FilterUpdateAction = unknown
