
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { DefaultColorMap, MapsConfig, SupportedColorMap } from "@snDisplayComponents/Colormaps"
import { Fragment, FunctionComponent } from "react"


type Props = {
    value: SupportedColorMap | undefined,
    onChange: (evt: SelectChangeEvent<SupportedColorMap>) => void
}

const SurfaceColorMapSelector: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props
    const items = MapsConfig.map(item =>
        <MenuItem key={item.key} value={item.value}>{item.value}</MenuItem>
    )
    
    return (
        <Fragment>
            <Typography id="dependent-variable-selector" gutterBottom fontWeight="bold">
                Surface color scheme
            </Typography>
            <FormControl fullWidth size="small">
                <Select<SupportedColorMap>
                    value={props.value ?? DefaultColorMap}
                    onChange={onChange}
                >
                    {...items}
                </Select>
            </FormControl>
        </Fragment>
    )
}

export default SurfaceColorMapSelector
