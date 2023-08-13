import { isWebGL2Supported } from '../GLHelper.js';

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
export function getUniformFunction(gl, uniformType) {
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
export function getUniformComponentFunction(gl, uniformType) {
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
export function getUniformArrayFunction(gl, uniformType) {
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
  m22,
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
  m33,
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
  m23,
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
  m32,
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
