import Drawer from '@mui/material/Drawer'
import { FunctionComponent, PropsWithChildren } from 'react'


// Note: this is retained largely as a model for an instruction/about overlay.
// (That would probably fly in from the top, too.)

type DrawerProps = {
    open: boolean
    pinned: boolean
    changeOpenState: (newState: boolean) => void
    changePinState: (newState: boolean) => void 
}


// Query: do we need to trap these keypresses?
const toggleControlDrawer = (handler: (newState: boolean) => void, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
             (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }
        console.log(`toggleControlDrawer called, setting state to ${open}`)
        handler(open)
    }


const SelectionControlDrawer: FunctionComponent<PropsWithChildren<DrawerProps>> = (props: PropsWithChildren<DrawerProps>) => {
    const { children, open, pinned, changeOpenState } = props
    // styling
    // e.g. consider width = 500, consider a fancy-looking border, etc.

    const drawer = pinned
        ? ( <Drawer
                variant="permanent"
                // sx={{
                //   display: { xs: 'none', sm: 'block' },
                //   '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                // }}
                open
            >
                {children}
            </Drawer>)
        : ( <Drawer
                // container={container}
                variant="temporary"
                open={open}
                onClose={toggleControlDrawer(changeOpenState, false)}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                // sx={{
                // display: { xs: 'block', sm: 'none' },
                // '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                // }}
            >
                {children}
            </Drawer>)

    return drawer
}

export default SelectionControlDrawer
