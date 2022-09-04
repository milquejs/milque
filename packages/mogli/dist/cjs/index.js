'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Checks whether the context supports WebGL2 features.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @returns {boolean} Whether WebGL2 is supported.
 */
function isWebGL2Supported(gl) {
  return (
    typeof WebGL2RenderingContext !== 'undefined' &&
    gl instanceof WebGL2RenderingContext
  );
}

var GLHelper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isWebGL2Supported: isWebGL2Supported
});

class BufferDataContext {
  /**
   * @param {WebGLRenderingContextBase} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   */
  constructor(gl, target) {
    this.gl = gl;
    this.target = target;
  }

  /**
   * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
   * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
   * @returns {BufferDataContext}
   */
  data(srcDataOrSize, usage = undefined) {
    const gl = this.gl;
    const target = this.target;
    if (typeof srcDataOrSize === 'number') {
      /** @type {WebGLRenderingContext|WebGL2RenderingContext} */
      (gl).bufferData(target, srcDataOrSize, usage || gl.STATIC_DRAW);
    } else {
      if (!ArrayBuffer.isView(srcDataOrSize))
        throw new Error('Source data must be a typed array.');
      /** @type {WebGLRenderingContext|WebGL2RenderingContext} */
      (gl).bufferData(target, srcDataOrSize, usage || gl.STATIC_DRAW);
    }
    return this;
  }

  /**
   * @param {BufferSource} srcData The buffer data source.
   * @param {number} [dstOffset] The destination byte offset to put the data.
   * @param {number} [srcOffset] The source array index offset to copy the data from.
   * @param {number} [srcLength] The source array count to copy the data until.
   * @returns {BufferDataContext}
   */
  subData(
    srcData,
    dstOffset = 0,
    srcOffset = undefined,
    srcLength = undefined
  ) {
    const gl = this.gl;
    const target = this.target;
    if (!ArrayBuffer.isView(srcData)) {
      throw new Error('Source data must be a typed array.');
    } else if (typeof srcOffset !== 'undefined') {
      if (isWebGL2Supported(gl)) {
        /** @type {WebGL2RenderingContext} */
        (gl).bufferSubData(target, dstOffset, srcData, srcOffset, srcLength);
      } else {
        // HACK: `subarray()` is in ALL TypedArrays, but not in BufferSource
        const srcSubData = srcLength
          // @ts-ignore
          ? srcData.subarray(srcOffset, srcOffset + srcLength)
          // @ts-ignore
          : srcData.subarray(srcOffset);
        /** @type {WebGLRenderingContext|WebGL2RenderingContext} */
        (gl).bufferSubData(target, dstOffset, srcSubData);
      }
    } else {
      /** @type {WebGLRenderingContext|WebGL2RenderingContext} */
      (gl).bufferSubData(target, dstOffset, srcData);
    }
    return this;
  }
}

class BufferBuilder {
  /**
   * @param {WebGLRenderingContext} gl The webgl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
   * new buffer will be created.
   */
  constructor(gl, target, buffer = undefined) {
    /** @private */
    this.dataContext = new BufferDataContext(gl, target);
    this.handle = buffer || gl.createBuffer();
    gl.bindBuffer(target, this.handle);
  }

  get gl() {
    return this.dataContext.gl;
  }

  get target() {
    return this.dataContext.target;
  }

  /**
   * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
   * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
   * @returns {BufferBuilder}
   */
  data(srcDataOrSize, usage = undefined) {
    this.dataContext.data(srcDataOrSize, usage);
    return this;
  }

  /**
   * @param {BufferSource} srcData The buffer data source.
   * @param {number} [dstOffset] The destination byte offset to put the data.
   * @param {number} [srcOffset] The source array index offset to copy the data from.
   * @param {number} [srcLength] The source array count to copy the data until.
   * @returns {BufferBuilder}
   */
  subData(
    srcData,
    dstOffset = 0,
    srcOffset = undefined,
    srcLength = undefined
  ) {
    this.dataContext.subData(srcData, dstOffset, srcOffset, srcLength);
    return this;
  }

  /** @returns {WebGLBuffer} */
  build() {
    return this.handle;
  }
}

class BufferInfo {
  /**
   * @param {WebGLRenderingContextBase} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   * @param {GLenum} bufferType The buffer data type. Usually, this is
   * `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
   * array buffers. It must be either `gl.BYTE`, `gl.UNSIGNED_BYTE`,
   * `gl.SHORT`, `gl.UNSIGNED_SHORT`, `gl.FLOAT`, or `gl.HALF_FLOAT`
   * for WebGL2.
   * @param {WebGLBuffer} buffer The buffer handle.
   */
  constructor(gl, target, bufferType, buffer) {
    this.gl = gl;
    this.target = target;
    this.handle = buffer;
    this.type = bufferType;

    /** @private */
    this.bindContext = new BufferDataContext(gl, this.target);
  }

  bind(gl) {
    gl.bindBuffer(this.target, this.handle);
    this.bindContext.gl = gl;
    return this.bindContext;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
const BufferEnums = {
  // WebGL1
  BYTE: 0x1400,
  UNSIGNED_BYTE: 0x1401,
  SHORT: 0x1402,
  UNSIGNED_SHORT: 0x1403,
  INT: 0x1404,
  UNSIGNED_INT: 0x1405,
  FLOAT: 0x1406,
  // WebGL2
  HALF_FLOAT: 0x140b,
};

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
function createBufferSource(gl, type, data) {
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
function createBuffer(gl, target, bufferSource, usage = gl.STATIC_DRAW) {
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
function getTypedArrayForBufferType(gl, bufferType) {
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
function getBufferTypeForBufferSource(gl, bufferSource) {
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
function getByteCountForBufferType(gl, bufferType) {
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
function getBufferTypeForTypedArray(gl, typedArray) {
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
function getBufferUsage(gl, target, buffer) {
  gl.bindBuffer(target, buffer);
  return gl.getBufferParameter(target, gl.BUFFER_USAGE);
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {GLenum} target 
 * @param {WebGLBuffer} buffer 
 * @returns {GLenum}
 */
function getBufferByteCount(gl, target, buffer) {
  gl.bindBuffer(target, buffer);
  return gl.getBufferParameter(target, gl.BUFFER_SIZE);
}

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {GLenum} target 
 * @param {WebGLBuffer} buffer 
 * @returns {GLenum}
 */
function getBufferLength(gl, target, buffer, type) {
  return Math.trunc(getBufferByteCount(gl, target, buffer) / getByteCountForBufferType(gl, type));
}

var BufferHelper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createBufferSource: createBufferSource,
  createBuffer: createBuffer,
  getTypedArrayForBufferType: getTypedArrayForBufferType,
  getBufferTypeForBufferSource: getBufferTypeForBufferSource,
  getByteCountForBufferType: getByteCountForBufferType,
  getBufferTypeForTypedArray: getBufferTypeForTypedArray,
  getBufferUsage: getBufferUsage,
  getBufferByteCount: getBufferByteCount,
  getBufferLength: getBufferLength
});

class BufferInfoBuilder {
  /**
   * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
   * new buffer will be created.
   */
  constructor(gl, target, buffer = undefined) {
    /** @private */
    this.bufferBuilder = new BufferBuilder(gl, target, buffer);
    /** @private */
    this.bufferType = gl.FLOAT;
  }

  get gl() {
    return this.bufferBuilder.gl;
  }

  get handle() {
    return this.bufferBuilder.handle;
  }

  get target() {
    return this.bufferBuilder.target;
  }

  /**
   * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
   * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
   * @returns {BufferInfoBuilder}
   */
  data(srcDataOrSize, usage = undefined) {
    this.bufferBuilder.data(srcDataOrSize, usage);
    if (typeof srcDataOrSize !== 'number') {
      this.bufferType = getBufferTypeForBufferSource(this.gl, srcDataOrSize);
    }
    return this;
  }

  /**
   * @param {BufferSource} srcData The buffer data source.
   * @param {number} [dstOffset] The destination byte offset to put the data.
   * @param {number} [srcOffset] The source array index offset to copy the data from.
   * @param {number} [srcLength] The source array count to copy the data until.
   * @returns {BufferInfoBuilder}
   */
  subData(
    srcData,
    dstOffset = undefined,
    srcOffset = undefined,
    srcLength = undefined
  ) {
    this.bufferBuilder.subData(srcData, dstOffset, srcOffset, srcLength);
    this.bufferType = getBufferTypeForBufferSource(this.gl, srcData);
    return this;
  }

  /**
   * @returns {BufferInfo}
   */
  build() {
    const handle = this.bufferBuilder.build();
    const gl = this.gl;
    const target = this.target;
    const type = this.bufferType;
    return new BufferInfo(gl, target, type, handle);
  }
}

/**
 * Get list of parameter infos for all active uniforms in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The program to get the active uniforms from.
 * @returns {Array<WebGLActiveInfo>} An array of active uniforms.
 */
function getActiveUniforms(gl, program) {
  let result = [];
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; ++i) {
    let uniformInfo = gl.getActiveUniform(program, i);
    if (!uniformInfo) break;
    result.push(uniformInfo);
  }
  return result;
}

/**
 * Get list of parameter infos for all active attributes in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The program to get the active attributes from.
 * @returns {Array<WebGLActiveInfo>} An array of active attributes.
 */
function getActiveAttribs(gl, program) {
  let result = [];
  const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < attributeCount; ++i) {
    let attributeInfo = gl.getActiveAttrib(program, i);
    if (!attributeInfo) continue;
    result.push(attributeInfo);
  }
  return result;
}

/**
 * Get the number of expected elements in the attribute vertex type.
 *
 * @param {WebGLRenderingContextBase} gl The gl context.
 * @param {GLenum} attribType The attribute gl type.
 * @returns {number} The number of expected elements in the attribute vertex type.
 */
function getAttribVertexSize(gl, attribType) {
  // https://www.khronos.org/registry/OpenGL-Refpages/es2.0/xhtml/glGetActiveAttrib.xml
  switch (attribType) {
    case gl.FLOAT:
    case gl.INT:
    case gl.UNSIGNED_INT:
    case gl.BOOL:
      return 1;
    case gl.FLOAT_VEC2:
    case gl.INT_VEC2:
    case gl.BOOL_VEC2:
      return 2;
    case gl.FLOAT_VEC3:
    case gl.INT_VEC3:
    case gl.BOOL_VEC3:
      return 3;
    case gl.FLOAT_VEC4:
    case gl.INT_VEC4:
    case gl.BOOL_VEC4:
      return 4;
    case gl.FLOAT_MAT2:
      return 4;
    case gl.FLOAT_MAT3:
      return 9;
    case gl.FLOAT_MAT4:
      return 16;
    default:
      throw new Error('Invalid vertex attribute type.');
  }
}

/**
 * @callback AttributeFunction
 * @param {number} index
 * @param {WebGLBuffer} buffer
 * @param {number} vertexSize
 * @param {GLenum} bufferType
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 */

/**
 * Gets the attribute modifier function by attribute type. For vectors
 * of size 1, it accepts a single number value. For vectors of greater
 * size, it takes an array of numbers.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {GLenum} attributeType The attribute data type.
 * @returns {AttributeFunction} The attribute modifier function.
 */
function getAttributeFunction(gl, attributeType) {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
    switch (attributeType) {
        // WebGL1
        case gl.FLOAT:
        case gl.FLOAT_VEC2:
        case gl.FLOAT_VEC3:
        case gl.FLOAT_VEC4:
            return attributeFloatBuffer;
    }

    if (isWebGL2Supported(gl)) {
        const gl2 = /** @type {WebGL2RenderingContext} */ (gl);
        switch (attributeType) {
            case gl.INT:
            case gl.INT_VEC2:
            case gl.INT_VEC3:
            case gl.INT_VEC4:
            case gl.BOOL:
            case gl.BOOL_VEC2:
            case gl.BOOL_VEC3:
            case gl.BOOL_VEC4:
                return attributeIntBuffer;
            case gl.FLOAT_MAT2:
                return attributeFloatMat2Buffer;
            case gl.FLOAT_MAT3:
                return attributeFloatMat3Buffer;
            case gl.FLOAT_MAT4:
                return attributeFloatMat4Buffer;
            // WebGL2
            case gl2.UNSIGNED_INT:
            case gl2.UNSIGNED_INT_VEC2:
            case gl2.UNSIGNED_INT_VEC3:
            case gl2.UNSIGNED_INT_VEC4:
                return attributeUintBuffer;
        }
    }

    throw new Error('Cannot find attribute function for gl enum.');
}

/**
 * @param {number} index
 * @param {WebGLBuffer} buffer
 * @param {number} vertexSize
 * @param {GLenum} bufferType
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 * @this {WebGLRenderingContextBase}
 */
function attributeFloatBuffer(index, buffer, vertexSize, bufferType, normalize = false, stride = 0, offset = 0, divisor = undefined) {
    this.bindBuffer(this.ARRAY_BUFFER, buffer);
    this.enableVertexAttribArray(index);
    this.vertexAttribPointer(index, vertexSize, bufferType, normalize, stride, offset);
    if (divisor !== undefined) {
        if (!isWebGL2Supported(this)) {
            throw new Error('Cannot use attribute divisor in WebGL 1.');
        }
        const gl2 = /** @type {WebGL2RenderingContext} */ (this);
        gl2.vertexAttribDivisor(index, divisor);
    }
}

/**
 * @param {number} index
 * @param {WebGLBuffer} buffer
 * @param {number} vertexSize
 * @param {GLenum} bufferType
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 * @this {WebGLRenderingContextBase}
 */
 function attributeIntBuffer(index, buffer, vertexSize, bufferType, normalize = false, stride = 0, offset = 0, divisor = undefined) {
    if (!isWebGL2Supported(this)) {
        throw new Error('Cannot use attribute divisor in WebGL 1.');
    }
    const gl2 = /** @type {WebGL2RenderingContext} */ (this);
    gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer);
    gl2.enableVertexAttribArray(index);
    gl2.vertexAttribIPointer(index, vertexSize, bufferType, stride, offset);
    if (divisor !== undefined) {
        gl2.vertexAttribDivisor(index, divisor);
    }
}

/**
 * @param {number} index
 * @param {WebGLBuffer} buffer
 * @param {number} vertexSize
 * @param {GLenum} bufferType
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 * @this {WebGLRenderingContextBase}
 */
function attributeUintBuffer(index, buffer, vertexSize, bufferType, normalize = false, stride = 0, offset = 0, divisor = undefined) {
    if (!isWebGL2Supported(this)) {
        throw new Error('Cannot use attribute divisor in WebGL 1.');
    }
    const gl2 = /** @type {WebGL2RenderingContext} */ (this);
    gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer);
    gl2.enableVertexAttribArray(index);
    gl2.vertexAttribIPointer(index, vertexSize, bufferType, stride, offset);
    if (divisor !== undefined) {
        gl2.vertexAttribDivisor(index, divisor);
    }
}

/**
 * @param {number} index
 * @param {WebGLBuffer} buffer
 * @param {number} vertexSize
 * @param {GLenum} bufferType
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 * @this {WebGLRenderingContextBase}
 */
function attributeFloatMat2Buffer(index, buffer, vertexSize, bufferType, normalize = false, stride = 0, offset = 0, divisor = undefined) {
    // NOTE: Size along 1 dimension
    let matrixSize = getAttribVertexSize(this, this.FLOAT_MAT2);
    // NOTE: Assumes a square matrix.
    let matrixLength = matrixSize * matrixSize;
    attributeFloatMatrixBufferImpl(matrixLength, matrixSize, index, buffer, vertexSize, bufferType, normalize, stride, offset, divisor);
}

/**
 * @param {number} index
 * @param {WebGLBuffer} buffer
 * @param {number} vertexSize
 * @param {GLenum} bufferType
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 * @this {WebGLRenderingContextBase}
 */
function attributeFloatMat3Buffer(index, buffer, vertexSize, bufferType, normalize = false, stride = 0, offset = 0, divisor = undefined) {
    // NOTE: Size along 1 dimension
    let matrixSize = getAttribVertexSize(this, this.FLOAT_MAT3);
    // NOTE: Assumes a square matrix.
    let matrixLength = matrixSize * matrixSize;
    attributeFloatMatrixBufferImpl(matrixLength, matrixSize, index, buffer, vertexSize, bufferType, normalize, stride, offset, divisor);
}

/**
 * @param {number} index
 * @param {WebGLBuffer} buffer
 * @param {number} vertexSize
 * @param {GLenum} bufferType
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 * @this {WebGLRenderingContextBase}
 */
function attributeFloatMat4Buffer(index, buffer, vertexSize, bufferType, normalize = false, stride = 0, offset = 0, divisor = undefined) {
    // NOTE: Size along 1 dimension
    let matrixSize = getAttribVertexSize(this, this.FLOAT_MAT4);
    // NOTE: Assumes a square matrix.
    let matrixLength = matrixSize * matrixSize;
    attributeFloatMatrixBufferImpl(matrixLength, matrixSize, index, buffer, vertexSize, bufferType, normalize, stride, offset, divisor);
}

/**
 * @param {number} matrixLength
 * @param {number} matrixSize
 * @param {number} index
 * @param {WebGLBuffer} buffer
 * @param {number} vertexSize
 * @param {GLenum} bufferType
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 * @this {WebGLRenderingContextBase}
 */
function attributeFloatMatrixBufferImpl(matrixLength, matrixSize, index, buffer, vertexSize, bufferType, normalize, stride, offset, divisor) {
    if (!isWebGL2Supported(this)) {
        throw new Error('Cannot use attribute divisor in WebGL 1.');
    }
    const gl2 = /** @type {WebGL2RenderingContext} */ (this);
    gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer);
    // Number of matrices in the buffer.
    let matrixCount = vertexSize / matrixSize;
    // The stride to each matrix
    let matrixStride = matrixLength * vertexSize;
    // The offset within each matrix data
    let offsetPerMatrix = stride / matrixSize;
    for(let i = 0; i < matrixSize; ++i) {
        let ii = index + i;
        gl2.enableVertexAttribArray(ii);
        gl2.vertexAttribPointer(ii, matrixCount, bufferType, normalize, matrixStride, offset + offsetPerMatrix * i);
        if (divisor !== undefined) {
            gl2.vertexAttribDivisor(ii, divisor);
        }
    }
}

/**
 * @typedef {import('./ProgramAttributeFunctions.js').AttributeFunction} AttributeFunction
 */

/**
 * @typedef ActiveAttributeInfo
 * @property {GLenum} type
 * @property {number} length
 * @property {number} location
 * @property {AttributeFunction} set
 */

/**
 * Get map of all active attributes to their info in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The program to get active attributes from.
 * @returns {Record<string, ActiveAttributeInfo>} An object mapping of attribute names to info.
 */
function getActiveAttribsInfo(gl, program) {
  /** @type {Record<string, ActiveAttributeInfo>} */
  let result = {};
  const activeAttributes = getActiveAttribs(gl, program);
  for (let activeInfo of activeAttributes) {
    const attributeName = activeInfo.name;
    const attributeSize = activeInfo.size;
    const attributeType = activeInfo.type;
    const attributeLocation = gl.getAttribLocation(program, attributeName);
    const attributeSet = getAttributeFunction(gl, attributeType);
    result[attributeName] = {
      type: attributeType,
      length: attributeSize,
      location: attributeLocation,
      set: attributeSet,
    };
  }
  return result;
}

/**
 * Create and compile shader from source text.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {GLenum} shaderType The type of the shader. This is usually `gl.VERTEX_SHADER`
 * or `gl.FRAGMENT_SHADER`.
 * @param {string} shaderSource The shader source text.
 * @returns {WebGLShader} The compiled shader.
 */
function createShader(gl, shaderType, shaderSource) {
  let shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!status) {
    let log = gl.getShaderInfoLog(shader) +
      `\nFailed to compile shader:\n${shaderSource}`;
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

/**
 * Link the given shader program from list of compiled shaders.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The shader program handle.
 * @param {Array<WebGLShader>} shaders The list of compiled shaders
 * to link in the program.
 * @returns {Promise<WebGLProgram>} The linked shader program.
 */
async function createShaderProgram(gl, program, shaders) {
  // Attach to the program.
  for (let shader of shaders) {
    gl.attachShader(program, shader);
  }

  // Link'em!
  gl.linkProgram(program);

  // Might be async...
  const ext = gl.getExtension('KHR_parallel_shader_compile');
  if (ext) {
    const statusInterval = 1000 / 60;
    let result;
    do {
      await new Promise((resolve, _) => setTimeout(resolve, statusInterval));
      result = gl.getProgramParameter(program, ext.COMPLETION_STATUS_KHR);
    } while (!result);
  }

  // Don't forget to clean up the shaders! It's no longer needed.
  for (let shader of shaders) {
    gl.detachShader(program, shader);
    gl.deleteShader(shader);
  }

  let status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!status) {
    let log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

/**
 * Draw the currently bound render context.
 *
 * @param {WebGLRenderingContextBase} gl
 * @param {number} mode
 * @param {number} offset
 * @param {number} count
 * @param {WebGLBuffer} [elementBuffer]
 */
function draw(gl, mode, offset, count, elementBuffer = undefined) {
  if (elementBuffer) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset);
  } else {
    gl.drawArrays(mode, offset, count);
  }
}

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 */
function getProgramStatus(gl, program) {
  return {
    /** @type {GLboolean} */
    linkStatus: gl.getProgramParameter(program, gl.LINK_STATUS),
    /** @type {GLboolean} */
    deleteStatus: gl.getProgramParameter(program, gl.DELETE_STATUS),
    /** @type {GLboolean} */
    validateStatus: gl.getProgramParameter(program, gl.VALIDATE_STATUS),
    /** @type {string} */
    infoLog: gl.getProgramInfoLog(program),
  };
}

var ProgramHelper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createShader: createShader,
  createShaderProgram: createShaderProgram,
  draw: draw,
  getProgramStatus: getProgramStatus,
  getActiveUniforms: getActiveUniforms,
  getActiveAttribs: getActiveAttribs
});

/**
 * @callback UniformArrayFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {Float32List|Int32List|Uint32List} value The vector array.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @callback UniformComponentFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {...number} values The components of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @typedef {UniformArrayFunction|UniformComponentFunction} UniformFunction
 */

/**
 * Gets the uniform modifier function by uniform type. For uniform vectors
 * of size 1, it accepts a single number value. For vectors of greater
 * size, it takes an array of numbers.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformFunction} The uniform modifier function.
 */
function getUniformFunction(gl, uniformType) {
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
  const gl1 = /** @type {WebGLRenderingContext} */ (gl);
  switch (uniformType) {
    // WebGL1
    case gl1.FLOAT:
      return gl1.uniform1f;
    case gl1.FLOAT_VEC2:
      return gl1.uniform2fv;
    case gl1.FLOAT_VEC3:
      return gl1.uniform3fv;
    case gl1.FLOAT_VEC4:
      return gl1.uniform4fv;
    case gl1.INT:
      return gl1.uniform1i;
    case gl1.INT_VEC2:
      return gl1.uniform2iv;
    case gl1.INT_VEC3:
      return gl1.uniform3iv;
    case gl1.INT_VEC4:
      return gl1.uniform4iv;
    case gl1.BOOL:
      return gl1.uniform1i;
    case gl1.BOOL_VEC2:
      return gl1.uniform2iv;
    case gl1.BOOL_VEC3:
      return gl1.uniform3iv;
    case gl1.BOOL_VEC4:
      return gl1.uniform4iv;
    case gl1.FLOAT_MAT2:
      return uniformMatrix2fv;
    case gl1.FLOAT_MAT3:
      return uniformMatrix3fv;
    case gl1.FLOAT_MAT4:
      return uniformMatrix4fv;
    // WeblGL1 Samplers
    case gl1.SAMPLER_2D:
    case gl1.SAMPLER_CUBE:
      return gl1.uniform1i;
  }

  if (isWebGL2Supported(gl)) {
    const gl2 = /** @type {WebGL2RenderingContext} */ (gl);
    switch (uniformType) {
      // WebGL2
      case gl2.UNSIGNED_INT:
        return gl2.uniform1ui;
      case gl2.UNSIGNED_INT_VEC2:
        return gl2.uniform2uiv;
      case gl2.UNSIGNED_INT_VEC3:
        return gl2.uniform3uiv;
      case gl2.UNSIGNED_INT_VEC4:
        return gl2.uniform4uiv;
      case gl2.FLOAT_MAT2x3:
        return uniformMatrix2x3fv;
      case gl2.FLOAT_MAT2x4:
        return uniformMatrix2x4fv;
      case gl2.FLOAT_MAT3x2:
        return uniformMatrix3x2fv;
      case gl2.FLOAT_MAT3x4:
        return uniformMatrix3x4fv;
      case gl2.FLOAT_MAT4x2:
        return uniformMatrix4x2fv;
      case gl2.FLOAT_MAT4x3:
        return uniformMatrix4x3fv;
      // WeblGL2 Samplers
      case gl2.SAMPLER_3D:
      case gl2.SAMPLER_2D_SHADOW:
      case gl2.SAMPLER_2D_ARRAY:
      case gl2.SAMPLER_2D_ARRAY_SHADOW:
      case gl2.SAMPLER_CUBE_SHADOW:
      case gl2.INT_SAMPLER_2D:
      case gl2.INT_SAMPLER_3D:
      case gl2.INT_SAMPLER_CUBE:
      case gl2.INT_SAMPLER_2D_ARRAY:
      case gl2.UNSIGNED_INT_SAMPLER_2D:
      case gl2.UNSIGNED_INT_SAMPLER_3D:
      case gl2.UNSIGNED_INT_SAMPLER_CUBE:
      case gl2.UNSIGNED_INT_SAMPLER_2D_ARRAY:
        return gl2.uniform1i;
    }
  }

  throw new Error('Cannot find uniform function for gl enum.');
}

/**
 * Get the per component uniform modifier function by uniform type.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformComponentFunction} The per component uniform modifier function.
 */
function getUniformComponentFunction(gl, uniformType) {
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
  const gl1 = /** @type {WebGLRenderingContext} */ (gl);
  switch (uniformType) {
    // WebGL1
    case gl1.FLOAT:
      return gl1.uniform1f;
    case gl1.FLOAT_VEC2:
      return gl1.uniform2f;
    case gl1.FLOAT_VEC3:
      return gl1.uniform3f;
    case gl1.FLOAT_VEC4:
      return gl1.uniform4f;
    case gl1.INT:
      return gl1.uniform1i;
    case gl1.INT_VEC2:
      return gl1.uniform2i;
    case gl1.INT_VEC3:
      return gl1.uniform3i;
    case gl1.INT_VEC4:
      return gl1.uniform4i;
    case gl1.BOOL:
      return gl1.uniform1i;
    case gl1.BOOL_VEC2:
      return gl1.uniform2i;
    case gl1.BOOL_VEC3:
      return gl1.uniform3i;
    case gl1.BOOL_VEC4:
      return gl1.uniform4i;
    case gl1.FLOAT_MAT2:
      return uniformMatrix2f;
    case gl1.FLOAT_MAT3:
      return uniformMatrix3f;
    case gl1.FLOAT_MAT4:
      return uniformMatrix4f;
    // WeblGL1 Samplers
    case gl1.SAMPLER_2D:
    case gl1.SAMPLER_CUBE:
      return gl1.uniform1i;
  }

  if (isWebGL2Supported(gl)) {
    const gl2 = /** @type {WebGL2RenderingContext} */ (gl);
    switch (uniformType) {
      // WebGL2
      case gl2.UNSIGNED_INT:
        return gl2.uniform1ui;
      case gl2.UNSIGNED_INT_VEC2:
        return gl2.uniform2ui;
      case gl2.UNSIGNED_INT_VEC3:
        return gl2.uniform3ui;
      case gl2.UNSIGNED_INT_VEC4:
        return gl2.uniform4ui;
      case gl2.FLOAT_MAT2x3:
        return uniformMatrix2x3f;
      case gl2.FLOAT_MAT2x4:
        return uniformMatrix2x4f;
      case gl2.FLOAT_MAT3x2:
        return uniformMatrix3x2f;
      case gl2.FLOAT_MAT3x4:
        return uniformMatrix3x4f;
      case gl2.FLOAT_MAT4x2:
        return uniformMatrix4x2f;
      case gl2.FLOAT_MAT4x3:
        return uniformMatrix4x3f;
      // WeblGL2 Samplers
      case gl2.SAMPLER_3D:
      case gl2.SAMPLER_2D_SHADOW:
      case gl2.SAMPLER_2D_ARRAY:
      case gl2.SAMPLER_2D_ARRAY_SHADOW:
      case gl2.SAMPLER_CUBE_SHADOW:
      case gl2.INT_SAMPLER_2D:
      case gl2.INT_SAMPLER_3D:
      case gl2.INT_SAMPLER_CUBE:
      case gl2.INT_SAMPLER_2D_ARRAY:
      case gl2.UNSIGNED_INT_SAMPLER_2D:
      case gl2.UNSIGNED_INT_SAMPLER_3D:
      case gl2.UNSIGNED_INT_SAMPLER_CUBE:
      case gl2.UNSIGNED_INT_SAMPLER_2D_ARRAY:
        return gl2.uniform1i;
    }
  }

  throw new Error('Cannot find per component uniform function for gl enum.');
}

/**
 * Get the array uniform modifier function by uniform type.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformArrayFunction} The array uniform modifier function.
 */
function getUniformArrayFunction(gl, uniformType) {
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
  const gl1 = /** @type {WebGLRenderingContext} */ (gl);
  switch (uniformType) {
    // WebGL1
    case gl1.FLOAT:
      return gl1.uniform1fv;
    case gl1.FLOAT_VEC2:
      return gl1.uniform2fv;
    case gl1.FLOAT_VEC3:
      return gl1.uniform3fv;
    case gl1.FLOAT_VEC4:
      return gl1.uniform4fv;
    case gl1.INT:
      return gl1.uniform1iv;
    case gl1.INT_VEC2:
      return gl1.uniform2iv;
    case gl1.INT_VEC3:
      return gl1.uniform3iv;
    case gl1.INT_VEC4:
      return gl1.uniform4iv;
    case gl1.BOOL:
      return gl1.uniform1iv;
    case gl1.BOOL_VEC2:
      return gl1.uniform2iv;
    case gl1.BOOL_VEC3:
      return gl1.uniform3iv;
    case gl1.BOOL_VEC4:
      return gl1.uniform4iv;
    case gl1.FLOAT_MAT2:
      return uniformMatrix2fv;
    case gl1.FLOAT_MAT3:
      return uniformMatrix3fv;
    case gl1.FLOAT_MAT4:
      return uniformMatrix4fv;
    case gl1.SAMPLER_2D:
    case gl1.SAMPLER_CUBE:
      return gl1.uniform1iv;
  }

  if (isWebGL2Supported(gl)) {
    const gl2 = /** @type {WebGL2RenderingContext} */ (gl);
    switch (uniformType) {
      // WebGL2
      case gl2.UNSIGNED_INT:
        return gl2.uniform1uiv;
      case gl2.UNSIGNED_INT_VEC2:
        return gl2.uniform2uiv;
      case gl2.UNSIGNED_INT_VEC3:
        return gl2.uniform3uiv;
      case gl2.UNSIGNED_INT_VEC4:
        return gl2.uniform4uiv;
      case gl2.FLOAT_MAT2x3:
        return uniformMatrix2x3fv;
      case gl2.FLOAT_MAT2x4:
        return uniformMatrix2x4fv;
      case gl2.FLOAT_MAT3x2:
        return uniformMatrix3x2fv;
      case gl2.FLOAT_MAT3x4:
        return uniformMatrix3x4fv;
      case gl2.FLOAT_MAT4x2:
        return uniformMatrix4x2fv;
      case gl2.FLOAT_MAT4x3:
        return uniformMatrix4x3fv;
      // WebGL2 Samplers
      case gl2.SAMPLER_3D:
      case gl2.SAMPLER_2D_SHADOW:
      case gl2.SAMPLER_2D_ARRAY:
      case gl2.SAMPLER_2D_ARRAY_SHADOW:
      case gl2.SAMPLER_CUBE_SHADOW:
      case gl2.INT_SAMPLER_2D:
      case gl2.INT_SAMPLER_3D:
      case gl2.INT_SAMPLER_CUBE:
      case gl2.INT_SAMPLER_2D_ARRAY:
      case gl2.UNSIGNED_INT_SAMPLER_2D:
      case gl2.UNSIGNED_INT_SAMPLER_3D:
      case gl2.UNSIGNED_INT_SAMPLER_CUBE:
      case gl2.UNSIGNED_INT_SAMPLER_2D_ARRAY:
        return gl2.uniform1iv;
    }
  }

  throw new Error('Cannot find array uniform function for gl enum.');
}

function uniformMatrix2fv(location, value) {
  this.uniformMatrix2fv(location, false, value);
}

function uniformMatrix2f(location, m00, m01, m10, m11) {
  this.uniformMatrix2fv(location, false, [m00, m01, m10, m11]);
}

function uniformMatrix3fv(location, value) {
  this.uniformMatrix3fv(location, false, value);
}

function uniformMatrix3f(
  location,
  m00,
  m01,
  m02,
  m10,
  m11,
  m12,
  m20,
  m21,
  m22
) {
  this.uniformMatrix3fv(location, false, [
    m00,
    m01,
    m02,
    m10,
    m11,
    m12,
    m20,
    m21,
    m22,
  ]);
}

function uniformMatrix4fv(location, value) {
  this.uniformMatrix4fv(location, false, value);
}

function uniformMatrix4f(
  location,
  m00,
  m01,
  m02,
  m03,
  m10,
  m11,
  m12,
  m13,
  m20,
  m21,
  m22,
  m23,
  m30,
  m31,
  m32,
  m33
) {
  this.uniformMatrix4fv(location, false, [
    m00,
    m01,
    m02,
    m03,
    m10,
    m11,
    m12,
    m13,
    m20,
    m21,
    m22,
    m23,
    m30,
    m31,
    m32,
    m33,
  ]);
}

function uniformMatrix2x3fv(location, value) {
  this.uniformMatrix2x3fv(location, false, value);
}

function uniformMatrix2x3f(location, m00, m01, m02, m10, m11, m12) {
  this.uniformMatrix2x3fv(location, false, [m00, m01, m02, m10, m11, m12]);
}

function uniformMatrix2x4fv(location, value) {
  this.uniformMatrix2x4fv(location, false, value);
}

function uniformMatrix2x4f(location, m00, m01, m02, m03, m10, m11, m12, m13) {
  this.uniformMatrix2x4fv(location, false, [
    m00,
    m01,
    m02,
    m03,
    m10,
    m11,
    m12,
    m13,
  ]);
}

function uniformMatrix3x2fv(location, value) {
  this.uniformMatrix3x2fv(location, false, value);
}

function uniformMatrix3x2f(location, m00, m01, m10, m11, m20, m21) {
  this.uniformMatrix3x2fv(location, false, [m00, m01, m10, m11, m20, m21]);
}

function uniformMatrix3x4fv(location, value) {
  this.uniformMatrix3x4fv(location, false, value);
}

function uniformMatrix3x4f(
  location,
  m00,
  m01,
  m02,
  m03,
  m10,
  m11,
  m12,
  m13,
  m20,
  m21,
  m22,
  m23
) {
  this.uniformMatrix3x4fv(location, false, [
    m00,
    m01,
    m02,
    m03,
    m10,
    m11,
    m12,
    m13,
    m20,
    m21,
    m22,
    m23,
  ]);
}

function uniformMatrix4x2fv(location, value) {
  this.uniformMatrix4x2fv(location, false, value);
}

function uniformMatrix4x2f(location, m00, m01, m10, m11, m20, m21, m30, m31) {
  this.uniformMatrix4x2fv(location, false, [
    m00,
    m01,
    m10,
    m11,
    m20,
    m21,
    m30,
    m31,
  ]);
}

function uniformMatrix4x3fv(location, value) {
  this.uniformMatrix4x3fv(location, false, value);
}

function uniformMatrix4x3f(
  location,
  m00,
  m01,
  m02,
  m10,
  m11,
  m12,
  m20,
  m21,
  m22,
  m30,
  m31,
  m32
) {
  this.uniformMatrix4x3fv(location, false, [
    m00,
    m01,
    m02,
    m10,
    m11,
    m12,
    m20,
    m21,
    m22,
    m30,
    m31,
    m32,
  ]);
}

var ProgramUniformFunctions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getUniformFunction: getUniformFunction,
  getUniformComponentFunction: getUniformComponentFunction,
  getUniformArrayFunction: getUniformArrayFunction
});

/**
 * @typedef {import('./ProgramUniformFunctions').UniformFunction} UniformFunction
 */

/**
 * @typedef ActiveUniformInfo
 * @property {number} type
 * @property {number} length
 * @property {WebGLUniformLocation} location
 * @property {UniformFunction} set
 */

/**
 * Get map of all active uniforms to their info in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The program to get active uniforms from.
 * @returns {Record<string, ActiveUniformInfo>} An object mapping of uniform names to info.
 */
function getActiveUniformsInfo(gl, program) {
  /** @type {Record<string, ActiveUniformInfo>} */
  let result = {};
  const activeUniforms = getActiveUniforms(gl, program);
  for (let activeInfo of activeUniforms) {
    const uniformName = activeInfo.name;
    const uniformSize = activeInfo.size;
    const uniformType = activeInfo.type;
    const uniformLocation = gl.getUniformLocation(program, uniformName);
    const uniformSet = getUniformFunction(gl, uniformType);
    result[uniformName] = {
      type: uniformType,
      length: uniformSize,
      location: uniformLocation,
      set: uniformSet,
    };
  }
  return result;
}

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
function getProgramInfo(gl, program) {
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
async function linkProgramShaders(gl, program, shaderSources, shaderTypes = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER]) {
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
function bindProgramAttributes(gl, programInfo, bufferOrVertexArrayObjectInfo) {
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
function bindProgramUniforms(gl, programInfo, uniforms) {
    let uniformInfos = programInfo.uniforms;
    for(let name in uniforms) {
        let value = uniforms[name];
        let { location, set } = uniformInfos[name];
        set.call(gl, location, value);
    }
}

var ProgramInfoHelper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProgramInfo: getProgramInfo,
  linkProgramShaders: linkProgramShaders,
  bindProgramAttributes: bindProgramAttributes,
  bindProgramUniforms: bindProgramUniforms
});

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
function createBufferInfo(gl, arrays, elementArray = undefined) {
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
 * @param {Array<import('../program/ProgramInfoHelper.js').ProgramInfo>} programInfos
 * @returns {VertexArrayObjectInfo}
 */
function createVertexArrayInfo(gl, bufferInfo, programInfos) {
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
 * @param {BufferInfo} bufferInfo 
 */
function drawBufferInfo(gl, bufferInfo, mode = gl.TRIANGLES, offset = 0, vertexCount = bufferInfo.vertexCount, instanceCount = undefined) {
    let element = bufferInfo.element;
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
            throw new Error('Invalid buffer for array attribute options.');
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

var BufferInfoHelper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createBufferInfo: createBufferInfo,
  createVertexArrayInfo: createVertexArrayInfo,
  drawBufferInfo: drawBufferInfo
});

class ProgramInfo {
  /**
   * @param {WebGLRenderingContextBase} gl
   * @param {WebGLProgram} program
   */
  constructor(gl, program) {
    this.handle = program;

    this.activeUniforms = getActiveUniformsInfo(gl, program);
    this.activeAttributes = getActiveAttribsInfo(gl, program);

    this.drawContext = new ProgramInfoDrawContext(gl, this);
  }

  /**
   * Bind the program and prepare to draw. This returns the bound context
   * that can modify the draw state.
   *
   * @param {WebGLRenderingContextBase} gl
   * @returns {ProgramInfoDrawContext} The bound context to draw with.
   */
  bind(gl) {
    gl.useProgram(this.handle);

    this.drawContext.gl = gl;
    return this.drawContext;
  }
}

class ProgramInfoDrawContext {
  constructor(gl, programInfo) {
    this.gl = gl;
    /** @private */
    this.parent = programInfo;
  }

  uniform(uniformName, value) {
    const activeUniforms = this.parent.activeUniforms;
    if (uniformName in activeUniforms) {
      let uniform = activeUniforms[uniformName];
      let location = uniform.location;
      uniform.set.call(this.gl, location, value);
    }
    return this;
  }

  /**
   * @param {string} attributeName Name of the attribute.
   * @param {GLenum} bufferType The buffer data type. This is usually `gl.FLOAT`
   * but can also be one of `gl.BYTE`, `gl.UNSIGNED_BYTE`, `gl.SHORT`, `gl.UNSIGNED_SHORT`
   * or `gl.HALF_FLOAT` for WebGL2.
   * @param {WebGLBuffer} buffer The buffer handle.
   * @param {boolean} [normalize=false] Whether to normalize the vectors in the buffer.
   * @param {number} [stride=0] The stride for each vector in the buffer.
   * @param {number} [offset=0] The initial offset in the buffer.
   */
  attribute(
    attributeName,
    bufferType,
    buffer,
    normalize = false,
    stride = 0,
    offset = 0
  ) {
    const gl = this.gl;
    const activeAttributes = this.parent.activeAttributes;
    if (attributeName in activeAttributes) {
      let attribute = activeAttributes[attributeName];
      let location = attribute.location;
      let size = attribute.size;
      if (buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(
          location,
          size,
          bufferType,
          normalize,
          stride,
          offset
        );
        gl.enableVertexAttribArray(location);
      } else {
        gl.disableVertexAttribArray(location);
      }
    }
    return this;
  }

  /**
   * Draws using this program.
   *
   * @param {WebGLRenderingContext} gl
   * @param {number} mode
   * @param {number} offset
   * @param {number} count
   * @param {WebGLBuffer} elementBuffer
   */
  draw(gl, mode, offset, count, elementBuffer = null) {
    draw(gl, mode, offset, count, elementBuffer);
    return this.parent;
  }
}

class ProgramBuilder {
  /**
   * @param {WebGLRenderingContextBase} gl
   * @param {WebGLProgram} [program]
   */
  constructor(gl, program = undefined) {
    this.handle = program || gl.createProgram();
    this.shaders = [];
    /** @type {WebGLRenderingContextBase} */
    this.gl = gl;
  }

  /**
   * @param {GLenum} shaderType
   * @param {string} shaderSource
   * @returns {ProgramBuilder}
   */
  shader(shaderType, shaderSource) {
    const gl = this.gl;
    let shader = createShader(gl, shaderType, shaderSource);
    this.shaders.push(shader);
    return this;
  }

  /**
   * @returns {WebGLProgram}
   */
  link() {
    const gl = this.gl;
    createShaderProgram(gl, this.handle, this.shaders);
    this.shaders.length = 0;
    return this.handle;
  }
}

class ProgramInfoBuilder {
  /**
   * @param {WebGLRenderingContextBase} gl
   * @param {WebGLProgram} [program]
   */
  constructor(gl, program = undefined) {
    /** @private */
    this.programBuilder = new ProgramBuilder(gl, program);
  }

  get gl() {
    return this.programBuilder.gl;
  }

  get handle() {
    return this.programBuilder.handle;
  }

  get shaders() {
    return this.programBuilder.shaders;
  }

  /**
   * @param {GLenum} shaderType
   * @param {string} shaderSource
   * @returns {ProgramInfoBuilder}
   */
  shader(shaderType, shaderSource) {
    this.programBuilder.shader(shaderType, shaderSource);
    return this;
  }

  /**
   * @returns {ProgramInfo}
   */
  link() {
    const handle = this.programBuilder.link();
    return new ProgramInfo(this.gl, handle);
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
const ProgramUniformEnums = {
  // WebGL1
  FLOAT: 0x1406,
  FLOAT_VEC2: 0x8b50,
  FLOAT_VEC3: 0x8b51,
  FLOAT_VEC4: 0x8b52,
  INT: 0x1404,
  INT_VEC2: 0x8b53,
  INT_VEC3: 0x8b54,
  INT_VEC4: 0x8b55,
  BOOL: 0x8b56,
  BOOL_VEC2: 0x8b57,
  BOOL_VEC3: 0x8b58,
  BOOL_VEC4: 0x8b59,
  FLOAT_MAT2: 0x8b5a,
  FLOAT_MAT3: 0x8b5b,
  FLOAT_MAT4: 0x8b5c,
  SAMPLER_2D: 0x8b5e,
  SAMPLER_CUBE: 0x8b60,
  // WebGL2
  UNSIGNED_INT: 0x1405,
  UNSIGNED_INT_VEC2: 0x8dc6,
  UNSIGNED_INT_VEC3: 0x8dc7,
  UNSIGNED_INT_VEC4: 0x8dc8,
  FLOAT_MAT2x3: 0x8b65,
  FLOAT_MAT2x4: 0x8b66,
  FLOAT_MAT3x2: 0x8b67,
  FLOAT_MAT3x4: 0x8b68,
  FLOAT_MAT4x2: 0x8b69,
  FLOAT_MAT4x3: 0x8b6a,
  SAMPLER_3D: 0x8b5f,
  SAMPLER_2D_SHADOW: 0x8b62,
  SAMPLER_2D_ARRAY: 0x8dc1,
  SAMPLER_2D_ARRAY_SHADOW: 0x8dc4,
  SAMPLER_CUBE_SHADOW: 0x8dc5,
  INT_SAMPLER_2D: 0x8dca,
  INT_SAMPLER_3D: 0x8dcb,
  INT_SAMPLER_CUBE: 0x8dcc,
  INT_SAMPLER_2D_ARRAY: 0x8dcf,
  UNSIGNED_INT_SAMPLER_2D: 0x8dd2,
  UNSIGNED_INT_SAMPLER_3D: 0x8dd3,
  UNSIGNED_INT_SAMPLER_CUBE: 0x8dd4,
  UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8dd7,
};

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
const ProgramAttributeEnums = {
  // WebGL1
  BYTE: 0x1400,
  UNSIGNED_BYTE: 0x1401,
  SHORT: 0x1402,
  UNSIGNED_SHORT: 0x1403,
  FLOAT: 0x1406,
  // WebGL2
  HALF_FLOAT: 0x140b,
};

exports.BufferBuilder = BufferBuilder;
exports.BufferDataContext = BufferDataContext;
exports.BufferEnums = BufferEnums;
exports.BufferHelper = BufferHelper;
exports.BufferInfo = BufferInfo;
exports.BufferInfoBuilder = BufferInfoBuilder;
exports.BufferInfoHelper = BufferInfoHelper;
exports.GLHelper = GLHelper;
exports.ProgramAttributeEnums = ProgramAttributeEnums;
exports.ProgramBuilder = ProgramBuilder;
exports.ProgramHelper = ProgramHelper;
exports.ProgramInfo = ProgramInfo;
exports.ProgramInfoBuilder = ProgramInfoBuilder;
exports.ProgramInfoDrawContext = ProgramInfoDrawContext;
exports.ProgramInfoHelper = ProgramInfoHelper;
exports.ProgramUniformEnums = ProgramUniformEnums;
exports.ProgramUniformFunctions = ProgramUniformFunctions;
