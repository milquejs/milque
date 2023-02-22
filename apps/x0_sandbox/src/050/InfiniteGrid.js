import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';

const vertexShader = `
varying mat4 v_projectionMatrix;
varying mat4 v_viewMatrix;
varying vec3 v_position;
varying vec3 v_cameraPosition;

varying vec3 v_nearPoint;
varying vec3 v_farPoint;

void main() {
    v_projectionMatrix = projectionMatrix;
    v_viewMatrix = viewMatrix;
    v_position = position;
    v_cameraPosition = cameraPosition;

    // Unproject
    mat4 inverseViewProjectionMatrix = inverse(viewMatrix) * inverse(projectionMatrix);
    vec4 nearPoint = inverseViewProjectionMatrix * vec4(position.xy, 0.0, 1.0);
    vec4 farPoint = inverseViewProjectionMatrix * vec4(position.xy, 1.0, 1.0);
    v_nearPoint = nearPoint.xyz / nearPoint.w;
    v_farPoint = farPoint.xyz / farPoint.w;

    gl_Position = vec4(position, 1.0);
}`;

const fragmentShader = `
precision highp float;

varying mat4 v_projectionMatrix;
varying mat4 v_viewMatrix;
varying vec3 v_position;
varying vec3 v_cameraPosition;

varying vec3 v_nearPoint;
varying vec3 v_farPoint;

uniform float u_near;
uniform float u_far;

vec4 grid(vec3 fragPos, float scale) {
    vec2 coord = fragPos.xz / scale;
    vec2 deriv = fwidth(coord);
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / deriv;
    float line = min(grid.x, grid.y);

    float minz = min(deriv.y, 1.0);
    float minx = min(deriv.x, 1.0);
    float alpha = 1.0 - min(line, 1.0);
    vec4 color = vec4(0.2, 0.2, 0.2, alpha);

    float range = 0.5 * scale;
    // z-axis
    if (fragPos.x > -range * minx && fragPos.x < range * minx) {
        color.z = 1.0;
    }
    // x-axis
    if (fragPos.z > -range * minz && fragPos.z < range * minz) {
        color.x = 1.0;
    }
    return color;
}

float computeDepth(vec3 pos) {
    vec4 clipSpacePos = v_projectionMatrix * v_viewMatrix * vec4(pos.xyz, 1.0);
    return clipSpacePos.z / clipSpacePos.w;
}

float computeLinearDepth(float depth) {
    float clipSpaceDepth = depth * 2.0 - 1.0;
    float linearDepth = (2.0 * u_near * u_far) / (u_far + u_near - clipSpaceDepth * (u_far - u_near));
    return linearDepth / u_far;
}

void main() {
    float t = -v_nearPoint.y / (v_farPoint.y - v_nearPoint.y);
    vec3 fragPos = v_nearPoint + t * (v_farPoint - v_nearPoint);
    float depth = computeDepth(fragPos);
    float linearDepth = computeLinearDepth(depth);
    gl_FragDepth = linearDepth;

    float d = max(0.0, log2(length(v_cameraPosition)) / 30.0);
    float fd = floor(d * 10.0);
    float fr = mod(d, 0.1) * 10.0;

    // Change grid size depending on zoom.
    vec4 maxGrid;
    vec4 minGrid;
    if (d <= 0.0) {
        fr = 1.0;
        minGrid = vec4(0.0, 0.0, 0.0, 0.0);
        maxGrid = grid(fragPos, 1.0) + grid(fragPos / 5.0, 0.1);
    } else if (d < 0.1) {
        minGrid = grid(fragPos, 1.0) + grid(fragPos / 5.0, 0.1);
        maxGrid = grid(fragPos, 1.0);
    } else {
        float g = pow(10.0, max(0.0, fd - 1.0));
        minGrid = grid(fragPos, g);
        maxGrid = grid(fragPos, g * 10.0);
    }
    vec4 color = mix(minGrid, maxGrid, fr);

    // Only below (y=0).
    color = color * float(t > 0.0);

    // float fade = max(0.0, (1.0 - depth));
    // float c = length(fragPos);
    float fade = linearDepth * 10.0;
    color.r = fade;

    gl_FragColor = color;
}`;

export class InfiniteGrid extends Mesh {
    constructor() {
        const geometry = new PlaneGeometry(2, 2, 1, 1);
        const material = new ShaderMaterial({
            uniforms: {
                u_near: { value: 0.01 },
                u_far: { value: 100 },
            },
            transparent: true,
            vertexShader,
            fragmentShader,
            extensions: {
                derivatives: true,
            }
        });
        super(geometry, material);
        this.frustumCulled = false;
    }
}
