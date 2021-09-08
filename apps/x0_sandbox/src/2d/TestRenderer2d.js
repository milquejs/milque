import { ProgramHelper } from '@milque/mogli';
import { BufferHelper } from '@milque/mogli';
import { OrthographicCamera } from '@milque/scene';

/**
 * @typedef {import('@milque/mogli').ProgramInfo} ProgramInfo
 */

const VERTEX_SHADER_SOURCE = `#version 300 es

in vec2 a_position;

uniform mat4 u_projection;
uniform mat4 u_view;

void main()
{
    gl_Position = u_projection * u_view * vec4(a_position.xy, 0, 1);
}
`;
const FRAGMENT_SHADER_SOURCE = `#version 300 es

precision highp float;

out vec4 fragColor;

void main()
{
    fragColor = vec4(1, 0, 0.5, 1);
}
`;

export class TestRenderer2d
{
    constructor(gl)
    {
        this.gl = gl;
        this.camera = new OrthographicCamera();

        let vs = ProgramHelper.createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        let fs = ProgramHelper.createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        let program = ProgramHelper.createShaderProgram(gl, gl.createProgram(), [vs, fs]);
        let programInfo = ProgramHelper.getProgramInfo(gl, program);

        this.program = program;
        this.programInfo = programInfo;

        let positionData = BufferHelper.createBufferSource(gl, gl.FLOAT, [
            0, 0,
            0, 100,
            100, 0,
        ]);
        let positionBuffer = BufferHelper.createBuffer(gl, gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
        
        this.vao = createVertexArrayObject(gl, program);
        bindVertexAttribBuffer(gl, programInfo.activeAttributes.a_position.location, positionBuffer, 2, gl.FLOAT);
    }

    draw()
    {
        const gl = this.gl;
        let program = this.program;
        let programInfo = this.programInfo;
        let camera = this.camera;
        gl.useProgram(program);
        
        camera.resize(gl.canvas.width, gl.canvas.height);
        bindActiveUniform(gl, programInfo, 'u_projection', camera.projectionMatrix);
        bindActiveUniform(gl, programInfo, 'u_view', camera.viewMatrix);
        
        gl.bindVertexArray(this.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {ProgramInfo} programInfo 
 * @param {string} uniformName 
 * @param {Float32List|Int32List} value
 */
function bindActiveUniform(gl, programInfo, uniformName, value)
{
    let activeUniform = programInfo.activeUniforms[uniformName];
    activeUniform.set.call(gl, activeUniform.location, value);
}

/**
 * @param {WebGL2RenderingContextBase} gl 
 */
function createVertexArrayObject(gl, program)
{
    let handle = gl.createVertexArray();
    gl.useProgram(program);
    gl.bindVertexArray(handle);
    return handle;
}

function bindVertexAttribBuffer(gl, location, buffer, size, type, normalize = false, stride = 0, offset = 0)
{
    gl.enableVertexAttribArray(location);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
}
