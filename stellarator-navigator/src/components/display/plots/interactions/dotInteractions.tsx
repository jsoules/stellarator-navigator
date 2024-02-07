import { getStringId } from "@snUtil/makeResourcePath"

// eslint-disable-next-line react-refresh/only-export-components
const BASENAME = import.meta.env.BASE_URL

export const onHoverDot = (id: number) => {
    console.log(`Hovered ${getStringId(id).id}`)
}


export const onHoverOff = (id: number) => {
    console.log(`Stopped hovering ${getStringId(id).id}`)
}


export const onClickDot = (id: number) => {
    // TODO FIXME once routing is set up right
    if (BASENAME === '/') {
        window.open(`model/${getStringId(id).id}`, "_blank", "noreferrer")
    } else {
        window.open(`${BASENAME}/model/${getStringId(id).id}`, "_blank", "noreferrer")
    }
}


// TODO: RETEST THIS
export const onOpenSelected = (ids?: Set<number>) => {
    const slowOpen = (id: number) => {
        console.log(`Opening ${getStringId(id).id}`)
        onClickDot(id)
        window.focus()
    }
    if (ids !== undefined) {
        ids.forEach(id => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // await new Promise(_ => setTimeout(() => slowOpen(id), 250))
            setTimeout(() => slowOpen(id), 250)
        })
    }
}
