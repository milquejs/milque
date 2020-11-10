import { getTypeInfo } from './GLTypeInfo.js';

/**
 * Creates a buffer source given the type and data.
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Number} type
 * @param {Array} data The buffer source data array.
 */
export function createBufferSource(gl, type, data)
{
    let { TypedArray } = getTypeInfo(gl, type);
    return new TypedArray(data);
}

/**
 * Creates a WebGL array buffer.
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Number} type 
 * @param {Array} data 
 * @param {Number} usage 
 */
export function createArrayBuffer(gl, type, data = [], usage = gl.STATIC_DRAW)
{
    const { TypedArray } = getTypeInfo(gl, type);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    if (data instanceof TypedArray)
    {
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    }
    else
    {
        gl.bufferData(gl.ARRAY_BUFFER, new TypedArray(data), usage);
    }
    return {
        handle: buffer,
        type,
        target: gl.ARRAY_BUFFER,
        length: data.length,
    };
}

/**
 * Creates a WebGL element array buffer.
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Array} data 
 * @param {Number} usage 
 */
export function createElementArrayBuffer(gl, data = [], usage = gl.STATIC_DRAW)
{
    const { TypedArray } = getTypeInfo(gl, gl.UNSIGNED_SHORT);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    if (data instanceof TypedArray)
    {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, usage);
    }
    else
    {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new TypedArray(data), usage);
    }
    return {
        handle: buffer,
        type: gl.UNSIGNED_SHORT,
        target: gl.ELEMENT_ARRAY_BUFFER,
        length: data.length,
    };
}

/**
 * Draw the currently bound render context.
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Number} mode 
 * @param {Number} offset 
 * @param {Number} count 
 * @param {WebGLBuffer} elementBuffer 
 */
export function draw(gl, mode, offset, count, elementBuffer = null)
{
    if (elementBuffer)
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset);
    }
    else
    {
        gl.drawArrays(mode, offset, count);
    }
}
