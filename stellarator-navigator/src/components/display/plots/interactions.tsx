import { Dispatch, SetStateAction, useCallback } from "react"

export const useOnClickPlot = (setActiveNfp: Dispatch<SetStateAction<number>>, setActiveNc: Dispatch<SetStateAction<number | undefined>>) => {
    return useCallback((nfp: number, nc?: number) => {
        setActiveNfp(nfp)
        setActiveNc(nc)
    }, [setActiveNc, setActiveNfp])
}

export const onHoverDot = (id: number) => {
    console.log(`Hovered ${id}`)
}

export const onHoverOff = (id: number) => {
    console.log(`Stopped hovering ${id}`)
}

export const onClickDot = (id: number) => {
    window.open(`model/${id}`, "_blank", "noreferrer")
}
