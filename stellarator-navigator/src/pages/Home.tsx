import NavigatorReducer from '@snState/NavigatorReducer'
import applyFilterToState, { projectRecords } from '@snState/filter'
import { initialDatabase, initialNavigatorState } from "@snTypes/Defaults"
import useDatabase from 'querying/useDatabase'
import { FunctionComponent, useEffect, useMemo, useReducer, useState } from "react"
import useRoute from 'routing/useRoute'
import About from './About'
import Model from './Model'
import Overview from './Overview'


const Home: FunctionComponent = () => {
    // TODO: Margin, more styling, etc.
    const [showOverview, setShowOverview] = useState<boolean>(false)
    
    // TODO: pull the logic out, it's too long
    const database = useDatabase()
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
