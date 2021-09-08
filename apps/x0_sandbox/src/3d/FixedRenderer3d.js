import { BufferHelper, ProgramHelper } from '@milque/mogli';
import { createCube } from './primitive/index.js';
import { TransformStack } from '../2d/TransformStack.js';

const VERTEX_SHADER_SOURCE = `#version 300 es

in vec3 a_position;
in vec2 a_texcoord;
in vec3 a_normal;
in vec3 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

out vec2 v_texcoord;
out vec3 v_color;

void main()
{
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);

    v_color = a_color;
    v_texcoord = a_texcoord;
}
`;

const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;

in vec2 v_texcoord;
in vec3 v_color;

out vec4 out_color;

void main()
{
    out_color = vec4(v_color, 1.0);
}
`;

export class FixedRenderer3d
{
    /**
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(gl)
    {
        this.gl = gl;
        this.transform = new TransformStack();

        let vs = ProgramHelper.createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        let fs = ProgramHelper.createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        this.program = ProgramHelper.createShaderProgram(gl, gl.createProgram(), [vs, fs]);
        this.a_position = gl.getAttribLocation(this.program, 'a_position');
        this.a_texcoord = gl.getAttribLocation(this.program, 'a_texcoord');
        this.a_normal = gl.getAttribLocation(this.program, 'a_normal');
        this.a_color = gl.getAttribLocation(this.program, 'a_color');
        this.u_projection = gl.getUniformLocation(this.program, 'u_projection');
        this.u_view = gl.getUniformLocation(this.program, 'u_view');
        this.u_model = gl.getUniformLocation(this.program, 'u_model');

        this.mesh = createMesh(
            gl, createCube(), gl.createVertexArray(),
            this.a_position,
            this.a_texcoord,
            this.a_normal,
            this.a_color);
    }

    bindCameraMatrix(projectionMatrix, viewMatrix)
    {
        const gl = this.gl;
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.u_projection, false, projectionMatrix);
        gl.uniformMatrix4fv(this.u_view, false, viewMatrix);
    }

    drawCube()
    {
        const gl = this.gl;
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.u_model, false, this.transform.getTransformMatrix());
        gl.bindVertexArray(this.mesh.vao);
        gl.drawElements(gl.TRIANGLES, this.mesh.count, this.mesh.type, 0);
    }
}

function createMesh(gl, primitive, vao, positionLocation, texcoordLocation, normalLocation, colorLocation)
{
    let position = BufferHelper.createBufferFromArray(gl, gl.ARRAY_BUFFER, gl.FLOAT, primitive.position, gl.STATIC_DRAW);
    let texcoord = BufferHelper.createBufferFromArray(gl, gl.ARRAY_BUFFER, gl.FLOAT, primitive.texcoord, gl.STATIC_DRAW);
    let normal = BufferHelper.createBufferFromArray(gl, gl.ARRAY_BUFFER, gl.FLOAT, primitive.normal, gl.STATIC_DRAW);
    let color = BufferHelper.createBufferFromArray(gl, gl.ARRAY_BUFFER, gl.FLOAT, primitive.color, gl.STATIC_DRAW);
    let indices = BufferHelper.createBufferFromArray(gl, gl.ELEMENT_ARRAY_BUFFER, gl.UNSIGNED_SHORT, primitive.indices, gl.STATIC_DRAW);
    gl.bindVertexArray(vao);
    bindVertexAttribBuffer(gl, positionLocation, position, 3, gl.FLOAT, false, 0, 0);
    bindVertexAttribBuffer(gl, texcoordLocation, texcoord, 2, gl.FLOAT, false, 0, 0);
    bindVertexAttribBuffer(gl, normalLocation, normal, 3, gl.FLOAT, false, 0, 0);
    bindVertexAttribBuffer(gl, colorLocation, color, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
    return {
        vao,
        count: primitive.elementCount,
        type: gl.UNSIGNED_SHORT,
    };
}

function bindVertexAttribBuffer(gl, location, buffer, size, type, normalize = false, stride = 0, offset = 0)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {GLuint} location 
 * @param {boolean} force 
 */
function toggleVertexAttribBuffer(gl, location, force = !gl.getVertexAttrib(location, gl.VERTEX_ATTRIB_ARRAY_ENABLED))
{
    if (force)
    {
        gl.enableVertexAttribArray(location);
    }
    else
    {
        gl.disableVertexAttribArray(location);
    }
}
