import { makeRecordFromObject, rawObject } from "@snState/database"
import { KnownPathType } from "@snTypes/DataDictionary"
import { defaultEmptyRecord } from '@snTypes/Defaults'
import makeResourcePath, { getStringId } from "@snUtil/makeResourcePath"
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import queryFn from "./queryFn"

const recordQueryKey = (id: string | number) => {
    const stringId = getStringId(id)
    return ['record', stringId]
}

const recordQuery = async (id: string | number) => {
    const stringId = getStringId(id)
    const path = makeResourcePath(stringId, KnownPathType.RECORD)
    // TODO: Compress individual records
    return queryFn<rawObject>(path, false)
}

const useRecord = (id: string | number) => {
    const key = recordQueryKey(id)
    const { data: rawRecord, error } = useQuery({
        queryKey: key,
        queryFn: () => recordQuery(id)
    })

    if (error) {
        throw error
    }
    
    const record = useMemo(() => {
        if (!rawRecord) return defaultEmptyRecord
        return makeRecordFromObject(rawRecord)
    }, [rawRecord])

    return record
}

export default useRecord
