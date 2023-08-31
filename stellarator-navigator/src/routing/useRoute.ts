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


const isPlausibleRecordId = (id: string): boolean => {
    const numericRecordId = parseInt(id)
    if (isNaN(numericRecordId)) return false
    return (numericRecordId >= 21021 && numericRecordId <= 180162)
}


const useRoute = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const route: Route = useMemo(() => {
        if (location.pathname.startsWith('/model/')) {
            // URLs of form BASENAME/model/MODEL_ID
            const tokens = location.pathname.split('/')
            const recordId = tokens[2]
            if (!isPlausibleRecordId(recordId)) {
                console.log(`Requested record ID ${recordId} is invalid.`)
                return { page: 'home' }
            }
            return {
                page: 'model',
                recordId: recordId
            }
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
