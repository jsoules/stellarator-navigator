import { DependentVariables, Fields, IndependentVariables, getLabel } from "@snTypes/DataDictionary"
import { BoundedPlotDimensions, DataGeometry } from "@snTypes/Types"
import { useCallback } from "react"
import CanvasXAxis from "../plotFittings/CanvasXAxis"
import CanvasYAxis from "../plotFittings/CanvasYAxis"


type canvasAxisProps = {
    dataGeometry: DataGeometry
    dependentVar: DependentVariables
    independentVar: IndependentVariables
    dimsIn: BoundedPlotDimensions
}


export const useCanvasAxes = (props: canvasAxisProps) => {
    const { dataGeometry, dependentVar, independentVar, dimsIn } = props

    const xAxis = useCallback((c: CanvasRenderingContext2D) => {
        const axisLabel = getLabel({name: independentVar, labelType: 'plot'})
        CanvasXAxis({
            dataRange: [dataGeometry.xmin, dataGeometry.xmax],
            canvasRange: [0, dimsIn.boundedWidth],
            axisLabel,
            isLog: false,
            isY: false,
            markedValue: undefined,
            dims: dimsIn
        }, c)
    }, [dataGeometry.xmax, dataGeometry.xmin, dimsIn, independentVar])

    const yAxis = useCallback((c: CanvasRenderingContext2D) => {
        const axisLabel = getLabel({name: dependentVar, labelType: 'plot'})
        CanvasYAxis({
            dataRange: [dataGeometry.ymin, dataGeometry.ymax],
            canvasRange: [0, dimsIn.boundedHeight],
            axisLabel,
            isLog: Fields[dependentVar].isLog,
            markedValue: Fields[dependentVar].markedValue,
            dims: dimsIn,
            isY: true
        }, c)
    }, [dataGeometry.ymax, dataGeometry.ymin, dependentVar, dimsIn])

    return [xAxis, yAxis]
}
