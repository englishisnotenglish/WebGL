/**
 * Created by wjz on 2017/11/20.
 * This is texture testing, I will use a pic from website.
 */
const canvas = document.querySelector("#canvas"),
   gl = canvas.getContext('webgl');

//顶点着色器
const VSHEADER_SOURCE =
  'attribute vec4 vPosition; \n' +
  'attribute vec2 tPosition; \n' +
  'varying vec2 vTCoord; \n' +
  'void main() {\n' +
    'gl_Position = vPosition;\n' +
    'vTCoord = tPosition;\n' +
  '}';

//片元着色器
const FSHEADER_SOURCE =
  'precision mediump float; \n' +
  'uniform sampler2D u_Sampler; \n' +
  'varying vec2 vTCoord; \n' +
  'void main() { \n' +
    'gl_FragColor = texture2D(u_Sampler, vTCoord);\n' +
  '}';

if(!initShaders(gl, VSHEADER_SOURCE, FSHEADER_SOURCE)) {
  console.log('failed to init the shader');
}



//gl.clearColor(255, 255, 255, 1);
//
//gl.clear(gl.COLOR_BUFFER_BIT);

//创建缓冲区
function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0.5, 0.5, 1, 1,
    -0.5, 0.5, 0, 1,
    0.5, -0.5, 1, 0,
    -0.5, -0.5, 0, 0
  ]);

  var n = 4;

  var vertexBuffers = gl.createBuffer();
  if(!vertexBuffers) console.log('init vertex buffers failed');

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const size = vertices.BYTES_PER_ELEMENT,
    vPosition = gl.getAttribLocation(gl.program, 'vPosition'),
    tPosition = gl.getAttribLocation(gl.program, 'tPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, size * 4, 0);
  gl.vertexAttribPointer(tPosition, 2, gl.FLOAT, false, size * 4, 2 * size);

  gl.enableVertexAttribArray(vPosition);
  gl.enableVertexAttribArray(tPosition);

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

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);//配置纹理图像

  gl.uniform1i(sampler, 0); // 0号纹理给uniform;

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

initTexture();






