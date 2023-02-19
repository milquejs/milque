import { isWebGL2Supported } from '../../GLHelper.js';
import { bindProgramAttributes } from '../../program/helper/ProgramInfoHelper.js';
import { getBufferTypeForBufferSource, getByteCountForBufferType, getTypedArrayForBufferType } from './BufferHelper.js';

/**
 * @typedef {WebGLBuffer|BufferSource|Array<number>} AttribBufferLike
 * 
 * @typedef ArrayAttribOption
 * @property {AttribBufferLike} buffer
 * @property {string} [name]
 * @property {number} [size]
 * @property {GLenum} [type]
 * @property {boolean} [normalize]
 * @property {number} [stride]
 * @property {number} [offset]
 * @property {number} [divisor]
 * @property {GLenum} [usage]
 * @property {number} [length]
 * 
 * @typedef ElementAttribOption
 * @property {AttribBufferLike} buffer
 * @property {GLenum} [type]
 * @property {GLenum} [usage]
 * @property {number} [length]
 * 
 * @typedef {ReturnType<createArrayAttrib>} ArrayAttrib
 * @typedef {ReturnType<createElementAttrib>} ElementAttrib
 * 
 * @typedef BufferInfo
 * @property {Record<string, ArrayAttrib>} attributes
 * @property {number} vertexCount
 * @property {ElementAttrib} element
 * 
 * @typedef VertexArrayObjectInfo
 * @property {WebGLVertexArrayObject} handle
 * @property {number} vertexCount
 * @property {ElementAttrib} element
 */

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {Record<string, ArrayAttribOption>} arrays 
 * @param {ElementAttribOption} [elementArray]
 * @returns {BufferInfo}
 */
export function createBufferInfo(gl, arrays, elementArray = undefined) {
    let attributes = createVertexAttributesInfo(/** @type {WebGLRenderingContext|WebGL2RenderingContext} */ (gl), arrays);
    let element = createElementAttributeInfo(/** @type {WebGLRenderingContext|WebGL2RenderingContext} */ (gl), elementArray);
    let vertexCount;
    if (element) {
        vertexCount = element.length;
    } else {
        let names = Object.keys(attributes);
        if (names.length > 0) {
            let a = attributes[names[0]];
            vertexCount = Math.trunc(a.length / a.size);
        } else {
            vertexCount = 0;
        }
    }
    return {
        attributes,
        element,
        vertexCount,
    };
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {BufferInfo} bufferInfo 
 * @param {Array<import('../../program/helper/ProgramInfoHelper.js').ProgramInfo>} programInfos
 * @returns {VertexArrayObjectInfo}
 */
export function createVertexArrayInfo(gl, bufferInfo, programInfos) {
    if (!isWebGL2Supported(gl)) {
        throw new Error('Vertex array objects is only supported on WebGL2.');
    }
    const gl2 = /** @type {WebGL2RenderingContext} */ (gl);
    let vao = gl2.createVertexArray();
    gl2.bindVertexArray(vao);
    for(let programInfo of programInfos) {
        bindProgramAttributes(gl2, programInfo, bufferInfo);
    }
    gl2.bindVertexArray(null);
    return {
        handle: vao,
        element: bufferInfo.element,
        vertexCount: bufferInfo.vertexCount,
    };
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {BufferInfo|VertexArrayObjectInfo} bufferOrVertexArrayObjectInfo 
 */
export function drawBufferInfo(gl, bufferOrVertexArrayObjectInfo, mode = gl.TRIANGLES, offset = 0, vertexCount = bufferOrVertexArrayObjectInfo.vertexCount, instanceCount = undefined) {
    let element = bufferOrVertexArrayObjectInfo.element;
    if (element) {
        let elementType = element.type;
        if (instanceCount !== undefined) {
            if (!isWebGL2Supported(gl)) {
                throw new Error('Instanced element drawing is only supported on WebGL2.');
            }
            const gl2 = /** @type {WebGL2RenderingContext} */ (gl);
            gl2.drawElementsInstanced(mode, vertexCount, elementType, offset, instanceCount);
        } else {
            gl.drawElements(mode, vertexCount, elementType, offset);
        }
    } else {
        if (instanceCount !== undefined) {
            if (!isWebGL2Supported(gl)) {
                throw new Error('Instanced array drawing is only supported on WebGL2.');
            }
            const gl2 = /** @type {WebGL2RenderingContext} */ (gl);
            gl2.drawArraysInstanced(mode, offset, vertexCount, instanceCount);
        } else {
            gl.drawArrays(mode, offset, vertexCount);
        }
    }
}

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl 
 * @param {ElementAttribOption} elementArray 
 * @returns {ElementAttrib}
 */
function createElementAttributeInfo(gl, elementArray = undefined) {
    if (!elementArray) {
        return null;
    }
    if (typeof elementArray !== 'object') {
        throw new Error('Element attribute options must be an object.');
    }
    let {
        type = gl.UNSIGNED_SHORT,
        buffer,
        usage = gl.STATIC_DRAW,
        length,
    } = /** @type {ElementAttribOption} */ (elementArray);

    // Resolve buffer.
    if (buffer instanceof WebGLBuffer) {
        // Do nothing :)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    } else if (ArrayBuffer.isView(buffer)) {
        /** @type {BufferSource} */
        let srcData = buffer;
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, srcData, usage);
        if (type === undefined) {
            type = getBufferTypeForBufferSource(gl, srcData);
        }
        if (length === undefined) {
            // @ts-ignore
            length = srcData.length;
        }
    } else if (Array.isArray(buffer)) {
        /** @type {Array<number>} */
        let array = buffer;
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), usage);
        if (length === undefined) {
            length = array.length;
        }
    } else if (typeof buffer === 'number') {
        let size = buffer;
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, size, usage);
        if (length === undefined) {
            length = size;
        }
    } else {
        throw new Error('Invalid buffer for element attribute options.');
    }

    // Resolve type.
    if (type === undefined) {
        type = gl.UNSIGNED_SHORT;
    }

    // Resolve length.
    if (length === undefined) {
        let bytes = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE);
        length = Math.trunc(bytes / getByteCountForBufferType(gl, type));
    }

    return createElementAttrib(buffer, type, length);
}

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl 
 * @param {Record<string, ArrayAttribOption>} arrays
 * @returns {Record<string, ArrayAttrib>}
 */
function createVertexAttributesInfo(gl, arrays) {
    /** @type {Record<string, ArrayAttrib>} */
    let result = {};
    for(let key of Object.keys(arrays)) {
        let array = arrays[key];
        if (!array) {
            continue;
        }
        if (typeof array !== 'object') {
            throw new Error('Array attribute options must be an object.');
        }
        let {
            name = key,
            buffer,
            size = 3,
            type,
            normalize = false,
            stride = 0,
            offset = 0,
            divisor = undefined,
            usage = gl.STATIC_DRAW,
            length,
        } = /** @type {ArrayAttribOption} */ (array);

        // Resolve buffer.
        if (buffer instanceof WebGLBuffer) {
            // Do nothing :)
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        } else if (ArrayBuffer.isView(buffer)) {
            /** @type {BufferSource} */
            let srcData = buffer;
            buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, srcData, usage);
            if (type === undefined) {
                type = getBufferTypeForBufferSource(gl, srcData);
            }
            if (length === undefined) {
                // @ts-ignore
                length = srcData.length;
            }
        } else if (Array.isArray(buffer)) {
            /** @type {Array<number>} */
            let array = buffer;
            if (type === undefined) {
                type = gl.FLOAT;
            }
            if (length === undefined) {
                length = array.length;
            }
            buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            let TypedArray = getTypedArrayForBufferType(gl, type);
            gl.bufferData(gl.ARRAY_BUFFER, new TypedArray(array), usage);
        } else if (typeof buffer === 'number') {
            let size = buffer;
            buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, size, usage);
            if (length === undefined) {
                length = size;
            }
        } else {
            throw new Error(`Invalid buffer '${buffer}' for array attribute options.`);
        }

        // Resolve type.
        if (type === undefined) {
            type = gl.FLOAT;
        }

        // Resolve length.
        if (length === undefined) {
            let bytes = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
            length = Math.trunc(bytes / getByteCountForBufferType(gl, type));
        }

        // Resolve size.
        if (size === undefined) {
            size = tryVertexSize(name, length);
        }
        
        result[name] = createArrayAttrib(name, buffer, length, size, type, normalize, stride, offset, divisor);
    }
    return result;
}

/**
 * @param {string} attribName 
 * @param {number} arrayLength 
 */
function tryVertexSize(attribName, arrayLength) {
    let result;
    if (attribName.includes('texcoord')) {
        result = 2;
    } else if (attribName.includes('color')) {
        result = 4;
    } else {
        result = 3;
    }
    if (arrayLength % result !== 0) {
        throw new Error(`Could not determine vertex size - guessed ${result} but array length ${arrayLength} is not evenly divisible.`);
    }
    return result;
}

/**
 * @param {WebGLBuffer} buffer 
 * @param {GLenum} type 
 * @param {number} length
 */
function createElementAttrib(buffer, type, length) {
    return {
        buffer,
        type,
        length,
    };
}

/**
 * @param {string} name 
 * @param {WebGLBuffer} buffer 
 * @param {number} length
 * @param {number} size 
 * @param {GLenum} type 
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 */
function createArrayAttrib(name, buffer, length, size, type, normalize, stride, offset, divisor) {
    return {
        name,
        buffer,
        length,
        size,
        type,
        normalize,
        stride,
        offset,
        divisor,
    };
}
