import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { IconButton } from "@mui/material"
import { FunctionComponent, PropsWithChildren } from "react"

type Props = {
    isClosed: boolean
    toggleFn: (newState: boolean) => void
}

const PlotVariableControlsDropdown: FunctionComponent<PropsWithChildren<Props>> = (props: PropsWithChildren<Props>) => {
    const { isClosed, children, toggleFn } = props

    return (
        <div>
            <div className="collapseWrapper">
                <span className="collapseLabel">
                    { isClosed ? "Show" : "Hide" } plot variable controls
                </span>
                <span className="collapseButton">
                    <IconButton onClick={() => toggleFn(!isClosed)}>
                        { isClosed ? <ExpandMore /> : <ExpandLess /> }    
                    </IconButton>
                </span>
            </div>
            <div style={{width: '100%', display: isClosed ? 'none' : 'inline-block'}}>
                {children}
            </div>
        </div>
    )
}

export default PlotVariableControlsDropdown
