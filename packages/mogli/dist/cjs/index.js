'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Checks whether the context supports WebGL2 features.
 * 
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @returns {Boolean} True if WebGL2 is supported. Otherwise, false.
 */
function isWebGL2Supported(gl) {
  return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
}

function getAttribVertexSize(gl, attribType) {
  // https://www.khronos.org/registry/OpenGL-Refpages/es2.0/xhtml/glGetActiveAttrib.xml
  switch (attribType) {
    case gl.FLOAT:
      return 1;

    case gl.FLOAT_VEC2:
      return 2;

    case gl.FLOAT_VEC3:
      return 3;

    case gl.FLOAT_VEC4:
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

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
var ProgramAttributeEnums = {
  // WebGL1
  BYTE: 0x1400,
  UNSIGNED_BYTE: 0x1401,
  SHORT: 0x1402,
  UNSIGNED_SHORT: 0x1403,
  FLOAT: 0x1406,
  // WebGL2
  HALF_FLOAT: 0x140B
};

class BufferDataContext {
  /**
   * @param {WebGLRenderingContext} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   */
  constructor(gl, target) {
    this.gl = gl;
    this.target = target;
  }
  /**
   * @param {BufferSource|number} srcData The buffer data source or the buffer size in bytes.
   * @param {GLenum} [usage] The buffer data usage.
   */


  data(srcData, usage = undefined) {
    const gl = this.gl;
    const target = this.target;
    if (!ArrayBuffer.isView(srcData)) throw new Error('Source data must be a typed array.');
    gl.bufferData(target, srcData, usage || gl.STATIC_DRAW);
    return this;
  }
  /**
   * @param {BufferSource} srcData The buffer data source.
   * @param {number} [dstOffset] The destination byte offset to put the data.
   * @param {number} [srcOffset] The source array index offset to copy the data from.
   * @param {number} [srcLength] The source array count to copy the data until.
   */


  subData(srcData, dstOffset = 0, srcOffset = undefined, srcLength = undefined) {
    const gl = this.gl;
    const target = this.target;
    if (!ArrayBuffer.isView(srcData)) throw new Error('Source data must be a typed array.');

    if (srcOffset) {
      if (isWebGL2Supported(gl)) {
        gl.bufferSubData(target, dstOffset, srcData, srcOffset, srcLength);
      } else {
        const srcSubData = srcLength ? srcData.subarray(srcOffset, srcOffset + srcLength) : srcData.subarray(srcOffset);
        gl.bufferSubData(target, dstOffset, srcSubData);
      }
    } else {
      gl.bufferSubData(target, dstOffset, srcData);
    }

    return this;
  }

}
class BufferBuilder extends BufferDataContext {
  /**
   * @param {WebGLRenderingContext} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
   * new buffer will be created.
   */
  static from(gl, target, buffer = undefined) {
    return new BufferBuilder(gl, target, buffer);
  }
  /**
   * @param {WebGLRenderingContext} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
   * new buffer will be created.
   */


  constructor(gl, target, buffer = undefined) {
    super(gl, target);
    this.handle = buffer || gl.createBuffer();
    gl.bindBuffer(target, this.handle);
  }

  build() {
    return this.handle;
  }

}

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
function createBufferSource(gl, type, data) {
  const TypedArray = getBufferTypedArray(gl, type);
  return new TypedArray(data);
}
function getBufferTypedArray(gl, bufferType) {
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
      throw new Error('Cannot find valid typed array for buffer type.');
  }
}
function getTypedArrayBufferType(gl, typedArray) {
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
function getBufferUsage(gl, target, buffer) {
  gl.bindBuffer(target, buffer);
  return gl.getBufferParameter(target, gl.BUFFER_USAGE);
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
var BufferEnums = {
  // WebGL1
  BYTE: 0x1400,
  UNSIGNED_BYTE: 0x1401,
  SHORT: 0x1402,
  UNSIGNED_SHORT: 0x1403,
  INT: 0x1404,
  UNSIGNED_INT: 0x1405,
  FLOAT: 0x1406,
  // WebGL2
  HALF_FLOAT: 0x140B
};

class BufferInfoBuilder extends BufferBuilder {
  constructor(gl, target) {
    super(gl, target);
    /** @private */

    this.bufferType = gl.FLOAT;
  }
  /** @override */


  data(srcData, usage = undefined) {
    let result = super.data(srcData, usage);
    const typedArray = srcData.constructor;
    this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
    return result;
  }
  /** @override */


  subData(srcData, dstOffset = undefined, srcOffset = undefined, srcLength = undefined) {
    let result = super.subData(srcData, dstOffset, srcOffset, srcLength);
    const typedArray = srcData.constructor;
    this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
    return result;
  }
  /** @override */


  build() {
    const handle = super.build();
    const gl = this.gl;
    const target = this.target;
    const type = this.bufferType;
    return new BufferInfo(gl, target, type, handle);
  }

}
class BufferInfo {
  /**
   * 
   * @param {WebGLRenderingContext} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   */
  static from(gl, target) {
    return new BufferInfoBuilder(gl, target);
  }
  /**
   * @param {WebGlRenderingContext} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   * @param {GLenum} bufferType The buffer data type.
   * @param {WebGLBuffer} buffer The buffer handle.
   */


  constructor(gl, target, bufferType, buffer) {
    this.gl = gl;
    this.target = target;
    this.handle = buffer;
    this.type = bufferType;
    /** @private */

    this.bindContext = new BufferInfoBindContext(gl, this);
  }

  bind(gl) {
    gl.bindBuffer(this.target, this.handle);
    this.bindContext.gl = gl;
    return this.bindContext;
  }

}
class BufferInfoBindContext extends BufferDataContext {
  constructor(gl, bufferInfo) {
    super(gl, bufferInfo.target);
    /** @private */

    this.parent = bufferInfo;
  }

}

/**
 * @callback UniformArrayFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {Float32List|Int32List} value The vector array.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 * 
 * @callback UniformComponentFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {...Number} values The components of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 * 
 * @typedef {UniformArrayFunction|UniformComponentFunction} UniformFunction
 */

/**
 * Gets the uniform modifier function by uniform type. For uniform vectors
 * of size 1, it accepts a single number value. For vectors of greater
 * size, it takes an array of numbers.
 * 
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformFunction} The uniform modifier function.
 */

function getUniformFunction(gl, uniformType) {
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
  switch (uniformType) {
    // WebGL1
    case gl.FLOAT:
      return gl.uniform1f;

    case gl.FLOAT_VEC2:
      return gl.uniform2fv;

    case gl.FLOAT_VEC3:
      return gl.uniform3fv;

    case gl.FLOAT_VEC4:
      return gl.uniform4fv;

    case gl.INT:
      return gl.uniform1i;

    case gl.INT_VEC2:
      return gl.uniform2iv;

    case gl.INT_VEC3:
      return gl.uniform3iv;

    case gl.INT_VEC4:
      return gl.uniform4iv;

    case gl.BOOL:
      return gl.uniform1i;

    case gl.BOOL_VEC2:
      return gl.uniform2iv;

    case gl.BOOL_VEC3:
      return gl.uniform3iv;

    case gl.BOOL_VEC4:
      return gl.uniform4iv;

    case gl.FLOAT_MAT2:
      return uniformMatrix2fv;

    case gl.FLOAT_MAT3:
      return uniformMatrix3fv;

    case gl.FLOAT_MAT4:
      return uniformMatrix4fv;
    // WeblGL1 Samplers

    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      return gl.uniform1i;
  }

  if (isWebGL2Supported(gl)) {
    switch (uniformType) {
      // WebGL2
      case gl.UNSIGNED_INT:
        return gl.uniform1ui;

      case gl.UNSIGNED_INT_VEC2:
        return gl.uniform2uiv;

      case gl.UNSIGNED_INT_VEC3:
        return gl.uniform3uiv;

      case gl.UNSIGNED_INT_VEC4:
        return gl.uniform4uiv;

      case gl.FLOAT_MAT2x3:
        return uniformMatrix2x3fv;

      case gl.FLOAT_MAT2x4:
        return uniformMatrix2x4fv;

      case gl.FLOAT_MAT3x2:
        return uniformMatrix3x2fv;

      case gl.FLOAT_MAT3x4:
        return uniformMatrix3x4fv;

      case gl.FLOAT_MAT4x2:
        return uniformMatrix4x2fv;

      case gl.FLOAT_MAT4x3:
        return uniformMatrix4x3fv;
      // WeblGL2 Samplers

      case gl.SAMPLER_3D:
      case gl.SAMPLER_2D_SHADOW:
      case gl.SAMPLER_2D_ARRAY:
      case gl.SAMPLER_2D_ARRAY_SHADOW:
      case gl.SAMPLER_CUBE_SHADOW:
      case gl.INT_SAMPLER_2D:
      case gl.INT_SAMPLER_3D:
      case gl.INT_SAMPLER_CUBE:
      case gl.INT_SAMPLER_2D_ARRAY:
      case gl.UNSIGNED_INT_SAMPLER_2D:
      case gl.UNSIGNED_INT_SAMPLER_3D:
      case gl.UNSIGNED_INT_SAMPLER_CUBE:
      case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
        return gl.uniform1i;
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

function getUniformFunctionForComponent(gl, uniformType) {
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
  switch (uniformType) {
    // WebGL1
    case gl.FLOAT:
      return gl.uniform1f;

    case gl.FLOAT_VEC2:
      return gl.uniform2f;

    case gl.FLOAT_VEC3:
      return gl.uniform3f;

    case gl.FLOAT_VEC4:
      return gl.uniform4f;

    case gl.INT:
      return gl.uniform1i;

    case gl.INT_VEC2:
      return gl.uniform2i;

    case gl.INT_VEC3:
      return gl.uniform3i;

    case gl.INT_VEC4:
      return gl.uniform4i;

    case gl.BOOL:
      return gl.uniform1i;

    case gl.BOOL_VEC2:
      return gl.uniform2i;

    case gl.BOOL_VEC3:
      return gl.uniform3i;

    case gl.BOOL_VEC4:
      return gl.uniform4i;

    case gl.FLOAT_MAT2:
      return uniformMatrix2f;

    case gl.FLOAT_MAT3:
      return uniformMatrix3f;

    case gl.FLOAT_MAT4:
      return uniformMatrix4f;
    // WeblGL1 Samplers

    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      return gl.uniform1i;
  }

  if (isWebGL2Supported(gl)) {
    switch (uniformType) {
      // WebGL2
      case gl.UNSIGNED_INT:
        return gl.uniform1ui;

      case gl.UNSIGNED_INT_VEC2:
        return gl.uniform2ui;

      case gl.UNSIGNED_INT_VEC3:
        return gl.uniform3ui;

      case gl.UNSIGNED_INT_VEC4:
        return gl.uniform4ui;

      case gl.FLOAT_MAT2x3:
        return uniformMatrix2x3f;

      case gl.FLOAT_MAT2x4:
        return uniformMatrix2x4f;

      case gl.FLOAT_MAT3x2:
        return uniformMatrix3x2f;

      case gl.FLOAT_MAT3x4:
        return uniformMatrix3x4f;

      case gl.FLOAT_MAT4x2:
        return uniformMatrix4x2f;

      case gl.FLOAT_MAT4x3:
        return uniformMatrix4x3f;
      // WeblGL2 Samplers

      case gl.SAMPLER_3D:
      case gl.SAMPLER_2D_SHADOW:
      case gl.SAMPLER_2D_ARRAY:
      case gl.SAMPLER_2D_ARRAY_SHADOW:
      case gl.SAMPLER_CUBE_SHADOW:
      case gl.INT_SAMPLER_2D:
      case gl.INT_SAMPLER_3D:
      case gl.INT_SAMPLER_CUBE:
      case gl.INT_SAMPLER_2D_ARRAY:
      case gl.UNSIGNED_INT_SAMPLER_2D:
      case gl.UNSIGNED_INT_SAMPLER_3D:
      case gl.UNSIGNED_INT_SAMPLER_CUBE:
      case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
        return gl.uniform1i;
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

function getUniformFunctionForArray(gl, uniformType) {
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
  switch (uniformType) {
    // WebGL1
    case gl.FLOAT:
      return gl.uniform1fv;

    case gl.FLOAT_VEC2:
      return gl.uniform2fv;

    case gl.FLOAT_VEC3:
      return gl.uniform3fv;

    case gl.FLOAT_VEC4:
      return gl.uniform4fv;

    case gl.INT:
      return gl.uniform1iv;

    case gl.INT_VEC2:
      return gl.uniform2iv;

    case gl.INT_VEC3:
      return gl.uniform3iv;

    case gl.INT_VEC4:
      return gl.uniform4iv;

    case gl.BOOL:
      return gl.uniform1iv;

    case gl.BOOL_VEC2:
      return gl.uniform2iv;

    case gl.BOOL_VEC3:
      return gl.uniform3iv;

    case gl.BOOL_VEC4:
      return gl.uniform4iv;

    case gl.FLOAT_MAT2:
      return uniformMatrix2fv;

    case gl.FLOAT_MAT3:
      return uniformMatrix3fv;

    case gl.FLOAT_MAT4:
      return uniformMatrix4fv;

    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      return gl.uniform1iv;
  }

  if (isWebGL2Supported(gl)) {
    switch (uniformType) {
      // WebGL2
      case gl.UNSIGNED_INT:
        return gl.uniform1uiv;

      case gl.UNSIGNED_INT_VEC2:
        return gl.uniform2uiv;

      case gl.UNSIGNED_INT_VEC3:
        return gl.uniform3uiv;

      case gl.UNSIGNED_INT_VEC4:
        return gl.uniform4uiv;

      case gl.FLOAT_MAT2x3:
        return uniformMatrix2x3fv;

      case gl.FLOAT_MAT2x4:
        return uniformMatrix2x4fv;

      case gl.FLOAT_MAT3x2:
        return uniformMatrix3x2fv;

      case gl.FLOAT_MAT3x4:
        return uniformMatrix3x4fv;

      case gl.FLOAT_MAT4x2:
        return uniformMatrix4x2fv;

      case gl.FLOAT_MAT4x3:
        return uniformMatrix4x3fv;
      // WebGL2 Samplers

      case gl.SAMPLER_3D:
      case gl.SAMPLER_2D_SHADOW:
      case gl.SAMPLER_2D_ARRAY:
      case gl.SAMPLER_2D_ARRAY_SHADOW:
      case gl.SAMPLER_CUBE_SHADOW:
      case gl.INT_SAMPLER_2D:
      case gl.INT_SAMPLER_3D:
      case gl.INT_SAMPLER_CUBE:
      case gl.INT_SAMPLER_2D_ARRAY:
      case gl.UNSIGNED_INT_SAMPLER_2D:
      case gl.UNSIGNED_INT_SAMPLER_3D:
      case gl.UNSIGNED_INT_SAMPLER_CUBE:
      case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
        return gl.uniform1iv;
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

function uniformMatrix3f(location, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  this.uniformMatrix3fv(location, false, [m00, m01, m02, m10, m11, m12, m20, m21, m22]);
}

function uniformMatrix4fv(location, value) {
  this.uniformMatrix4fv(location, false, value);
}

function uniformMatrix4f(location, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  this.uniformMatrix4fv(location, false, [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33]);
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
  this.uniformMatrix2x4fv(location, false, [m00, m01, m02, m03, m10, m11, m12, m13]);
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

function uniformMatrix3x4f(location, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23) {
  this.uniformMatrix3x4fv(location, false, [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23]);
}

function uniformMatrix4x2fv(location, value) {
  this.uniformMatrix4x2fv(location, false, value);
}

function uniformMatrix4x2f(location, m00, m01, m10, m11, m20, m21, m30, m31) {
  this.uniformMatrix4x2fv(location, false, [m00, m01, m10, m11, m20, m21, m30, m31]);
}

function uniformMatrix4x3fv(location, value) {
  this.uniformMatrix4x3fv(location, false, value);
}

function uniformMatrix4x3f(location, m00, m01, m02, m10, m11, m12, m20, m21, m22, m30, m31, m32) {
  this.uniformMatrix4x3fv(location, false, [m00, m01, m02, m10, m11, m12, m20, m21, m22, m30, m31, m32]);
}

/**
 * Create and compile shader from source text.
 * 
 * @param {WebGLRenderingContext} gl The webgl context.
 * @param {GLenum} type The type of the shader. This is usually `gl.VERTEX_SHADER`
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
    console.error(gl.getShaderInfoLog(shader) + `\nFailed to compile shader:\n${shaderSource}`);
    gl.deleteShader(shader);
  }

  return shader;
}
/**
 * Link the given shader program from list of compiled shaders.
 * 
 * @param {WebGLRenderingContext} gl The webgl context.
 * @param {WebGLProgram} program The type of the shader.
 * This is usually `gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`.
 * @param {Array<WebGLShader>} shaders The list of compiled shaders
 * to link in the program.
 * @returns {WebGLProgram} The linked shader program.
 */

function createShaderProgram(gl, program, shaders) {
  // Attach to the program.
  for (let shader of shaders) {
    gl.attachShader(program, shader);
  } // Link'em!


  gl.linkProgram(program); // Don't forget to clean up the shaders! It's no longer needed.

  for (let shader of shaders) {
    gl.detachShader(program, shader);
    gl.deleteShader(shader);
  }

  let status = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!status) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  return program;
}
/**
 * Get list of parameter infos for all active uniforms in the shader program.
 * 
 * @param {WebGLRenderingContext} gl The webgl context.
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
 * @param {WebGLRenderingContext} gl The webgl context.
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
 * Draw the currently bound render context.
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Number} mode 
 * @param {Number} offset 
 * @param {Number} count 
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

function getActiveUniformsInfo(gl, program) {
  let result = {};
  const activeUniforms = getActiveUniforms(gl, program);

  for (let activeInfo of activeUniforms) {
    const uniformName = activeInfo.name;
    const uniformSize = activeInfo.size;
    const uniformType = activeInfo.type;
    const uniformLocation = gl.getUniformLocation(program, uniformName);
    let uniformSet;

    if (uniformSize <= 1) {
      // Is a single value uniform
      uniformSet = getUniformFunction(gl, uniformType);
    } else {
      // Is an array uniform
      uniformSet = getUniformFunctionForArray(gl, uniformType);
    }

    result[uniformName] = {
      type: uniformType,
      length: uniformSize,
      location: uniformLocation,
      set: uniformSet
    };
  }

  return result;
}

/**
 * @typedef ActiveAttributeInfo
 * @property {GLenum} type
 * @property {Number} length
 * @property {Number} location
 */

/**
 * Get map of all active uniforms to their info in the shader program.
 * 
 * @param {WebGLRenderingContext} gl The webgl context.
 * @param {WebGLProgram} program The program to get active attributes from.
 * @returns {Record<String, ActiveAttributeInfo>} An object mapping of attribute names to info.
 */

function getActiveAttribsInfo(gl, program) {
  let result = {};
  const attributeInfos = getActiveAttribs(gl, program);

  for (let attributeInfo of attributeInfos) {
    const attributeName = attributeInfo.name;
    const attributeSize = attributeInfo.size;
    const attributeType = attributeInfo.type;
    const attributeLocation = gl.getAttribLocation(program, attributeName);
    const attributeComponents = getAttribVertexSize(gl, attributeType);
    result[attributeName] = {
      type: attributeType,
      length: attributeSize,
      location: attributeLocation,
      size: attributeComponents
    };
  }

  return result;
}

class ProgramBuilder {
  static from(gl, program = undefined) {
    return new ProgramBuilder(gl, program);
  }

  constructor(gl, program = undefined) {
    this.handle = program || gl.createProgram();
    this.shaders = [];
    this.gl = gl;
  }

  shader(shaderType, shaderSource) {
    const gl = this.gl;
    let shader = createShader(gl, shaderType, shaderSource);
    this.shaders.push(shader);
    return this;
  }

  link() {
    const gl = this.gl;
    createShaderProgram(gl, this.handle, this.shaders);
    this.shaders.length = 0;
    return this.handle;
  }

}

class ProgramInfoBuilder extends ProgramBuilder {
  constructor(gl) {
    super(gl);
  }
  /** @override */


  link() {
    const handle = super.link();
    return new ProgramInfo(this.gl, handle);
  }

}
class ProgramInfo {
  static from(gl) {
    return new ProgramInfoBuilder(gl);
  }

  constructor(gl, program) {
    this.handle = program;
    this.activeUniforms = getActiveUniformsInfo(gl, program);
    this.activeAttributes = getActiveAttribsInfo(gl, program);
    /** @private */

    this.drawContext = new ProgramInfoDrawContext(gl, this);
  }

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


  attribute(attributeName, bufferType, buffer, normalize = false, stride = 0, offset = 0) {
    const gl = this.gl;
    const activeAttributes = this.parent.activeAttributes;

    if (attributeName in activeAttributes) {
      let attribute = activeAttributes[attributeName];
      let location = attribute.location;
      let size = attribute.size;

      if (buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(location, size, bufferType, normalize, stride, offset);
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
   * @param {Number} mode 
   * @param {Number} offset 
   * @param {Number} count 
   * @param {WebGLBuffer} elementBuffer 
   */


  draw(gl, mode, offset, count, elementBuffer = null) {
    draw(gl, mode, offset, count, elementBuffer);
    return this.parent;
  }

}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
var ProgramUniformEnums = {
  // WebGL1
  FLOAT: 0x1406,
  FLOAT_VEC2: 0x8B50,
  FLOAT_VEC3: 0x8B51,
  FLOAT_VEC4: 0x8B52,
  INT: 0x1404,
  INT_VEC2: 0x8B53,
  INT_VEC3: 0x8B54,
  INT_VEC4: 0x8B55,
  BOOL: 0x8B56,
  BOOL_VEC2: 0x8B57,
  BOOL_VEC3: 0x8B58,
  BOOL_VEC4: 0x8B59,
  FLOAT_MAT2: 0x8B5A,
  FLOAT_MAT3: 0x8B5B,
  FLOAT_MAT4: 0x8B5C,
  SAMPLER_2D: 0x8B5E,
  SAMPLER_CUBE: 0x8B60,
  // WebGL2
  UNSIGNED_INT: 0x1405,
  UNSIGNED_INT_VEC2: 0x8DC6,
  UNSIGNED_INT_VEC3: 0x8DC7,
  UNSIGNED_INT_VEC4: 0x8DC8,
  FLOAT_MAT2x3: 0x8B65,
  FLOAT_MAT2x4: 0x8B66,
  FLOAT_MAT3x2: 0x8B67,
  FLOAT_MAT3x4: 0x8B68,
  FLOAT_MAT4x2: 0x8B69,
  FLOAT_MAT4x3: 0x8B6A,
  SAMPLER_3D: 0x8B5F,
  SAMPLER_2D_SHADOW: 0x8B62,
  SAMPLER_2D_ARRAY: 0x8DC1,
  SAMPLER_2D_ARRAY_SHADOW: 0x8DC4,
  SAMPLER_CUBE_SHADOW: 0x8DC5,
  INT_SAMPLER_2D: 0x8DCA,
  INT_SAMPLER_3D: 0x8DCB,
  INT_SAMPLER_CUBE: 0x8DCC,
  INT_SAMPLER_2D_ARRAY: 0x8DCF,
  UNSIGNED_INT_SAMPLER_2D: 0x8DD2,
  UNSIGNED_INT_SAMPLER_3D: 0x8DD3,
  UNSIGNED_INT_SAMPLER_CUBE: 0x8DD4,
  UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8DD7
};

exports.ATTRIBUTE_ENUMS = ProgramAttributeEnums;
exports.BUFFER_ENUMS = BufferEnums;
exports.BufferBuilder = BufferBuilder;
exports.BufferDataContext = BufferDataContext;
exports.BufferInfo = BufferInfo;
exports.BufferInfoBindContext = BufferInfoBindContext;
exports.BufferInfoBuilder = BufferInfoBuilder;
exports.ProgramBuilder = ProgramBuilder;
exports.ProgramInfo = ProgramInfo;
exports.ProgramInfoBuilder = ProgramInfoBuilder;
exports.ProgramInfoDrawContext = ProgramInfoDrawContext;
exports.UNIFORM_ENUMS = ProgramUniformEnums;
exports.createBufferSource = createBufferSource;
exports.createShader = createShader;
exports.createShaderProgram = createShaderProgram;
exports.draw = draw;
exports.getActiveAttribs = getActiveAttribs;
exports.getActiveAttribsInfo = getActiveAttribsInfo;
exports.getActiveUniforms = getActiveUniforms;
exports.getActiveUniformsInfo = getActiveUniformsInfo;
exports.getAttribVertexSize = getAttribVertexSize;
exports.getBufferTypedArray = getBufferTypedArray;
exports.getBufferUsage = getBufferUsage;
exports.getTypedArrayBufferType = getTypedArrayBufferType;
exports.getUniformFunction = getUniformFunction;
exports.getUniformFunctionForArray = getUniformFunctionForArray;
exports.getUniformFunctionForComponent = getUniformFunctionForComponent;
exports.isWebGL2Supported = isWebGL2Supported;
