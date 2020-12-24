/**
 * Creates a buffer source given the type and data.
 * 
 * @param {WebGLRenderingContext} gl The gl context.
 * @param {GLenum} type The data type of the elements in the buffer. Usually,
 * this is `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
 * array buffers.
 * @param {Array} data The buffer source data array.
 * @returns {BufferSource} The typed array buffer containing the given data.
 */
export function createBufferSource(gl, type, data)
{
    const TypedArray = getBufferTypedArray(gl, type);
    return new TypedArray(data);
}

export function getBufferTypedArray(gl, bufferType)
{
    // NOTE: For WebGL2, gl.HALF_FLOAT (float16) does not have an associated TypedArray.
    switch(bufferType)
    {
        case gl.BYTE: return Int8Array;
        case gl.UNSIGNED_BYTE: return Uint8Array;
        case gl.SHORT: return Int16Array;
        case gl.UNSIGNED_SHORT: return Uint16Array;
        case gl.FLOAT:
        default:
            return Float32Array;
    }
}
