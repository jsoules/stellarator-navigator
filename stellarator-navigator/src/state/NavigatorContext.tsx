import database from "@snState/database";
import applyFilterToState, { projectRecords } from "@snState/filter";
import { initialNavigatorState } from "@snTypes/Defaults";
import { FilterSettings, NavigatorContextType } from "@snTypes/Types";
import React, { FunctionComponent, PropsWithChildren, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import NavigatorReducer from "./NavigatorReducer";

export const NavigatorContext = React.createContext<NavigatorContextType>({
    filterSettings: initialNavigatorState,
    selection: new Set<number>(),
    database,
    dispatch: () => {},
    fetchRecords: (ids: Set<number>) => { ids.clear(); return [] },
})

const SetupFilterContext: FunctionComponent<PropsWithChildren> = (props: PropsWithChildren) => {
    const { children } = props
    const [filterSettings, filterSettingDispatch] = useReducer(NavigatorReducer, initialNavigatorState)
    const [selection, updateSelection] = useState(new Set<number>())
    const doFilter = useCallback((filters: FilterSettings) => {
        applyFilterToState(filters, updateSelection)
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
        fetchRecords: doRowProjection,
    }}, [filterSettings, selection, doRowProjection])

    return (
        <NavigatorContext.Provider value={ctxt}>
            {children}
        </NavigatorContext.Provider>
    )
}

export default SetupFilterContext
