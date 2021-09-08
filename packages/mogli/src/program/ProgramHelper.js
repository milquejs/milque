import { getActiveAttribsInfo } from './ProgramAttributeInfo.js';
import { getActiveUniformsInfo } from './ProgramUniformInfo.js';

export * from './ProgramActives.js';

/**
 * @typedef ProgramInfo
 * @property {WebGLProgram} handle
 * @property {boolean} linkStatus
 * @property {boolean} deleteStatus
 * @property {boolean} validateStatus
 * @property {Record<string, ActiveUniformInfo>} activeUniforms
 * @property {Record<string, ActiveAttributeInfo>} activeAttributes
 */

/**
 * Create and compile shader from source text.
 * 
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {GLenum} type The type of the shader. This is usually `gl.VERTEX_SHADER`
 * or `gl.FRAGMENT_SHADER`.
 * @param {string} shaderSource The shader source text.
 * @returns {WebGLShader} The compiled shader.
 */
export function createShader(gl, shaderType, shaderSource)
{
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!status)
    {
        let infoLog = gl.getShaderInfoLog(shader)
            + `\nFailed to compile shader:\n${shaderSource}`;
        gl.deleteShader(shader);
        throw new Error(infoLog);
    }
    return shader;
}

/**
 * Link the given shader program from list of compiled shaders.
 * 
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The type of the shader.
 * This is usually `gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`.
 * @param {Array<WebGLShader>} shaders The list of compiled shaders
 * to link in the program.
 * @returns {WebGLProgram} The linked shader program.
 */
export function createShaderProgram(gl, program, shaders)
{
    // Attach to the program.
    for(let shader of shaders)
    {
        gl.attachShader(program, shader);
    }

    // Link'em!
    gl.linkProgram(program);

    // Don't forget to clean up the shaders! It's no longer needed.
    for(let shader of shaders)
    {
        gl.detachShader(program, shader);
        gl.deleteShader(shader);
    }

    let status = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!status)
    {
        let infoLog = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(infoLog);
    }
    return program;
}

/**
 * Get additional info about the target program. The program does not need to be currently bound.
 * 
 * @param {WebGLRenderingContextBase} gl 
 * @param {WebGLProgram} program 
 * @returns {ProgramInfo}
 */
export function getProgramInfo(gl, program)
{
    return {
        handle: program,
        /** @type {GLboolean} */
        linkStatus: gl.getProgramParameter(program, gl.LINK_STATUS),
        /** @type {GLboolean} */
        deleteStatus: gl.getProgramParameter(program, gl.DELETE_STATUS),
        /** @type {GLboolean} */
        validateStatus: gl.getProgramParameter(program, gl.VALIDATE_STATUS),
        /** @type {string} */
        validationLog: gl.getProgramInfoLog(program),
        activeUniforms: getActiveUniformsInfo(gl, program),
        activeAttributes: getActiveAttribsInfo(gl, program),
    };
}
