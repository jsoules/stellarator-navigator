import { SupportedColorMap } from "@snComponents/display/Colormaps"
import { HrBar, Spinner } from "@snGeneralComponents/index"
import { useModel, useRecord } from "@snQuerying/index"
import { defaultEmptyRecord } from "@snTypes/Defaults"
import { getStringId } from "@snUtil/makeResourcePath"
import useWindowDimensions from "@snUtil/useWindowDimensions"
import { DownloadLinks, IotaProfilePlot, PoincarePlot, RecordManifest, SimulationView, SurfaceControls } from "@snVisualizer/index"
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router"

const Model: FunctionComponent = () => {
    const params = useParams()
    const id = params.modelId
    if (id === undefined) {
        throw Error(`Can't happen: modelId parameter not set in ${JSON.stringify(params)}`)
    }
    const stringId = getStringId(id)
    const canvasRef = useRef(null)
    const rec = useRecord(id)
    const { baseCoils, baseSurfs, fullCoils, fullSurfs, surfaceCount } = useModel(stringId.id, rec?.nfp ?? 1)
    
    const [colorMap, setColorMap] = useState<SupportedColorMap>('plasma')
    const [showFullRing, setShowFullRing] = useState<boolean>(false)
    // TODO: Temporarily defaulted to False & disabled control while an irregularity in the data is updated
    const [showCurrents, setShowCurrents] = useState<boolean>(false)
    const [surfaceChecks, setSurfaceChecks] = useState<boolean[]>(Array(rec?.nSurfaces || 1).fill(true))
    useEffect(() => setSurfaceChecks(Array(rec.nSurfaces || 1).fill(true)), [rec?.nSurfaces])

    const downloadLinks = <DownloadLinks id={stringId.id} />
    const poincarePlot = <PoincarePlot id={stringId.id}/>

    const { width } = useWindowDimensions()
    const lw = useMemo(() => Math.max(0, (2 * width / 3) - 80), [width])
    const rw = useMemo(() => Math.max(0, (width / 3) - 40), [width])

    const viewer = useMemo(() => {
        // TODO: Can we avoid rendering a SimulationView with no data, without
        // breaking the changing-number-of-hooks rules?
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
                <div style={{width: Math.floor(lw + 40)}} className="simulationViewWrapper">
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
                    <canvas ref={canvasRef}
                        title="Click and drag to rotate the camera; right-click, shift-click, or ctrl-click and drag to pan."
                    />
                    {viewer}
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