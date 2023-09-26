import { GlobalizationMethodNames, getLabel } from "@snTypes/DataDictionary"
import { StellaratorRecord } from "@snTypes/Types"
import { FunctionComponent } from "react"


type recordProps = {
    rec: StellaratorRecord
}

const RecordManifest: FunctionComponent<recordProps> = (props: recordProps) => {
    const { rec } = props

    return (<div>
        <div key="id">
            <span className="manifestLabel">{getLabel({name: "id", labelType: "full"})}:</span>
            <span>{rec.id}</span>
        </div>
        <div key="length">
            <span className="manifestLabel">Length (m):</span>
            <span>{rec.totalCoilLength} ({rec.coilLengthPerHp} per half-period)</span>
        </div>
        <div key="hyperparameters">
            <span className="manifestLabel">Hyperparameters:</span>
            <span>{rec.nFourierCoil} Fourier modes over {rec.nSurfaces} surfaces, {GlobalizationMethodNames[rec.globalizationMethod]} method</span>
        </div>
        <div key="qaError">
            <span className="manifestLabel">{getLabel({name: "qaError", labelType: "plot"})}:</span>
            <span>{(10 ** rec.qaError).toExponential(10)}</span>
        </div>
        <div key="iota">
            <span className="manifestLabel">{getLabel({name: "meanIota", labelType: "plot"})}:</span>
            <span>{rec.meanIota}</span>
        </div>
        <div key="nc">
            <span className="manifestLabel">{getLabel({name: "ncPerHp", labelType: "plot"})}:</span>
            <span>{rec.ncPerHp}</span>
        </div>
        <div key="nfp">
            <span className="manifestLabel">{getLabel({name: "nfp", labelType: "full"})}:</span>
            <span>{rec.nfp}</span>
        </div>
        <div key="volume">
            <span className="manifestLabel">{getLabel({name: "volume", labelType: "full"})}:</span>
            <span>{rec.volume}</span>
        </div>
        <div key="maxKappa">
            <span className="manifestLabel">{getLabel({name: "maxKappa", labelType: "full"})}:</span>
            <span>{rec.maxKappa}</span>
        </div>
        <div key="maxMsc">
            <span className="manifestLabel">{getLabel({name: "maxMeanSquaredCurve", labelType: "plot"})}:</span>
            <span>{rec.maxMeanSquaredCurve}</span>
        </div>
        <div key="minorRadius">
            <span className="manifestLabel">{getLabel({name: "minorRadius", labelType: "plot"})}:</span>
            <span>{rec.minorRadius}</span>
        </div>
        <div key="minDist">
            <span className="manifestLabel">{getLabel({name: "minIntercoilDist", labelType: "full"})}:</span>
            <span>{rec.minIntercoilDist}</span>
        </div>
        <div key="minCsDist">
            <span className="manifestLabel">{getLabel({name: "minCoil2SurfaceDist", labelType: "full"})}:</span>
            <span>{rec.minCoil2SurfaceDist}</span>
        </div>
        <div key="gradient">
            <span className="manifestLabel">{getLabel({name: "gradient", labelType: "full"})}:</span>
            <span>{(10 ** rec.gradient).toExponential(10)}</span>
        </div>
        <div key="aspectRatio">
            <span className="manifestLabel">{getLabel({name: "aspectRatio", labelType: "full"})}:</span>
            <span>{rec.aspectRatio}</span>
        </div>
    </div>)
}

export default RecordManifest
