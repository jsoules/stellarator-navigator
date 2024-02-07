import { Palettes, SupportedColorPalette } from "@snComponents/display/Colormaps"
import { makeValsFromFieldname } from "@snState/projection"
import { ToggleableVariables, getLabel } from "@snTypes/DataDictionary"
import { FilterSettings } from "@snTypes/Types"
import { FunctionComponent } from "react"


const ColorBox = (props: {color: string}) => (
    <div className="colorBox" style={{backgroundColor: props.color}}>
    </div>
)


const ColorCaption = (props: {text: string}) => (
    <div className="legendText">{props.text}</div>
)


const getColorsForValues = (props: PlotLegendProps) => {
    const scheme = Palettes[props.style]
    const options = (props.filters[props.var] ?? [])
    const selected = options
        .map((v, i) => v ? i : undefined)
        .filter(x => x !== undefined) as number[]
    return selected.length === 0
        ? options.map((_, i) => scheme[i % scheme.length])
        : selected.map(i => scheme[i % scheme.length])
}


type PlotLegendProps = {
    var: ToggleableVariables
    style: SupportedColorPalette
    filters: FilterSettings
}    


const PlotLegend: FunctionComponent<PlotLegendProps> = (props: PlotLegendProps) => {
    const colorVals = makeValsFromFieldname(props.var, props.filters, true)
    const fieldDesc = getLabel({name: props.var, labelType: 'short'})
    const colors = getColorsForValues(props)

    return (
        <div className="legend">
            <div className="legendHeader">Legend</div>
            {colorVals.map((cv, i) => (
                <div className="legendEntry" key={`legend-${cv}`}>
                    <ColorBox color={colors[i]} />
                    <ColorCaption text={`${fieldDesc} = ${cv}`} />
                </div>))}
        </div>)
}

export default PlotLegend
