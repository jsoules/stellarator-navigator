import { FunctionComponent } from "react"
import { FilterSettings } from "../types/Types"

type Props = {
    s: FilterSettings
}

const PlotDisplay: FunctionComponent<Props> = (props: Props) => {
    const { s } = props
    return (
        <div>
            TK -- Grid of plots. Selected field-period-counts on the horizontal axis,
            selected coil counts per half-period on the vertical axis.

            (Right now that would be {s.ncPerHp} x {s.nfp} or something)

            Each plot showing dots (color coded per sim) with the total coil length
            (or cl per half-period) on the independent axis and the selected
            dependent variable on the y-axis. Dots color-coded according to sim,
            clicking each dot should bring up 3D vis in a separate window.

            Will need to work out how to display the 3D--we probably need to convert
            everything to something more three.js-friendly.

            Query: Pull Paul in on that part?

            Query: Do we need an independent-variable dropdown or control or something?
        </div>
    )
}

export default PlotDisplay