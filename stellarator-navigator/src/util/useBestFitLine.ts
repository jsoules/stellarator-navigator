import { useMemo } from "react"


const useBestFitLine = (data: number[][]) => {
    return useMemo(() => {
        const sum = (data.reduce((previous, current) => [previous[0] + current[0], previous[1] + current[1]], [0, 0]))
        const xMean = sum[0]/data.length
        const yMean = sum[1]/data.length
        const slopeParts = data.reduce((p, c) =>
        [
            p[0] + ((c[0] - xMean) * (c[1] - yMean)),
            p[1] + (c[0] - xMean) ** 2
        ], [0, 0])
        const slope = slopeParts[0]/slopeParts[1]
        const intercept = yMean - slope * xMean
        return {slope, intercept}
    }, [data])
}

export default useBestFitLine
