precision mediump float;

attribute vec3 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

varying vec3 v_position;
varying vec2 v_texcoord;
varying vec3 v_normal;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

uniform mat4 u_world;
uniform mat4 u_local;

void main()
{
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    
    v_position = a_position;
    v_texcoord = a_texcoord;
    v_normal = a_normal;
}