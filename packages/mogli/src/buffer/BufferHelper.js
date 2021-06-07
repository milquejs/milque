/**
 * Creates a buffer source given the type and data.
 * 
 * @param {WebGLRenderingContextBase} gl The gl context.
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

/**
 * Create a buffer with the given source.
 * 
 * @param {WebGLRenderingContextBase} gl The gl context.
 * @param {GLenum} target The buffer bind target. Usually, this is `gl.ARRAY_BUFFER` or
 * `gl.ELEMENT_ARRAY_BUFFER`.
 * @param {BufferSource} bufferSource The typed array buffer containing the given data.
 * For convenience, you can use `BufferHelper.createBufferSource()` to convert a data array
 * to the appropriate typed array.
 * @param {GLenum} usage The buffer usage hint. By default, this is `gl.STATIC_DRAW`.
 * @returns {WebGLBuffer} The created and bound data buffer.
 */
export function createBuffer(gl, target, bufferSource, usage = undefined)
{
    let handle = gl.createBuffer();
    gl.bindBuffer(target, handle);
    if (!ArrayBuffer.isView(bufferSource)) throw new Error('Source data must be a typed array.');
    gl.bufferData(target, bufferSource, usage || gl.STATIC_DRAW);
    return handle;
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
