import { isWebGL2Supported } from '../GLHelper.js';
import { getActiveAttribsInfo } from './ProgramAttributeInfo.js';
import { createShader, createShaderProgram } from './ProgramHelper.js';
import { getActiveUniformsInfo } from './ProgramUniformInfo.js';

/**
 * @typedef {import('../buffer/BufferInfoHelper.js').BufferInfo} BufferInfo
 * @typedef {import('../buffer/BufferInfoHelper.js').VertexArrayObjectInfo} VertexArrayObjectInfo
 */

/**
 * @typedef ProgramInfo
 * @property {WebGLProgram} handle
 * @property {Record<string, import('./ProgramUniformInfo.js').ActiveUniformInfo>} uniforms
 * @property {Record<string, import('./ProgramAttributeInfo.js').ActiveAttributeInfo>} attributes
 */

/**
 * Assumes all shaders already compiled and linked successfully.
 * 
 * @param {WebGLRenderingContextBase} gl 
 * @param {WebGLProgram} program
 * @returns {ProgramInfo}
 */
export function getProgramInfo(gl, program) {
    return {
        handle: program,
        attributes: getActiveAttribsInfo(gl, program),
        uniforms: getActiveUniformsInfo(gl, program),
    };
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {WebGLProgram} program
 * @param {Array<string>} shaderSources
 * @param {Array<GLenum>} [shaderTypes]
 * @returns {Promise<WebGLProgram>}
 */
export async function linkProgramShaders(gl, program, shaderSources, shaderTypes = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER]) {
    let index = 0;
    let shaders = [];
    for(let shaderSource of shaderSources) {
        if (index >= shaderTypes.length) {
            throw new Error('Missing shader type for shader source.');
        }
        let shaderType = shaderTypes[index++];
        let shader = createShader(gl, shaderType, shaderSource);
        shaders.push(shader);
    }
    await createShaderProgram(gl, program, shaders);
    return program;
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {ReturnType<getProgramInfo>} programInfo 
 * @param {BufferInfo|VertexArrayObjectInfo} bufferOrVertexArrayObjectInfo 
 */
export function bindProgramAttributes(gl, programInfo, bufferOrVertexArrayObjectInfo) {
    if ('handle' in bufferOrVertexArrayObjectInfo && bufferOrVertexArrayObjectInfo.handle instanceof WebGLVertexArrayObject) {
        if (!isWebGL2Supported(gl)) {
            throw new Error('Vertex array objects are only supported in WebGL 2.');
        }
        const gl2 = /** @type {WebGL2RenderingContext} */ (gl);
        let vaoInfo = /** @type {VertexArrayObjectInfo} */ (bufferOrVertexArrayObjectInfo);
        gl2.bindVertexArray(vaoInfo.handle);
    } else {
        let bufferInfo = /** @type {BufferInfo} */ (bufferOrVertexArrayObjectInfo);
        let attributeInfos = programInfo.attributes;
        for(let name in attributeInfos) {
            if (!(name in bufferInfo.attributes)) {
                throw new Error(`Missing buffer for attribute '${name}'.`);
            }
            let attrib = bufferInfo.attributes[name];
            let { location, set } = attributeInfos[attrib.name];
            set.call(gl, location, attrib.buffer, attrib.size, attrib.type, attrib.normalize, attrib.stride, attrib.offset, attrib.divisor);
        }
        if (bufferInfo.element) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.element.buffer);
        }
    }
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {ReturnType<getProgramInfo>} programInfo 
 * @param {Record<string, ?>} uniforms
 */
export function bindProgramUniforms(gl, programInfo, uniforms) {
    let uniformInfos = programInfo.uniforms;
    for(let name in uniforms) {
        let value = uniforms[name];
        let { location, set } = uniformInfos[name];
        set.call(gl, location, value);
    }
}
