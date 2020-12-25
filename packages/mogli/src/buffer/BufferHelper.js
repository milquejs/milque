/**
 * Creates a buffer source given the type and data.
 * 
 * @param {WebGLRenderingContext} gl The gl context.
 * @param {GLenum} type The data type of the elements in the buffer. Usually,
 * this is `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
 * array buffers. It must be either `gl.BYTE`, `gl.UNSIGNED_BYTE`, `gl.SHORT`,
 * `gl.UNSIGNED_SHORT`, `gl.FLOAT`, or `gl.HALF_FLOAT` for WebGL2.
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
        case gl.INT: return Int32Array;
        case gl.UNSIGNED_INT: return Uint32Array;
        case gl.FLOAT: return Float32Array;
        default: throw new Error('Cannot find valid typed array for buffer type.');
    }
}

export function getTypedArrayBufferType(gl, typedArray)
{
    // NOTE: For WebGL2, gl.HALF_FLOAT (float16) does not have an associated TypedArray.
    switch(typedArray)
    {
        case Int8Array: return gl.BYTE;
        case Uint8Array: return gl.UNSIGNED_BYTE;
        case Int16Array: return gl.SHORT;
        case Uint16Array: return gl.UNSIGNED_SHORT;
        case Int32Array: return gl.INT;
        case Uint32Array: return gl.UNSIGNED_INT;
        case Float32Array: return gl.FLOAT;
        default: throw new Error('Cannot find valid buffer type for typed array.');
    }
}

export function getBufferUsage(gl, target, buffer)
{
    gl.bindBuffer(target, buffer);
    return gl.getBufferParameter(target, gl.BUFFER_USAGE);
}
