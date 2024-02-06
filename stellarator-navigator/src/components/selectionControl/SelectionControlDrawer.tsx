import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { IconButton } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import { FunctionComponent, PropsWithChildren } from 'react'


type DrawerProps = {
    open: boolean
    width: number
    changeOpenState: (newState: boolean) => void
}


const DrawerCloser: FunctionComponent<DrawerProps> = (props: DrawerProps) => (

    <div className="drawerCloser">
        <span className="rightIcon">
            <IconButton onClick={() => props.changeOpenState(false)}>
                <ChevronLeftIcon />
            </IconButton>
        </span>
    </div>
)


const SelectionControlDrawer: FunctionComponent<PropsWithChildren<DrawerProps>> = (props: PropsWithChildren<DrawerProps>) => {
    const { children, open, width } = props
    // more styling--e.g. consider a fancy-looking border?

    const drawer = (
        <Drawer
            variant="persistent"
            anchor="left"
            transitionDuration={0}  // since it looks weird that I can't get the content div to transition smoothly in
            // when we hide. If that can be fixed, this can go back to the default value (I think 300ms)
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
            }}
            open={open}
        >
            <DrawerCloser {...props} />
            {children}
        </Drawer>
    )

    return drawer
}

export default SelectionControlDrawer
