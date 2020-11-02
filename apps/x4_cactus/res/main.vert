attribute vec4 a_position;

uniform mat4 u_projection;
uniform mat4 u_view;

void main()
{
    gl_Position = u_projection * u_view * a_position;
}