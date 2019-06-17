import vert from './shaders/drawText/drawText.vert.glsl';
import frag from './shaders/drawText/drawText.frag.glsl';

const canvas = document.querySelector("#canvas"),
   gl = canvas.getContext('webgl');

// init shader
if(!initShaders(gl, vert, frag)) {
    console.log('failed to init the shader');
}
