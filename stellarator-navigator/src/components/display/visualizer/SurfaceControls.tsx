import { SelectChangeEvent } from "@mui/material"
import { SupportedColorMap } from "@snComponents/display/Colormaps"
import { SurfaceApiResponseObject } from "@snTypes/Types"
import SurfaceCheckboxes from "@snVisualizer/SurfaceCheckboxes"
import SurfaceColorMapSelector from "@snVisualizer/SurfaceColorMapSelector"
import { Dispatch, FunctionComponent, SetStateAction, useCallback, useEffect } from "react"

type ModelProps = {
    surfaces: SurfaceApiResponseObject
    surfaceChecks: boolean[]
    setSurfaceChecks: Dispatch<SetStateAction<boolean[]>>
    colorMap: SupportedColorMap
    setColorMap: Dispatch<SetStateAction<SupportedColorMap>>
}

const Model: FunctionComponent<ModelProps> = (props: ModelProps) => {
    const { surfaces, surfaceChecks, setSurfaceChecks, colorMap, setColorMap } = props
    const surfacesExist = (surfaces.surfacePoints ?? []).length > 0

    useEffect(() => {
        setSurfaceChecks(Array((surfaces.surfacePoints ?? []).length).fill(true))
    }, [setSurfaceChecks, surfaces])

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

    return surfacesExist
        ? (
            <div style={{display: "flex"}}>
                <div style={{flex: 1, padding: 20 }}>
                    <SurfaceCheckboxes selections={surfaceChecks} onChange={handleCheckboxChange} />
                </div>
                <div style={{flex: 1, padding: 20 }}>
                    <SurfaceColorMapSelector value={colorMap} onChange={handleColorMapChange} />
                </div>
            </div>
        )
        : <></>
}

export default Model