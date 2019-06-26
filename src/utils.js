
function getAndEnableAttribute(gl, name) {
    const positionPointer = gl.getAttribLocation(gl.program, name);
    gl.enableVertexAttribArray(positionPointer);
    return positionPointer;
}


function getUniformLocation(gl, name) {
    return gl.getUniformLocation(gl.program, name);
}

function createAndPutBuffer(gl, vertices, mode) {
    mode = mode || gl.ARRAY_BUFFER;
    var vertexBuffers = gl.createBuffer();
    if(!vertexBuffers) console.log('init vertex buffers failed');

    gl.bindBuffer(mode, vertexBuffers);
    gl.bufferData(mode, vertices, gl.STATIC_DRAW);
}

export {
    getAndEnableAttribute,
    getUniformLocation,
    createAndPutBuffer,
}