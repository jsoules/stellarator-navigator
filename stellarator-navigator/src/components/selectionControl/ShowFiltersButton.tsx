import { Button, Tooltip } from '@mui/material'
import { FunctionComponent } from 'react'

type ShowFiltersProps = {
    openState: boolean
    changeOpenState: (newState: boolean) => void
}

const ShowFiltersButton: FunctionComponent<ShowFiltersProps> = (props: ShowFiltersProps) => {
    return props.openState ? <></> : (
        <div className="showFiltersButton">
            <Tooltip
                title="Show filter controls"
                placement="bottom"
            >
                <Button
                    variant="contained"
                    size="small"
                    onClick={ () => (props.changeOpenState(true)) }
                >
                    Show Filter Controls
                </Button>
            </Tooltip>
        </div>
    )
}

export default ShowFiltersButton
