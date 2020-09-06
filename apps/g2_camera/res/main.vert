attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

varying vec3 v_normal;

void main()
{
    v_normal = a_normal;
    
    gl_Position = u_projection * u_view * u_model * a_position;
}
