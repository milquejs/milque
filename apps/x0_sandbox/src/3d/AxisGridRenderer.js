// SOURCE: https://github.com/martin-pr/possumwood/wiki/Infinite-ground-plane-using-GLSL-shaders

import { ProgramHelper } from '@milque/mogli';

const VERTEX_SHADER_SOURCE = `#version 300 es

uniform mat4 u_projection;
uniform mat4 u_view;
uniform float u_grid_near;
uniform float u_grid_far;

out mat4 v_projection;
out mat4 v_view;
out float v_grid_near;
out float v_grid_far;

out vec3 v_near_point;
out vec3 v_far_point;
out float v_grid_depth;
out vec3 v_eye;

vec3 quad[6] = vec3[](
    vec3(1.0, 1.0, 0.0), vec3(-1.0, -1.0, 0.0), vec3(-1.0, 1.0, 0.0),
    vec3(-1.0, -1.0, 0.0), vec3(1.0, 1.0, 0.0), vec3(1.0, -1.0, 0.0));

vec3 unproject(vec3 point, mat4 inverseProjection, mat4 inverseView)
{
    vec4 unproj = inverseView * inverseProjection * vec4(point, 1.0);
    return unproj.xyz / unproj.w;
}

void main()
{
    vec4 point = vec4(quad[gl_VertexID], 1.0);

    gl_Position = point;
    v_projection = u_projection;
    v_view = u_view;
    v_grid_near = u_grid_near;
    v_grid_far = u_grid_far;

    mat4 iproj = inverse(u_projection);
    mat4 iview = inverse(u_view);
    v_near_point = unproject(vec3(point.xy, 0.0), iproj, iview);
    v_far_point = unproject(vec3(point.xy, 1.0), iproj, iview);

    vec4 eye = iview * vec4(0.0, 0.0, 0.0, 1.0);
    v_grid_depth = eye.y;
    v_eye = eye.xyz;
}
`;
const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;

vec3 GRID_COLOR = vec3(0.6, 0.6, 0.6);
vec3 XAXIS_COLOR = vec3(0.0, 0.0, 1.0);
vec3 ZAXIS_COLOR = vec3(1.0, 0.0, 0.0);

in mat4 v_projection;
in mat4 v_view;
in float v_grid_near;
in float v_grid_far;

in vec3 v_near_point;
in vec3 v_far_point;
in float v_grid_depth;
in vec3 v_eye;

out vec4 out_color;

vec4 computeGrid(vec3 fragPos, float coordSize)
{
    vec2 coord = fragPos.xz / coordSize;
    vec2 dcoord = fwidth(coord);
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / dcoord;
    float line = min(grid.x, grid.y);
    float mx = min(dcoord.x, 1.0);
    float mz = min(dcoord.y, 1.0);
    float g = 1.0 - min(line, 1.0);
    if (g <= 0.0) return vec4(0.0);
    if (abs(fragPos.x) < mx * coordSize) return vec4(ZAXIS_COLOR, g);
    if (abs(fragPos.z) < mz * coordSize) return vec4(XAXIS_COLOR, g);
    return vec4(GRID_COLOR, g);
}

float computeDepth(vec3 fragPos)
{
    float near = gl_DepthRange.near;
    float far = gl_DepthRange.far;
    vec4 clipPos = v_projection * v_view * vec4(fragPos, 1.0);
    float clipDepth = clipPos.z / clipPos.w;
    float depth = (((far - near) * clipDepth) + near + far) / 2.0;
    return depth;
}

void main()
{
    float t = -v_near_point.y / (v_far_point.y - v_near_point.y);
    if (t <= 0.0) discard;
    vec3 point = v_near_point + t * (v_far_point - v_near_point);
    
    // HACK: Do magic for smooth cell size transition on screen.
    float depthRatio = pow(abs(v_grid_depth), 0.5) / 7.0;

    float gridSize = 1.0 * pow(10.0, floor(depthRatio));
    vec4 gridColor = computeGrid(point, gridSize);
    if (gridColor.a <= 0.0) discard;

    // HACK: Do magic for a nice fade distance.
    float eyeDist = max(v_grid_near, distance(v_eye.xz, point.xz)) / min(v_grid_far, pow(10.0, depthRatio) * 30.0);
    
    // Color it.
    float alpha = mod(depthRatio, 1.0);
    vec4 superGridColor = computeGrid(point, gridSize * 10.0);
    gridColor = mix(gridColor, superGridColor, alpha);

    // Fade it.
    gridColor.a -= eyeDist;
    if (gridColor.a <= 0.0) discard;

    // Depth it.
    float gridDepth = computeDepth(point);
    
    out_color = gridColor;
    gl_FragDepth = gridDepth;
}
`;

export class AxisGridRenderer
{
    /**
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(gl)
    {
        this.gl = gl;

        let vs = ProgramHelper.createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        let fs = ProgramHelper.createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        this.program = ProgramHelper.createShaderProgram(gl, gl.createProgram(), [vs, fs]);
        this.u_projection = gl.getUniformLocation(this.program, 'u_projection');
        this.u_view = gl.getUniformLocation(this.program, 'u_view');
        this.u_grid_near = gl.getUniformLocation(this.program, 'u_grid_near');
        this.u_grid_far = gl.getUniformLocation(this.program, 'u_grid_far');
    }

    bindCameraMatrix(projectionMatrix, viewMatrix)
    {
        const gl = this.gl;
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.u_projection, false, projectionMatrix);
        gl.uniformMatrix4fv(this.u_view, false, viewMatrix);
    }

    bindClippingPlane(nearDepth, farDepth)
    {
        const gl = this.gl;
        gl.useProgram(this.program);
        gl.uniform1f(this.u_grid_near, nearDepth);
        gl.uniform1f(this.u_grid_far, farDepth);
    }

    drawAxisGrid()
    {
        const gl = this.gl;
        gl.useProgram(this.program);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}
