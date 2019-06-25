precision mediump float;
attribute vec3 a_triangle;

uniform mat4 u_viewMatrix;
uniform vec3 u_eyePosition; // 视点
uniform vec3 u_upDir; // 正方向

void main () {
    gl_Position = vec4(a_triangle, 1.0) * u_viewMatrix;
}
