/**
 * Created by wjz on 2018/3/20.
 */
const canvas = document.querySelector("#canvas"),
  angle = document.querySelector('#angle'),
  gl = canvas.getContext('webgl');

// canvas.addEventListener('click', function (ev) {
//   console.log(ev.clientX, ev.clientY);
// });

const center = [0, 0],
  radius = 100,
  percent = 0.8;

// 顶点着色器
const VSHEADER_SOURCE = `
  attribute vec2 position;
  attribute vec2 picPosition;
  varying vec2 vPicPosition;
  void main() {
    gl_Position =  vec4(position, 0, 1);
    vPicPosition = picPosition;
  }
`;

// 片元着色器
const FSHEADER_SOURCE = `
  precision mediump float;
  varying vec4 color;
  uniform int uColorType;
  varying vec2 vPicPosition;
  uniform sampler2D u_Sampler;
  void main() {
    if (uColorType == 0) {
      gl_FragColor = texture2D(u_Sampler, vPicPosition);
    } else {
      gl_FragColor = vec4(0.5, 0.5, 0.5, 1);
    }
  }
`;

if(!initShaders(gl, VSHEADER_SOURCE, FSHEADER_SOURCE)) {
  console.log('failed to init the shader');
}

// angle.oninput = function() {
//   setUniform(angle.value);
//   gl.clearColor(255, 255, 255, 1);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.TRIANGLES, 0, n);
// };

// gl.clearColor(255, 255, 255, 1);
//
// gl.clear(gl.COLOR_BUFFER_BIT);

// 创建缓冲区
function initVertexBuffers(gl) {
  const width = canvas.clientWidth / 2,
    height = canvas.clientHeight / 2,
    rx = radius / width,
    ry = radius /height;
  center[0] /= width;
  center[1] /= height;
  
  const rightOffsetX = center[0] + rx,
    leftOffsetX = center[0] - rx,
    topOffsetY = center[1] + ry,
    bottomOffsetY = center[1] - ry;
  var vertices = new Float32Array([
    rightOffsetX, bottomOffsetY,
    rightOffsetX, topOffsetY,
    leftOffsetX, bottomOffsetY,
    leftOffsetX, topOffsetY,
    rightOffsetX * percent, bottomOffsetY * percent,
    rightOffsetX * percent, topOffsetY * percent,
    leftOffsetX * percent, bottomOffsetY * percent,
    leftOffsetX * percent, topOffsetY * percent,
    rightOffsetX, topOffsetY,
    rightOffsetX * percent, topOffsetY * percent,
    rightOffsetX, bottomOffsetY,
    rightOffsetX * percent, bottomOffsetY * percent,
    leftOffsetX, bottomOffsetY,
    leftOffsetX * percent, bottomOffsetY * percent,
    leftOffsetX, topOffsetY,
    leftOffsetX * percent, topOffsetY * percent,
    rightOffsetX, topOffsetY,
    rightOffsetX * percent, topOffsetY * percent,
  ]);

  var texcoords = new Float32Array([
    0, 0,
    0, 0,
    0, 0,
    0, 0,
    1, 0,
    1, 1,
    0, 0,
    0, 1,
    0, 0,
    0, 0,
    0, 0,
    0, 0,
    1, 0,
    1, 1,
    0, 0,
    0, 1,
    0, 0,
    0, 0,
  ]);

  const position = gl.getAttribLocation(gl.program, 'position'),
    uColorType = gl.getUniformLocation(gl.program, 'uColorType'),
    picPosition = gl.getAttribLocation(gl.program, 'picPosition'),
    fsize = vertices.BYTES_PER_ELEMENT;

  var n = 8;

  gl.uniform1i(uColorType, 0);
  var vertexBuffers = gl.createBuffer();
  if(!vertexBuffers) console.log('init vertex buffers failed');

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, fsize * 2, 0);
  gl.enableVertexAttribArray(position);

  var texBuffers = gl.createBuffer();
  if(!texBuffers) console.log('init texBuffers failed');

  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffers);
  gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);

  gl.vertexAttribPointer(picPosition, 2, gl.FLOAT, false, fsize * 2, 0);
  gl.enableVertexAttribArray(picPosition);
  return 8;
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
  const uColorType = gl.getUniformLocation(gl.program, 'uColorType');
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

  gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
  gl.uniform1i(uColorType, 1);
  gl.drawArrays(gl.TRIANGLE_STRIP, 8, 10);
}

initTexture();

//gl.drawArrays(gl.LINE_LOOP, 0, n);
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




