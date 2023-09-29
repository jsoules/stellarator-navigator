import HrBar from "@snComponents/HrBar"
import { SupportedColorMap } from "@snComponents/display/Colormaps"
import DownloadLinks from "@snComponents/display/visualizer/DownloadLinks"
import SurfaceControls from "@snComponents/display/visualizer/SurfaceControls"
import { useFullRingCoils, useFullRingSurface } from "@snComponents/display/visualizer/useFullRing"
import { NavigatorContext } from "@snState/NavigatorContext"
import RecordManifest from "@snVisualizer/RecordManifest"
import SimulationView from "@snVisualizer/SimulationView"
import { useCoils, useDownloadPaths, useSurfaces } from "@snVisualizer/fetch3dData"
import { FunctionComponent, useContext, useMemo, useRef, useState } from "react"

type ModelProps = {
    id: number | string
}

// TODO: NEED TO PROVIDE A DEFAULT RECORD FOR IF THE LOOKUP FAILS SO WE DON'T GET ERRORS

const Model: FunctionComponent<ModelProps> = (props: ModelProps) => {
    const { id } = props
    const { fetchRecords } = useContext(NavigatorContext)
    const canvasRef = useRef(null)
    const numericId = typeof(id) === "number" ? id : parseInt(id)
    const rec = fetchRecords(new Set([numericId]))[0]
    const downloadPaths = useDownloadPaths({ recordId: `${id}` })
    const baseCoils = useCoils({ recordId: `${id}` })
    const baseSurfs = useSurfaces({ recordId: `${id}` })
    const fullCoils = useFullRingCoils(baseCoils, rec.nfp)
    const fullSurfs = useFullRingSurface(baseSurfs, rec.nfp) // have to double because they're really half-periods
    
    const [surfaceChecks, setSurfaceChecks] = useState<boolean[]>(Array(rec.nSurfaces).fill(true))
    const [colorMap, setColorMap] = useState<SupportedColorMap>('plasma')
    const [showFullRing, setShowFullRing] = useState<boolean>(false)
    const [showCurrents, setShowCurrents] = useState<boolean>(true)

    const surfacesExist = useMemo(() => baseSurfs.surfacePoints !== undefined && baseSurfs.surfacePoints.length !== 0, [baseSurfs])
    const coils = showFullRing ? fullCoils : baseCoils
    const surfs = showFullRing ? fullSurfs : baseSurfs

    return (
        <div>
            <div style={{padding: 10}}>
                <canvas ref={canvasRef} />
                {/* TODO: Don't restrict this width/height to these values, do something smarter */}
                <SimulationView
                    width={800}
                    height={640}
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
            <HrBar />
            <RecordManifest rec={rec} />
            <HrBar />
            <DownloadLinks apiResponse={downloadPaths} />
        </div>
    )
}

export default Model