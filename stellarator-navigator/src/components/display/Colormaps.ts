import { CSSProperties } from "react"
import { inferno, magma, plasma, viridis } from 'scale-color-perceptual'

export type SupportedColorMap = 'inferno' | 'magma' | 'plasma' | 'viridis' | 'hsv' | 'default'

export const Tab20: CSSProperties["color"][] = [
    "#1f77b4",
    "#aec7e8",
    "#ff7f0e",
    "#ffbb78",
    "#2ca02c",
    "#98df8a",
    "#d62728",
    "#ff9896",
    "#9467bd",
    "#c5b0d5",
    "#8c564b",
    "#c49c94",
    "#e377c2",
    "#f7b6d2",
    "#7f7f7f",
    "#c7c7c7",
    "#bcbd22",
    "#dbdb8d",
    "#17becf",
    "#9edae5"
]

export const SpacedViridis: CSSProperties["color"][] = [
    "#440154",
    "#472d7b",
    "#3b528b",
    "#2c728e",
    "#21918c",
    "#28ae80",
    "#5ec962",
    "#addc30"
]

// from https://davidmathlogic.com/colorblind/#%23000000-%23E69F00-%2356B4E9-%23009E73-%23F0E442-%230072B2-%23D55E00-%23CC79A7
// export const WongCBFriendly: CSSProperties["color"][] = [
export const WongCBFriendly: string[] = [
    "#000000",
    "#E69F00",
    "#56B4E9",
    "#009E73",
    "#F0E442",
    "#0072B2",
    "#D55E00",
    "#CC79A7"
]

// also consider https://thenode.biologists.com/data-visualization-with-flying-colors/research/

// Continuous scales for display: cross-import from scale-color-perceptual

// TODO: Consider adding intensity-bounding?
export const valueToRgbTriplet = (value: number, scheme: SupportedColorMap = 'viridis') => {
    if (value > 1) {
        console.warn(`Continuous color mapper received value ${value}, but should be normalized to (0, 1).`)
        return ([0, 0, 0])
    }
    const rgbHex = getRgbValue(value, scheme)
    return convertHexToRgb(rgbHex)
}


const getRgbValue = (value: number, scheme: SupportedColorMap = 'viridis'): string => {
    // TODO: Support the rainbow color map currently being used
    switch(scheme) {
        case 'inferno':
            return inferno(value)
            break
        case 'magma':
            return magma(value)
            break
        case 'plasma':
            return plasma(value)
            break
        case 'viridis':
            return viridis(value)
            break
        case 'hsv':
            return hsv(value)
            break
        default:
            return `#${toPaddedRgb(value)}8080`
    }
}


const toPaddedRgb = (v: number): string => {
    const of255 = Math.ceil(255 * v)
    const padded = `000${of255.toString(16)}`
    return padded.slice(-2)
}


const convertHexToRgb = (hex: string): number[] => {
    // assume 6-digit hex with leading sharp, e.g. '#00ff00'
    const rStr = hex.substring(1, 3)
    const gStr = hex.substring(3, 5)
    const bStr = hex.substring(5, 7)
    return [parseInt(rStr, 16)/255,
        parseInt(gStr, 16)/255,
        parseInt(bStr, 16)/255
    ]
}


///

const hsv = (value: number): string => {
    // hsv colormap: per https://octave.sourceforge.io/octave/function/hsv.html
    // The basic principle of this color map is that over the course of the full
    // 256-element range, we make linear intensity changes to each of the three
    // RGB components in turn.
    // Since it's cyclical, we thus have 6 slopes netting to 0 over the range 0-1,
    // so each line's slope is +/- 6.
    // Rather than using a lot of if-thens, we can use min/max.
    // So red starts at 2, drops over the first half of the 256 range, then rises.
    // Green starts at 0, rises for 1/3, drops for 2/3
    // blue starts at -2, rises for 2/3, drops for 1/3.

    const slope = 6
    const clamp = (x: number) => Math.max(0, Math.min(1, x))
    const r = clamp(2 - slope * (Math.min(value, 0.5)) + slope * (Math.max(0, value - 0.5)))
    const g = clamp(0 + slope * (Math.min(value, 1/3)) - slope * (Math.max(0, value - 1/3)))
    const b = clamp(-2 + slope * (Math.min(value, 2/3)) - slope * (Math.max(0, value - 2/3)))
    return `#${toPaddedRgb(r)}${toPaddedRgb(g)}${toPaddedRgb(b)}`
}
