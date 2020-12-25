precision mediump float;

varying vec2 v_texcoord;
varying vec3 v_normal;

uniform vec3 u_color;
uniform sampler2D u_texture;

void main()
{
    gl_FragColor = vec4(u_color, 1.0);
}
