import { getUniformFunction, getUniformArrayFunction } from './UniformTypeInfo.js';

/**
 * @typedef {import('./UniformTypeInfo.js').UniformFunction} UniformFunction
 */
 
/**
 * @typedef ActiveUniformInfo
 * @property {String} type
 * @property {Number} length
 * @property {Number} location
 * @property {UniformFunction} set
 */

/**
 * Get list of parameter infos for all active uniforms in the shader program.
 * 
 * @param {WebGLRenderingContext} gl The webgl context.
 * @param {WebGLProgram} program The program to get the active uniforms from.
 * @returns {Array<WebGLActiveInfo>} An array of active uniforms.
 */
export function getActiveUniforms(gl, program)
{
    let result = [];
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for(let i = 0; i < uniformCount; ++i)
    {
        let uniformInfo = gl.getActiveUniform(program, i);
        if (!uniformInfo) break;
        result.push(uniformInfo);
    }
    return result;
}

/**
 * Get map of all active uniforms to their info in the shader program.
 * 
 * @param {WebGLRenderingContext} gl The webgl context.
 * @param {WebGLProgram} program The program to get active uniforms from.
 * @returns {Record<String, ActiveUniformInfo>} An object mapping of uniform names to info.
 */
export function getActiveUniformsInfo(gl, program)
{
    let result = {};
    const activeUniforms = getActiveUniforms(gl, program);
    for(let activeInfo of activeUniforms)
    {
        const uniformName = activeInfo.name;
        const uniformSize = activeInfo.size;
        const uniformType = activeInfo.type;

        const uniformLocation = gl.getUniformLocation(program, uniformName);

        let uniformSet;
        if (uniformSize <= 1)
        {
            // Is a single value uniform
            uniformSet = getUniformFunction(gl, uniformType);
        }
        else
        {
            // Is an array uniform
            uniformSet = getUniformArrayFunction(gl, uniformType);
        }

        result[uniformName] = {
            type: uniformType,
            length: uniformSize,
            location: uniformLocation,
            set: uniformSet,
        };
    }
    return result;
}
