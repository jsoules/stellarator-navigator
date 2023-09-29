import { SelectChangeEvent } from "@mui/material"
import SnSwitch from "@snComponents/SnSwitch"
import { SupportedColorMap } from "@snComponents/display/Colormaps"
import SurfaceCheckboxes from "@snVisualizer/SurfaceCheckboxes"
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
}

const Model: FunctionComponent<ModelProps> = (props: ModelProps) => {
    const { checksNeeded, surfaceChecks, setSurfaceChecks, showCurrents, setShowCurrents, colorMap, setColorMap, showFullRing, setShowFullRing } = props

    const handleCheckboxChange = useCallback((index: number, newState: boolean) => {
        if (index === -1) {
            setSurfaceChecks(Array(surfaceChecks.length).fill(newState))
        } else {
            const newList = [...surfaceChecks]
            newList[index] = newState
            setSurfaceChecks(newList)
        }
    }, [setSurfaceChecks, surfaceChecks])

    const handleColorMapChange = (evt: SelectChangeEvent<SupportedColorMap>) => setColorMap(evt.target.value as unknown as SupportedColorMap)

    return checksNeeded
        ? (<>
            <div style={{display: "flex"}}>
                <div style={{flex: 1, padding: 20 }}>
                    <SurfaceCheckboxes selections={surfaceChecks} onChange={handleCheckboxChange} />
                </div>
                <div style={{flex: 1, padding: 20 }}>
                    <SurfaceColorMapSelector value={colorMap} onChange={handleColorMapChange} />
                </div>
            </div>
            <div style={{display: "flex"}}>
                <div style={{flex: 1, padding: 20}}>
                    <SnSwitch 
                        header="Device display"
                        label="Show complete device?"
                        checked={showFullRing}
                        handleChange={setShowFullRing}
                    />
                </div>
                <div style={{flex: 1, padding: 20}}>
                    <SnSwitch
                        header="Coil currents"
                        label="Color coils per currents?"
                        checked={showCurrents}
                        handleChange={setShowCurrents}
                    />                    
                </div>
            </div>
        </>)
        : <></>
}

export default Model