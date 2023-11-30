import { DataGeometry } from "@snTypes/Types"
import { mat4 } from "gl-matrix"
import { dotMargin } from "./drawScatter"


export type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: {
        dotPosition: number
        dotColor: number
        dotSize: number
    },
    uniformLocations: {
        dataToNormalMatrix: WebGLUniformLocation | null,
        stdToScreen: WebGLUniformLocation | null,
    }
}


export type BufferSet = {
    position: WebGLBuffer
    color: WebGLBuffer
    size: WebGLBuffer
}


type shaderTypes = WebGLRenderingContextBase["VERTEX_SHADER"] | WebGLRenderingContextBase["FRAGMENT_SHADER"]


// example logic for circles: http://gamedusa.blogspot.com/2007/05/drawing-circle-primitives-using.html
// note that we still need to configure this for size highlights.
// Vertex shader: called per vertex of the shape.
const vertexShaderSrc = `
uniform mat4 uProjectionMatrix;
uniform vec2 uStdToScreen;
attribute vec4 aDotPosition;
attribute vec4 aColor;
attribute float aDotRadius; // expected to be 4.0 or 8.0
varying vec4 vColor;
varying vec2 vScreenPos;
varying float vRadius;

void main() {
    vColor = aColor;
    gl_Position = uProjectionMatrix * aDotPosition;

    // pos -> window-coordinates
    vScreenPos = uStdToScreen + (gl_Position.xy * uStdToScreen);
    
    // And one last little trick: the dots are a little smaller
    // than expected because the overall canvas is larger than
    // the visible part that gets copied. Technically we should
    // divide by the lesser of ([width, height] - margin)/[w, h]
    // but it's probably fine to just make it a little bit bigger.
    gl_PointSize = 2.0 * aDotRadius + 1.0;
    vRadius = gl_PointSize * 0.5;
}
`


// Fragment shader: called once for each pixel on each shape,
// after processing by vertex shader.
const fragmentShaderSrc = `
precision mediump float;
varying vec4 vColor;
varying vec2 vScreenPos;
varying float vRadius;
void main() {
    if (distance(gl_FragCoord.xy, vScreenPos) > vRadius) discard;
    gl_FragColor = vColor;
}
`



const loadShader = (gl: WebGLRenderingContext, shaderType: shaderTypes, source: string) => {
    const shader = gl.createShader(shaderType)
    if (shader === null) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!status) {
        throw new TypeError(`Couldn't compile shader:\n${gl.getShaderInfoLog(shader)}`)
    }

    return shader;
}


const createProgram = (glCtxt: WebGLRenderingContext, vertexShaderSrc: string, fragmentShaderSrc: string) => {
    const vertexShader = loadShader(glCtxt, glCtxt.VERTEX_SHADER, vertexShaderSrc)
    const fragmentShader = loadShader(glCtxt, glCtxt.FRAGMENT_SHADER, fragmentShaderSrc)
    if (vertexShader === null || fragmentShader === null) {
        glCtxt.deleteShader(fragmentShader)
        glCtxt.deleteShader(vertexShader)
        throw new Error(`Loading shader returned null.`)
    }

    const shaderProgram = glCtxt.createProgram()
    if (shaderProgram === null) {
        glCtxt.deleteShader(fragmentShader)
        glCtxt.deleteShader(vertexShader)
        throw new Error(`Unable to create shader program.`)
    }
    glCtxt.attachShader(shaderProgram, vertexShader)
    glCtxt.attachShader(shaderProgram, fragmentShader)
    glCtxt.linkProgram(shaderProgram)

    const status = glCtxt.getProgramParameter(shaderProgram, glCtxt.LINK_STATUS)
    if (!status) {
        const error = glCtxt.getProgramInfoLog(shaderProgram)
        glCtxt.deleteProgram(shaderProgram)
        glCtxt.deleteShader(fragmentShader)
        glCtxt.deleteShader(vertexShader)
        throw new Error(`Couldn't link shader program:\n${error}`)
    }

    return shaderProgram
}


const initBuffers = (glCtxt: WebGLRenderingContext): BufferSet => {
    const positionBuffer = glCtxt.createBuffer()
    const colorBuffer = glCtxt.createBuffer()
    const sizeBuffer = glCtxt.createBuffer()
    if (positionBuffer === null || colorBuffer === null || sizeBuffer === null) {
        throw Error("Error allocating buffers.")
    }

    return {
        position: positionBuffer,
        color: colorBuffer,
        size: sizeBuffer
    }
}


const makeProgramInfo = (shaderProgram: WebGLProgram, glCtxt: WebGLRenderingContext) => {
    const programInfo: ProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            dotPosition: glCtxt.getAttribLocation(shaderProgram, "aDotPosition"),
            dotColor: glCtxt.getAttribLocation(shaderProgram, "aColor"),
            dotSize: glCtxt.getAttribLocation(shaderProgram, "aDotRadius")
        },
        uniformLocations: {
            dataToNormalMatrix: glCtxt.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            stdToScreen: glCtxt.getUniformLocation(shaderProgram, "uStdToScreen")
        }
    }
    if (programInfo.uniformLocations.dataToNormalMatrix === null || programInfo.uniformLocations.stdToScreen === null) {
        throw Error(`Program error (syntax?): Failed to allocate one of the uniformLocations.\n${JSON.stringify(programInfo)}`)
    }

    return programInfo
}


const populateData = (glCtxt: WebGLRenderingContext, data: number[], colorValues: number[], sizes: number[], buffers: BufferSet) => {
    glCtxt.bindBuffer(glCtxt.ARRAY_BUFFER, buffers.position)
    glCtxt.bufferData(glCtxt.ARRAY_BUFFER, new Float32Array(data), glCtxt.STATIC_DRAW)

    glCtxt.bindBuffer(glCtxt.ARRAY_BUFFER, buffers.size)
    glCtxt.bufferData(glCtxt.ARRAY_BUFFER, new Float32Array(sizes.flat()), glCtxt.STATIC_DRAW)

    glCtxt.bindBuffer(glCtxt.ARRAY_BUFFER, buffers.color)
    glCtxt.bufferData(glCtxt.ARRAY_BUFFER, new Float32Array(colorValues), glCtxt.STATIC_DRAW)
}


const readyData = (glCtxt: WebGLRenderingContext, buffers: BufferSet, programInfo: ProgramInfo) => {
    setPositionAttribute(glCtxt, buffers, programInfo)
    setColorAttribute(glCtxt, buffers, programInfo)
    setSizeAttribute(glCtxt, buffers, programInfo)
}


// Loads data from the position buffer into the webgl program internal buffer.
const setPositionAttribute = (gl: WebGLRenderingContext, buffers: BufferSet, programInfo: ProgramInfo) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    const numComponents = 2 // 2 values per iteration
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.vertexAttribPointer(
        programInfo.attribLocations.dotPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.dotPosition)
}


const setColorAttribute = (gl: WebGLRenderingContext, buffers: BufferSet, programInfo: ProgramInfo) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(programInfo.attribLocations.dotColor, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(programInfo.attribLocations.dotColor)
}


const setSizeAttribute = (gl: WebGLRenderingContext, buffers: BufferSet, programInfo: ProgramInfo) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.size)
    gl.vertexAttribPointer(programInfo.attribLocations.dotSize, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(programInfo.attribLocations.dotSize)
}


export type ScatterDataLoaderType = (data: number[], sizes: number[], colorValues: number[]) => void

const initProgram = (glCtxt: WebGLRenderingContext | null) => {
    if (glCtxt === null) return () => () => {}
    const shaderProgram = createProgram(glCtxt, vertexShaderSrc, fragmentShaderSrc)

    const programInfo = makeProgramInfo(shaderProgram, glCtxt)
    const buffers = initBuffers(glCtxt)

    glCtxt.useProgram(programInfo.program)
    const configureCanvas = (geometry: DataGeometry, width: number, height: number) => {
        // const colorVecs = colorList.map(c => [c[0], c[1], c[2], 1.0])

        // We want to add a margin (of some known pixel value) to each side of the canvas, so that dots on the edge
        // don't get cut off in drawing. Problem is our "ortho" matrix doesn't know that, and will just map to
        // (-1, 1) x (-1, 1). Figuring out what the matrix really should be is tricky; so instead we want to
        // set a fake data range that keeps the same centers for the x, y series, but extends them so that
        // the actual data range covers only the visible portion of the canvas.
        // e.g. if our margin takes up 10% of the total width and the x-variable runs from 60 - 120,
        // then we want to set a fake data range centered at 90 and with width (60/0.9 = 66-bar),
        // so from 57ish to 123ish.
        const xMarginFactor = (2 * dotMargin)/width
        const yMarginFactor = (2 * dotMargin)/height
        const visibleXOverFull = 1 - xMarginFactor
        const visibleYOverFull = 1 - yMarginFactor
        const dataXSpan = geometry.xmax - geometry.xmin
        const dataXMid  = geometry.xmin + dataXSpan/2
        const dataYSpan = geometry.ymax - geometry.ymin
        const dataYMid  = geometry.ymin + dataYSpan/2
        const targetHalfSpanX = (dataXSpan/2)/visibleXOverFull
        const targetHalfSpanY = (dataYSpan/2)/visibleYOverFull

        const projectionMatrix = mat4.create()
        mat4.ortho(projectionMatrix, dataXMid - targetHalfSpanX, dataXMid + targetHalfSpanX, dataYMid - targetHalfSpanY, dataYMid + targetHalfSpanY, 0, 1)
        glCtxt.uniformMatrix4fv(programInfo.uniformLocations.dataToNormalMatrix, false, projectionMatrix)
        glCtxt.uniform2fv(programInfo.uniformLocations.stdToScreen, [0.5*width + dotMargin, 0.5*height + dotMargin])

        const loadData: ScatterDataLoaderType = (data, sizes, colorValues) => {
            if (data === undefined || data.length === 0) return
            populateData(glCtxt, data, colorValues, sizes, buffers)
            readyData(glCtxt, buffers, programInfo)
        }

        return loadData
    }

    return configureCanvas
}

export default initProgram
