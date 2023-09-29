import useFilterCallbacks from "@snControlComponents/SelectionControlCallbacks"
import SelectionControlPanel from "@snControlComponents/SelectionControlPanel"
import { NavigatorContext } from "@snState/NavigatorContext"
import useWindowDimensions from "@snUtil/useWindowDimensions"
import { FunctionComponent, useContext, useMemo } from "react"
import useRoute from "routing/useRoute"
import Splitter from "../components/Splitter"
import Model from "./Model"
import PlotGrid from "./PlotGrid"


const splitterInitialPosition = 500
const splitterWidthRolloff = 30

const MainWindow: FunctionComponent = () => {
    const {width, height} = useWindowDimensions()
    const { filterSettings, dispatch } = useContext(NavigatorContext)
    const callbacks = useFilterCallbacks(dispatch)
    const selectionUpdate = callbacks.handleUpdateMarks
    const { route } = useRoute()

    // Note: was height - 40, may need to reinstate to allow room for a banner
    const effectiveHeight = useMemo(() => height, [height])
    const effectiveWidth = useMemo(() => width - 40, [width])

    if (route.page === 'model') {
        return <Model id={route.recordId} />
    }

    let content = <span />
    if (route.page === 'home') {
        content = <PlotGrid filters={filterSettings} width={width - splitterInitialPosition - splitterWidthRolloff} height={effectiveHeight} selectionHandler={selectionUpdate} />
    }

    return (
        
        <div className="MainWindow" style={{width: effectiveWidth, height: effectiveHeight}}>
            <Splitter
                width={width - splitterWidthRolloff}
                height={effectiveHeight}
                initialPosition={splitterInitialPosition}
            >
                <div>
                    <SelectionControlPanel filterSettings={filterSettings} callbacks={callbacks} />
                </div>
                {content}
            </Splitter>
        </div>
    )
}

export default MainWindow