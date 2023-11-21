type OffscreenScatterProps = {
    glCtxt: WebGLRenderingContext
    vertexCount: number
}

export const dotMargin = 8.0

export const resizeCanvas = (props: {ctxt: WebGLRenderingContext | null, width: number, height: number }) => {
    const { ctxt, width, height } = props
    if (ctxt === null) {
        console.log(`Null offscreen-canvas webgl context received.`)
        return
    }
    const fullWidth = width + 2 * dotMargin
    const fullHeight = height + 2 * dotMargin
    if (ctxt.canvas.width !== fullWidth || ctxt.canvas.height !== fullHeight) {
        ctxt.canvas.width = fullWidth
        ctxt.canvas.height = fullHeight
        ctxt.viewport(0, 0, fullWidth, fullHeight)
    }
}


const draw = (gl: WebGLRenderingContext, vertexCount: number) => {
    gl.clearColor(0.0, 0.0, 0.0, 0.0) // clear to transparent (don't want to hide the canvas background)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

    // clears canvas before drawing
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const offset = 0
    gl.drawArrays(gl.POINTS, offset, vertexCount)
}


const drawScatter = (props: OffscreenScatterProps) => {
    const { glCtxt, vertexCount } = props

    console.log(`Rendering ${vertexCount} vertices.`)
    draw(glCtxt, vertexCount)
}

export default drawScatter
