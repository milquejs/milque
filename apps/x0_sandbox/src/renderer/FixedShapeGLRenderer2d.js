import { mat4, quat, vec3 } from 'gl-matrix';
import { OrthographicCamera } from '@milque/scene';
import { BufferHelper, BufferInfo, ProgramInfo } from '@milque/mogli';

import { hex } from './color.js';
import { FixedGLRenderer2d } from './FixedGLRenderer2d.js';

const WEBGL_VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;

uniform mat4 u_projection_view;
uniform mat4 u_model;

void main()
{
    gl_Position = u_projection_view * u_model * vec4(a_position.xy, 0.0, 1.0);
}`;

const WEBGL_FRAGMENT_SHADER_SOURCE = `
precision mediump float;

uniform vec3 u_color;

void main()
{
    gl_FragColor = vec4(u_color.rgb, 1.0);
}`;

const CIRCLE_ITERATIONS = 16;
const CIRCLE_VERTICES = (() => {
    let result = [];
    let iterations = CIRCLE_ITERATIONS;
    let rads = Math.PI * 2 / iterations;
    let prevX = 1, prevY = 0;
    let nextX, nextY;
    for(let i = 0; i <= iterations; ++i)
    {
        nextX = Math.cos(i * rads);
        nextY = Math.sin(i * rads);
        result.push(0, 0);
        result.push(prevX, prevY);
        result.push(nextX, nextY);
        prevX = nextX;
        prevY = nextY;
    }
    return result;
})();
const CIRCLE_VERTEX_COUNT = Math.trunc(CIRCLE_VERTICES.length / 2);
const LINE_CIRCLE_VERTICES = (() => {
    let result = [];
    let iterations = CIRCLE_ITERATIONS;
    let rads = Math.PI * 2 / iterations;
    let prevX = 1, prevY = 0;
    let nextX, nextY;
    for(let i = 0; i <= iterations; ++i)
    {
        nextX = Math.cos(i * rads);
        nextY = Math.sin(i * rads);
        result.push(prevX, prevY);
        result.push(nextX, nextY);
        prevX = nextX;
        prevY = nextY;
    }
    return result;
})();
const LINE_CIRCLE_VERTEX_COUNT = Math.trunc(LINE_CIRCLE_VERTICES.length / 2);
const QUAD_VERTICES = [
    // Top-Left
    0, 0,
    1, 0,
    0, 1,
    // Bottom-Right
    1, 1,
    1, 0,
    0, 1,
];
const LINE_VERTICES = [
    0, 0,
    1, 1,
];

export class FixedShapeGLRenderer2d extends FixedGLRenderer2d
{
    constructor(canvas)
    {
        super(canvas);
        const gl = this.gl;
        gl.enable(gl.DEPTH_TEST);
        /**
         * @protected
         * @type {ProgramInfo}
         */
        this.program = ProgramInfo.builder(gl)
            .shader(gl.VERTEX_SHADER, WEBGL_VERTEX_SHADER_SOURCE)
            .shader(gl.FRAGMENT_SHADER, WEBGL_FRAGMENT_SHADER_SOURCE)
            .link();
        /**
         * @protected
         * @type {BufferInfo}
         */
        this.meshQuad = BufferInfo.builder(gl, gl.ARRAY_BUFFER)
            .data(BufferHelper.createBufferSource(gl, gl.FLOAT, QUAD_VERTICES))
            .build();
        /**
         * @protected
         * @type {BufferInfo}
         */
        this.meshLine = BufferInfo.builder(gl, gl.ARRAY_BUFFER)
            .data(BufferHelper.createBufferSource(gl, gl.FLOAT, LINE_VERTICES))
            .build();
        /**
         * @protected
         * @type {BufferInfo}
         */
        this.meshCircle = BufferInfo.builder(gl, gl.ARRAY_BUFFER)
            .data(BufferHelper.createBufferSource(gl, gl.FLOAT, CIRCLE_VERTICES))
            .build();
        /**
         * @protected
         * @type {BufferInfo}
         */
        this.meshLineCircle = BufferInfo.builder(gl, gl.ARRAY_BUFFER)
            .data(BufferHelper.createBufferSource(gl, gl.FLOAT, LINE_CIRCLE_VERTICES))
            .build();
        /** @protected */
        this.camera = new OrthographicCamera();
        /** @protected */
        this.projectionViewMatrix = mat4.create();
        /** @protected */
        this.modelMatrix = mat4.create();
        /** @protected */
        this.shapeColor = vec3.create();
        /** @protected */
        this.shapeDepth = 0;
    }

    prepare()
    {
        this.resetTransform();
        this.resize();
        this.clear();
        this.color(0xFFFFFF);
        this.zLevel(0);
    }

    resize()
    {
        const gl = this.gl;
        const viewportWidth = gl.canvas.width;
        const viewportHeight = gl.canvas.height;

        gl.viewport(0, 0, viewportWidth, viewportHeight);

        let camera = this.camera;
        camera.resize(viewportWidth, viewportHeight);

        let projViewMatrix = this.projectionViewMatrix;
        mat4.mul(projViewMatrix,
            camera.projectionMatrix,
            camera.viewMatrix);

        // Set the projection view matrix
        let program = this.program;
        program.bind(gl).uniform('u_projection_view', projViewMatrix);
    }

    clear(color = 0x000000)
    {
        const gl = this.gl;
        gl.clearColor(
            hex.redf(color), hex.greenf(color),
            hex.bluef(color), hex.alphaf(color));
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.resetTransform();
    }

    color(color = 0xFFFFFF)
    {
        const gl = this.gl;
        let program = this.program;
        let colorVector = this.shapeColor;
        vec3.set(colorVector,
            hex.redf(color),
            hex.greenf(color),
            hex.bluef(color));
        // Set the shape color vector
        program.bind(gl).uniform('u_color', colorVector);
        return this;
    }

    zLevel(level = 0)
    {
        this.shapeDepth = level;
        return this;
    }

    line(x1 = 0, y1 = 0, x2 = x1 + 16, y2 = y1)
    {
        const gl = this.gl;
        let z = this.shapeDepth;
        let dx = x2 - x1;
        let dy = y2 - y1;
        let program = this.program;
        let modelMatrix = this.modelMatrix;
        mat4.fromTranslation(modelMatrix, vec3.fromValues(x1, y1, z));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(dx, dy, 1));
        let transformationMatrix = this.peekTransform();
        if (transformationMatrix)
        {
            mat4.mul(modelMatrix, transformationMatrix, modelMatrix);
        }
        program.bind(gl)
            .attribute('a_position', gl.FLOAT, this.meshLine.handle)
            .uniform('u_model', modelMatrix)
            .draw(gl, gl.LINES, 0, 2);
        return this;
    }

    ray(x = 0, y = 0, angle = 0, length = 16)
    {
        let radians = Math.PI * angle / 180;
        return this.line(x, y, x + Math.cos(radians) * length, y + Math.sin(radians) * length);
    }

    lineBox(x = 0, y = 0, rx = 8, ry = 8, angle = 0)
    {
        const gl = this.gl;
        drawBox(gl, this.program, this.meshQuad,
            this.peekTransform(),
            this.modelMatrix, gl.LINE_LOOP,
            x, y, this.shapeDepth, rx, ry, angle);
        return this;
    }

    lineRect(x = 0, y = 0, w = 16, h = 16, angle = 0)
    {
        return this.lineBox(x, y, w / 2, h / 2, angle);
    }

    box(x = 0, y = 0, rx = 8, ry = rx, angle = 0)
    {
        const gl = this.gl;
        drawBox(gl, this.program, this.meshQuad,
            this.peekTransform(),
            this.modelMatrix, gl.TRIANGLES,
            x, y, this.shapeDepth, rx, ry, angle);
        return this;
    }

    rect(x = 0, y = 0, w = 16, h = w, angle = 0)
    {
        let rx = w / 2;
        let ry = h / 2;
        return this.box(x - rx, y - ry, rx, ry, angle);
    }

    circle(x = 0, y = 0, r = 8)
    {
        const gl = this.gl;
        drawCircle(gl, this.program, this.meshCircle, CIRCLE_VERTEX_COUNT,
            this.peekTransform(),
            this.modelMatrix, gl.TRIANGLES, x, y, this.shapeDepth, r);
    }

    lineCircle(x = 0, y = 0, r = 0)
    {
        const gl = this.gl;
        drawCircle(gl, this.program, this.meshLineCircle, LINE_CIRCLE_VERTEX_COUNT,
            this.peekTransform(),
            this.modelMatrix, gl.LINE_LOOP, x, y, this.shapeDepth, r);
    }
}

function drawBox(
    gl, program, mesh, transformationMatrix, modelMatrix,
    drawMode, x, y, z, rx, ry, angle)
{
    mat4.fromRotationTranslationScaleOrigin(modelMatrix,
        quat.fromEuler(quat.create(), 0, 0, angle),
        vec3.fromValues(x, y, z),
        vec3.fromValues(rx * 2, ry * 2, 1),
        vec3.fromValues(0.5, 0.5, 0));
    if (transformationMatrix)
    {
        mat4.mul(modelMatrix, transformationMatrix, modelMatrix);
    }
    program.bind(gl)
        .attribute('a_position', gl.FLOAT, mesh.handle)
        .uniform('u_model', modelMatrix)
        .draw(gl, drawMode, 0, 6);
}

function drawCircle(
    gl, program, mesh, vertexCount, transformationMatrix,
    modelMatrix, drawMode, x, y, z, r)
{
    mat4.fromRotationTranslationScale(modelMatrix,
        quat.fromEuler(quat.create(), 0, 0, 0),
        vec3.fromValues(x, y, z),
        vec3.fromValues(r, r, 1));
    if (transformationMatrix)
    {
        mat4.mul(modelMatrix, transformationMatrix, modelMatrix);
    }
    program.bind(gl)
        .attribute('a_position', gl.FLOAT, mesh.handle)
        .uniform('u_model', modelMatrix)
        .draw(gl, drawMode, 0, vertexCount);
}
