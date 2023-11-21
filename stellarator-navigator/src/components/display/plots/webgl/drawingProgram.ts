import { DataGeometry } from "@snTypes/Types"
// import { mat4, vec3 } from "gl-matrix"
import { mat4 } from "gl-matrix"
import { dotMargin } from "./drawScatter"


export type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: {
        dotPosition: number
        dotColor: number
    },
    uniformLocations: {
        dataToNormalMatrix: WebGLUniformLocation | null,
        stdToScreen: WebGLUniformLocation | null,
    }
}


export type BufferSet = {
    position: WebGLBuffer
    color: WebGLBuffer
}


type shaderTypes = WebGLRenderingContextBase["VERTEX_SHADER"] | WebGLRenderingContextBase["FRAGMENT_SHADER"]


// v1--just dots
// // Vertex shader: called per vertex of the shape.
// const vertexShaderSrc = `
// attribute vec4 aDotPosition;
// attribute vec4 aColor;
// varying vec4 vColor;
// uniform mat4 uProjectionMatrix;

// void main() {
//     gl_Position = uProjectionMatrix * aDotPosition;
//     vColor = aColor;
//     gl_PointSize = 4.0;
// }
// `


// // Fragment shader: called once for each pixel on each shape,
// // after processing by vertex shader.
// const fragmentShaderSrc = `
// precision mediump float;
// varying vec4 vColor;
// void main() {
//     gl_FragColor = vColor;
// }
// `


// v2 -- try to do circles
// - changed pointsize to 8 (8x8 square) from which we'll strip;
// note that we still need to configure this for size highlights.
// Vertex shader: called per vertex of the shape.
const vertexShaderSrc = `
uniform mat4 uProjectionMatrix;
uniform vec2 uStdToScreen;
attribute vec4 aDotPosition;
attribute vec4 aColor;
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
    gl_PointSize = 8.0 + 1.0;
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
    if (positionBuffer === null || colorBuffer === null) {
        throw Error("Error allocating buffers.")
    }

    return {
        position: positionBuffer,
        color: colorBuffer
    }
}


const makeProgramInfo = (shaderProgram: WebGLProgram, glCtxt: WebGLRenderingContext) => {
    const programInfo: ProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            dotPosition: glCtxt.getAttribLocation(shaderProgram, "aDotPosition"),
            dotColor: glCtxt.getAttribLocation(shaderProgram, "aColor")
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


const populateData = (glCtxt: WebGLRenderingContext, data: number[][], colorVecs: number[][], buffers: BufferSet) => {
    const flatData = data.flat()
    // if (flatData.length < 37) {
    //     console.log(`FlatData report:\n,${flatData.map((v, i) => `${v}${i % 2 === 1 ? '\n' : ''}`)}`)
    // }
    glCtxt.bindBuffer(glCtxt.ARRAY_BUFFER, buffers.position)
    glCtxt.bufferData(glCtxt.ARRAY_BUFFER, new Float32Array(flatData), glCtxt.STATIC_DRAW)

    // incidentally, the "fill(0)" shouldn't be required: you can iterate over an array of empty elements
    // just as easily as an array of 0s. But some versions of TypeScript linter don't like it & want to
    // "optimize out" the empty array.

    // length/2 because it's a flattened list of both x and y coordinates.
    const flatColors = data.map((series, idx) => new Array(series.length/2).fill(0).map(() => colorVecs[idx])).flat(2)
    // if (flatColors.length < 73) {
    //     console.log(`FlatColors report:\n,${flatColors.map((c, i) => `${c}${i % 4 === 3 ? '\n' : ''}`)}`)
    // }
    glCtxt.bindBuffer(glCtxt.ARRAY_BUFFER, buffers.color)
    glCtxt.bufferData(glCtxt.ARRAY_BUFFER, new Float32Array(flatColors), glCtxt.STATIC_DRAW)
}


const readyData = (glCtxt: WebGLRenderingContext, buffers: BufferSet, programInfo: ProgramInfo) => {
    setPositionAttribute(glCtxt, buffers, programInfo)
    setColorAttribute(glCtxt, buffers, programInfo)
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


const initProgram = (glCtxt: WebGLRenderingContext | null) => {
    if (glCtxt === null) return () => () => {}
    const shaderProgram = createProgram(glCtxt, vertexShaderSrc, fragmentShaderSrc)

    const programInfo = makeProgramInfo(shaderProgram, glCtxt)
    const buffers = initBuffers(glCtxt)
    // TODO: NEED TO ADD SIZE ARRAY

    glCtxt.useProgram(programInfo.program)
    const configureCanvas = (colorList: number[][], geometry: DataGeometry, width: number, height: number) => {
        const colorVecs = colorList.map(c => [c[0], c[1], c[2], 1.0])

        // // all right, we'll do it live.
        // const dataWidth     = geometry.xmax - geometry.xmin
        // const dataHeight    = geometry.ymax - geometry.ymin
        // const viewWExMargin = 2 - xMarginFactor
        // const viewHExMargin = 2 - yMarginFactor
        // const xRatio        = viewWExMargin / dataWidth
        // const yRatio        = viewHExMargin / dataHeight
        // const xOffset       = (-1 * geometry.xmin * xRatio) + xMarginFactor/2 - 1
        // const yOffset       = (-1 * geometry.ymin * yRatio) + yMarginFactor/2 - 1
        // const projectionMatrix = mat4.fromValues(xRatio,       0, 0, 0,
        //                                               0,  yRatio, 0, 0,
        //                                               0,       0, 0, 0,
        //                                         xOffset, yOffset, 0, 1)
        
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

        const loadData = (data: number[][]) => {
            populateData(glCtxt, data, colorVecs, buffers)
            readyData(glCtxt, buffers, programInfo)
        }

        return loadData
    }

    return configureCanvas
}

export default initProgram



// FOR CIRCLES
// SEE https://webglfundamentals.org/webgl/lessons/webgl-qna-the-fastest-way-to-draw-many-circles.html
// twgl is a reference to https://twgljs.org/

// function main() {
//     const gl = document.querySelector('canvas').getContext('webgl');
//     const ext = gl.getExtension('ANGLE_instanced_arrays');
//     if (!ext) {
//       return alert('need ANGLE_instanced_arrays');
//     }
//     twgl.addExtensionsToContext(gl);
    
//     const vs = `
//     attribute float id;
//     attribute vec4 position;
//     attribute vec2 texcoord;
    
//     uniform float time;
    
//     varying vec2 v_texcoord;
//     varying vec4 v_color;
    
//     void main() {
//       float o = id + time;
//       gl_Position = position + vec4(
//           vec2(
//                fract(o * 0.1373),
//                fract(o * 0.5127)) * 2.0 - 1.0,
//           0, 0);
          
//       v_texcoord = texcoord;
//       v_color = vec4(fract(vec3(id) * vec3(0.127, 0.373, 0.513)), 1);
//     }`;
    
//     const fs = `
//     precision mediump float;
//     varying vec2 v_texcoord;
//     varying vec4 v_color;
    
//     float circle(in vec2 st, in float radius) {
//       vec2 dist = st - vec2(0.5);
//       return 1.0 - smoothstep(
//          radius - (radius * 0.01),
//          radius +(radius * 0.01),
//          dot(dist, dist) * 4.0);
//     }
    
//     void main() {
//       if (circle(v_texcoord, 1.0) < 0.5) {
//         discard;
//       }
//       gl_FragColor = v_color;
//     }
//     `; 
    
//     // compile shaders, link program, look up locations
//     const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  
//     const maxCount = 250000;
//     const ids = new Float32Array(maxCount);
//     for (let i = 0; i < ids.length; ++i) {
//       ids[i] = i;
//     }
//     const x = 16 / 300 * 2;
//     const y = 16 / 150 * 2;
    
//     const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
//       position: {
//         numComponents: 2,
//         data: [
//          -x, -y,
//           x, -y,
//          -x,  y,
//          -x,  y,
//           x, -y,
//           x,  y,
//        ],
//       },
//       texcoord: [
//           0, 1,
//           1, 1,
//           0, 0,
//           0, 0,
//           1, 1,
//           1, 0,    
//       ],
//       id: {
//         numComponents: 1,
//         data: ids,
//         divisor: 1,
//       }
//     });
//     twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    
//     const fpsElem = document.querySelector('#fps');
//     const countElem = document.querySelector('#count');
    
//     let count;  
//     function getCount() {
//       count = Math.min(maxCount, parseInt(countElem.value));
//     }
    
//     countElem.addEventListener('input', getCount);
//     getCount();
    
//     const maxHistory = 60;
//     const fpsHistory = new Array(maxHistory).fill(0);
//     let historyNdx = 0;
//     let historyTotal = 0;
    
//     let then = 0;
//     function render(now) {
//       const deltaTime = now - then;
//       then = now;
      
//       historyTotal += deltaTime - fpsHistory[historyNdx];
//       fpsHistory[historyNdx] = deltaTime;
//       historyNdx = (historyNdx + 1) % maxHistory;
      
//       fpsElem.textContent = (1000 / (historyTotal / maxHistory)).toFixed(1);
      
//       gl.useProgram(programInfo.program);
//       twgl.setUniforms(programInfo, {time: now * 0.001});
//       ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, count);
//       requestAnimationFrame(render);
//     }
//     requestAnimationFrame(render);
//   }
//   main();
