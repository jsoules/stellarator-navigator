import { RawData, makeDatabase } from '@snState/database'
import { KnownPathType } from '@snTypes/DataDictionary'
import { initialDatabase } from "@snTypes/Defaults"
import makeResourcePath, { getStringId } from '@snUtil/makeResourcePath'
import { useQuery } from '@tanstack/react-query'
import queryFn from 'querying/queryFn'
import { useMemo } from "react"

const useDatabase = () => {
    const databasePath = makeResourcePath(getStringId(''), KnownPathType.DATABASE)
    const { data: rawDatabase, error } = useQuery({
        queryKey: ['database'],
        queryFn: () => queryFn<RawData>(databasePath, !import.meta.env.DEV),
    })
    // TODO: Replace this with more sophisticated error--should bubble to routing
    if (error) {
        throw error
    }

    const database = useMemo(() => {
        if (!rawDatabase) {
            return initialDatabase
        }
        return makeDatabase(rawDatabase)
    }, [rawDatabase])

    return database
}

export default useDatabase