import React, { FunctionComponent, PropsWithChildren, useMemo, useReducer } from "react";
import { FilterSettings, NavigatorContextType } from "../types/Types";
import NavigatorReducer from "./NavigatorReducer";

// consumer components can use useContext($CONTEXTNAME) to get the context's contents
// e.g. const { data, dispatch, checkCnxnStatus } = useContext(MCMCMonitorContext)
// So context needs to provide them with:
// * a way to interact with the database
// * the current set of selected IDs
// * what the current filters are
// * A way to change the current filters
// POSSIBLY a way to associate each ID with its target?

const initialNavigatorState: FilterSettings = {
    coilLengthPerHp: undefined,
    totalCoilLength: undefined,
    meanIota: 0.1,
    ncPerHp: new Array(13).fill(false),
    nfp: new Array(5).fill(false),
    dependentVariable: "maxKappa"
}


export const NavigatorContext = React.createContext<NavigatorContextType>({
    filterSettings: initialNavigatorState,
    selection: new Set<number>(),
    dispatch: () => {},
    fetchRecords: (ids: Set<number>) => { ids.clear(); return {} }, // TODO
})

type Props = {
    id: number
}

const SetupFilterContext: FunctionComponent<PropsWithChildren<Props>> = (props: PropsWithChildren<Props>) => {
    const { children } = props
    const [filterSettings, filterSettingDispatch] = useReducer(NavigatorReducer, initialNavigatorState)
    const ctxt: NavigatorContextType = useMemo(() => {return {
        filterSettings,
        dispatch: filterSettingDispatch,
        selection: new Set<number>(),
        fetchRecords: (ids: Set<number>) => { ids.clear(); return {} }, // TODO
    }}, [filterSettings, filterSettingDispatch])

    return (
        <NavigatorContext.Provider value={ctxt}>
            {children}
        </NavigatorContext.Provider>
    )
}

export default SetupFilterContext
