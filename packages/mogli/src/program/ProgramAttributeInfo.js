import { getAttribVertexSize } from './ProgramAttributeHelper.js';
import { getActiveAttribs } from './ProgramActives.js';

/**
 * @typedef ActiveAttributeInfo
 * @property {GLenum} type
 * @property {Number} length
 * @property {Number} location
 */

/**
 * Get map of all active uniforms to their info in the shader program.
 *
 * @param {WebGLRenderingContext} gl The webgl context.
 * @param {WebGLProgram} program The program to get active attributes from.
 * @returns {Record<String, ActiveAttributeInfo>} An object mapping of attribute names to info.
 */
export function getActiveAttribsInfo(gl, program) {
  let result = {};
  const attributeInfos = getActiveAttribs(gl, program);
  for (let attributeInfo of attributeInfos) {
    const attributeName = attributeInfo.name;
    const attributeSize = attributeInfo.size;
    const attributeType = attributeInfo.type;
    const attributeLocation = gl.getAttribLocation(program, attributeName);
    const attributeComponents = getAttribVertexSize(gl, attributeType);

    result[attributeName] = {
      type: attributeType,
      length: attributeSize,
      location: attributeLocation,
      size: attributeComponents,
    };
  }
  return result;
}
