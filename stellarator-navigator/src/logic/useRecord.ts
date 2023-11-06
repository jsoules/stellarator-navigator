import { defaultEmptyRecord } from '@snTypes/Defaults'
import { StellaratorRecord } from '@snTypes/Types'
import { fetchData } from '@snUtil/fetchData'
import makeResourcePath, { KnownPathType, getStringId } from '@snUtil/makeResourcePath'
import { useEffect, useState } from 'react'
import { makeRecordFromObject, rawObject } from './database'

type fetched = rawObject | {isDummy?: boolean}

const useRecord = (id: string | number) => {
    const stringId = getStringId(id)
    const [rawRecord, setRawRecord] = useState<fetched>({isDummy: true})
    const [record, setRecord] = useState<StellaratorRecord>(defaultEmptyRecord)
    const recordPath = makeResourcePath(stringId, KnownPathType.RECORD)
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
