import { createShader, createShaderProgram } from './ProgramHelper.js';

export class ProgramBuilder
{
    static from(gl, program = undefined)
    {
        return new ProgramBuilder(gl, program);
    }

    constructor(gl, program = undefined)
    {
        this.handle = program || gl.createProgram();
        this.shaders = [];
        this.gl = gl;
    }

    shader(shaderType, shaderSource)
    {
        const gl = this.gl;
        let shader = createShader(gl, shaderType, shaderSource);
        this.shaders.push(shader);
        return this;
    }

    link()
    {
        const gl = this.gl;
        createShaderProgram(gl, this.handle, this.shaders);
        this.shaders.length = 0;
        return this.handle;
    }
}
