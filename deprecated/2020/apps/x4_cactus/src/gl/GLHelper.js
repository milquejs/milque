import { getTypeInfo } from './GLTypeInfo.js';

/**
 * Creates a buffer source given the type and data.
 * 
 * @param {WebGLRenderingContext} gl The gl context.
 * @param {Number} type The data type of the elements in the buffer. Usually,
 * this is `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
 * array buffers.
 * @param {Array} data The buffer source data array.
 * @returns {BufferSource} The typed array buffer containing the given data.
 */
export function createBufferSource(gl, type, data)
{
    let { TypedArray } = getTypeInfo(gl, type);
    return new TypedArray(data);
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
