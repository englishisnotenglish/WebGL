/**
 * Created by wjz on 2018/3/20.
 */
const canvas = document.querySelector("#canvas"),
  angle = document.querySelector('#angle'),
  gl = canvas.getContext('webgl');

canvas.addEventListener('click', function (ev) {
  console.log(ev.clientX, ev.clientY);
});

const center = [0, 0],
  radius = 100;

// 顶点着色器
const VSHEADER_SOURCE =
  'attribute vec4 position;\n' +
  'attribute vec4 vColor;\n' +
  'attribute vec2 picPosition;\n' +
  'varying vec4 color;\n' +
  'varying vec2 vPicPosition;\n' +
  'void main() {\n' +
    'gl_Position = position;\n' +
    'vPicPosition = picPosition;\n' +
    'color = vColor;\n' +
  '}';

// 片元着色器
const FSHEADER_SOURCE =
  'precision mediump float;' +
  'varying vec4 color;' +
  'varying vec2 vPicPosition;' +
  'uniform sampler2D u_Sampler; \n' +
  'void main() { \n' +
    'gl_FragColor = texture2D(u_Sampler, vPicPosition); \n' +
  '}';

if(!initShaders(gl, VSHEADER_SOURCE, FSHEADER_SOURCE)) {
  console.log('failed to init the shader');
}

// angle.oninput = function() {
//   setUniform(angle.value);
//   gl.clearColor(255, 255, 255, 1);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.TRIANGLES, 0, n);
// };



gl.clearColor(255, 255, 255, 1);

gl.clear(gl.COLOR_BUFFER_BIT);

// 创建缓冲区
function initVertexBuffers(gl) {
  const width = canvas.clientWidth / 2,
    height = canvas.clientHeight / 2,
    rx = radius / width,
    ry = radius /height;
  center[0] /= width;
  center[1] /= height;

  var vertices = new Float32Array([
    center[0] + rx, center[1] + ry, 1, 0, 0,
    center[0] + rx, center[1] - ry, 0, 1, 0,
    center[0] - rx, center[1] - ry, 0, 0, 1,
    center[0] - rx, center[1] + ry, 0, 0, 1,
  ]);

  var n = 4;

  var vertexBuffers = gl.createBuffer();
  if(!vertexBuffers) console.log('init vertex buffers failed');

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const position = gl.getAttribLocation(gl.program, 'position'),
    vColor = gl.getAttribLocation(gl.program, 'vColor'),
    picPosition = gl.getAttribLocation(gl.program, 'picPosition'),
    fsize = vertices.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, fsize * 5, 0);
  gl.vertexAttribPointer(picPosition, 2, gl.FLOAT, false, fsize * 5, 0);
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, fsize * 5, fsize * 2);

  gl.enableVertexAttribArray(position);
  gl.enableVertexAttribArray(vColor);
  gl.enableVertexAttribArray(picPosition);

  return n;
}

const n = initVertexBuffers(gl);

function initTexture() {
  const texture = gl.createTexture(),
    sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

  const img = new Image();
  img.onload = function() {
    loadTexture(gl, n, texture, sampler, img);
  };
  img.src = './Omhy-fypatmw5816858.jpg';
}

// 将图片的纹素给片元
function loadTexture(gl, n, texture, sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 将纹理图像Y轴翻转

  gl.activeTexture(gl.TEXTURE0); // 开启0号纹理

  gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定纹理

  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);// 配置纹理图像

  gl.uniform1i(sampler, 0); // 0号纹理给unifrom;

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

initTexture();

gl.drawArrays(gl.LINE_LOOP, 0, n);
// function setUniform(angle) {
//   const cosA = Math.cos(angle / 180 * Math.PI),
//     sinA = Math.sin(angle / 180 * Math.PI);
//   var vertices = new Float32Array([
//     cosA, -sinA, 0, 0,
//     sinA, cosA, 0, 0,
//     0, 0, 1, 0,
//     0, 0, 0, 1
//   ]);
//
//   const unifrom = gl.getUniformLocation(gl.program, 'rect');
//   gl.uniformMatrix4fv(unifrom, false, vertices);
// }




