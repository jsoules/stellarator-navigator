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
    window.open(`/model/${id}`, "_blank", "noreferrer")
}

export const onOpenSelected = (ids?: Set<number>) => {
    const slowOpen = async (id: number) => {
        console.log(`Opening ${id}`)
        window.open(`/model/${id}`, "mozillaTab", "noreferrer")
        window.focus()
    }
    if (ids !== undefined) {
        ids.forEach(async id => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            await new Promise(_ => setTimeout(() => slowOpen(id), 250))
        })
    }
}
