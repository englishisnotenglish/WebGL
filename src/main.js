/**
 * Created by wjz on 2017/11/20.
 */
const canvas = document.querySelector("#canvas"),
    angle = document.querySelector('#angle'),
   gl = canvas.getContext('webgl');

//顶点着色器
const VSHEADER_SOURCE =
  'attribute vec4 position;' +
  'uniform mat4 rect;' +
  'void main() {\n' +
    'gl_Position = rect * position;\n' +
    'gl_PointSize = 10.0;\n' +
  '}';

//片元着色器
const FSHEADER_SOURCE =
  'void main() { \n' +
    'gl_FragColor = vec4(gl_FragCoord.x / 300, 0, gl_FragCoord.y / 150, 1);\n' +
  '}';

if(!initShaders(gl, VSHEADER_SOURCE, FSHEADER_SOURCE)) {
  console.log('failed to init the shader');
}

angle.oninput = function() {
  setUniform(angle.value);
  gl.clearColor(255, 255, 255, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
};


//gl.clearColor(255, 255, 255, 1);
//
//gl.clear(gl.COLOR_BUFFER_BIT);

//创建缓冲区
function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ]);

  var n = 3;

  var vertexBuffers = gl.createBuffer();
  if(!vertexBuffers) console.log('init vertex buffers failed');

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const position = gl.getAttribLocation(gl.program, 'position');
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(position);

  return n;
}

const n = initVertexBuffers(gl);

function setUniform(angle) {
  const cosA = Math.cos(angle / 180 * Math.PI),
    sinA = Math.sin(angle / 180 * Math.PI);
  var vertices = new Float32Array([
    cosA, -sinA, 0, 0,
    sinA, cosA, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);

  const unifrom = gl.getUniformLocation(gl.program, 'rect');
  gl.uniformMatrix4fv(unifrom, false, vertices);
}

gl.drawArrays(gl.TRIANGLES, 0, n);




//function clickToDrawPoint(event) {
//  const rect = event.target.getBoundingClientRect(),
//    sx = event.clientX - rect.left,
//    sy = event.clientY -  rect.top,
//    halfW = canvas.width / 2,
//    halfYH = canvas.height / 2,
//    x = (sx - halfW) / halfW,
//    y = (halfYH - sy) /halfYH;
//
//  points.push({
//    x,
//    y
//  });
//
//  for(var i = 0, len = points.length; i < len; i++) {
//    const point = points[i];
//    gl.vertexAttrib3f(position, point.x, point.y, 0);
//    gl.drawArrays(gl.POINTS, 0, 10);
//  }
//}


