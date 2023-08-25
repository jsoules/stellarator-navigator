// adapted from MCMC-Monitor
// (https://github.com/flatironinstitute/mcmc-monitor/blob/4bef724d9a02163ade5a110764cace24144a9f57/src/util/useRoute.ts)

import { useCallback, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export type Route = {
    page: 'home'
} | {
    page: 'model',
    recordId: string
} | {
    page: 'filterEcho'
}

const useRoute = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const route: Route = useMemo(() => {
        if (location.pathname.startsWith('/model/')) {
            // expected to be of form BASENAME/model/MODEL_ID
            const tokens = location.pathname.split('/')
            const recordId = tokens[2]
            // todo: could validate record here
            return {
                page: 'model',
                recordId: recordId
            }
            // TODO: Probably remove this from production version
        } else if (location.pathname.startsWith('/filterEcho/')) {
            return {
                page: 'filterEcho'
            }
        } else {
            return {
                page: 'home'
            }
        }
    }, [location])

    const setRoute = useCallback((r: Route) => {
        if (r.page === 'home') {
            navigate({...location, pathname: ''})
        }
        if (r.page === 'model') {
            navigate({...location, pathname: `/model/${r.recordId}`})
        }
        if (r.page === 'filterEcho') {
            navigate({...location, pathname: '/filterEcho/'})
        }
    }, [location, navigate])

    return { route, setRoute }
}

export default useRoute
