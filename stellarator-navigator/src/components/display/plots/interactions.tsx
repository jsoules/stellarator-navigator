import { getStringId } from "@snUtil/makeResourcePath"
import { Dispatch, SetStateAction, useCallback } from "react"

const BASENAME = import.meta.env.BASE_URL

export const useOnClickPlot = (setActiveNfp: Dispatch<SetStateAction<number>>, setActiveNc: Dispatch<SetStateAction<number | undefined>>) => {
    return useCallback((nfp: number, nc?: number) => {
        setActiveNfp(nfp)
        setActiveNc(nc)
    }, [setActiveNc, setActiveNfp])
}

export const onHoverDot = (id: number) => {
    console.log(`Hovered ${getStringId(id)}`)
}

export const onHoverOff = (id: number) => {
    console.log(`Stopped hovering ${getStringId(id)}`)
}

export const onClickDot = (id: number) => {
    // TODO FIXME once routing is set up right
    if (BASENAME === '/') {
        window.open(`model/${getStringId(id)}`, "_blank", "noreferrer")
    } else {
        window.open(`${BASENAME}/model/${getStringId(id)}`, "_blank", "noreferrer")
    }
}

export const onOpenSelected = (ids?: Set<number>) => {
    const slowOpen = async (id: number) => {
        console.log(`Opening ${getStringId(id)}`)
        window.open(`${BASENAME}/model/${getStringId(id)}`, "mozillaTab", "noreferrer")
        window.focus()
    }
    if (ids !== undefined) {
        ids.forEach(async id => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            await new Promise(_ => setTimeout(() => slowOpen(id), 250))
        })
    }
}
