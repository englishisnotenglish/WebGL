/**
 * Created by wjz on 2019/6/17.
 * This is texture testing, I will use a pic from website.
 */
import VSHEADER_SOURCE from './shaders/threeD/threeD.vert.glsl';
import FSHEADER_SOURCE from './shaders/threeD/threeD.frag.glsl';
import { createAndPutBuffer, getAndEnableAttribute, getUniformLocation } from './utils';

const rectModal =[
    0, 1, 3, 0, 2, 3, // front
    2 , 3 , 7, 2, 6, 7, // top
    4, 7, 5, 4, 7, 6, // behind
    0, 5, 4, 0, 5, 1, // bottom
    0, 6, 2, 0, 6, 4, // left
    1, 7, 5, 1, 7, 3, // right
];

function createRect(num, rectModal) {
    let index = [],
        no = 0;
    for (let i = 0, len = num; i < len; i++) {
        no = (i + 1);
        rectModal.forEach(rectIndex => {
            index.push(
                no * 8  + rectIndex
            );
        })
    }
    return rectModal.concat(index);
}

const canvas = document.querySelector("#canvas"),
    gl = canvas.getContext('webgl');


if (!initShaders(gl, VSHEADER_SOURCE, FSHEADER_SOURCE)) {
    console.log('failed to init the shader');
}


let viewMatrix = null,
    perspectiveMatrix = null;

const a_triangle = getAndEnableAttribute(gl, 'a_triangle'),
    u_viewMatrix = getUniformLocation(gl, 'u_viewMatrix');

// 创建缓冲区
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.25, 0, 0,  // first
        0.5, 0, 0,
        .25, 0.25, 0, 
        0.5, 0.25, 0, 
        0.25, 0, .25, 
        0.5, 0, .25,
        .25, 0.25, .25, 
        0.5, 0.25, .25, 

        0.25, 0, -0.5,  // 第一个后面的正方体
        0.5, 0, -0.5,
        .25, 0.25, -0.5, 
        0.5, 0.25, -0.5, 
        0.25, 0, -.75, 
        0.5, 0, -.75,
        .25, 0.25, -.75, 
        0.5, 0.25, -.75, 

        0.-.25, 0, 0,  // second
        0.-.5, 0, 0,
        -.25, 0.25, 0, 
        -0.5, 0.25, 0, 
        -0.25, 0, .25, 
        -0.5, 0, .25,
        -.25, 0.25, .25, 
        -0.5, 0.25, .25, 

        0.-.25, 0, -0.5,  // behind second
        0.-.5, 0, -0.5,
        -.25, 0.25, -0.5, 
        -0.5, 0.25, -0.5, 
        -0.25, 0, -.75, 
        -0.5, 0, -.75,
        -.25, 0.25, -.75, 
        -0.5, 0.25, -.75, 
    ]);

    // 顶点索引
    let index = new Uint8Array(
        createRect(3, rectModal)
    );

    const size = vertices.BYTES_PER_ELEMENT,
        u_eyePosition = getUniformLocation(gl, 'u_eyePosition'),
        u_perspective = getUniformLocation(gl, 'u_perspective');

    
    createAndPutBuffer(gl, vertices);
    createAndPutBuffer(gl, index, gl.ELEMENT_ARRAY_BUFFER);
    gl.vertexAttribPointer(a_triangle, 3, gl.FLOAT, false, size * 3, 0);

    viewMatrix = new Matrix4();
    perspectiveMatrix = new Matrix4();
    perspectiveMatrix.setPerspective(
        90, 1, 1, 10,
    );
    viewMatrix.setLookAt(
        0, 0,  0,
        -100, 0,  -100, 
        0, 1, 0,
    );

    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_perspective, false, perspectiveMatrix.elements);

    return index.length;
}

const n = initVertexBuffers(gl);

function setLookAt(x, y, z = 0) {
    viewMatrix.setLookAt(
       -x * 100, 0, -y * 100,
       0, 0, 0,
        0, 1, 0,
    );

    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

canvas.addEventListener('mousemove', (e) => {
    const { clientX, clientY, target} = e;
    let halfW = target.width / 2,
        halfH = target.height / 2;

    let x = (clientX - halfW) / halfW,
        y = (halfH - clientY) / halfH;

    setLookAt(x, y);
});

gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);





