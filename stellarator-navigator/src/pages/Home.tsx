import { Button, Tooltip } from '@mui/material'
import { NavigatorContext } from "@snState/NavigatorContext"
import { initialDatabase } from "@snTypes/Defaults"
import imgUrl from 'assets/sample-197168.png'
import { FunctionComponent, useContext, useMemo } from "react"
import useRoute from 'routing/useRoute'
import Model from './Model'
import Overview from './Overview'

const BASENAME = import.meta.env.BASE_URL

const Home: FunctionComponent = () => {
    // TODO: Margin, more styling, etc.
    const { database } = useContext(NavigatorContext)
    const { route } = useRoute()
    const ready = database !== initialDatabase
    const buttonString = ready ? "Launch Navigator" : "Loading Navigator..."
    const button = useMemo(() => (
        <span>
            <Button
                variant="contained"
                style={{margin: 20}}
                aria-label={buttonString}
                disabled={!ready}
                onClick={() => document.getElementById("launch")?.click()}
            >
                {buttonString}
            </Button>
        </span>
    ), [buttonString, ready])

    if (route.page === 'model') {
        return <Model id={route.recordId} />
    }

    if (route.page === 'overview') {
        return <Overview />
    }

    return (
        <div className="homeBase MainWindow ForceLightMode">
            <h1>QUASR:
                A QUAsi-symmetric Stellarator Repository
            </h1>

            <div className="flexWrapper">
                <div className="homeImage">
                    <img src={imgUrl} />
                </div>
                <div className="homeCopy">
                    <div>
                        The QUASR repository contains a database of over 90,000 curl-free stellarators
                        and the coil sets that generate them, optimized for volume quasi-symmetry.
                   </div>
                   <div>
                        Click the "Launch Navigator" button to navigate the QUASR database. Once you have
                        identified devices of interest, click the scatterplot representation or table
                        entry to launch a separate window with detailed record information,
                        including an interactive 3-D model and Poincaré plots.
                   </div>
                    <div className="homeButton">
                        <Tooltip title={buttonString}>
                            {button}
                        </Tooltip>
                        <a id="launch" href={BASENAME === '/' ? "/overview" : `${BASENAME}/overview`} style={{display: "none"}}/>
                    </div>
                </div>
            </div>
            <div className="authorship">
                <div>
                    QUASR database by Andrew Giuliani (Flatiron Institute), based on algorithms
                    developed with Florian Wechsung (NYU), Georg Stadler (NYU), Antoine Cerfon (NYU),
                    and Matt Landreman (U Maryland), described in
                    (
                    <a
                        href="https://doi.org/10.1016/j.jcp.2022.111147"
                        title="A. Giuliani, F. Wechsung, A. Cerfon, G. Stadler, M. Landreman, Single-stage gradient-based stellarator coil design: Optimization for near-axis quasi-symmetry. Journal of Computational Physics, 459 (2022), 111147."
                    >1</a>), (
                    <a
                        href="https://doi.org/10.1017/S0022377822000563"
                        title="Giuliani, A., Wechsung, F., Stadler, G., Cerfon, A., & Landreman, M. (2022). Direct computation of magnetic surfaces in Boozer coordinates and coil optimization for quasisymmetry. Journal of Plasma Physics, 88 (4), 905880401."
                    >2</a>), (
                    <a
                        href="https://doi.org/10.1063/5.0129716"
                        title="Andrew Giuliani, Florian Wechsung, Antoine Cerfon, Matt Landreman, Georg Stadler; Direct stellarator coil optimization for nested magnetic surfaces with precise quasi-symmetry. Phys. Plasmas 1 April 2023; 30 (4): 042511."
                    >3</a>)
                </div>
                <div>
                    Stellarator Navigator by Jeff Soules (Flatiron Institute)
                </div>
            </div>
        </div>
    )
}

export default Home
