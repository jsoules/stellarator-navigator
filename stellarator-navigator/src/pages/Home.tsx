import NavigatorReducer from '@snState/NavigatorReducer'
import { RawData, makeDatabase } from '@snState/database'
import applyFilterToState, { projectRecords } from '@snState/filter'
import { initialDatabase, initialNavigatorState } from "@snTypes/Defaults"
import { KnownPathType, makeResourcePath } from '@snUtil/useResourcePath'
import { useQuery } from '@tanstack/react-query'
import queryFn from 'querying/queryFn'
import { FunctionComponent, useEffect, useMemo, useReducer, useState } from "react"
import useRoute from 'routing/useRoute'
import About from './About'
import Model from './Model'
import Overview from './Overview'


const Home: FunctionComponent = () => {
    // TODO: Margin, more styling, etc.
    const [showOverview, setShowOverview] = useState<boolean>(false)

    // TODO: pull the logic out, it's too long
    // DATABASE SETUP LOGIC
    const databasePath = makeResourcePath('', KnownPathType.DATABASE)
    const { data: rawDatabase, error } = useQuery({
        queryKey: ['database'],
        queryFn: () => queryFn(databasePath, !import.meta.env.DEV),
    })
    // TODO: Replace this with more sophisticated error--should bubble to routing
    if (error) {
        throw error
    }
    // TODO: Confirm this is in fact honoring the memoization
    // (I think it is not)
    // (alas)
    const database = useMemo(() => {
        if (!rawDatabase) {
            return initialDatabase
        }
        return makeDatabase(rawDatabase as RawData)
    }, [rawDatabase])
    // DATABASE FILTER LOGIC
    const [filterSettings, filterSettingDispatch] = useReducer(NavigatorReducer, initialNavigatorState)
    const [selection, updateSelection] = useState(new Set<number>())
    useEffect(() => applyFilterToState(filterSettings, database, updateSelection), [database, filterSettings])
    const records = useMemo(() => projectRecords(selection, database), [database, selection])


    const { route } = useRoute()
    const ready = database && database !== initialDatabase

    if (route.page === 'model') {
        return <Model id={route.recordId} />
    }

    return (
        showOverview 
            ? <Overview records={records} dispatch={filterSettingDispatch} filterSettings={filterSettings} />
            : <About ready={ready} setShowOverview={setShowOverview} />
    )
}

export default Home
