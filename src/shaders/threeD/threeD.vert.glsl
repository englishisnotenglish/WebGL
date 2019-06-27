precision mediump float;
attribute vec3 a_triangle;

uniform mat4 u_viewMatrix;
uniform mat4 u_perspective;

void main () {
    gl_Position = u_perspective * u_viewMatrix * vec4(a_triangle, 1.0) ;
}
