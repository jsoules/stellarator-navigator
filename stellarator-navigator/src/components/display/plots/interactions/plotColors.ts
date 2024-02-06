import { SelectChangeEvent } from "@mui/material"
import { DefaultColorMap, DefaultColorPalette, SupportedColorMap, SupportedColorPalette } from "@snComponents/display/Colormaps"
import { DependentVariables, ToggleableVariables, fieldIsCategorical } from "@snTypes/DataDictionary"
import { defaultPlotColorSplit } from "@snTypes/Defaults"
import { Dispatch, useCallback } from "react"


export type PlotColorProps = {
    colorSplit: DependentVariables | ToggleableVariables,
    style: SupportedColorMap | SupportedColorPalette
}


export type ColorPropsAction = {
    type: 'updateVariable',
    variable: DependentVariables | ToggleableVariables
} | {
    type: 'updateScheme',
    scheme: SupportedColorPalette | SupportedColorMap
}

export const defaultPlotColorProps = {
    colorSplit: defaultPlotColorSplit,
    style: DefaultColorPalette
} as PlotColorProps

export const isDiscreteColorStyle = (s: SupportedColorMap | SupportedColorPalette) =>
    Object.values(SupportedColorPalette).includes(s as SupportedColorPalette)

export const plotColorReducer = (s: PlotColorProps, a: ColorPropsAction): PlotColorProps => {
    // TODO: Should we special-case the coil length fields? They're technically categorical but that's
    // not useful for coloration...
    const splitVariableIsDiscrete = fieldIsCategorical(s.colorSplit)
    switch (a.type) {
        case 'updateVariable': {
            if (a.variable === s.colorSplit) return s // no-op, shouldn't happen
            const newSplitIsDiscrete = fieldIsCategorical(a.variable)
            if (splitVariableIsDiscrete !== newSplitIsDiscrete) {
                return {
                    colorSplit: a.variable,
                    style: newSplitIsDiscrete ? DefaultColorPalette : DefaultColorMap
                } as PlotColorProps
            }
            return { ...s, colorSplit: a.variable } as PlotColorProps
        }
        case 'updateScheme': {
            const newColorSchemeIsDiscrete = Object.values(SupportedColorPalette).includes(a.scheme as SupportedColorPalette)
            // should be impossible: make it a no-op
            if (splitVariableIsDiscrete !== newColorSchemeIsDiscrete) return s
            if (a.scheme === s.style) return s  // don't trigger refresh for a no-op
            return { ...s, style: a.scheme } as PlotColorProps
        }
        default:
            throw Error('Unknown verb for reducer.')
    }
}


export const usePlotColorCallbacks = (dispatch: Dispatch<ColorPropsAction>) => {
    const colorVariableCallback = useCallback((event: SelectChangeEvent) => {
        dispatch({
            type: 'updateVariable',
            variable: event.target.value as unknown as DependentVariables | ToggleableVariables
        })
    }, [dispatch])

    const colorSchemeCallback = useCallback((event: SelectChangeEvent) => {
        dispatch({
            type: 'updateScheme',
            scheme: event.target.value as SupportedColorPalette | SupportedColorMap
        })
    }, [dispatch])

    return { colorVariableCallback, colorSchemeCallback }
}
