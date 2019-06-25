
function getAndEnableAttribute(gl, name) {
    const positionPointer = gl.getAttribLocation(gl.program, name);
    gl.enableVertexAttribArray(positionPointer);
    return positionPointer;
}


function getAndEnableUniform(gl, name) {
    return gl.getUniformLocation(gl.program, name);
}

function createAndPutBuffer(gl, vertices) {
    var vertexBuffers = gl.createBuffer();
    if(!vertexBuffers) console.log('init vertex buffers failed');

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

export {
    getAndEnableAttribute,
    getAndEnableUniform,
    createAndPutBuffer,
}