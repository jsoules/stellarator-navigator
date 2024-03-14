import { Button, Tooltip } from '@mui/material'
// import imgUrl from 'assets/sample-197168.png'
import imgVideo from 'assets/sample-0197168.mp4'
import { Dispatch, FunctionComponent, SetStateAction, useMemo } from "react"

// const BASENAME = import.meta.env.BASE_URL

type Props = {
    ready: boolean
    setShowOverview: Dispatch<SetStateAction<boolean>>
}

const articles: {link: string, title: string}[] = [
    {
        link: "https://doi.org/10.1016/j.jcp.2022.111147",
        title: "A. Giuliani, F. Wechsung, A. Cerfon, G. Stadler, " +
                "M. Landreman, Single-stage gradient-based stellarator coil " +
                "design: Optimization for near-axis quasi-symmetry. Journal of " +
                "Computational Physics, 459 (2022), 111147.",},
    {
        link: "https://doi.org/10.1017/S0022377822000563",
        title: "Giuliani, A., Wechsung, F., Stadler, G., Cerfon, A., & Landreman, " +
               "M. (2022). Direct computation of magnetic surfaces in Boozer coordinates " +
               "and coil optimization for quasisymmetry. Journal of Plasma Physics, 88 (4), 905880401."
    },
    {
        link: "https://doi.org/10.1063/5.0129716",
        title: "Andrew Giuliani, Florian Wechsung, " +
               "Antoine Cerfon, Matt Landreman, Georg Stadler; " +
               "Direct stellarator coil optimization for nested magnetic " +
               "surfaces with precise quasi-symmetry. Phys. Plasmas 1 April 2023; 30 (4): 042511."
    },
]

const LaunchButton = (props: Props) => {
    const buttonString = props.ready ? "Launch Navigator" : "Loading Navigator..."
    return (
        <div className="homeButton">
            <Tooltip title={buttonString}>
                <span>
                    <Button
                        variant="contained"
                        style={{margin: 20}}
                        aria-label={buttonString}
                        disabled={!props.ready}
                        onClick={() => document.getElementById("launch")?.click()}
                    >
                        {buttonString}
                    </Button>
                </span>
            </Tooltip>
            <a id="launch"
                // href={BASENAME === '/' ? "/overview" : `${BASENAME}/overview`}
                onClick={() => props.setShowOverview(true)}
                style={{display: "none"}}
            />
        </div>
    )
}


const Home: FunctionComponent<Props> = (props: Props) => {
    // TODO: Margin, more styling, etc.
    const { ready, setShowOverview } = props

    const button = useMemo(() => <LaunchButton ready={ready} setShowOverview={setShowOverview} />, [ready, setShowOverview])

    return (
        <div className="homeBase MainWindow ForceLightMode">
            <h1>QUASR:
                A QUAsi-symmetric Stellarator Repository
            </h1>

            <div className="flexWrapper">
                <div className="homeCopy">
                    <div>
                        The QUASR repository contains a database of over 320,000 curl-free stellarators
                        and the coil sets that generate them, optimized for volume quasi-symmetry.
                    </div>
                    <div>
                        Click the &ldquo;Launch Navigator&rdquo; button to navigate the QUASR database. Once you have
                        identified devices of interest, click the scatterplot representation or table
                        entry to launch a separate window with detailed record information,
                        including an interactive 3-D model and Poincaré plots.
                    </div>
                    {button}
                </div>
                <div className="homeImage">
                    {/* <img src={imgUrl} /> */}
                    <video loop autoPlay muted>
                        <source src={imgVideo} type="video/mp4" />
                    </video>
                </div>
            </div>
            <div className="authorship">
                <div>
                    QUASR database by Andrew Giuliani (Flatiron Institute), based on algorithms
                    developed with Florian Wechsung (NYU), Georg Stadler (NYU), Antoine Cerfon (NYU),
                    and Matt Landreman (U Maryland), and described in
                    {articles.map((a, i) => (
                        <Tooltip title={a.title} key={`article-${i}`}>
                            <span>&nbsp;(<a href={a.link}>{i + 1}</a>)</span>
                        </Tooltip>
                    ))}
                </div>
                <div>
                    Navigator by Jeff Soules (Flatiron Institute)
                </div>
            </div>
        </div>
    )
}

export default Home
