import useFiltering from "@snState/filter"
import { initialDatabase } from "@snTypes/Defaults"
import useDatabase from 'querying/useDatabase'
import { FunctionComponent, useState } from "react"
import About from './About'
import Overview from './Overview'


const Home: FunctionComponent = () => {
    // TODO: Margin, more styling, etc.
    const database = useDatabase()
    const { records, filterSettings, filterSettingDispatch } = useFiltering(database)
    const [showOverview, setShowOverview] = useState<boolean>(false)
    const ready = database && database !== initialDatabase
    
    return (
        showOverview 
            ? <Overview records={records} dispatch={filterSettingDispatch} filterSettings={filterSettings} />
            : <About ready={ready} setShowOverview={setShowOverview} />
    )
}

export default Home
