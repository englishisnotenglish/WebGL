precision mediump float;
attribute vec3 a_triangle;

uniform mat4 u_viewMatrix;
uniform mat4 u_perspective;
uniform vec3 u_eyePosition; // 视点
uniform vec3 u_upDir; // 正方向

void main () {
    gl_Position = u_viewMatrix * vec4(a_triangle, 1.0) ;
}
