// TODO: This probably belongs in a different directory
// Maybe with the underlying dataset or something

import { DependentVariableOpt } from "../../types/Types"

export const coilLengthPerHpValidValues = [
    4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 
    6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0, 8.25,
    8.5, 8.75, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0,
    12.5, 13.0, 13.5, 14.0, 14.25, 14.5, 15.0, 15.5, 15.75,
    16.0, 16.5, 17.0, 17.25, 17.5, 18.0, 18.75, 19.0, 19.5,
    20.0, 20.25, 21.0, 21.75, 22.0, 22.5, 23.0, 23.25, 23.75,
    24.0, 24.75, 25.0, 25.5, 26.0, 26.25, 27.0, 27.5, 28.0,
    28.5, 28.75, 29.0, 30.0, 31.0, 31.25, 31.5, 32.0, 32.5,
    33.0, 33.25, 33.75, 34.0, 34.5, 35.0, 36.0, 36.25, 36.75,
    37.5, 38.0, 38.5, 38.75, 39.0, 40.0, 40.25, 40.5, 41.25,
    42.0, 42.5, 42.75, 43.5, 43.75, 44.0, 45.0, 45.5, 46.0,
    46.5, 47.25, 47.5, 48.0, 49.0, 49.5, 50.0, 50.75, 51.0,
    51.75, 52.0, 52.25, 52.5, 54.0, 54.25, 55.0, 56.0, 56.25,
    57.0, 57.5, 57.75, 58.0, 58.5, 60.0
]

export const totalCoilLengthValidValues = [
    28.5, 30.0, 31.0, 31.5, 32.0, 33.0, 34.0, 34.5, 35.0, 
    36.0, 37.5, 38.0, 39.0, 40.0, 40.5, 42.0, 43.5, 44.0,
    45.0, 46.0, 46.5, 47.5, 48.0, 49.5, 50.0, 51.0, 52.0,
    52.5, 54.0, 55.0, 56.0, 57.0, 57.5, 58.0, 60.0, 62.0,
    62.5, 63.0, 64.0, 65.0, 66.0, 66.5, 67.5, 68.0, 69.0,
    70.0, 72.0, 72.5, 73.5, 75.0, 76.0, 77.0, 77.5, 78.0, 
    80.0, 80.5, 81.0, 82.5, 84.0, 85.0, 85.5, 87.0, 87.5,
    88.0, 90.0, 91.0, 92.0, 93.0, 94.5, 95.0, 96.0, 98.0, 
    99.0, 100.0, 101.5, 102.0, 103.5, 104.0, 104.5, 105.0,
    108.0, 108.5, 110.0, 112.0, 112.5, 114.0, 115.0, 115.5, 
    116.0, 117.0, 120.0
]

export const meanIotaSentinelValue = -100

export const meanIotaValidValues = [
    -0.6, -0.5, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9
]

export const ncPerHpValidValues = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
]

export const nfpValidValues = [
    1, 2, 3, 4, 5
]

export const defaultDependentVariableValue = 4
export const parseDependentVariableValues = (value: DependentVariableOpt) => {
    const obj = dependentVariableValidValues.find(v => v.value === value)
    if (obj === undefined) return -1
    return obj.key
}
export const dependentVariableValidValues = [
    {key: 1, value: 'maxKappa', text: 'Max Kappa'},
    {key: 2, value:   'maxMsc', text: 'Max MSC'},
    {key: 3, value:  'minDist', text: 'Min Dist'},
    {key: 4, value:  'qaError', text: 'QA Error'}
]
