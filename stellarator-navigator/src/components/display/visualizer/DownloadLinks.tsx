// import { Button, Tooltip } from '@mui/material'
import { DownloadPathsApiResponseObject } from "@snTypes/Types"
import { FunctionComponent } from "react"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python"
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs"

type Props = {
    apiResponse?: DownloadPathsApiResponseObject
}

SyntaxHighlighter.registerLanguage('python', python)

const codeSnippet =
`from simsopt._core import load
# replace "NAME_OF_FILE_YOU_DOWNLOADED" with the name you gave the file
[surfaces, axis, coils] = load(f'NAME_OF_FILE_YOU_DOWNLOADED.json')`

const DownloadLinks: FunctionComponent<Props> = (props: Props) => {
    const { apiResponse } = props
    if (apiResponse === undefined || apiResponse.vmecPath === undefined || apiResponse.simsoptPath === undefined) return <></>

    // NOTE: The following won't actually work on the local filesystem, but should do fine as long as you're returning a valid endpoint.
    const vmecPathParts = apiResponse.vmecPath.split("/")
    const vmecFile = vmecPathParts.pop() ?? ""
    const vmecPath = vmecPathParts.join("/")
    const simsoptPathParts = apiResponse.simsoptPath.split("/")
    const simsoptFile = simsoptPathParts.pop() ?? ""
    const simsoptPath = simsoptPathParts.join("/")

    // return <div style={{paddingLeft: 20}}>
    //             <Tooltip
    //                 title="Download VMEC input file"
    //             >
    //                 <Button
    //                     variant="contained"
    //                     size="small"
    //                     style={{margin: 20}}
    //                     onClick={() => document.getElementById("vmec_download")?.click()}
    //                 >
    //                     Download VMEC
    //                 </Button>
    //             </Tooltip>
    //             <a id="vmec_download" href={`${vmecPath}/${vmecFile}`} download={vmecFile} style={{display: "none"}} />
    //             <Tooltip
    //                 title="Download SIMSOPT coils, magnetic axis, and surface serializations"
    //             >
    //                 <Button
    //                     variant="contained"
    //                     size="small"
    //                     style={{margin: 20}}
    //                     onClick={() => document.getElementById("simsopt_download")?.click()}
    //                 >
    //                     Download SIMSOPT
    //                 </Button>
    //             </Tooltip>
    //             <a id="simsopt_download" href={`${simsoptPath}/${simsoptFile}`} download={`${simsoptFile}`} style={{display: "none"}} />
    //             <div>
    //                 <span>To load downloaded SIMSOPT data, execute the following Python script:</span>
    //                 <div style={{border: "1px solid #7f7f7f", margin: 10}}>
    //                     <SyntaxHighlighter children={codeSnippet} language="python" style={a11yLight} />
    //                 </div>
    //             </div>
    //         </div>
    return <div className="indent">
        Right-click and "Save link as" to download:
        <ul>
            <li>
                <a id="vmec_download" href={`${vmecPath}/${vmecFile}`} download={vmecFile}> VMEC input file</a>
            </li>
            <li>
                <a id="simsopt_download" href={`${simsoptPath}/${simsoptFile}`} download={`${simsoptFile}`}>
                    SIMSOPT coils, magnetic axis, and surface serializations
                </a>
            </li>
        </ul>
        <div>
            <span>To load downloaded SIMSOPT data, execute the following Python script:</span>
            <div className="codeSnippetWrapper">
                <SyntaxHighlighter children={codeSnippet} language="python" style={a11yLight} />
            </div>
        </div>
    </div>

}

export default DownloadLinks