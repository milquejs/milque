export * from './ProgramActives.js';

/**
 * Create and compile shader from source text.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {GLenum} shaderType The type of the shader. This is usually `gl.VERTEX_SHADER`
 * or `gl.FRAGMENT_SHADER`.
 * @param {string} shaderSource The shader source text.
 * @returns {WebGLShader} The compiled shader.
 */
export function createShader(gl, shaderType, shaderSource) {
  let shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!status) {
    let log = gl.getShaderInfoLog(shader) +
      `\nFailed to compile shader:\n${shaderSource}`;
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

/**
 * Link the given shader program from list of compiled shaders.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The shader program handle.
 * @param {Array<WebGLShader>} shaders The list of compiled shaders
 * to link in the program.
 * @returns {Promise<WebGLProgram>} The linked shader program.
 */
export async function createShaderProgram(gl, program, shaders) {
  // Attach to the program.
  for (let shader of shaders) {
    gl.attachShader(program, shader);
  }

  // Link'em!
  gl.linkProgram(program);

  // Might be async...
  const ext = gl.getExtension('KHR_parallel_shader_compile');
  if (ext) {
    const statusInterval = 1000 / 60;
    let result;
    do {
      await new Promise((resolve, _) => setTimeout(resolve, statusInterval));
      result = gl.getProgramParameter(program, ext.COMPLETION_STATUS_KHR);
    } while (!result);
  }

  // Don't forget to clean up the shaders! It's no longer needed.
  for (let shader of shaders) {
    gl.detachShader(program, shader);
    gl.deleteShader(shader);
  }

  let status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!status) {
    let log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

/**
 * Draw the currently bound render context.
 *
 * @param {WebGLRenderingContextBase} gl
 * @param {number} mode
 * @param {number} offset
 * @param {number} count
 * @param {WebGLBuffer} [elementBuffer]
 */
export function draw(gl, mode, offset, count, elementBuffer = undefined) {
  if (elementBuffer) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset);
  } else {
    gl.drawArrays(mode, offset, count);
  }
}

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 */
export function getProgramStatus(gl, program) {
  return {
    /** @type {GLboolean} */
    linkStatus: gl.getProgramParameter(program, gl.LINK_STATUS),
    /** @type {GLboolean} */
    deleteStatus: gl.getProgramParameter(program, gl.DELETE_STATUS),
    /** @type {GLboolean} */
    validateStatus: gl.getProgramParameter(program, gl.VALIDATE_STATUS),
    /** @type {string} */
    infoLog: gl.getProgramInfoLog(program),
  };
}
