/**
 * @typedef ActiveAttributeInfo
 * @property {GLenum} type
 * @property {Number} length
 * @property {Number} location
 */

/**
 * Get list of parameter infos for all active attributes in the shader program.
 *
 * @param {WebGLRenderingContext} gl The webgl context.
 * @param {WebGLProgram} program The program to get the active attributes from.
 * @returns {Array<WebGLActiveInfo>} An array of active attributes.
 */
export function getActiveAttribs(gl, program) {
  let result = [];
  const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < attributeCount; ++i) {
    let attributeInfo = gl.getActiveAttrib(program, i);
    if (!attributeInfo) continue;
    result.push(attributeInfo);
  }
  return result;
}

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

    result[attributeName] = {
      type: attributeType,
      length: attributeSize,
      location: attributeLocation,
    };
  }
  return result;
}
