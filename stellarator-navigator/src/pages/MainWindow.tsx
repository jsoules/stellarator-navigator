import { FunctionComponent, useContext } from "react"
import Splitter from "../components/Splitter"
import useFilterCallbacks from "../components/selectionControl/SelectionControlCallbacks"
import SelectionControlPanel from "../components/selectionControl/SelectionControlPanel"
import { NavigatorContext } from "../state/NavigatorContext"
import useWindowDimensions from "../util/useWindowDimensions"
import FilterEcho from "./FilterEcho"


const MainWindow: FunctionComponent = () => {
    const {width, height} = useWindowDimensions()
    const { filterSettings, dispatch } = useContext(NavigatorContext)
    const callbacks = useFilterCallbacks(dispatch)

    // TODO: Update selected elements on state change

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
                    <div>GRAPHS AND STUFF HERE</div> <br />
                    <FilterEcho s={filterSettings} />
                </div>
            </Splitter>
        </div>
    )
}

export default MainWindow