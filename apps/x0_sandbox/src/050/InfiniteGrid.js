import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three';

const vertexShader = `
varying mat4 v_projectionMatrix;
varying mat4 v_modelViewMatrix;
varying vec3 v_position;

varying vec3 v_nearPoint;
varying vec3 v_farPoint;

vec3 unproject(float x, float y, float z, mat4 view, mat4 proj) {
    mat4 invView = inverse(view);
    mat4 invProj = inverse(proj);
    vec4 unprojected = invView * invProj * vec4(x, y, z, 1.0);
    return unprojected.xyz / unprojected.w;
}

void main() {
    v_projectionMatrix = projectionMatrix;
    v_modelViewMatrix = modelViewMatrix;
    v_position = position;

    vec3 p = position.xyz;
    v_nearPoint = unproject(p.x, p.y, 0.0, modelViewMatrix, projectionMatrix);
    v_farPoint = unproject(p.x, p.y, 1.0, modelViewMatrix, projectionMatrix);
    gl_Position = vec4(p, 1.0);
}`;

const fragmentShader = `
precision mediump float;

varying mat4 v_projectionMatrix;
varying mat4 v_modelViewMatrix;
varying vec3 v_position;

varying vec3 v_nearPoint;
varying vec3 v_farPoint;

vec4 grid(vec3 fragPos, float scale) {
    vec2 coord = fragPos.xz * scale;
    vec2 deriv = fwidth(coord);
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / deriv;
    float line = min(grid.x, grid.y);
    float minz = min(deriv.y, 1.0);
    float minx = min(deriv.x, 1.0);
    vec4 color = vec4(0.2, 0.2, 0.2, 1.0 - min(line, 1.0));
    // z-axis
    if (fragPos.x > -0.1 * minx && fragPos.x < 0.1 * minx) {
        color.z = 1.0;
    }
    // x-axis
    if (fragPos.z > -0.1 * minz && fragPos.z < 0.1 * minz) {
        color.x = 1.0;
    }
    return color;
}

float computeDepth(vec3 pos) {
    vec4 clipSpacePos = v_projectionMatrix * v_modelViewMatrix * vec4(v_position.xyz, 1.0);
    return clipSpacePos.z / clipSpacePos.w;
}

float computeLinearDepth(vec3 pos) {
    float v_near = 0.01;
    float v_far = 10.0;
    vec4 clipSpacePos = v_projectionMatrix * v_modelViewMatrix * vec4(v_position.xyz, 1.0);
    float clipSpaceDepth = (clipSpacePos.z / clipSpacePos.w) * 2.0 - 1.0;
    float linearDepth = (2.0 * v_near * v_far) / (v_far + v_near - clipSpaceDepth * (v_far - v_near));
    return linearDepth / v_far;
}

void main() {
    float t = -v_nearPoint.y / (v_farPoint.y - v_nearPoint.y);
    vec3 fragPos = v_nearPoint + t * (v_farPoint - v_nearPoint);
    gl_FragDepth = computeDepth(fragPos);
    
    float linearDepth = computeLinearDepth(fragPos);
    float linearFade = max(0.0, (0.5 - linearDepth));
    vec4 color = (grid(fragPos, 10.0) + grid(fragPos, 1.0)) * float(t > 0.0);
    color.a *= linearFade;
    gl_FragColor = color;
}`;

export class InfiniteGrid extends Mesh {
    constructor() {
        const geometry = new PlaneGeometry(2, 2, 1, 1);
        const material = new ShaderMaterial({
            side: DoubleSide,
            uniforms: {
            },
            depthTest: true,
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
