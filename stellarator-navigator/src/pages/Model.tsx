import HrBar from "@snComponents/HrBar"
import { SupportedColorMap } from "@snComponents/display/Colormaps"
import DownloadLinks from "@snComponents/display/visualizer/DownloadLinks"
import IotaProfilePlot from "@snComponents/display/visualizer/IotaProfilePlot"
import PoincarePlot from "@snComponents/display/visualizer/PoincarePlot"
import SurfaceControls from "@snComponents/display/visualizer/SurfaceControls"
import { useFullRingCoils, useFullRingSurface } from "@snComponents/display/visualizer/useFullRing"
import useRecord from "@snState/useRecord"
import { defaultEmptyRecord } from "@snTypes/Defaults"
import { useDownloadPaths } from "@snUtil/useResourcePath"
import useWindowDimensions from "@snUtil/useWindowDimensions"
import RecordManifest from "@snVisualizer/RecordManifest"
import SimulationView from "@snVisualizer/SimulationView"
import { useCoils, useSurfaces } from "@snVisualizer/fetch3dData"
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react"

type ModelProps = {
    id: number | string
}

const Model: FunctionComponent<ModelProps> = (props: ModelProps) => {
    const { id } = props
    const canvasRef = useRef(null)
    const rec = useRecord(id)
    const downloadPaths = useDownloadPaths({ recordId: `${id}` })
    const baseCoils = useCoils({ recordId: `${id}` })
    const baseSurfs = useSurfaces({ recordId: `${id}` })
    const fullCoils = useFullRingCoils(baseCoils, rec.nfp)
    const fullSurfs = useFullRingSurface(baseSurfs, rec.nfp)
    
    const [surfaceChecks, setSurfaceChecks] = useState<boolean[]>(Array(rec.nSurfaces).fill(true))
    const [colorMap, setColorMap] = useState<SupportedColorMap>('plasma')
    const [showFullRing, setShowFullRing] = useState<boolean>(false)
    const [showCurrents, setShowCurrents] = useState<boolean>(true)

    const surfacesExist = useMemo(() => baseSurfs.surfacePoints !== undefined && baseSurfs.surfacePoints.length !== 0, [baseSurfs])
    useEffect(() => setSurfaceChecks(Array(rec.nSurfaces || 1).fill(true)), [rec?.nSurfaces])
    const coils = showFullRing ? fullCoils : baseCoils
    const surfs = showFullRing ? fullSurfs : baseSurfs


    const { width } = useWindowDimensions()
    const lw = useMemo(() => Math.max(0, (2 * width / 3) - 80), [width])
    const rw = useMemo(() => Math.max(0, (width / 3) - 40), [width])

    return rec === defaultEmptyRecord
        ? <div></div>
        : (<div className="simulationViewParent">
            <div className="flexWrapper simulationViewParent">
                <div style={{width: Math.floor(lw + 40)}} className="simulationViewWrapper">
                    <canvas ref={canvasRef} />
                    <SimulationView
                        width={lw}
                        height={0.8 * lw}
                        canvasRef={canvasRef}
                        coils={coils}
                        surfs={surfs}
                        surfaceChecks={surfaceChecks}
                        colorScheme={colorMap}
                        displayedPeriods={showFullRing ? 2 * rec.nfp : 1}
                        showCurrents={showCurrents}
                    />
                    <SurfaceControls
                        checksNeeded={surfacesExist}
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
                    <IotaProfilePlot iotaProfile={rec.iotaProfile} meanIota={rec.meanIota} width={rw} height={rw} />
                </div>
            </div>
            <HrBar />
            <PoincarePlot id={rec.id} />
            <HrBar />
            <DownloadLinks dataPaths={downloadPaths} />
        </div>
    )
}

export default Model