import InfoIcon from '@mui/icons-material/Info'
import { IconButton } from "@mui/material"
import { FunctionComponent } from "react"


type InfoButtonProps = {
    open: boolean
    changeOpenState: (newState: boolean) => void
}

const InfoButton: FunctionComponent<InfoButtonProps> = (props: InfoButtonProps) => (
    <div className="instructionButton">
        <span className="infoIcon">
            <IconButton onClick={(() => props.changeOpenState(true))}>
                <InfoIcon fontSize='large' />
            </IconButton>
        </span>
    </div>
)

export default InfoButton
