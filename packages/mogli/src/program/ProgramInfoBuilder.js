import { ProgramBuilder } from './ProgramBuilder.js';
import { ProgramInfo } from './ProgramInfo.js';

export class ProgramInfoBuilder {
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {WebGLProgram} [program]
   */
  constructor(gl, program = undefined) {
    /** @private */
    this.programBuilder = new ProgramBuilder(gl, program);
  }

  get gl() {
    return this.programBuilder.gl;
  }

  get handle() {
    return this.programBuilder.handle;
  }

  get shaders() {
    return this.programBuilder.shaders;
  }

  /**
   * @param {GLenum} shaderType
   * @param {string} shaderSource
   * @returns {ProgramInfoBuilder}
   */
  shader(shaderType, shaderSource) {
    this.programBuilder.shader(shaderType, shaderSource);
    return this;
  }

  /**
   * @returns {ProgramInfo}
   */
  link() {
    const handle = this.programBuilder.link();
    return new ProgramInfo(this.gl, handle);
  }
}
