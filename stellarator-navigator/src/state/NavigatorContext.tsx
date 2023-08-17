import React, { FunctionComponent, PropsWithChildren, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { initialNavigatorState } from "../constants/Defaults";
import database from "../logic/database";
import applyFilter, { projectRecords } from "../logic/filter";
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


// TODO: SHOULD WE SPLIT THIS CONTEXT?

export const NavigatorContext = React.createContext<NavigatorContextType>({
    filterSettings: initialNavigatorState,
    selection: new Set<number>(),
    database,
    dispatch: () => {},
    fetchRecords: (ids: Set<number>) => { ids.clear(); return [] }, // TODO
})

const SetupFilterContext: FunctionComponent<PropsWithChildren> = (props: PropsWithChildren) => {
    const { children } = props
    const [filterSettings, filterSettingDispatch] = useReducer(NavigatorReducer, initialNavigatorState)
    const [selection, updateSelection] = useState(new Set<number>())
    const doFilter = useCallback((filters: FilterSettings) => {
        applyFilter(database, filters, updateSelection)
    }, [updateSelection])
    const doRowProjection = useCallback((selection: Set<number>) => {
        return projectRecords(selection, database)
    }, [])

    useEffect(() => {
        doFilter(filterSettings)
    }, [filterSettings, doFilter])

    const ctxt: NavigatorContextType = useMemo(() => {return {
        filterSettings,
        selection,
        database,
        dispatch: filterSettingDispatch,
        fetchRecords: doRowProjection
    }}, [selection, filterSettings, filterSettingDispatch, doRowProjection])

    return (
        <NavigatorContext.Provider value={ctxt}>
            {children}
        </NavigatorContext.Provider>
    )
}

export default SetupFilterContext
