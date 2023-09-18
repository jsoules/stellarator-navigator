// adapted from MCMC-Monitor
// (https://github.com/flatironinstitute/mcmc-monitor/blob/4bef724d9a02163ade5a110764cace24144a9f57/src/util/useRoute.ts)

import { useCallback, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export type Route = {
    page: 'home'
} | {
    page: 'model',
    recordId: string
}

// This is all very manual-style routing, with the main landing page reading the route and returning the
// appropriate contents. Basically, I'm not making real use of react-router here--its framework
// assumptions are more than I want to deal with here. I just need to know when the location
// changes so I can do my own routing downstream.

const isPlausibleRecordId = (id: string): boolean => {
    const numericRecordId = parseInt(id)
    if (isNaN(numericRecordId)) return false
    return (numericRecordId >= 950 && numericRecordId <= 505000)
}


const redirectHome = (): Route => {
    window.history.replaceState(null, "", "/")
    return { page: "home" }
}


const useRoute = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const setRoute = useCallback((r: Route) => {
        if (r.page === 'home') {
            navigate({...location, pathname: ''})
        }
        if (r.page === 'model') {
            navigate({...location, pathname: `/model/${r.recordId}`})
        }
    }, [location, navigate])

    const route: Route = useMemo(() => {
        if (location.pathname.startsWith('/model/')) {
            // URLs of form BASENAME/model/MODEL_ID
            const tokens = location.pathname.split('/')
            const recordId = tokens[2]
            if (!isPlausibleRecordId(recordId)) {
                console.warn(`Requested record ID ${recordId} is invalid.`)
                return redirectHome()
            }
            return {
                page: 'model',
                recordId: recordId
            }
        } else {
            return redirectHome()
        }
    }, [location])

    return { route, setRoute }
}

export default useRoute
