import { SupportedColorMap } from "@snComponents/display/Colormaps"
import InstructionButton from "@snComponents/general/InstructionButton"
import { ModelInstructionDrawer } from "@snComponents/general/InstructionDrawer"
import { HrBar, Spinner } from "@snGeneralComponents/index"
import { useModel, useRecord } from "@snQuerying/index"
import { defaultEmptyRecord } from "@snTypes/Defaults"
import { getStringId } from "@snUtil/makeResourcePath"
import useWindowDimensions from "@snUtil/useWindowDimensions"
import { DownloadLinks, IotaProfilePlot, PoincarePlot, RecordManifest, SimulationView, SurfaceControls } from "@snVisualizer/index"
import imgLogo from 'assets/Quasr_Logo_RGB_Full.svg'
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
    const { baseCoils, baseSurfs, fullCoils, fullSurfs, surfaceCount } = useModel(stringId.id, rec.nfp)
    
    const [instructionsOpen, setInstructionsOpen] = useState(false)
    const [colorMap, setColorMap] = useState<SupportedColorMap>(SupportedColorMap.PLASMA)
    const [showFullRing, setShowFullRing] = useState<boolean>(false)
    const [showCurrents, setShowCurrents] = useState<boolean>(true)
    // const [autoRotate, setAutoRotate] = useState<boolean>(false)
    const [surfaceChecks, setSurfaceChecks] = useState<boolean[]>(Array(rec.nSurfaces).fill(true))
    useEffect(() => setSurfaceChecks(Array<boolean>(rec.nSurfaces).fill(true)), [rec.nSurfaces])

    const downloadLinks = <DownloadLinks id={stringId.id} />
    const poincarePlot = <PoincarePlot id={stringId.id}/>

    // const { width, height } = useWindowDimensions()
    const { width } = useWindowDimensions()
    const lw = useMemo(() => Math.max(0, (2 * width / 3) - 80), [width])
    const rw = useMemo(() => Math.max(0, (width / 3) - 40), [width])
    // NOTE: Removed (for the time being) per feedback 3/20/24.
    // Keeping this in comments since we may revisit later.
    // // This is quite hacky--depends on hard-coding the dimensions of the top controls.
    // // It will probably work for most but break on some setups.
    // // I'm mostly letting it through because the whole thing ought to be done with CSS somehow.
    // // Also note the similarity to some computations in defining the plot grid--
    // // these should perhaps be unified in some way
    // const ASSUMED_CONTROLS_HEIGHT = 350
    // const prescribedHeight = lw * 0.8
    // const availableHeight = height - ASSUMED_CONTROLS_HEIGHT
    // const constrainedLeftWidth = prescribedHeight <= availableHeight
    //     ? lw
    //     : Math.floor(availableHeight / 0.8)
    // const unused = lw - constrainedLeftWidth
    // const leftMargin = unused === 0 ? 0 : unused / 2 + 20 // because the parent width is lw + 40
    // // So many magic numbers for such a little layout task......

    const viewer = useMemo(() => {
        // TODO: Can we avoid rendering a SimulationView with no data, without
        // breaking the changing-number-of-hooks rules?
        const ifAvail = (
            <>
                <SimulationView
                    // width={constrainedLeftWidth}
                    // height={0.8 * constrainedLeftWidth}
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
            // <div style={{width: constrainedLeftWidth, height: 0.8 * constrainedLeftWidth}}>
            <div style={{width: lw, height: 0.8 * lw}}>
                <Spinner />
            </div>
        )
        return (baseCoils.length === 0 || baseSurfs === undefined || baseSurfs.incomplete) ? spinner : ifAvail
    }, [lw, showFullRing, fullCoils, baseCoils, fullSurfs, baseSurfs, surfaceChecks, colorMap, rec.nfp, showCurrents])

    return rec === defaultEmptyRecord
        ? <div></div>
        : (<div className="simulationViewParent ForceLightMode">
            <ModelInstructionDrawer open={instructionsOpen} changeOpenState={setInstructionsOpen} />
            <div className="modelButtonRow">
                <img className="modelLogo" src={imgLogo} />
                <InstructionButton open={instructionsOpen} changeOpenState={setInstructionsOpen} />
            </div>
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
                    <canvas
                        ref={canvasRef}
                        className="deviceModel"
                        // style={{marginLeft: `${leftMargin}px`}}
                        title="Click and drag to rotate the camera; right-click, shift-click, or ctrl-click and drag to pan."
                    />
                    {viewer}
                </div>
                <div style={{width: Math.floor(rw) }}>
                    <IotaProfilePlot iotaProfile={rec.iotaProfile} tfProfile={rec.tfProfile} meanIota={rec.meanIota} width={rw} height={rw} />
                    <HrBar />
                    <RecordManifest rec={rec} colWidth={Math.floor(rw)} />
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