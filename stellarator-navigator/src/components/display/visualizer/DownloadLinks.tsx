import { Button, Tooltip } from '@mui/material'
import makeResourcePath, { KnownPathType } from "@snUtil/makeResourcePath"
import { FunctionComponent } from "react"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python"
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs"

type Props = {
    id: string
}

SyntaxHighlighter.registerLanguage('python', python)

const codeSnippet =
`from simsopt._core import load
# replace "NAME_OF_FILE_YOU_DOWNLOADED" with the name you gave the file
[surfaces, coils] = load(f'NAME_OF_FILE_YOU_DOWNLOADED.json')`

const DownloadLinks: FunctionComponent<Props> = (props: Props) => {
    const { id } = props
    const vmecPath = makeResourcePath(id, KnownPathType.NML_VMEC)
    const simsoptPath = makeResourcePath(id, KnownPathType.SIMSOPT)

    // We have to do some fussy path-munging in order to construct the forced-download link correctly--otherwise
    // the browser will suggest saving the file according to its full path, not just its file name.
    const vmecPathParts = vmecPath.split("/")
    const vmecFile = vmecPathParts.pop() ?? ""
    const vmecPathFinal = vmecPathParts.join("/")
    const simsoptPathParts = simsoptPath.split("/")
    const simsoptFile = simsoptPathParts.pop() ?? ""
    const simsoptPathFinal = simsoptPathParts.join("/")

    return <div className="indent">
                <Tooltip
                    title="Download VMEC input file"
                >
                    <Button
                        variant="contained"
                        size="small"
                        style={{margin: 20}}
                        onClick={() => document.getElementById("vmec_download")?.click()}
                    >
                        Download VMEC
                    </Button>
                </Tooltip>
                <a id="vmec_download" href={`${vmecPathFinal}/${vmecFile}`} download={vmecFile} style={{display: "none"}} />
                <Tooltip
                    title="Download SIMSOPT coils, magnetic axis, and surface serializations"
                >
                    <Button
                        variant="contained"
                        size="small"
                        style={{margin: 20}}
                        onClick={() => document.getElementById("simsopt_download")?.click()}
                    >
                        Download SIMSOPT
                    </Button>
                </Tooltip>
                <a id="simsopt_download" href={`${simsoptPathFinal}/${simsoptFile}`} download={`${simsoptFile}`} style={{display: "none"}} />
                <div>
                    <span>To load downloaded SIMSOPT data, execute the following Python script:</span>
                    <div style={{border: "1px solid #7f7f7f", margin: 10}}>
                        <SyntaxHighlighter children={codeSnippet} language="python" style={a11yLight} />
                    </div>
                </div>
            </div>
    // This is retained as a links-only implementation, just in case we need to roll back to it.
    // return <div className="indent">
    //     Right-click and "Save link as" to download:
    //     <ul>
    //         <li>
    //             <a id="vmec_download" href={`${vmecPathFinal}/${vmecFile}`} download={vmecFile}> VMEC input file</a>
    //         </li>
    //         <li>
    //             <a id="simsopt_download" href={`${simsoptPathFinal}/${simsoptFile}`} download={`${simsoptFile}`}>
    //                 SIMSOPT coils, magnetic axis, and surface serializations
    //             </a>
    //         </li>
    //     </ul>
    //     <div>
    //         <span>To load downloaded SIMSOPT data, execute the following Python script:</span>
    //         <div className="codeSnippetWrapper">
    //             <SyntaxHighlighter children={codeSnippet} language="python" style={a11yLight} />
    //         </div>
    //     </div>
    // </div>
}

export default DownloadLinks
