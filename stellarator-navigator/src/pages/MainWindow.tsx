import { SelectChangeEvent } from "@mui/material"
import { FunctionComponent, useCallback, useContext, useMemo } from "react"
import Splitter from "../components/Splitter"
import FilterEcho from "../components/display/FilterEcho"
import SelectionControlPanel, { handleCheckboxChange, handleCoilLengthChange, handleDependentVariableChg, handleMeanIotaChg } from "../components/selectionControl/SelectionControlPanel"
import { NavigatorContext } from "../state/NavigatorContext"
import useWindowDimensions from "../util/useWindowDimensions"



const MainWindow: FunctionComponent = () => {
    const {width, height} = useWindowDimensions()
    const { filterSettings, dispatch } = useContext(NavigatorContext)

    const handleCoilLengthPerHpChange = useCallback((newValue: number | number[]) => {
        handleCoilLengthChange(dispatch, 'updateCoilLengthPerHp', newValue)
    }, [dispatch])
    const handleTotalCoilLengthChange = useCallback((newValue: number | number[]) => {
        handleCoilLengthChange(dispatch, 'updateTotalCoilLength', newValue)
    }, [dispatch])
    const handleMeanIotaChange = useCallback((event: SelectChangeEvent) => {
        handleMeanIotaChg(dispatch, event)
    }, [dispatch])
    const handleDependentVariableChange = useCallback((event: SelectChangeEvent) => {
        handleDependentVariableChg(dispatch, event)
    }, [dispatch])
    const handleNcPerHpCheckboxChange = useCallback((index: number) => {
        handleCheckboxChange(dispatch, 'updateNcPerHp', index)
    }, [dispatch])
    const handleNfpCheckboxChange = useCallback((index: number) => {
        handleCheckboxChange(dispatch, 'updateNfp', index)
    }, [dispatch])

    const callbacks = useMemo(() => {
        return {
            handleCoilLengthPerHpChange,
            handleTotalCoilLengthChange,
            handleMeanIotaChange,
            handleDependentVariableChange,
            handleNcPerHpCheckboxChange,
            handleNfpCheckboxChange
        }
    }, [handleCoilLengthPerHpChange, handleDependentVariableChange, handleMeanIotaChange, handleNcPerHpCheckboxChange, handleNfpCheckboxChange, handleTotalCoilLengthChange])

    // TODO: Add a context-and-reducer to manage values
    return (
        <div style={{position: 'absolute', width: width - 40, height: height - 40, margin: 20, overflow: 'hidden'}}>
            <Splitter
                width={width - 30}
                height={height - 40}
                initialPosition={500}
            >
                <div>
                    <SelectionControlPanel filterSettings={filterSettings} callbacks={callbacks} />
                </div>
                <div>
                    <div>GRAPHS AND STUFF HERE</div>
                    <FilterEcho s={filterSettings} />
                </div>
            </Splitter>
        </div>
    )
}

export default MainWindow