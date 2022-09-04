import { getUniformFunction } from './ProgramUniformFunctions.js';
import { getActiveUniforms } from './ProgramActives.js';

/**
 * @typedef {import('./ProgramUniformFunctions').UniformFunction} UniformFunction
 */

/**
 * @typedef ActiveUniformInfo
 * @property {number} type
 * @property {number} length
 * @property {WebGLUniformLocation} location
 * @property {UniformFunction} set
 */

/**
 * Get map of all active uniforms to their info in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The program to get active uniforms from.
 * @returns {Record<string, ActiveUniformInfo>} An object mapping of uniform names to info.
 */
export function getActiveUniformsInfo(gl, program) {
  /** @type {Record<string, ActiveUniformInfo>} */
  let result = {};
  const activeUniforms = getActiveUniforms(gl, program);
  for (let activeInfo of activeUniforms) {
    const uniformName = activeInfo.name;
    const uniformSize = activeInfo.size;
    const uniformType = activeInfo.type;
    const uniformLocation = gl.getUniformLocation(program, uniformName);
    const uniformSet = getUniformFunction(gl, uniformType);
    result[uniformName] = {
      type: uniformType,
      length: uniformSize,
      location: uniformLocation,
      set: uniformSet,
    };
  }
  return result;
}
