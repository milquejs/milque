import { getUniformFunction, getUniformFunctionForArray } from './ProgramUniformFunctions.js';
import { getActiveUniforms } from './ProgramHelper.js';

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
            uniformSet = getUniformFunctionForArray(gl, uniformType);
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
