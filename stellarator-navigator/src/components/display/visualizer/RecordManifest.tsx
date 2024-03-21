import { getLabel, helicityValuesTranslation } from "@snTypes/DataDictionary"
import { StellaratorRecord } from "@snTypes/Types"
import { FunctionComponent } from "react"


type recordProps = {
    rec: StellaratorRecord
    colWidth: number
}

const RecordManifest: FunctionComponent<recordProps> = (props: recordProps) => {
    const { rec, colWidth } = props
    const maxWidth = 520 // "empirically observed" i.e. it looks okay on my monitor
    const margin = Math.max((colWidth - maxWidth)/2, 0)

    return (
        <div className="metadataManifest" style={{ maxWidth: maxWidth, marginLeft: margin }}>
            <div key="title">
                Device Metadata
            </div>
            <div key="id">
                <div className="manifestLabel">{getLabel({name: "id", labelType: "full"})}:</div>
                <div className="manifestContent">{rec.id}</div>
            </div>
            <div key="length">
                <div className="manifestLabel">Length (m):</div>
                <div className="manifestContent">{rec.totalCoilLength} ({rec.coilLengthPerHp} per half-period)</div>
            </div>
            <div key="qaError">
                <div className="manifestLabel">{getLabel({name: "qaError", labelType: "plot"})}:</div>
                <div className="manifestContent">{(10 ** rec.qaError).toExponential(10)}</div>
            </div>
            <div key="iota">
                <div className="manifestLabel">{getLabel({name: "meanIota", labelType: "plot"})}:</div>
                <div className="manifestContent">{rec.meanIota}</div>
            </div>
            <div key="nc">
                <div className="manifestLabel">{getLabel({name: "ncPerHp", labelType: "plot"})}:</div>
                <div className="manifestContent">{rec.ncPerHp}</div>
            </div>
            <div key="nfp">
                <div className="manifestLabel">{getLabel({name: "nfp", labelType: "full"})}:</div>
                <div className="manifestContent">{rec.nfp}</div>
            </div>
            <div key="volume">
                <div className="manifestLabel">{getLabel({name: "volume", labelType: "full"})}:</div>
                <div className="manifestContent">{rec.volume}</div>
            </div>
            <div key="maxKappa">
                <div className="manifestLabel">{getLabel({name: "maxKappa", labelType: "full"})}:</div>
                <div className="manifestContent">{rec.maxKappa}</div>
            </div>
            <div key="maxMsc">
                <div className="manifestLabel">{getLabel({name: "maxMeanSquaredCurve", labelType: "plot"})}:</div>
                <div className="manifestContent">{rec.maxMeanSquaredCurve}</div>
            </div>
            <div key="minorRadius">
                <div className="manifestLabel">{getLabel({name: "minorRadius", labelType: "plot"})}:</div>
                <div className="manifestContent">{rec.minorRadius}</div>
            </div>
            <div key="minDist">
                <div className="manifestLabel">{getLabel({name: "minIntercoilDist", labelType: "full"})}:</div>
                <div className="manifestContent">{rec.minIntercoilDist}</div>
            </div>
            <div key="minCsDist">
                <div className="manifestLabel">{getLabel({name: "minCoil2SurfaceDist", labelType: "full"})}:</div>
                <div className="manifestContent">{rec.minCoil2SurfaceDist}</div>
            </div>
            <div key="meanElongation">
                <div className="manifestLabel">{getLabel({name: "meanElongation", labelType: "full"})}:</div>
                <div className="manifestContent">{rec.meanElongation}</div>
            </div>
            <div key="maxElongation">
                <div className="manifestLabel">{getLabel({name: "maxElongation", labelType: "full"})}:</div>
                <div className="manifestContent">{rec.maxElongation}</div>
            </div>
            <div key="aspectRatio">
                <div className="manifestLabel">{getLabel({name: "aspectRatio", labelType: "full"})}:</div>
                <div className="manifestContent">{rec.aspectRatio}</div>
            </div>
            <div key="helicity">
                <div className="manifestLabel">{getLabel({name: "helicity", labelType: "full"})}:</div>
                <div className="manifestContent">{helicityValuesTranslation[rec.helicity]}</div>
            </div>
        </div>
    )
}

export default RecordManifest
