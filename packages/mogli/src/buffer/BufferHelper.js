import { BufferEnums } from './BufferEnums.js';

/**
 * Creates a buffer source given the type and data.
 *
 * @param {WebGLRenderingContextBase} gl The gl context.
 * @param {GLenum} type The data type of the elements in the buffer. Usually,
 * this is `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
 * array buffers. It must be either `gl.BYTE`, `gl.UNSIGNED_BYTE`, `gl.SHORT`,
 * `gl.UNSIGNED_SHORT`, `gl.FLOAT`, or `gl.HALF_FLOAT` for WebGL2.
 * @param {Array<number>} data The buffer source data array.
 * @returns {BufferSource} The typed array buffer containing the given data.
 */
export function createBufferSource(gl, type, data) {
  const TypedArray = getTypedArrayForBufferType(gl, type);
  return new TypedArray(data);
}

/**
 * Create a buffer with the given source.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The gl context.
 * @param {GLenum} target The buffer bind target. Usually, this is `gl.ARRAY_BUFFER` or
 * `gl.ELEMENT_ARRAY_BUFFER`.
 * @param {BufferSource} bufferSource The buffer source array.
 * @param {GLenum} [usage] The buffer usage hint. By default, this is `gl.STATIC_DRAW`.
 * @returns {WebGLBuffer} The created and bound data buffer.
 */
export function createBuffer(gl, target, bufferSource, usage = gl.STATIC_DRAW) {
  if (!ArrayBuffer.isView(bufferSource))
    throw new Error('Source data must be a typed array.');
  let handle = gl.createBuffer();
  gl.bindBuffer(target, handle);
  gl.bufferData(target, bufferSource, usage);
  return handle;
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {GLenum} bufferType
 */
export function getTypedArrayForBufferType(gl, bufferType) {
  // NOTE: For WebGL2, gl.HALF_FLOAT (float16) does not have an associated TypedArray.
  switch (bufferType) {
    case gl.BYTE:
      return Int8Array;
    case gl.UNSIGNED_BYTE:
      return Uint8Array;
    case gl.SHORT:
      return Int16Array;
    case gl.UNSIGNED_SHORT:
      return Uint16Array;
    case gl.INT:
      return Int32Array;
    case gl.UNSIGNED_INT:
      return Uint32Array;
    case gl.FLOAT:
      return Float32Array;
    default:
      throw new Error(`Cannot find valid typed array for buffer type '${bufferType}'.`);
  }
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {BufferSource} bufferSource 
 * @returns {GLenum}
 */
export function getBufferTypeForBufferSource(gl, bufferSource) {
  if (bufferSource instanceof Int8Array) {
    return gl.BYTE;
  } else if (bufferSource instanceof Uint8Array) {
    return gl.UNSIGNED_BYTE;
  } else if (bufferSource instanceof Int16Array) {
    return gl.SHORT;
  } else if (bufferSource instanceof Uint16Array) {
    return gl.UNSIGNED_SHORT;
  } else if (bufferSource instanceof Int32Array) {
    return gl.INT;
  } else if (bufferSource instanceof Uint32Array) {
    return gl.UNSIGNED_INT;
  } else if (bufferSource instanceof Float32Array) {
    return gl.FLOAT;
  } else {
    throw new Error('Cannot find valid data type for buffer source.');
  }
}

const BUFFER_TYPE_BYTE_COUNT = {
  [BufferEnums.BYTE]: 1,
  [BufferEnums.UNSIGNED_BYTE]: 1,
  [BufferEnums.SHORT]: 2,
  [BufferEnums.UNSIGNED_SHORT]: 2,
  [BufferEnums.INT]: 4,
  [BufferEnums.UNSIGNED_INT]: 4,
  [BufferEnums.FLOAT]: 4,
  [BufferEnums.HALF_FLOAT]: 2,
};
export function getByteCountForBufferType(gl, bufferType) {
  return BUFFER_TYPE_BYTE_COUNT[bufferType];
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {Int8ArrayConstructor
 * |Uint8ArrayConstructor
 * |Int16ArrayConstructor
 * |Uint16ArrayConstructor
 * |Int32ArrayConstructor
 * |Uint32ArrayConstructor
 * |Float32ArrayConstructor} typedArray 
 * @returns {GLenum}
 */
export function getBufferTypeForTypedArray(gl, typedArray) {
  // NOTE: For WebGL2, gl.HALF_FLOAT (float16) does not have an associated TypedArray.
  switch (typedArray) {
    case Int8Array:
      return gl.BYTE;
    case Uint8Array:
      return gl.UNSIGNED_BYTE;
    case Int16Array:
      return gl.SHORT;
    case Uint16Array:
      return gl.UNSIGNED_SHORT;
    case Int32Array:
      return gl.INT;
    case Uint32Array:
      return gl.UNSIGNED_INT;
    case Float32Array:
      return gl.FLOAT;
    default:
      throw new Error('Cannot find valid buffer type for typed array.');
  }
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {GLenum} target 
 * @param {WebGLBuffer} buffer 
 * @returns {GLenum}
 */
export function getBufferUsage(gl, target, buffer) {
  gl.bindBuffer(target, buffer);
  return gl.getBufferParameter(target, gl.BUFFER_USAGE);
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {GLenum} target 
 * @param {WebGLBuffer} buffer 
 * @returns {GLenum}
 */
export function getBufferByteCount(gl, target, buffer) {
  gl.bindBuffer(target, buffer);
  return gl.getBufferParameter(target, gl.BUFFER_SIZE);
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {GLenum} target 
 * @param {WebGLBuffer} buffer 
 * @returns {GLenum}
 */
export function getBufferLength(gl, target, buffer, type) {
  return Math.trunc(getBufferByteCount(gl, target, buffer) / getByteCountForBufferType(gl, type));
}
