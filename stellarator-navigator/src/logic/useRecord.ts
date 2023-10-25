import { defaultEmptyRecord } from '@snTypes/Defaults'
import { StellaratorRecord } from '@snTypes/Types'
import { fetchData } from '@snUtil/fetchData'
import useResourcePath, { KnownPathType, getStringId } from '@snUtil/useResourcePath'
import { useEffect, useState } from 'react'
import { makeRecordFromObject, rawObject } from './database'

type fetched = rawObject | {isDummy?: boolean}

const useRecord = (id: string | number) => {
    const stringId = typeof id === "string" ? id.padStart(6, '0') : getStringId(id)
    const [rawRecord, setRawRecord] = useState<fetched>({isDummy: true})
    const [record, setRecord] = useState<StellaratorRecord>(defaultEmptyRecord)
    const recordPath = useResourcePath(stringId, KnownPathType.RECORD)
    useEffect(() => {
        fetchData<object>(recordPath, setRawRecord)
    }, [recordPath])
    useEffect(() => {
        if (!("isDummy" in rawRecord)) {
            setRecord(makeRecordFromObject(rawRecord as rawObject))
        } 
    }, [rawRecord])
    return record
}

export default useRecord
