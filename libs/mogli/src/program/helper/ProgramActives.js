/**
 * Get list of parameter infos for all active uniforms in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The program to get the active uniforms from.
 * @returns {Array<WebGLActiveInfo>} An array of active uniforms.
 */
export function getActiveUniforms(gl, program) {
  let result = [];
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; ++i) {
    let uniformInfo = gl.getActiveUniform(program, i);
    if (!uniformInfo) break;
    result.push(uniformInfo);
  }
  return result;
}

/**
 * Get list of parameter infos for all active attributes in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
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
