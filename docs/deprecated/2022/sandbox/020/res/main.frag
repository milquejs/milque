precision mediump float;

varying vec3 v_normal;

uniform vec4 u_color;

void main()
{
    vec3 normal = normalize(v_normal);
    float light = max(dot(normal, vec3(0.5, 0.5, 1)), 0.3);
    
    gl_FragColor = u_color * light;
}
