precision mediump float;

varying vec3 v_position;
varying vec2 v_texcoord;
varying vec3 v_normal;

uniform vec3 u_color;
uniform sampler2D u_texture;

void main()
{
    gl_FragColor = mix(
        texture2D(u_texture, v_texcoord),
        vec4(u_color, 1.0),
        0.5);
}
