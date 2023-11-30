import { inferno, magma, plasma, viridis } from 'scale-color-perceptual'

export type SupportedColorMap = 'inferno' | 'magma' | 'plasma' | 'viridis' | 'hsv' | 'blueOrange' | 'default'

export const DefaultColorMap: SupportedColorMap = 'plasma'
export const MapsConfig: {key: number, value: SupportedColorMap}[] = [
    { key: 1, value: 'plasma'  },
    { key: 2, value: 'inferno' },
    { key: 3, value: 'magma'   },
    { key: 4, value: 'viridis' },
    { key: 5, value: 'hsv'     }
]

export const Tab20: string[] = [
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

export const SpacedViridis: string[] = [
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

// and another one pulling from https://personal.sron.nl/~pault/ entry of 2021.04.02 -- get feedback
// Note: it's *really challenging* to get 13 distinct colors with sufficient contrast; we probably
// can't fully meet web accessibility guidelines under these constraints. Hopefully it isn't as
// important since the data can be explored in other ways.
export const Tol: string[] = [
    "#332288", // indigo
    "#88CCEE", // cyan
    "#44AA99", // teal
    "#117733", // forest green
    "#999933", // olive
    "#DDCC77", // sand
    "#CC6677", // rose
    "#882255", // wine
    "#AA4499", // purple
    "#0077BB", // midrange blue (added)
    "#ddaa33", // a dark yellow (added)
    "#000000", // black (added)
    "#999999"  // mid-tone grey (added)
]

// also consider https://thenode.biologists.com/data-visualization-with-flying-colors/research/

// Continuous scales for display: cross-import from scale-color-perceptual

export type SupportedColorPalette = "Tab20" | "SpacedViridis" | "WongCBFriendly" | "Tol"
export const DefaultColorPalette: SupportedColorPalette = "Tol"
const Palettes: {[key in SupportedColorPalette]: string[]} = {
    "Tab20": Tab20,
    "SpacedViridis": SpacedViridis,
    "WongCBFriendly": WongCBFriendly,
    "Tol": Tol
}


type makeColorsParamsType = {
    values: number[][][]
    isContinuous: true
    scheme: SupportedColorMap
} | {
    values: number[][][]
    isContinuous: false
    scheme: SupportedColorPalette
}
type makeColorsType = ((props: makeColorsParamsType) => number[][][][])
export const makeColors: makeColorsType = (props) => {
    const { values, isContinuous, scheme } = props
    if (isContinuous) {
        // Normalize values
        // TODO: Consider doing something more sophisticated for outliers?
        const flatVals = values.flat(2)
        const max = Math.max(...flatVals)
        const min = Math.min(...flatVals)
        const span = max - min
        // TODO: This will not do the right thing for blue-orange, which should be normalized over (-1, 1)
        // need to special-case that if you want to support it
        // Handle the degenerate case: when max = min, map everything to 1
        const normalize = span === 0 ? () => 1 : (v: number) => ((v - min)/span)
        const normalValues = values.map(i => i.map(j => j.map(k => valueToRgbTriplet(normalize(k), scheme))))
        return normalValues
    }
    return values.map(i => i.map(j => j.map(k => discreteColorToRgbTriplet(k, scheme))))
}


// TODO: Consider adding intensity-bounding?
export const valueToRgbTriplet = (value: number, scheme: SupportedColorMap = 'viridis') => {
    if (value > 1) {
        console.warn(`Continuous color mapper received value ${value}, but should be normalized to (0, 1).`)
        return ([0, 0, 0])
    }
    const rgbHex = getRgbValue(value, scheme)
    return convertHexToRgb3Vec(rgbHex)
}


export const discreteColorToRgbTriplet = (index: number, scheme: SupportedColorPalette = DefaultColorPalette) => {
    const _scheme = Palettes[scheme]
    return convertHexToRgb3Vec(_scheme[index % _scheme.length])
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
        case 'blueOrange':
            return blueOrange(value)
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


export const convertHexToRgb3Vec = (hex: string): number[] => {
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


const blueOrange = (value: number): string => {
    // here 'value' is in the range (-1, 1) and we want to map negative values
    // to blue and positive values to the contrasting orange.
    // Specifically, full blue = -1 = azure = #007FFF,
    // full orange = 1 = #FF7F00.
    // So our midpoint will be #7F7F7F-gray.
    const offset = 0.5 * Math.abs(value)
    const low = toPaddedRgb(Math.max(0, 0.5 - offset))
    const high = toPaddedRgb(Math.min(1, 0.5 + offset))
    return value === 0
        ? '#7f7f7f'
        : value < 0
            ? `#${low}7f${high}`
            : `#${high}7f${low}`
}

