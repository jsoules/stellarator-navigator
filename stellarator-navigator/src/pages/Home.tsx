import NavigatorReducer from "@snState/NavigatorReducer"
import { initialDatabase, initialNavigatorState } from "@snTypes/Defaults"
import useDatabase from 'querying/useDatabase'
import { FunctionComponent, useEffect, useReducer, useState } from "react"
import About from './About'
import Overview from './Overview'


const Home: FunctionComponent = () => {
    const database = useDatabase()
    const [filterSettings, filterSettingDispatch] = useReducer(NavigatorReducer, initialNavigatorState)
    useEffect(() => filterSettingDispatch({type: 'initialize', database: database}), [database])

    const [showOverview, setShowOverview] = useState<boolean>(false)
    const ready = database !== initialDatabase

    return (
        showOverview 
            ? <Overview records={filterSettings.records} dispatch={filterSettingDispatch} filterSettings={filterSettings} />
            : <About ready={ready} setShowOverview={setShowOverview} />
    )
}

export default Home
