export const VERTEX_SHADER = /* glsl */`#version 300 es

in vec3 a_position;
in vec2 a_texcoord;
in vec3 a_normal;

out vec2 v_texcoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_texcoord = a_texcoord;
}
`;

export const FRAGMENT_SHADER = /* glsl */`#version 300 es

precision highp float;

in vec2 v_texcoord;

out vec4 out_FragColor;

uniform vec4 u_color;

void main() {
    out_FragColor = u_color;
}
`;

export const UNIFORMS = {
    u_color: [1, 0, 0.7, 1],
    u_model: null,
    u_view: null,
    u_projection: null,
};
