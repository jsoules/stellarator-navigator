type OffscreenScatterProps = {
    glCtxt: WebGLRenderingContext
    data: number[][] // Should be multiple series of x, y pairs, sorted per intended color.
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

    {
        const offset = 0
        gl.drawArrays(gl.POINTS, offset, vertexCount)
    }
}




// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
const drawScatter = (props: OffscreenScatterProps) => {
    const { glCtxt, data } = props

    if (data === undefined) {
        console.log(`Data is undefined.`)
        return
    }

    const vertexCount = data.reduce((t: number, c) => t + c.length, 0)
    console.log(`Rendering ${vertexCount} vertices.`)

    draw(glCtxt, vertexCount)

    // TODO: NEED TO ADD SIZE FOR SELECTED DATA ELEMENTS
    // This probably comes in as a separate index--keep the business logic out of this file
    // EJMollinelli tutorial covers this
}

export default drawScatter

// TODO: SEPARATE THIS SO INITIALIZING THE PROGRAM AND ALLOCATING THE BUFFERS IS SEPARATE FROM EACH DRAW CYCLE
// why incur the recompile penalty...?


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
