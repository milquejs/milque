precision mediump float;

attribute vec3 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

varying vec2 v_texcoord;
varying vec3 v_normal;

void main()
{
    gl_Position = vec4(a_position, 1.0);
    v_texcoord = a_texcoord;
    v_normal = a_normal;
}
