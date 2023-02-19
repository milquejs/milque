import { createShader, createShaderProgram } from './helper/ProgramHelper.js';

export class ProgramBuilder {
  /**
   * @param {WebGLRenderingContextBase} gl
   * @param {WebGLProgram} [program]
   */
  constructor(gl, program = undefined) {
    this.handle = program || gl.createProgram();
    this.shaders = [];
    /** @type {WebGLRenderingContextBase} */
    this.gl = gl;
  }

  /**
   * @param {GLenum} shaderType
   * @param {string} shaderSource
   * @returns {ProgramBuilder}
   */
  shader(shaderType, shaderSource) {
    const gl = this.gl;
    let shader = createShader(gl, shaderType, shaderSource);
    this.shaders.push(shader);
    return this;
  }

  /**
   * @returns {WebGLProgram}
   */
  link() {
    const gl = this.gl;
    createShaderProgram(gl, this.handle, this.shaders);
    this.shaders.length = 0;
    return this.handle;
  }
}
