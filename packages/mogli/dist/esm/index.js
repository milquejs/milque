/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create() {
  var out = new ARRAY_TYPE(9);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Translation vector
 * @returns {mat3} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat3} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
 *
 * @returns {mat3} out
 */

function normalFromMat4(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$1() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$1(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation$1(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling$1(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$2() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$1(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create$2();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$3() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */

function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$1 = function () {
  var vec = create$3();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
}();

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create$4() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */

var set$1 = set;
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize$2 = normalize$1;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

var rotationTo = function () {
  var tmpvec3 = create$2();
  var xUnitVec3 = fromValues(1, 0, 0);
  var yUnitVec3 = fromValues(0, 1, 0);
  return function (out, a, b) {
    var dot = dot$1(a, b);

    if (dot < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
      normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize$2(out, out);
    }
  };
}();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

var sqlerp = function () {
  var temp1 = create$4();
  var temp2 = create$4();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
}();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

var setAxes = function () {
  var matr = create();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize$2(out, fromMat3(out, matr));
  };
}();

const ORIGIN = fromValues(0, 0, 0);
const XAXIS = fromValues(1, 0, 0);
const YAXIS = fromValues(0, 1, 0);
const ZAXIS = fromValues(0, 0, 1);

function create$5()
{
    return {
        translation: create$2(),
        rotation: create$4(),
        scale: fromValues(1, 1, 1)
    };
}

/** This is the INVERSE of gluLookAt(). */
function lookAt(transform, target = ORIGIN)
{
    const result = create$2();
    subtract(result, target, transform.position);
    normalize(result, result);
    
    const dotProduct = dot$1(ZAXIS, result);
    if (Math.abs(dotProduct - (-1)) < Number.EPSILON)
    {
        set$1(transform.rotation, 0, 0, 1, Math.PI);
        return transform;
    }
    if (Math.abs(dot - 1) < Number.EPSILON)
    {
        set$1(transform.rotation, 0, 0, 0, 1);
        return transform;
    }

    cross(result, ZAXIS, result);
    normalize(result, result);
    const halfAngle = Math.acos(dotProduct) / 2;
    const sineAngle = Math.sin(halfAngle);
    transform.rotation[0] = result[0] * sineAngle;
    transform.rotation[1] = result[1] * sineAngle;
    transform.rotation[2] = result[2] * sineAngle;
    transform.rotation[3] = Math.cos(halfAngle);
    return transform;
}

function getTransformationMatrix(transform, dst = create$1())
{
    return fromRotationTranslationScale(dst, transform.rotation, transform.translation, transform.scale);
}

function getForwardVector(transform, dst = create$2())
{
    transformQuat(dst, ZAXIS, transform.rotation);
    return dst;
}

function getUpVector(transform, dst = create$2())
{
    transformQuat(dst, YAXIS, transform.rotation);
    return dst;
}

function getRightVector(transform, dst = create$2())
{
    transformQuat(dst, XAXIS, transform.rotation);
    return dst;
}

var Transform = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ORIGIN: ORIGIN,
  XAXIS: XAXIS,
  YAXIS: YAXIS,
  ZAXIS: ZAXIS,
  create: create$5,
  lookAt: lookAt,
  getTransformationMatrix: getTransformationMatrix,
  getForwardVector: getForwardVector,
  getUpVector: getUpVector,
  getRightVector: getRightVector
});

class SceneGraph
{
    constructor()
    {
        this.root = this.createSceneNode(create$5(), null);
    }
    
    update()
    {
        this.root.updateWorldMatrix();
    }

    createSceneNode(transform = create$5(), parent = this.root)
    {
        const result = {
            sceneGraph: this,
            transform,
            localMatrix: create$1(),
            worldMatrix: create$1(),
            parent: null,
            children: [],
            setParent(sceneNode)
            {
                if (this.parent)
                {
                    const index = this.parent.children.indexOf(this);
                    this.parent.children.splice(index, 1);
                }

                if (sceneNode)
                {
                    sceneNode.children.push(this);
                }

                this.parent = parent;
                return this;
            },
            updateWorldMatrix(parentWorldMatrix)
            {
                // NOTE: The reason we don't just use local matrix is because of accumulating errors on matrix updates.
                // Consider when you scale from 0 to 1 over time. It would get stuck at 0. Using a "source" of data where we
                // recompute the matrix prevents this.
                getTransformationMatrix(this.transform, this.localMatrix);

                if (parentWorldMatrix)
                {
                    multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix);
                }
                else
                {
                    copy(this.worldMatrix, this.localMatrix);
                }

                for(const child of this.children)
                {
                    child.updateWorldMatrix(this.worldMatrix);
                }
            }
        };

        if (parent)
        {
            result.setParent(parent);
        }
        return result;
    }
}

function create$6(position, texcoord, normal, indices, color = undefined)
{
    if (!color)
    {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        color = [];
        for(let i = 0; i < position.length; i += 3)
        {
            color.push(r, g, b);
        }
    }

    return {
        position,
        texcoord,
        normal,
        indices,
        color,
        elementSize: 3,
        elementCount: indices.length,
    };
}

function applyColor(r, g, b, geometry)
{
    for(let i = 0; i < geometry.color.length; i += 3)
    {
        geometry.color[i + 0] = r;
        geometry.color[i + 1] = g;
        geometry.color[i + 2] = b;
    }
    return geometry;
}

function applyTransformation(transformationMatrix, geometry)
{
    const position = geometry.position;
    const normal = geometry.normal;

    const inverseTransposeMatrix = create();
    normalFromMat4(inverseTransposeMatrix, transformationMatrix);

    const result = create$2();
    for(let i = 0; i < position.length; i += 3)
    {
        result[0] = position[i + 0];
        result[1] = position[i + 1];
        result[2] = position[i + 2];
        transformMat4(result, result, transformationMatrix);
        position[i + 0] = result[0];
        position[i + 1] = result[1];
        position[i + 2] = result[2];

        result[0] = normal[i + 0];
        result[1] = normal[i + 1];
        result[2] = normal[i + 2];
        transformMat3(result, result, inverseTransposeMatrix);
        normal[i + 0] = result[0];
        normal[i + 1] = result[1];
        normal[i + 2] = result[2];
    }

    return geometry;
}

function joinGeometry(...geometries)
{
    const position = [];
    const texcoord = [];
    const normal = [];
    const indices = [];
    const color = [];

    let indexCount = 0;
    for(const geometry of geometries)
    {
        position.push(...geometry.position);
        texcoord.push(...geometry.texcoord);
        normal.push(...geometry.normal);
        color.push(...geometry.color);
        indices.push(...geometry.indices.map((value) => value + indexCount));

        indexCount += geometry.position.length / 3;
    }

    return create$6(position, texcoord, normal, indices, color);
}

function create$7(centered = false)
{
    const x = 0;
    const y = 0;
    const z = 0;
    const width = 1;
    const height = 1;
    
    let position;
    if (centered)
    {
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;
        position = [
            x - halfWidth, y - halfHeight, z,
            x + halfWidth, y - halfHeight, z,
            x - halfWidth, y + halfHeight, z,
            x + halfWidth, y + halfHeight, z,
        ];
    }
    else
    {
        position = [
            x, y, z,
            x + width, y, z,
            x, y + height, z,
            x + width, y + height, z,
        ];
    }

    const texcoord = [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    const normal = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ];
    const indices = [
        0, 1, 2,
        2, 1, 3,
    ];
    
    return create$6(position, texcoord, normal, indices);
}

var QuadGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$7
});

function create$8(doubleSided = true)
{
    const frontPlane = create$7(true);
    if (doubleSided)
    {
        const backPlane = create$7(true);
        const transformationMatrix = fromYRotation(create$1(), Math.PI);
        applyTransformation(transformationMatrix, backPlane);
        applyColor(frontPlane.color[0], frontPlane.color[1], frontPlane.color[2], backPlane);
        return joinGeometry(frontPlane, backPlane);
    }
    else
    {
        return frontPlane;
    }
}

var PlaneGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$8
});

function create$9(front = true, back = true, top = true, bottom = true, left = true, right = true)
{
    const HALF_PI = Math.PI / 2;
    const halfWidth = 0.5;
    const halfHeight = 0.5;
    const halfDepth = 0.5;

    const transformationMatrix = create$1();
    const faces = [];
    
    // Front
    if (front)
    {
        const frontPlane = create$8(false);
        fromTranslation$1(transformationMatrix, [0, 0, halfDepth]);
        applyTransformation(transformationMatrix, frontPlane);
        faces.push(frontPlane);
    }
    // Top
    if (top)
    {
        const topPlane = create$8(false);
        fromXRotation(transformationMatrix, -HALF_PI);
        translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, topPlane);
        faces.push(topPlane);
    }
    // Back
    if (back)
    {
        const backPlane = create$8(false);
        fromYRotation(transformationMatrix, Math.PI);
        translate(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
        applyTransformation(transformationMatrix, backPlane);
        faces.push(backPlane);
    }
    // Bottom
    if (bottom)
    {
        const bottomPlane = create$8(false);
        fromXRotation(transformationMatrix, HALF_PI);
        translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, bottomPlane);
        faces.push(bottomPlane);
    }
    // Left
    if (left)
    {
        const leftPlane = create$8(false);
        fromYRotation(transformationMatrix, -HALF_PI);
        translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, leftPlane);
        faces.push(leftPlane);
    }
    // Right
    if (right)
    {
        const rightPlane = create$8(false);
        fromYRotation(transformationMatrix, HALF_PI);
        translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, rightPlane);
        faces.push(rightPlane);
    }

    return joinGeometry(...faces);
}

var CubeGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$9
});

function create$a()
{
    const size = 1;
    const fifthSize = size * 0.2;

    const transformationMatrix = create$1();

    const topRung = create$9(true, true, true, true, false, true);
    fromTranslation$1(transformationMatrix, [fifthSize / 2, fifthSize * 2, 0]);
    scale$1(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize, fifthSize]);
    applyTransformation(transformationMatrix, topRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
    
    const bottomRung = create$9(true, true, true, true, false, true);
    fromScaling$1(transformationMatrix, [fifthSize, fifthSize, fifthSize]);
    applyTransformation(transformationMatrix, bottomRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);

    const leftBase = create$9(true, true, true, true, true, true);
    fromTranslation$1(transformationMatrix, [-fifthSize, 0, 0]);
    scale$1(transformationMatrix, transformationMatrix, [fifthSize, size, fifthSize]);
    applyTransformation(transformationMatrix, leftBase);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);

    return joinGeometry(leftBase, topRung, bottomRung);
}

var GlyphFGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$a
});

var Geometry3D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Quad: QuadGeometry,
  Plane: PlaneGeometry,
  Cube: CubeGeometry,
  GlyphF: GlyphFGeometry,
  create: create$6,
  applyColor: applyColor,
  applyTransformation: applyTransformation,
  joinGeometry: joinGeometry
});

function create$b(position, texcoord, indices, color = undefined)
{
    if (!color)
    {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        color = [];
        for(let i = 0; i < position.length; i += 3)
        {
            color.push(r, g, b);
        }
    }

    return {
        position,
        texcoord,
        indices,
        color,
        elementSize: 2,
        elementCount: indices.length,
    };
}

function applyTransformation2D(transformationMatrix, geometry)
{
    const position = geometry.position;

    const result = vec2.create();
    for(let i = 0; i < position.length; i += 2)
    {
        result[0] = position[i + 0];
        result[1] = position[i + 1];
        vec3.transformMat3(result, result, transformationMatrix);
        position[i + 0] = result[0];
        position[i + 1] = result[1];
    }

    return geometry;
}

function joinGeometry2D(...geometries)
{
    const position = [];
    const texcoord = [];
    const indices = [];
    const color = [];

    let indexCount = 0;
    for(const geometry of geometries)
    {
        position.push(...geometry.position);
        texcoord.push(...geometry.texcoord);
        color.push(...geometry.color);

        for(let i = 0; i < geometry.indices.length; ++i)
        {
            const index = geometry.indices[i];
            indices.push(index + indexCount);
        }

        indexCount += geometry.position.length / 2;
    }

    return create$b(position, texcoord, indices, color);
}

function create$c(centered = false)
{
    const x = 0;
    const y = 0;
    const width = 1;
    const height = 1;
    
    let position;
    if (centered)
    {
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;
        position = [
            x - halfWidth, y - halfHeight,
            x + halfWidth, y - halfHeight,
            x - halfWidth, y + halfHeight,
            x + halfWidth, y + halfHeight,
        ];
    }
    else
    {
        position = [
            x, y,
            x + width, y,
            x, y + height,
            x + width, y + height,
        ];
    }

    const texcoord = [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    const indices = [
        0, 1, 2,
        2, 1, 3,
    ];
    
    return create$b(position, texcoord, indices);
}

var Quad2DGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$c
});

function create$d()
{
    const size = 1;
    const fifthSize = size * 0.2;

    const transformationMatrix = create();

    const topRung = create$c();
    fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2]);
    scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize]);
    applyTransformation2D(transformationMatrix, topRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
    
    const bottomRung = create$c();
    fromScaling(transformationMatrix, [fifthSize, fifthSize]);
    applyTransformation2D(transformationMatrix, bottomRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);

    const leftBase = create$c();
    fromTranslation(transformationMatrix, [-fifthSize, 0]);
    scale(transformationMatrix, transformationMatrix, [fifthSize, size]);
    applyTransformation2D(transformationMatrix, leftBase);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);

    return joinGeometry2D(leftBase, topRung, bottomRung);
}

var GlyphF2DGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$d
});

var Geometry2D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Quad2D: Quad2DGeometry,
  GlyphF2D: GlyphF2DGeometry,
  applyColor2D: applyColor,
  create: create$b,
  applyTransformation2D: applyTransformation2D,
  joinGeometry2D: joinGeometry2D
});

function createShaderProgramInfo(gl, vertexShaderSource, fragmentShaderSource, sharedAttributeLayout = [])
{
    const vertexShaderHandle = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShaderHandle = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const programHandle = createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout);

    // Don't forget to clean up the shaders! It's no longer needed...
    gl.detachShader(programHandle, vertexShaderHandle);
    gl.detachShader(programHandle, fragmentShaderHandle);
    gl.deleteShader(vertexShaderHandle);
    gl.deleteShader(fragmentShaderHandle);

    // But do keep around the program :P
    return {
        handle: programHandle,
        _gl: gl,
        uniforms: createShaderProgramUniformSetters(gl, programHandle),
        attributes: createShaderProgramAttributeSetters(gl, programHandle),
        uniform(name, value)
        {
            // If the uniform exists, since it may have been optimized away by the compiler :(
            if (name in this.uniforms)
            {
                this.uniforms[name](this._gl, value);
            }
            return this;
        },
        attribute(name, bufferInfo)
        {
            // If the attribute exists, since it may have been optimized away by the compiler :(
            if (name in this.attributes)
            {
                this.attributes[name](this._gl, bufferInfo);
            }
            return this;
        },
        elementAttribute(bufferInfo)
        {
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo);
            return this;
        }
    };
}

function createShader(gl, type, source)
{
    const shaderHandle = gl.createShader(type);
    gl.shaderSource(shaderHandle, source);
    gl.compileShader(shaderHandle);
    if (!gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS))
    {
        const result = gl.getShaderInfoLog(shaderHandle);
        gl.deleteShader(shaderHandle);
        throw new Error(result);
    }
    return shaderHandle;
}

function createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout = [])
{
    const programHandle = gl.createProgram();
    gl.attachShader(programHandle, vertexShaderHandle);
    gl.attachShader(programHandle, fragmentShaderHandle);

    // Bind the attribute locations, (either this or use 'layout(location = ?)' in the shader)
    // NOTE: Unfortunately, this must happen before program linking to take effect.
    for(let i = 0; i < sharedAttributeLayout.length; ++i)
    {
        gl.bindAttribLocation(programHandle, i, sharedAttributeLayout[i]);
    }

    gl.linkProgram(programHandle);
    if (!gl.getProgramParameter(programHandle, gl.LINK_STATUS))
    {
        const result = gl.getProgramInfoLog(programHandle);
        gl.deleteProgram(programHandle);
        throw new Error(result);
    }
    return programHandle;
}

function createShaderProgramAttributeSetters(gl, programHandle)
{
    const dst = {};
    const attributeCount = gl.getProgramParameter(programHandle, gl.ACTIVE_ATTRIBUTES);
    for(let i = 0; i < attributeCount; ++i)
    {
        const activeAttributeInfo = gl.getActiveAttrib(programHandle, i);
        if (!activeAttributeInfo) break;
        const attributeName = activeAttributeInfo.name;
        const attributeIndex = gl.getAttribLocation(programHandle, attributeName);
        dst[attributeName] = createShaderProgramAttributeSetter(attributeIndex);
    }
    return dst;
}

function createShaderProgramAttributeSetter(attributeIndex)
{
    const result = (function(attributeIndex, gl, bufferInfo) {
        gl.enableVertexAttribArray(attributeIndex);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.handle);
        gl.vertexAttribPointer(attributeIndex,
            bufferInfo.size,
            bufferInfo.type,
            bufferInfo.normalize,
            bufferInfo.stride,
            bufferInfo.offset);
    }).bind(null, attributeIndex);
    result.location = attributeIndex;
    return result;
}

function createShaderProgramUniformSetters(gl, programHandle)
{
    const dst = {};
    const ctx = {
        textureUnit: 0
    };
    const uniformCount = gl.getProgramParameter(programHandle, gl.ACTIVE_UNIFORMS);
    for(let i = 0; i < uniformCount; ++i)
    {
        const activeUniformInfo = gl.getActiveUniform(programHandle, i);
        if (!activeUniformInfo) break;

        let uniformName = activeUniformInfo.name;
        if (uniformName.substring(uniformName.length - 3) === '[0]')
        {
            uniformName = uniformName.substring(0, uniformName.length - 3);
        }
        const uniformSetter = createShaderProgramUniformSetter(gl, programHandle, activeUniformInfo, ctx);
        dst[uniformName] = uniformSetter;
    }
    return dst;
}

function createShaderProgramUniformSetter(gl, programHandle, uniformInfo, ctx)
{
    const name = uniformInfo.name;
    const location = gl.getUniformLocation(programHandle, name);
    const type = uniformInfo.type;
    const array = (uniformInfo.size > 1 && name.substring(name.length - 3) === '[0]');

    const uniformTypeInfo = getUniformTypeInfo(gl, type);
    if (!uniformTypeInfo)
    {
        throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);
    }

    switch(type)
    {
        case gl.FLOAT:
        case gl.INT:
        case gl.BOOL:
            return uniformTypeInfo.setter(location, array);
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            let textureUnit;
            if (array)
            {
                textureUnit = [];
                for(let i = 0; i < uniformInfo.size; ++i)
                {
                    textureUnit.push(ctx.textureUnit++);
                }
            }
            else
            {
                textureUnit = ctx.textureUnit++;
            }
            return uniformTypeInfo.setter(location, array, textureUnit);
        default:
            return uniformTypeInfo.setter(location);
    }
}

let UNIFORM_TYPE_MAP = null;
function getUniformTypeInfo(gl, type)
{
    if (UNIFORM_TYPE_MAP) return UNIFORM_TYPE_MAP[type];

    // NOTE: Instead of setting the active texture index for the sampler, we instead designate
    // active texture indices based on the program and number of sampler uniforms it has.
    // This way, we simply pass the texture handle to the uniform setter and it will find
    // the associated texture index by name. This is okay since we usually expect each
    // program to have it's own unqiue active texture list, therefore we can take advantage
    // of the reassignment of sampler uniforms to perform a lookup first instead.
    // This does mean that when creating a texture, you don't need to specify which active
    // texture index it should be in. This is handled by the shader program initialization,
    // and is assigned when the program is used.
    function samplerSetter(textureTarget, location, array = false, textureUnit = 0)
    {
        if (array && !Array.isArray(textureUnit)) throw new Error('Cannot create sampler array for non-array texture unit.');
        const result = (array
            ? function(location, textureUnits, textureTarget, gl, textures) {
                gl.uniform1fv(location, textureUnits);
                textures.forEach((texture, index) => {
                    gl.activeTexture(gl.TEXTURE0 + textureUnits[index]);
                    gl.bindTexture(textureTarget, texture);
                });
            }
            : function(location, textureUnit, textureTarget, gl, texture) {
                gl.uniform1i(location, textureUnit);
                gl.activeTexture(gl.TEXTURE0 + textureUnit);
                gl.bindTexture(textureTarget, texture);
            })
            .bind(null, location, textureUnit, textureTarget);
        result.location = location;
        return result;
    }

    UNIFORM_TYPE_MAP = {
        [gl.FLOAT]: {
            TypedArray: Float32Array,
            size: 4,
            setter(location, array = false)
            {
                const result = (array
                    ? function(location, gl, value) { gl.uniform1fv(location, value); }
                    : function(location, gl, value) { gl.uniform1f(location, value); })
                    .bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_VEC2]: {
            TypedArray: Float32Array,
            size: 8,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform2fv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_VEC3]: {
            TypedArray: Float32Array,
            size: 12,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform3fv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_VEC4]: {
            TypedArray: Float32Array,
            size: 16,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform4fv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.INT]: {
            TypedArray: Int32Array,
            size: 4,
            setter(location, array = false)
            {
                const result = (array
                    ? function(location, gl, value) { gl.uniform1iv(location, value); }
                    : function(location, gl, value) { gl.uniform1i(location, value); })
                    .bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.INT_VEC2]: {
            TypedArray: Int32Array,
            size: 8,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform2iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.INT_VEC3]: {
            TypedArray: Int32Array,
            size: 12,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform3iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.INT_VEC4]: {
            TypedArray: Int32Array,
            size: 16,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform4iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.BOOL]: {
            TypedArray: Uint32Array,
            size: 4,
            setter(location, array = false)
            {
                const result = (array
                    ? function(location, gl, value) { gl.uniform1iv(location, value); }
                    : function(location, gl, value) { gl.uniform1i(location, value); })
                    .bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.BOOL_VEC2]: {
            TypedArray: Uint32Array,
            size: 8,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform2iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.BOOL_VEC3]: {
            TypedArray: Uint32Array,
            size: 12,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform3iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.BOOL_VEC4]: {
            TypedArray: Uint32Array,
            size: 16,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform4iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_MAT2]: {
            TypedArray: Float32Array,
            size: 16,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniformMatrix2fv(location, false, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_MAT3]: {
            TypedArray: Float32Array,
            size: 36,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniformMatrix3fv(location, false, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_MAT4]: {
            TypedArray: Float32Array,
            size: 64,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniformMatrix4fv(location, false, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.SAMPLER_2D]: {
            TypedArray: null,
            size: 0,
            setter: samplerSetter.bind(null, gl.TEXTURE_2D)
        },
        [gl.SAMPLER_CUBE]: {
            TypedArray: null,
            size: 0,
            setter: samplerSetter.bind(null, gl.TEXTURE_CUBE)
        },
        // UNSIGNED_INT
        // UNSIGNED_INT_VEC2
        // UNSIGNED_INT_VEC3
        // UNSIGNED_INT_VEC4
        // FLOAT_MAT2x3
        // FLOAT_MAT2x4
        // FLOAT_MAT3x2
        // FLOAT_MAT3x4
        // FLOAT_MAT4x2
        // FLOAT_MAT4x3
        // SAMPLER_3D
        // SAMPLER_2D_SHADOW
        // SAMPLER_2D_ARRAY
        // SAMPLER_2D_ARRAY_SHADOW
        // INT_SAMPLER_2D
        // INT_SAMPLER_3D
        // INT_SAMPLER_CUBE
        // INT_SAMPLER_2D_ARRAY
        // UNSIGNED_INT_SAMPLER_2D
        // UNSIGNED_INT_SAMPLER_3D
        // UNSIGNED_INT_SAMPLER_CUBE
        // UNSIGNED_INT_SAMPLER_2D_ARRAY
    };
    return UNIFORM_TYPE_MAP[type];
}

function createBufferInfo(gl, type, data, size, normalize = false, stride = 0, offset = 0, bufferTarget = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW)
{
    const bufferHandle = gl.createBuffer();

    const bufferTypeInfo = getBufferTypeInfo(gl, type);
    if (!bufferTypeInfo) throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);    

    if (data instanceof bufferTypeInfo.TypedArray)
    {
        gl.bindBuffer(bufferTarget, bufferHandle);
        gl.bufferData(bufferTarget, data, usage);
    }
    else if (Array.isArray(data))
    {
        data = new bufferTypeInfo.TypedArray(data);
        gl.bindBuffer(bufferTarget, bufferHandle);
        gl.bufferData(bufferTarget, data, usage);
    }
    else if (typeof data === 'number')
    {
        gl.bindBuffer(bufferTarget, bufferHandle);
        gl.bufferData(bufferTarget, data, usage);
    }
    else
    {
        throw new Error(`Unknown buffer data type - can only be a TypedArray, an Array, or a number.`);
    }

    return {
        handle: bufferHandle,
        size,
        type,
        normalize,
        stride,
        offset,
        /** TODO: It binds the buffer to ARRAY_BUFFER, does this still work for ELEMENT_ARRAY_BUFFER? */
        updateData(gl, data, offset = 0, usage = gl.STATIC_DRAW)
        {
            // NOTE: All vertex array objects should NOT be bound. Otherwise, it will cause weird errors.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
            const bufferTypeInfo = getBufferTypeInfo(gl, type);
            if (!(data instanceof bufferTypeInfo.TypedArray))
            {
                data = new bufferTypeInfo.TypedArray(data);
            }

            if (offset > 0)
            {
                gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
            }
            else
            {
                gl.bufferData(gl.ARRAY_BUFFER, data, usage);
            }
        }
    };
}

function createElementBufferInfo(gl, type, data, stride = 0, offset = 0, usage = gl.STATIC_DRAW)
{
    // NOTE: Element buffer arrays can only be UNSIGNED bytes/shorts/ints.
    return createBufferInfo(gl, type, data, 1, false, stride, offset, gl.ELEMENT_ARRAY_BUFFER, usage);
}

let BUFFER_TYPE_MAP = null;
function getBufferTypeInfo(gl, type)
{
    if (BUFFER_TYPE_MAP) return BUFFER_TYPE_MAP[type];

    BUFFER_TYPE_MAP = {
        [gl.BYTE]: {
            TypedArray: Int8Array,
            size: 1
        },
        [gl.SHORT]: {
            TypedArray: Int16Array,
            size: 2
        },
        [gl.UNSIGNED_BYTE]: {
            TypedArray: Uint8Array,
            size: 1
        },
        [gl.UNSIGNED_SHORT]: {
            TypedArray: Uint16Array,
            size: 2
        },
        [gl.FLOAT]: {
            TypedArray: Float32Array,
            size: 4
        },
        // HALF_FLOAT
    };

    return BUFFER_TYPE_MAP[type];
}

function createVertexArrayInfo(gl, sharedAttributeLayout = [])
{
    const vertexArrayHandle = gl.createVertexArray();

    const attributes = {};
    for(let i = 0; i < sharedAttributeLayout.length; ++i)
    {
        attributes[sharedAttributeLayout[i]] = {
            location: i,
            setter: createShaderProgramAttributeSetter(i)
        };
    }

    return {
        handle: vertexArrayHandle,
        attributes: attributes,
        _gl: gl,
        elementBuffer: null,
        elementType: null,
        elementCount: 0,
        attributeBuffers: {},
        setElementCount(count)
        {
            this.elementCount = count;
            return this;
        },
        elementAttribute(bufferInfo)
        {
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo.handle);

            const bufferTypeInfo = getBufferTypeInfo(this._gl, bufferInfo.type);
            // NOTE: Number of bytes in buffer divided by the number of bytes of element type
            this.elementCount = this._gl.getBufferParameter(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.BUFFER_SIZE) / bufferTypeInfo.size;
            this.elementBuffer = bufferInfo;
            this.elementType = bufferInfo.type;
            return this;
        },
        sharedAttribute(name, bufferInfo)
        {
            if (name in this.attributes)
            {
                this.attributes[name].setter(this._gl, bufferInfo);
            }
            this.attributeBuffers[name] = bufferInfo;
            return this;
        },
        programAttribute(name, bufferInfo, ...programInfos)
        {
            for(const program of programInfos)
            {
                program.attribute(name, bufferInfo);
            }
            this.attributeBuffers[name] = bufferInfo;
            return this;
        }
    };
}

function createTextureInfo(gl)
{
    const textureHandle = gl.createTexture();
    return {
        handle: textureHandle
    };
}

function createDrawInfo(programInfo, vertexArrayInfo, uniforms, drawArrayOffset = 0, drawMode = null)
{
    return {
        programInfo,
        vertexArrayInfo,
        uniforms,
        drawArrayOffset,
        drawMode
    };
}

function draw(gl, drawInfos, sharedUniforms = {})
{
    for(const drawInfo of drawInfos)
    {
        const programInfo = drawInfo.programInfo;
        const vertexArrayInfo = drawInfo.vertexArrayInfo;
        const uniforms = drawInfo.uniforms;
        const drawArrayOffset = drawInfo.drawArrayOffset;
        const drawMode = drawInfo.drawMode || gl.TRIANGLES;

        // Prepare program...
        gl.useProgram(programInfo.handle);

        // Prepare vertex array...
        gl.bindVertexArray(vertexArrayInfo.handle);

        // Prepare shared uniforms...
        for(const [name, value] of Object.entries(sharedUniforms))
        {
            programInfo.uniform(name, value);
        }

        // Prepare uniforms...
        for(const [name, value] of Object.entries(uniforms))
        {
            programInfo.uniform(name, value);
        }

        // Depends on buffers in attributes...
        if (vertexArrayInfo.elementBuffer)
        {
            // NOTE: The offset is in BYTES, whereas drawArrayOffset is the number of elements.
            gl.drawElements(drawMode, vertexArrayInfo.elementCount, vertexArrayInfo.elementType, drawArrayOffset * vertexArrayInfo.elementBuffer.size);
        }
        else
        {
            gl.drawArrays(drawMode, drawArrayOffset, vertexArrayInfo.elementCount);
        }
    }
}

export { Geometry3D as Geometry, Geometry2D, SceneGraph, Transform, createBufferInfo, createDrawInfo, createElementBufferInfo, createShader, createShaderProgram, createShaderProgramAttributeSetter, createShaderProgramAttributeSetters, createShaderProgramInfo, createShaderProgramUniformSetter, createShaderProgramUniformSetters, createTextureInfo, createVertexArrayInfo, draw, getBufferTypeInfo, getUniformTypeInfo };
