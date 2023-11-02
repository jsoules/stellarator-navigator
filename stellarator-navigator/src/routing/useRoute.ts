// adapted from MCMC-Monitor
// (https://github.com/flatironinstitute/mcmc-monitor/blob/4bef724d9a02163ade5a110764cace24144a9f57/src/util/useRoute.ts)

import { useCallback, useMemo } from "react"
// import { NavigateFunction, useLocation, useNavigate } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"

export type Route = {
    page: 'home'
} | {
    page: 'overview'
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
    return (numericRecordId >= 950 && numericRecordId <= 850000)
}


const redirectHome = (): Route => {
// const redirectHome = (navigate: NavigateFunction): Route => {
    // TODO NOTE: Need to switch these two lines; use the BASENAME version for deployments, the empty for local/dev mode.
    if (BASENAME === '/') {
        window.history.replaceState(null, "", `/`)
    } else {
        window.history.replaceState(null, "", `${BASENAME}/`)
    }
    // navigate("/", { replace: true })
    return { page: "home" }
}

const BASENAME = import.meta.env.BASE_URL

const useRoute = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const setRoute = useCallback((r: Route) => {
        if (r.page === 'home') {
            navigate({...location, pathname: `${BASENAME}`})
        }
        if (r.page === 'overview') {
            navigate({...location, pathname: `${BASENAME}/overview`})
        }
        if (r.page === 'model') {
            navigate({...location, pathname: `${BASENAME}/model/${r.recordId}`})
        }
    }, [location, navigate])

    const route: Route = useMemo(() => {
        if (location.pathname.startsWith(`/model/`)) {
            // URLs of form BASENAME/model/MODEL_ID
            const tokens = location.pathname.split('/')
            const recordId = tokens[2]
            if (!isPlausibleRecordId(recordId)) {
                console.warn(`Requested record ID ${recordId} is invalid.`)
                // return redirectHome(navigate)
                return redirectHome()
            }
            return {
                page: 'model',
                recordId: recordId
            }
        } else if (location.pathname.startsWith('/overview')) {
            return { page: 'overview' }
        } else {
            // return redirectHome(navigate)
            return redirectHome()
        }
    }, [location.pathname])

    return { route, setRoute }
}

export default useRoute
