import HrBar from "@snComponents/HrBar"
import { SupportedColorMap } from "@snComponents/display/Colormaps"
import DownloadLinks from "@snComponents/display/visualizer/DownloadLinks"
import IotaProfilePlot from "@snComponents/display/visualizer/IotaProfilePlot"
import PoincarePlot from "@snComponents/display/visualizer/PoincarePlot"
import SurfaceControls from "@snComponents/display/visualizer/SurfaceControls"
import Spinner from "@snComponents/general/Spinner"
import { defaultEmptyRecord } from "@snTypes/Defaults"
import { getStringId } from "@snUtil/makeResourcePath"
import useWindowDimensions from "@snUtil/useWindowDimensions"
import RecordManifest from "@snVisualizer/RecordManifest"
import SimulationView from "@snVisualizer/SimulationView"
import useModel from "querying/useModel"
import useRecord from "querying/useRecord"
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react"

type ModelProps = {
    id: number | string
}

const Model: FunctionComponent<ModelProps> = (props: ModelProps) => {
    const { id } = props
    const stringId = getStringId(id)
    const canvasRef = useRef(null)
    const rec = useRecord(id)
    const { baseCoils, baseSurfs, fullCoils, fullSurfs, surfaceCount } = useModel(stringId, rec?.nfp ?? 1)
    
    const [colorMap, setColorMap] = useState<SupportedColorMap>('plasma')
    const [showFullRing, setShowFullRing] = useState<boolean>(false)
    // TODO: Temporarily defaulted to False & disabled control while an irregularity in the data is updated
    const [showCurrents, setShowCurrents] = useState<boolean>(false)
    const [surfaceChecks, setSurfaceChecks] = useState<boolean[]>(Array(rec?.nSurfaces || 1).fill(true))
    useEffect(() => setSurfaceChecks(Array(rec.nSurfaces || 1).fill(true)), [rec?.nSurfaces])

    // TODO: Consider de-memoizing this, it surely doesn't need it
    const downloadLinks = useMemo(() => <DownloadLinks id={stringId} />, [stringId])
    const poincarePlot = useMemo(() => <PoincarePlot id={stringId}/>, [stringId])

    const { width } = useWindowDimensions()
    const lw = useMemo(() => Math.max(0, (2 * width / 3) - 80), [width])
    const rw = useMemo(() => Math.max(0, (width / 3) - 40), [width])

    const viewer = useMemo(() => {
        // TODO: Fix this so it's not breaking hook rules
        const ifAvail = (
            <>
                <SimulationView
                    width={lw}
                    height={0.8 * lw}
                    canvasRef={canvasRef}
                    coils={showFullRing ? fullCoils : baseCoils}
                    surfs={showFullRing ? fullSurfs : baseSurfs}
                    surfaceChecks={surfaceChecks}
                    colorScheme={colorMap}
                    displayedPeriods={showFullRing ? 2 * rec.nfp : 1}
                    showCurrents={showCurrents}
                />
            </>
        )
        const spinner = (
            <div style={{width: lw, height: 0.8 * lw}}>
                <Spinner />
            </div>
        )
        return (baseCoils.length === 0 || baseSurfs === undefined || baseSurfs.incomplete) ? spinner : ifAvail
    }, [baseCoils, baseSurfs, colorMap, fullCoils, fullSurfs, lw, rec.nfp, showCurrents, showFullRing, surfaceChecks])

    return rec === defaultEmptyRecord
        ? <div></div>
        : (<div className="simulationViewParent ForceLightMode">
            <div className="flexWrapper simulationViewParent">
                {/* <div style={{width: 400, height: 300}}>
                    <Spinner Type='barSpinner'/>
                </div> */}
                <div style={{width: Math.floor(lw + 40)}} className="simulationViewWrapper">
                    <canvas ref={canvasRef} />
                    {viewer}
                    <SurfaceControls
                        checksNeeded={surfaceCount > 0}
                        surfaceChecks={surfaceChecks}
                        setSurfaceChecks={setSurfaceChecks}
                        showCurrents={showCurrents}
                        setShowCurrents={setShowCurrents}
                        colorMap={colorMap}
                        setColorMap={setColorMap}
                        showFullRing={showFullRing}
                        setShowFullRing={setShowFullRing}
                    />
                </div>
                <div style={{width: Math.floor(rw)}}>
                    <RecordManifest rec={rec} />
                    <HrBar />
                    <IotaProfilePlot iotaProfile={rec.iotaProfile} tfProfile={rec.tfProfile} meanIota={rec.meanIota} width={rw} height={rw} />
                </div>
            </div>
            <HrBar />
            {poincarePlot}
            <HrBar />
            {downloadLinks}
        </div>
    )
}

export default Model