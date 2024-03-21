import { SelectChangeEvent } from "@mui/material"
import SnCheckboxGroup from "@snComponents/SnCheckboxGroup"
import SnSwitch from "@snComponents/SnSwitch"
import { SupportedColorMap } from "@snComponents/display/Colormaps"
import SurfaceColorMapSelector from "@snVisualizer/SurfaceColorMapSelector"
import { Dispatch, FunctionComponent, SetStateAction, useCallback } from "react"

type ModelProps = {
    checksNeeded: boolean
    surfaceChecks: boolean[]
    setSurfaceChecks: Dispatch<SetStateAction<boolean[]>>
    showCurrents: boolean
    setShowCurrents: Dispatch<SetStateAction<boolean>>
    colorMap: SupportedColorMap
    setColorMap: Dispatch<SetStateAction<SupportedColorMap>>
    showFullRing: boolean
    setShowFullRing: Dispatch<SetStateAction<boolean>>
    autorotate: boolean
    setAutorotate: Dispatch<SetStateAction<boolean>>
}

const Model: FunctionComponent<ModelProps> = (props: ModelProps) => {
    const { checksNeeded, surfaceChecks, setSurfaceChecks, colorMap, setColorMap } = props
    const { autorotate, setAutorotate, showCurrents, setShowCurrents, showFullRing, setShowFullRing } = props

    const handleCheckboxChange = useCallback((index: number, newState: boolean) => {
        if (index === -1) {
            setSurfaceChecks(Array(surfaceChecks.length).fill(newState))
        } else {
            const newList = [...surfaceChecks]
            newList[index] = newState
            setSurfaceChecks(newList)
        }
    }, [setSurfaceChecks, surfaceChecks])

    const handleColorMapChange = (evt: SelectChangeEvent<SupportedColorMap>) => setColorMap(evt.target.value as SupportedColorMap)
    const surfacePart = (
        <div className="flexWrapper">
            <div className="surfaceControlFlexSplitAlt">
                <SnCheckboxGroup
                    desc="Surfaces to display"
                    id="surfaceSelection"
                    selections={surfaceChecks}
                    onChange={handleCheckboxChange}
                />
            </div>
            <div className="surfaceControlFlexSplit">
                <SurfaceColorMapSelector value={colorMap} onChange={handleColorMapChange} />
            </div>
        </div>
    )

    return (
        <div className="surfaceControlWrapper">
            {checksNeeded && surfacePart}
            <div className="flexWrapper">
                <div className="surfaceControlFlexSplit">
                    <SnSwitch 
                        header="Device display"
                        label="Show complete device?"
                        checked={showFullRing}
                        handleChange={setShowFullRing}
                    />
                </div>
                <div className="surfaceControlFlexSplit">
                    <SnSwitch
                        header="Coil currents"
                        label="Color coils per currents?"
                        checked={showCurrents}
                        handleChange={setShowCurrents}
                    />
                </div>
                <div className="surfaceControlFlexSplit">
                    <SnSwitch
                        header="Revolve model"
                        label="Revolve model?"
                        checked={autorotate}
                        handleChange={setAutorotate}
                    />
                </div>
            </div>
        </div>
    )
}

export default Model