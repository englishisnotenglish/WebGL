/**
 * Created by wjz on 2019/6/17.
 * This is texture testing, I will use a pic from website.
 */
import VSHEADER_SOURCE from './shaders/threeD/threeD.vert.glsl';
import FSHEADER_SOURCE from './shaders/threeD/threeD.frag.glsl';

import { createAndPutBuffer, getAndEnableAttribute, getAndEnableUniform } from './utils';
const canvas = document.querySelector("#canvas"),
    gl = canvas.getContext('webgl');


if (!initShaders(gl, VSHEADER_SOURCE, FSHEADER_SOURCE)) {
    console.log('failed to init the shader');
}


let viewMatrix = null;

const a_triangle = getAndEnableAttribute(gl, 'a_triangle'),
    u_viewMatrix = getAndEnableUniform(gl, 'u_viewMatrix');

// 创建缓冲区
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.5, 0.5, 0,
        -0.5, 0.5, 0,
        0.5, -0.5, 0,

        0.5, 0.5, .5,
        -0.5, 0.5, .5,
        0.5, -0.5, .5,

        0.5, 0.5, .75,
        -0.5, 0.5, .75,
        0.5, -0.5, .75,
    ]);



    const size = vertices.BYTES_PER_ELEMENT,
        u_eyePosition = getAndEnableUniform(gl, 'u_eyePosition');

    createAndPutBuffer(gl, vertices);
    gl.vertexAttribPointer(a_triangle, 3, gl.FLOAT, false, size * 3, 0);

    viewMatrix = new Matrix4();
    viewMatrix.setLookAt(
            .2, .25, .25,
            0, 0, 0, 
            0, 1, 0,
        );

    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix.elements);

    return vertices.length / 3;
}

const n = initVertexBuffers(gl);

function setLookAt(x, y) {
    viewMatrix.setLookAt(
        x, y, .25,
        0, 0, 0, 
        0, 1, 0,
    );

    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

canvas.addEventListener('mousemove', (e) => {
    const { clientX, clientY, target} = e;
    let halfW = target.width / 2,
        halfH = target.height / 2;

    let x = (clientX - halfW) / halfW,
        y = (halfH - clientY) / halfH;

    setLookAt(x, y);
});





gl.drawArrays(gl.TRIANGLES, 0, n);





