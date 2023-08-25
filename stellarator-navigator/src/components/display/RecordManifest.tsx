import { FunctionComponent } from "react"
import { StellaratorRecord } from "../../types/Types"


type recordProps = {
    rec: StellaratorRecord
}

const RecordManifest: FunctionComponent<recordProps> = (props: recordProps) => {
    const { rec } = props

    return (<div>
        <div key="id">
            <span className="manifestLabel">Record:</span>
            <span>{rec.id}</span>
        </div>
        <div key="length">
            <span className="manifestLabel">Length (m):</span>
            <span>{rec.totalCoilLength} ({rec.coilLengthPerHp} per half-period)</span>
        </div>
        <div key="iota">
            <span className="manifestLabel">Iota:</span>
            <span>{rec.meanIota}</span>
        </div>
        <div key="nc">
            <span className="manifestLabel">Coils per hp:</span>
            <span>{rec.ncPerHp}</span>
        </div>
        <div key="nfp">
            <span className="manifestLabel">Field periods:</span>
            <span>{rec.nfp}</span>
        </div>
        <div key="seed">
            <span className="manifestLabel">Seed:</span>
            <span>{rec.seed}</span>
        </div>
        <div key="maxKappa">
            <span className="manifestLabel">Max kappa:</span>
            <span>{rec.maxKappa}</span>
        </div>
        <div key="maxMsc">
            <span className="manifestLabel">Max MSC:</span>
            <span>{rec.maxMsc}</span>
        </div>
        <div key="minDist">
            <span className="manifestLabel">Min Dist:</span>
            <span>{rec.minDist}</span>
        </div>
        <div key="qaError">
            <span className="manifestLabel">QA Error:</span>
            <span>{(10 ** rec.qaError).toExponential(10)}</span>
        </div>
        <div key="gradient">
            <span className="manifestLabel">Gradient:</span>
            <span>{(10 ** rec.gradient).toExponential(10)}</span>
        </div>
        <div key="aspectRatio">
            <span className="manifestLabel">Aspect Ratio:</span>
            <span>{rec.aspectRatio}</span>
        </div>
    </div>)
}

export default RecordManifest
