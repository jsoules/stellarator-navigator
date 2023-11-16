import { DataGeometry } from "@snTypes/Types"
// import { mat4, vec4 } from "gl-matrix"
import { mat4 } from "gl-matrix"

type OffscreenScatterProps = {
    glCtxt: WebGLRenderingContext
    geometry: DataGeometry // TODO
    data: number[][] // TODO: should be multiple series of x, y pairs, sorted per intended color.
}


type ProgramInfo = {
    program: null,
    attribLocations: {
        dotPosition: number
    },
    uniformLocations: {
        dataToNormalMatrix: WebGLUniformLocation,
        // COLORS LOOKUP TABLE?
    }
}


type BufferSet = {
    position: WebGLBuffer
}


type shaderTypes = WebGLRenderingContextBase["VERTEX_SHADER"] | WebGLRenderingContextBase["FRAGMENT_SHADER"]


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
    const positionBuffer = initPositionBuffer(glCtxt)
    if (positionBuffer === null) {
        throw Error("Error allocating positionBuffer")
    }

    return {
        position: positionBuffer
    }
}


const initPositionBuffer = (glCtxt: WebGLRenderingContext) => {
    const positionBuffer = glCtxt.createBuffer()
    glCtxt.bindBuffer(glCtxt.ARRAY_BUFFER, positionBuffer)

    return positionBuffer
}


const feedPositionBuffer = (glCtxt: WebGLRenderingContext, positions: number[]) => {
    glCtxt.bufferData(glCtxt.ARRAY_BUFFER, new Float32Array(positions), glCtxt.STATIC_DRAW)
}


// Loads data from the position buffer into the webgl program internal buffer.
const setPositionAttribute = (gl: WebGLRenderingContext, buffers: BufferSet, programInfo: ProgramInfo) => {
    const numComponents = 2 // 2 values per iteration
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
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


const draw = (gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: BufferSet, dataToNormalMatrix: mat4, vertexCount: number) => {
    gl.clearColor(0.0, 0.0, 0.0, 0.0) // clear to transparent (don't want to hide the canvas background)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

    // clears canvas before drawing
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    setPositionAttribute(gl, buffers, programInfo)
    gl.useProgram(programInfo.program)

    gl.uniformMatrix4fv(programInfo.uniformLocations.dataToNormalMatrix, false, dataToNormalMatrix)
    // TODO: update color per vertex (...via lookup table? Or is indirection slower than just using memory?)

    {
        const offset = 0
        gl.drawArrays(gl.POINTS, offset, vertexCount)
    }
}




// Following webgl tutorial from mozilla:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
// TODO: MEMOIZE SOMETHING ALREADY
const drawScatter = (props: OffscreenScatterProps) => {
    const { glCtxt, geometry, data } = props

    if (data === undefined) {
        console.log(`Data is undefined.`)
        return
    }

    const projectionMatrix = mat4.create()
    mat4.ortho(projectionMatrix, geometry.xmin, geometry.xmax, geometry.ymin, geometry.ymax, -1, 1)

    // // double-checking
    // const firstPt = vec4.fromValues(data[0][0], data[0][1], 0, 0)
    // const projectedFirstPt = vec4.create()
    // vec4.transformMat4(projectedFirstPt, firstPt, projectionMatrix)
    // console.log(`First point ${firstPt} projected to ${projectedFirstPt}; data series has ${data.flat().length/2} elements`)

    // Vertex shader: called per vertex of the shape.
    const vertexShaderSrc = `
    attribute vec4 aDotPosition;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = uProjectionMatrix * aDotPosition;
        gl_PointSize = 4.0;
    }
    `

    // Fragment shader: called once for each pixel on each shape,
    // after processing by vertex shader.
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); --> just applies uniform red.
    // We would want to do a lookup or something against the vertex category I think?
    const fragmentShaderSrc = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `

    const shaderProgram = createProgram(glCtxt, vertexShaderSrc, fragmentShaderSrc)

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            dotPosition: glCtxt.getAttribLocation(shaderProgram, "aDotPosition")
        },
        uniformLocations: {
            dataToNormalMatrix: glCtxt.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        }
    }
    if (programInfo.uniformLocations.dataToNormalMatrix === null) {
        throw Error(`Program error (syntax?): Failed to allocate one of the uniformLocations.\n${JSON.stringify(programInfo)}`)
    }

    const buffers = initBuffers(glCtxt)

    // TODO: Flattening for now b/c we aren't ready to apply colors
    feedPositionBuffer(glCtxt, data.flat())
    draw(glCtxt, programInfo as unknown as ProgramInfo, buffers, projectionMatrix, data.flat().length/2)

    // TODO: NEED TO ADD SIZE FOR SELECTED DATA ELEMENTS
    // This probably comes in as a separate index--keep the business logic out of this file
    // EJMollinelli tutorial covers this
}

export default drawScatter


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
