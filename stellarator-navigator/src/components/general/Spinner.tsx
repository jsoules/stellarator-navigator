// Pure-CSS loader/spinner adapted from https://loading.io/css/,
// where it was released under CC0/no rights reserved free-use.

import { FunctionComponent } from "react"

export type SpinnerProps = {
    
    Type?: 'ringChase' | 'bar'
}

const Spinner: FunctionComponent<SpinnerProps> = (props: SpinnerProps) => {
    const { Type } = props

    return (
        <div className={Type ?? 'ringChaseSpinner'}>
            <div /> <div /> <div />
            <div /> <div /> <div />
            <div /> <div /> <div />
            <div /> <div /> <div />
        </div>
    )
}

export default Spinner
