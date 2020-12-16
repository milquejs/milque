precision mediump float;

varying vec3 v_position;
varying vec2 v_texcoord;
varying vec3 v_normal;

uniform vec3 u_color;
uniform sampler2D u_texture;

uniform mat4 u_local;

void main()
{
    // Remove translation from local transformations
    mat4 local = u_local;
    local[3][0] = 0.0;
    local[3][1] = 0.0;
    local[3][2] = 0.0;

    vec4 v;

    v = local * vec4(v_position, 1.0);
    vec3 pos = v.xyz;

    v = local * vec4(v_normal, 1.0);
    v = v / length(v);
    vec3 normal = v.xyz;

    v = local * vec4(1.0, 0.0, 0.0, 1.0);
    v = v / length(v);
    vec3 xaxis = v.xyz;
    vec3 yaxis = cross(normal, xaxis);

    float x = dot(pos, xaxis);
    float y = dot(pos, yaxis);

    
    gl_FragColor = vec4(abs(pos).xyz, 1.0);
    // v_texcoord = vec2(x, y);

    /*
    vec3 dist = dot(pos, a_normal);
    vec3 proj = point - dist * a_normal;

    vec3 axis = (u_local * vec4(1.0, 0.0, 0.0, 1.0)).xyz;
    vec3 pos = (u_local * vec4(a_position, 1.0)).xyz;
    vec3 proj = pos - dot(pos, a_normal) * a_normal;

    vec3 axisX = dot(axis, a_normal) * a_normal;
    axisX = axisX / length(axisX);
    vec3 axisY = a_normal * axisX;

    float x = dot(pos, axisX);
    float y = dot(pos, axisY);

    v_texcoord = vec2(x, y);
    */



    /*
    gl_FragColor = mix(
        texture2D(u_texture, v_texcoord),
        vec4(u_color, 1.0),
        0.5);
    */
}
