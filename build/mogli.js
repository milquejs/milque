(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Mogli = {}));
}(this, function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * Common utilities
   * @module glMatrix
   */
  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  var degree = Math.PI / 180;

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
   * @param {mat3} a the matrix to rotate
   * @param {vec2} v the vec2 to scale the matrix by
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
   * @param {vec2} v Translation vector
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
   * @param {vec2} v Scaling vector
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
  * @param {mat4} a Mat4 to derive the normal matrix from
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
   * @param {mat4} a the source matrix
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
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
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
   * @param {mat4} a the matrix to translate
   * @param {vec3} v vector to translate by
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
   * @param {mat4} a the matrix to scale
   * @param {vec3} v the vec3 to scale the matrix by
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
   * @param {vec3} v Translation vector
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
   * @param {vec3} v Scaling vector
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
   * @param {vec3} v Translation vector
   * @param {vec3} s Scaling vector
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
   * @param {vec3} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
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
   * Normalize a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to normalize
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
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  /**
   * Computes the cross product of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
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
   * @param {vec3} a the vector to transform
   * @param {mat4} m matrix to transform with
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
   * @param {vec3} a the vector to transform
   * @param {mat3} m the 3x3 matrix to transform with
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
   * Normalize a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to normalize
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
   * @param {vec3} axis the axis around which to rotate
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
   * @param {quat} a the first operand
   * @param {quat} b the second operand
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
   * @param {mat3} m rotation matrix
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
   * Normalize a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quaternion to normalize
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
   * @param {vec3} a the initial vector
   * @param {vec3} b the destination vector
   * @returns {quat} out
   */

  var rotationTo = function () {
    var tmpvec3 = create$2();
    var xUnitVec3 = fromValues(1, 0, 0);
    var yUnitVec3 = fromValues(0, 1, 0);
    return function (out, a, b) {
      var dot$1 = dot(a, b);

      if (dot$1 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
        normalize(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot$1 > 0.999999) {
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
        out[3] = 1 + dot$1;
        return normalize$2(out, out);
      }
    };
  }();
  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {quat} c the third operand
   * @param {quat} d the fourth operand
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
   * @param {vec3} view  the vector representing the viewing direction
   * @param {vec3} right the vector representing the local "right" direction
   * @param {vec3} up    the vector representing the local "up" direction
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

  function create$5() {
    return {
      translation: create$2(),
      rotation: create$4(),
      scale: fromValues(1, 1, 1)
    };
  }
  function getTransformationMatrix(transform) {
    var dst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : create$1();
    return fromRotationTranslationScale(dst, transform.rotation, transform.translation, transform.scale);
  }

  var Transform = /*#__PURE__*/Object.freeze({
    create: create$5,
    getTransformationMatrix: getTransformationMatrix
  });

  var SceneGraph =
  /*#__PURE__*/
  function () {
    function SceneGraph() {
      _classCallCheck(this, SceneGraph);

      this.root = this.createSceneNode(create$5(), null);
    }

    _createClass(SceneGraph, [{
      key: "update",
      value: function update() {
        this.root.updateWorldMatrix();
      }
    }, {
      key: "createSceneNode",
      value: function createSceneNode() {
        var transform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : create$5();
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.root;
        var result = {
          sceneGraph: this,
          transform: transform,
          localMatrix: create$1(),
          worldMatrix: create$1(),
          parent: null,
          children: [],
          setParent: function setParent(sceneNode) {
            if (this.parent) {
              var index = this.parent.children.indexOf(this);
              this.parent.children.splice(index, 1);
            }

            if (sceneNode) {
              sceneNode.children.push(this);
            }

            this.parent = parent;
            return this;
          },
          updateWorldMatrix: function updateWorldMatrix(parentWorldMatrix) {
            // NOTE: The reason we don't just use local matrix is because of accumulating errors on matrix updates.
            // Consider when you scale from 0 to 1 over time. It would get stuck at 0. Using a "source" of data where we
            // recompute the matrix prevents this.
            getTransformationMatrix(this.transform, this.localMatrix);

            if (parentWorldMatrix) {
              multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix);
            } else {
              copy(this.worldMatrix, this.localMatrix);
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var child = _step.value;
                child.updateWorldMatrix(this.worldMatrix);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
        };

        if (parent) {
          result.setParent(parent);
        }

        return result;
      }
    }]);

    return SceneGraph;
  }();

  function create$6(position, texcoord, normal, indices) {
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

    if (!color) {
      var r = Math.random();
      var g = Math.random();
      var b = Math.random();
      color = [];

      for (var i = 0; i < position.length; i += 3) {
        color.push(r, g, b);
      }
    }

    return {
      position: position,
      texcoord: texcoord,
      normal: normal,
      indices: indices,
      color: color,
      elementSize: 3,
      elementCount: indices.length
    };
  }
  function applyColor(r, g, b, geometry) {
    for (var i = 0; i < geometry.color.length; i += 3) {
      geometry.color[i + 0] = r;
      geometry.color[i + 1] = g;
      geometry.color[i + 2] = b;
    }

    return geometry;
  }
  function applyTransformation(transformationMatrix, geometry) {
    var position = geometry.position;
    var normal = geometry.normal;
    var inverseTransposeMatrix = create();
    normalFromMat4(inverseTransposeMatrix, transformationMatrix);
    var result = create$2();

    for (var i = 0; i < position.length; i += 3) {
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
  function joinGeometry() {
    var position = [];
    var texcoord = [];
    var normal = [];
    var indices = [];
    var color = [];
    var indexCount = 0;

    for (var _len = arguments.length, geometries = new Array(_len), _key = 0; _key < _len; _key++) {
      geometries[_key] = arguments[_key];
    }

    for (var _i = 0, _geometries = geometries; _i < _geometries.length; _i++) {
      var geometry = _geometries[_i];
      position.push.apply(position, _toConsumableArray(geometry.position));
      texcoord.push.apply(texcoord, _toConsumableArray(geometry.texcoord));
      normal.push.apply(normal, _toConsumableArray(geometry.normal));
      color.push.apply(color, _toConsumableArray(geometry.color));

      for (var i = 0; i < geometry.indices.length; ++i) {
        var index = geometry.indices[i];
        indices.push(index + indexCount);
      }

      indexCount += geometry.position.length / 3;
    }

    return create$6(position, texcoord, normal, indices, color);
  }

  function create$7() {
    var centered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var x = 0;
    var y = 0;
    var z = 0;
    var width = 1;
    var height = 1;
    var position;

    if (centered) {
      var halfWidth = width * 0.5;
      var halfHeight = height * 0.5;
      position = [x - halfWidth, y - halfHeight, z, x + halfWidth, y - halfHeight, z, x - halfWidth, y + halfHeight, z, x + halfWidth, y + halfHeight, z];
    } else {
      position = [x, y, z, x + width, y, z, x, y + height, z, x + width, y + height, z];
    }

    var texcoord = [0, 0, 1, 0, 0, 1, 1, 1];
    var normal = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    var indices = [0, 1, 2, 2, 1, 3];
    return create$6(position, texcoord, normal, indices);
  }

  var QuadGeometry = /*#__PURE__*/Object.freeze({
    create: create$7
  });

  function create$8() {
    var doubleSided = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var frontPlane = create$7(true);

    if (doubleSided) {
      var backPlane = create$7(true);
      var transformationMatrix = fromYRotation(create$1(), Math.PI);
      applyTransformation(transformationMatrix, backPlane);
      applyColor(frontPlane.color[0], frontPlane.color[1], frontPlane.color[2], backPlane);
      return joinGeometry(frontPlane, backPlane);
    } else {
      return frontPlane;
    }
  }

  var PlaneGeometry = /*#__PURE__*/Object.freeze({
    create: create$8
  });

  function create$9() {
    var front = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var back = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var bottom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var left = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var right = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    var HALF_PI = Math.PI / 2;
    var halfWidth = 0.5;
    var halfHeight = 0.5;
    var halfDepth = 0.5;
    var transformationMatrix = create$1();
    var faces = []; // Front

    if (front) {
      var frontPlane = create$8(false);
      fromTranslation$1(transformationMatrix, [0, 0, halfDepth]);
      applyTransformation(transformationMatrix, frontPlane);
      faces.push(frontPlane);
    } // Top


    if (top) {
      var topPlane = create$8(false);
      fromXRotation(transformationMatrix, -HALF_PI);
      translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
      applyTransformation(transformationMatrix, topPlane);
      faces.push(topPlane);
    } // Back


    if (back) {
      var backPlane = create$8(false);
      fromYRotation(transformationMatrix, Math.PI);
      translate(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
      applyTransformation(transformationMatrix, backPlane);
      faces.push(backPlane);
    } // Bottom


    if (bottom) {
      var bottomPlane = create$8(false);
      fromXRotation(transformationMatrix, HALF_PI);
      translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
      applyTransformation(transformationMatrix, bottomPlane);
      faces.push(bottomPlane);
    } // Left


    if (left) {
      var leftPlane = create$8(false);
      fromYRotation(transformationMatrix, -HALF_PI);
      translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
      applyTransformation(transformationMatrix, leftPlane);
      faces.push(leftPlane);
    } // Right


    if (right) {
      var rightPlane = create$8(false);
      fromYRotation(transformationMatrix, HALF_PI);
      translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
      applyTransformation(transformationMatrix, rightPlane);
      faces.push(rightPlane);
    }

    return joinGeometry.apply(void 0, faces);
  }

  var CubeGeometry = /*#__PURE__*/Object.freeze({
    create: create$9
  });

  function create$a() {
    var size = 1;
    var fifthSize = size * 0.2;
    var transformationMatrix = create$1();
    var topRung = create$9(true, true, true, true, false, true);
    fromTranslation$1(transformationMatrix, [fifthSize / 2, fifthSize * 2, 0]);
    scale$1(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize, fifthSize]);
    applyTransformation(transformationMatrix, topRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
    var bottomRung = create$9(true, true, true, true, false, true);
    fromScaling$1(transformationMatrix, [fifthSize, fifthSize, fifthSize]);
    applyTransformation(transformationMatrix, bottomRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);
    var leftBase = create$9(true, true, true, true, true, true);
    fromTranslation$1(transformationMatrix, [-fifthSize, 0, 0]);
    scale$1(transformationMatrix, transformationMatrix, [fifthSize, size, fifthSize]);
    applyTransformation(transformationMatrix, leftBase);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);
    return joinGeometry(leftBase, topRung, bottomRung);
  }

  var GlyphFGeometry = /*#__PURE__*/Object.freeze({
    create: create$a
  });



  var Geometry3D = /*#__PURE__*/Object.freeze({
    Quad: QuadGeometry,
    Plane: PlaneGeometry,
    Cube: CubeGeometry,
    GlyphF: GlyphFGeometry,
    create: create$6,
    applyColor: applyColor,
    applyTransformation: applyTransformation,
    joinGeometry: joinGeometry
  });

  function create$b(position, texcoord, indices) {
    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

    if (!color) {
      var r = Math.random();
      var g = Math.random();
      var b = Math.random();
      color = [];

      for (var i = 0; i < position.length; i += 3) {
        color.push(r, g, b);
      }
    }

    return {
      position: position,
      texcoord: texcoord,
      indices: indices,
      color: color,
      elementSize: 2,
      elementCount: indices.length
    };
  }
  function applyTransformation2D(transformationMatrix, geometry) {
    var position = geometry.position;
    var result = vec2.create();

    for (var i = 0; i < position.length; i += 2) {
      result[0] = position[i + 0];
      result[1] = position[i + 1];
      vec3.transformMat3(result, result, transformationMatrix);
      position[i + 0] = result[0];
      position[i + 1] = result[1];
    }

    return geometry;
  }
  function joinGeometry2D() {
    var position = [];
    var texcoord = [];
    var indices = [];
    var color = [];
    var indexCount = 0;

    for (var _len = arguments.length, geometries = new Array(_len), _key = 0; _key < _len; _key++) {
      geometries[_key] = arguments[_key];
    }

    for (var _i = 0, _geometries = geometries; _i < _geometries.length; _i++) {
      var geometry = _geometries[_i];
      position.push.apply(position, _toConsumableArray(geometry.position));
      texcoord.push.apply(texcoord, _toConsumableArray(geometry.texcoord));
      color.push.apply(color, _toConsumableArray(geometry.color));

      for (var i = 0; i < geometry.indices.length; ++i) {
        var index = geometry.indices[i];
        indices.push(index + indexCount);
      }

      indexCount += geometry.position.length / 2;
    }

    return create$b(position, texcoord, indices, color);
  }

  function create$c() {
    var centered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var x = 0;
    var y = 0;
    var width = 1;
    var height = 1;
    var position;

    if (centered) {
      var halfWidth = width * 0.5;
      var halfHeight = height * 0.5;
      position = [x - halfWidth, y - halfHeight, x + halfWidth, y - halfHeight, x - halfWidth, y + halfHeight, x + halfWidth, y + halfHeight];
    } else {
      position = [x, y, x + width, y, x, y + height, x + width, y + height];
    }

    var texcoord = [0, 0, 1, 0, 0, 1, 1, 1];
    var indices = [0, 1, 2, 2, 1, 3];
    return create$b(position, texcoord, indices);
  }

  var Quad2DGeometry = /*#__PURE__*/Object.freeze({
    create: create$c
  });

  function create$d() {
    var size = 1;
    var fifthSize = size * 0.2;
    var transformationMatrix = create();
    var topRung = create$c();
    fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2]);
    scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize]);
    applyTransformation2D(transformationMatrix, topRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
    var bottomRung = create$c();
    fromScaling(transformationMatrix, [fifthSize, fifthSize]);
    applyTransformation2D(transformationMatrix, bottomRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);
    var leftBase = create$c();
    fromTranslation(transformationMatrix, [-fifthSize, 0]);
    scale(transformationMatrix, transformationMatrix, [fifthSize, size]);
    applyTransformation2D(transformationMatrix, leftBase);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);
    return joinGeometry2D(leftBase, topRung, bottomRung);
  }

  var GlyphF2DGeometry = /*#__PURE__*/Object.freeze({
    create: create$d
  });



  var Geometry2D = /*#__PURE__*/Object.freeze({
    Quad2D: Quad2DGeometry,
    GlyphF2D: GlyphF2DGeometry,
    create: create$b,
    applyTransformation2D: applyTransformation2D,
    joinGeometry2D: joinGeometry2D,
    applyColor2D: applyColor
  });

  function createShaderProgramInfo(gl, vertexShaderSource, fragmentShaderSource) {
    var sharedAttributeLayout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var vertexShaderHandle = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShaderHandle = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var programHandle = createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout); // Don't forget to clean up the shaders! It's no longer needed...

    gl.detachShader(programHandle, vertexShaderHandle);
    gl.detachShader(programHandle, fragmentShaderHandle);
    gl.deleteShader(vertexShaderHandle);
    gl.deleteShader(fragmentShaderHandle); // But do keep around the program :P

    return {
      handle: programHandle,
      _gl: gl,
      uniforms: createShaderProgramUniformSetters(gl, programHandle),
      attributes: createShaderProgramAttributeSetters(gl, programHandle),
      uniform: function uniform(name, value) {
        // If the uniform exists, since it may have been optimized away by the compiler :(
        if (name in this.uniforms) {
          this.uniforms[name](this._gl, value);
        }

        return this;
      },
      attribute: function attribute(name, bufferInfo) {
        // If the attribute exists, since it may have been optimized away by the compiler :(
        if (name in this.attributes) {
          this.attributes[name](this._gl, bufferInfo);
        }

        return this;
      },
      elementAttribute: function elementAttribute(bufferInfo) {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo);

        return this;
      }
    };
  }
  function createShader(gl, type, source) {
    var shaderHandle = gl.createShader(type);
    gl.shaderSource(shaderHandle, source);
    gl.compileShader(shaderHandle);

    if (!gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS)) {
      var result = gl.getShaderInfoLog(shaderHandle);
      gl.deleteShader(shaderHandle);
      throw new Error(result);
    }

    return shaderHandle;
  }
  function createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle) {
    var sharedAttributeLayout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var programHandle = gl.createProgram();
    gl.attachShader(programHandle, vertexShaderHandle);
    gl.attachShader(programHandle, fragmentShaderHandle); // Bind the attribute locations, (either this or use 'layout(location = ?)' in the shader)
    // NOTE: Unfortunately, this must happen before program linking to take effect.

    for (var i = 0; i < sharedAttributeLayout.length; ++i) {
      gl.bindAttribLocation(programHandle, i, sharedAttributeLayout[i]);
    }

    gl.linkProgram(programHandle);

    if (!gl.getProgramParameter(programHandle, gl.LINK_STATUS)) {
      var result = gl.getProgramInfoLog(programHandle);
      gl.deleteProgram(programHandle);
      throw new Error(result);
    }

    return programHandle;
  }
  function createShaderProgramAttributeSetters(gl, programHandle) {
    var dst = {};
    var attributeCount = gl.getProgramParameter(programHandle, gl.ACTIVE_ATTRIBUTES);

    for (var i = 0; i < attributeCount; ++i) {
      var activeAttributeInfo = gl.getActiveAttrib(programHandle, i);
      if (!activeAttributeInfo) break;
      var attributeName = activeAttributeInfo.name;
      var attributeIndex = gl.getAttribLocation(programHandle, attributeName);
      dst[attributeName] = createShaderProgramAttributeSetter(attributeIndex);
    }

    return dst;
  }
  function createShaderProgramAttributeSetter(attributeIndex) {
    var result = function (attributeIndex, gl, bufferInfo) {
      gl.enableVertexAttribArray(attributeIndex);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.handle);
      gl.vertexAttribPointer(attributeIndex, bufferInfo.size, bufferInfo.type, bufferInfo.normalize, bufferInfo.stride, bufferInfo.offset);
    }.bind(null, attributeIndex);

    result.location = attributeIndex;
    return result;
  }
  function createShaderProgramUniformSetters(gl, programHandle) {
    var dst = {};
    var ctx = {
      textureUnit: 0
    };
    var uniformCount = gl.getProgramParameter(programHandle, gl.ACTIVE_UNIFORMS);

    for (var i = 0; i < uniformCount; ++i) {
      var activeUniformInfo = gl.getActiveUniform(programHandle, i);
      if (!activeUniformInfo) break;
      var uniformName = activeUniformInfo.name;

      if (uniformName.substring(uniformName.length - 3) === '[0]') {
        uniformName = uniformName.substring(0, uniformName.length - 3);
      }

      var uniformSetter = createShaderProgramUniformSetter(gl, programHandle, activeUniformInfo, ctx);
      dst[uniformName] = uniformSetter;
    }

    return dst;
  }
  function createShaderProgramUniformSetter(gl, programHandle, uniformInfo, ctx) {
    var name = uniformInfo.name;
    var location = gl.getUniformLocation(programHandle, name);
    var type = uniformInfo.type;
    var array = uniformInfo.size > 1 && name.substring(name.length - 3) === '[0]';
    var uniformTypeInfo = getUniformTypeInfo(gl, type);

    if (!uniformTypeInfo) {
      throw new Error("Unknown uniform type 0x".concat(type.toString(16), "."));
    }

    switch (type) {
      case gl.FLOAT:
      case gl.INT:
      case gl.BOOL:
        return uniformTypeInfo.setter(location, array);

      case gl.SAMPLER_2D:
      case gl.SAMPLER_CUBE:
        var textureUnit;

        if (array) {
          textureUnit = [];

          for (var i = 0; i < uniformInfo.size; ++i) {
            textureUnit.push(ctx.textureUnit++);
          }
        } else {
          textureUnit = ctx.textureUnit++;
        }

        return uniformTypeInfo.setter(location, array, textureUnit);

      default:
        return uniformTypeInfo.setter(location);
    }
  }
  var UNIFORM_TYPE_MAP = null;
  function getUniformTypeInfo(gl, type) {
    var _UNIFORM_TYPE_MAP;

    if (UNIFORM_TYPE_MAP) return UNIFORM_TYPE_MAP[type]; // NOTE: Instead of setting the active texture index for the sampler, we instead designate
    // active texture indices based on the program and number of sampler uniforms it has.
    // This way, we simply pass the texture handle to the uniform setter and it will find
    // the associated texture index by name. This is okay since we usually expect each
    // program to have it's own unqiue active texture list, therefore we can take advantage
    // of the reassignment of sampler uniforms to perform a lookup first instead.
    // This does mean that when creating a texture, you don't need to specify which active
    // texture index it should be in. This is handled by the shader program initialization,
    // and is assigned when the program is used.

    function samplerSetter(textureTarget, location) {
      var array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var textureUnit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      if (array && !Array.isArray(textureUnit)) throw new Error('Cannot create sampler array for non-array texture unit.');
      var result = (array ? function (location, textureUnits, textureTarget, gl, textures) {
        gl.uniform1fv(location, textureUnits);
        textures.forEach(function (texture, index) {
          gl.activeTexture(gl.TEXTURE0 + textureUnits[index]);
          gl.bindTexture(textureTarget, texture);
        });
      } : function (location, textureUnit, textureTarget, gl, texture) {
        gl.uniform1i(location, textureUnit);
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(textureTarget, texture);
      }).bind(null, location, textureUnit, textureTarget);
      result.location = location;
      return result;
    }

    UNIFORM_TYPE_MAP = (_UNIFORM_TYPE_MAP = {}, _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT, {
      TypedArray: Float32Array,
      size: 4,
      setter: function setter(location) {
        var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var result = (array ? function (location, gl, value) {
          gl.uniform1fv(location, value);
        } : function (location, gl, value) {
          gl.uniform1f(location, value);
        }).bind(null, location);
        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_VEC2, {
      TypedArray: Float32Array,
      size: 8,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniform2fv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_VEC3, {
      TypedArray: Float32Array,
      size: 12,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniform3fv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_VEC4, {
      TypedArray: Float32Array,
      size: 16,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniform4fv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.INT, {
      TypedArray: Int32Array,
      size: 4,
      setter: function setter(location) {
        var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var result = (array ? function (location, gl, value) {
          gl.uniform1iv(location, value);
        } : function (location, gl, value) {
          gl.uniform1i(location, value);
        }).bind(null, location);
        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.INT_VEC2, {
      TypedArray: Int32Array,
      size: 8,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniform2iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.INT_VEC3, {
      TypedArray: Int32Array,
      size: 12,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniform3iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.INT_VEC4, {
      TypedArray: Int32Array,
      size: 16,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniform4iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.BOOL, {
      TypedArray: Uint32Array,
      size: 4,
      setter: function setter(location) {
        var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var result = (array ? function (location, gl, value) {
          gl.uniform1iv(location, value);
        } : function (location, gl, value) {
          gl.uniform1i(location, value);
        }).bind(null, location);
        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.BOOL_VEC2, {
      TypedArray: Uint32Array,
      size: 8,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniform2iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.BOOL_VEC3, {
      TypedArray: Uint32Array,
      size: 12,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniform3iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.BOOL_VEC4, {
      TypedArray: Uint32Array,
      size: 16,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniform4iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_MAT2, {
      TypedArray: Float32Array,
      size: 16,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniformMatrix2fv(location, false, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_MAT3, {
      TypedArray: Float32Array,
      size: 36,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniformMatrix3fv(location, false, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_MAT4, {
      TypedArray: Float32Array,
      size: 64,
      setter: function setter(location) {
        var result = function (location, gl, value) {
          gl.uniformMatrix4fv(location, false, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.SAMPLER_2D, {
      TypedArray: null,
      size: 0,
      setter: samplerSetter.bind(null, gl.TEXTURE_2D)
    }), _defineProperty(_UNIFORM_TYPE_MAP, gl.SAMPLER_CUBE, {
      TypedArray: null,
      size: 0,
      setter: samplerSetter.bind(null, gl.TEXTURE_CUBE)
    }), _UNIFORM_TYPE_MAP);
    return UNIFORM_TYPE_MAP[type];
  }

  function createBufferInfo(gl, type, data, size) {
    var normalize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var stride = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var offset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var bufferTarget = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : gl.ARRAY_BUFFER;
    var usage = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : gl.STATIC_DRAW;
    var bufferHandle = gl.createBuffer();
    var bufferTypeInfo = getBufferTypeInfo(gl, type);
    if (!bufferTypeInfo) throw new Error("Unknown uniform type 0x".concat(type.toString(16), "."));

    if (data instanceof bufferTypeInfo.TypedArray) {
      gl.bindBuffer(bufferTarget, bufferHandle);
      gl.bufferData(bufferTarget, data, usage);
    } else if (Array.isArray(data)) {
      data = new bufferTypeInfo.TypedArray(data);
      gl.bindBuffer(bufferTarget, bufferHandle);
      gl.bufferData(bufferTarget, data, usage);
    } else if (typeof data === 'number') {
      gl.bindBuffer(bufferTarget, bufferHandle);
      gl.bufferData(bufferTarget, data, usage);
    } else {
      throw new Error("Unknown buffer data type - can only be a TypedArray, an Array, or a number.");
    }

    return {
      handle: bufferHandle,
      size: size,
      type: type,
      normalize: normalize,
      stride: stride,
      offset: offset,

      /** TODO: It binds the buffer to ARRAY_BUFFER, does this still work for ELEMENT_ARRAY_BUFFER? */
      updateData: function updateData(gl, data) {
        var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var usage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : gl.STATIC_DRAW;
        // NOTE: All vertex array objects should NOT be bound. Otherwise, it will cause weird errors.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
        var bufferTypeInfo = getBufferTypeInfo(gl, type);

        if (!(data instanceof bufferTypeInfo.TypedArray)) {
          data = new bufferTypeInfo.TypedArray(data);
        }

        if (offset > 0) {
          gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
        } else {
          gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        }
      }
    };
  }
  function createElementBufferInfo(gl, type, data) {
    var stride = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var usage = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : gl.STATIC_DRAW;
    // NOTE: Element buffer arrays can only be UNSIGNED bytes/shorts/ints.
    return createBufferInfo(gl, type, data, 1, false, stride, offset, gl.ELEMENT_ARRAY_BUFFER, usage);
  }
  var BUFFER_TYPE_MAP = null;
  function getBufferTypeInfo(gl, type) {
    var _BUFFER_TYPE_MAP;

    if (BUFFER_TYPE_MAP) return BUFFER_TYPE_MAP[type];
    BUFFER_TYPE_MAP = (_BUFFER_TYPE_MAP = {}, _defineProperty(_BUFFER_TYPE_MAP, gl.BYTE, {
      TypedArray: Int8Array,
      size: 1
    }), _defineProperty(_BUFFER_TYPE_MAP, gl.SHORT, {
      TypedArray: Int16Array,
      size: 2
    }), _defineProperty(_BUFFER_TYPE_MAP, gl.UNSIGNED_BYTE, {
      TypedArray: Uint8Array,
      size: 1
    }), _defineProperty(_BUFFER_TYPE_MAP, gl.UNSIGNED_SHORT, {
      TypedArray: Uint16Array,
      size: 2
    }), _defineProperty(_BUFFER_TYPE_MAP, gl.FLOAT, {
      TypedArray: Float32Array,
      size: 4
    }), _BUFFER_TYPE_MAP);
    return BUFFER_TYPE_MAP[type];
  }

  function createVertexArrayInfo(gl) {
    var sharedAttributeLayout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var vertexArrayHandle = gl.createVertexArray();
    var attributes = {};

    for (var i = 0; i < sharedAttributeLayout.length; ++i) {
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
      setElementCount: function setElementCount(count) {
        this.elementCount = count;
        return this;
      },
      elementAttribute: function elementAttribute(bufferInfo) {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo.handle);

        var bufferTypeInfo = getBufferTypeInfo(this._gl, bufferInfo.type); // NOTE: Number of bytes in buffer divided by the number of bytes of element type

        this.elementCount = this._gl.getBufferParameter(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.BUFFER_SIZE) / bufferTypeInfo.size;
        this.elementBuffer = bufferInfo;
        this.elementType = bufferInfo.type;
        return this;
      },
      sharedAttribute: function sharedAttribute(name, bufferInfo) {
        if (name in this.attributes) {
          this.attributes[name].setter(this._gl, bufferInfo);
        }

        this.attributeBuffers[name] = bufferInfo;
        return this;
      },
      programAttribute: function programAttribute(name, bufferInfo) {
        for (var _len = arguments.length, programInfos = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          programInfos[_key - 2] = arguments[_key];
        }

        for (var _i = 0, _programInfos = programInfos; _i < _programInfos.length; _i++) {
          var program = _programInfos[_i];
          program.attribute(name, bufferInfo);
        }

        this.attributeBuffers[name] = bufferInfo;
        return this;
      }
    };
  }

  function createTextureInfo(gl) {
    var textureHandle = gl.createTexture();
    return {
      handle: textureHandle
    };
  }

  function createDrawInfo(programInfo, vertexArrayInfo, uniforms) {
    var drawArrayOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var drawMode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    return {
      programInfo: programInfo,
      vertexArrayInfo: vertexArrayInfo,
      uniforms: uniforms,
      drawArrayOffset: drawArrayOffset,
      drawMode: drawMode
    };
  }
  function draw(gl, drawInfos) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = drawInfos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var drawInfo = _step.value;
        var programInfo = drawInfo.programInfo;
        var vertexArrayInfo = drawInfo.vertexArrayInfo;
        var uniforms = drawInfo.uniforms;
        var drawArrayOffset = drawInfo.drawArrayOffset;
        var drawMode = drawInfo.drawMode || gl.TRIANGLES; // Prepare program

        gl.useProgram(programInfo.handle); // Prepare vertex array

        gl.bindVertexArray(vertexArrayInfo.handle); // Prepare uniforms

        for (var _i = 0, _Object$entries = Object.entries(uniforms); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              name = _Object$entries$_i[0],
              value = _Object$entries$_i[1];

          programInfo.uniform(name, value);
        } // Depends on buffers in attributes...


        if (vertexArrayInfo.elementBuffer) {
          // NOTE: The offset is in BYTES, whereas drawArrayOffset is the number of elements.
          gl.drawElements(drawMode, vertexArrayInfo.elementCount, vertexArrayInfo.elementType, drawArrayOffset * vertexArrayInfo.elementBuffer.size);
        } else {
          gl.drawArrays(drawMode, drawArrayOffset, vertexArrayInfo.elementCount);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  exports.Geometry = Geometry3D;
  exports.Geometry2D = Geometry2D;
  exports.SceneGraph = SceneGraph;
  exports.Transform = Transform;
  exports.createBufferInfo = createBufferInfo;
  exports.createDrawInfo = createDrawInfo;
  exports.createElementBufferInfo = createElementBufferInfo;
  exports.createShader = createShader;
  exports.createShaderProgram = createShaderProgram;
  exports.createShaderProgramAttributeSetter = createShaderProgramAttributeSetter;
  exports.createShaderProgramAttributeSetters = createShaderProgramAttributeSetters;
  exports.createShaderProgramInfo = createShaderProgramInfo;
  exports.createShaderProgramUniformSetter = createShaderProgramUniformSetter;
  exports.createShaderProgramUniformSetters = createShaderProgramUniformSetters;
  exports.createTextureInfo = createTextureInfo;
  exports.createVertexArrayInfo = createVertexArrayInfo;
  exports.draw = draw;
  exports.getBufferTypeInfo = getBufferTypeInfo;
  exports.getUniformTypeInfo = getUniformTypeInfo;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
