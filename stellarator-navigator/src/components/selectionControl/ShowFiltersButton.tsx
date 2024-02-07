import { Button, Tooltip } from '@mui/material'
import { FunctionComponent, PropsWithChildren } from 'react'

type ShowFiltersBase = {
    openState: boolean
    changeOpenState: (newState: boolean) => void
}

type ShowFiltersProps = PropsWithChildren<ShowFiltersBase>

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
            {/* {props.children} */}
        </div>
    )
}

export default ShowFiltersButton
