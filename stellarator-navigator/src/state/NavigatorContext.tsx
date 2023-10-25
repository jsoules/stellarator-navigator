import useDatabase from "@snState/database";
import applyFilterToState, { projectRecords } from "@snState/filter";
import { initialDatabase, initialNavigatorState } from "@snTypes/Defaults";
import { FilterSettings, NavigatorContextType } from "@snTypes/Types";
import React, { FunctionComponent, PropsWithChildren, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import NavigatorReducer from "./NavigatorReducer";

export const NavigatorContext = React.createContext<NavigatorContextType>({
    filterSettings: initialNavigatorState,
    selection: new Set<number>(),
    database: initialDatabase,
    dispatch: () => {},
    fetchRecords: (ids: Set<number>) => { ids.clear(); return [] },
})

const SetupFilterContext: FunctionComponent<PropsWithChildren> = (props: PropsWithChildren) => {
    const { children } = props
    const [filterSettings, filterSettingDispatch] = useReducer(NavigatorReducer, initialNavigatorState)
    const [selection, updateSelection] = useState(new Set<number>())
    const database = useDatabase()
    const doFilter = useCallback((filters: FilterSettings) => {
        applyFilterToState(filters, database, updateSelection)
    }, [database])
    const doRowProjection = useCallback((selection: Set<number>) => {
        return projectRecords(selection, database)
    }, [database])

    useEffect(() => {
        doFilter(filterSettings)
    }, [filterSettings, doFilter])

    const ctxt: NavigatorContextType = useMemo(() => ({
        filterSettings,
        selection,
        database,
        dispatch: filterSettingDispatch,
        fetchRecords: doRowProjection,
    }), [filterSettings, selection, database, doRowProjection])

    return (
        <NavigatorContext.Provider value={ctxt}>
            {children}
        </NavigatorContext.Provider>
    )
}

export default SetupFilterContext
