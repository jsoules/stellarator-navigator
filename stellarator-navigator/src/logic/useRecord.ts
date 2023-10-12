import { defaultEmptyRecord } from '@snTypes/Defaults'
import { StellaratorRecord } from '@snTypes/Types'
import { fetchData } from '@snUtil/fetchData'
import useResourcePath, { KnownPathType, getStringId } from '@snUtil/useResourcePath'
import { useEffect, useState } from 'react'


const useRecord = (id: string | number) => {
    const stringId = typeof id === "string" ? id.padStart(6, '0') : getStringId(id)
    const [record, setRecord] = useState<StellaratorRecord>(defaultEmptyRecord)
    const recordPath = useResourcePath(stringId, KnownPathType.RECORD)
    useEffect(() => {
        fetchData<StellaratorRecord>(recordPath, setRecord)
    }, [recordPath])
    return record
}

export default useRecord
