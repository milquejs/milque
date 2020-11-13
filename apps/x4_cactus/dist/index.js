(function () {
  'use strict';

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
   * Set a mat4 to the identity matrix
   *
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */

  function identity(out) {
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
   * Generates a perspective projection matrix with the given bounds.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} fovy Vertical field of view in radians
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum, can be null or Infinity
   * @returns {mat4} out
   */

  function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }

    return out;
  }
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {ReadonlyVec3} eye Position of the viewer
   * @param {ReadonlyVec3} center Point the viewer is looking at
   * @param {ReadonlyVec3} up vec3 pointing up
   * @returns {mat4} out
   */

  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];

    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);

    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);

    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
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
   * Set the components of a vec3 to the given values
   *
   * @param {vec3} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} out
   */

  function set(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Adds two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */

  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  /**
   * Scales a vec3 by a scalar number
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec3} out
   */

  function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
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

  function dot(a, b) {
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
   * Creates a new vec4 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} a new 4D vector
   */

  function fromValues$1(x, y, z, w) {
    var out = new ARRAY_TYPE(4);
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

  const MODE_NOSCALE = 'noscale';
  const MODE_CENTER = 'center';
  const MODE_FIT = 'fit';
  const MODE_STRETCH = 'stretch';

  const DEFAULT_MODE = MODE_NOSCALE;
  const DEFAULT_WIDTH = 300;
  const DEFAULT_HEIGHT = 150;

  const INNER_HTML = `
<div class="container">
    <label class="hidden" id="title">display-port</label>
    <label class="hidden" id="fps">00</label>
    <label class="hidden" id="dimension">0x0</label>
    <canvas></canvas>
    <slot></slot>
</div>`;
  const INNER_STYLE = `
:host {
    display: inline-block;
    color: #555555;
}
.container {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
}
canvas {
    background: #000000;
    margin: auto;
    image-rendering: pixelated;
}
label {
    font-family: monospace;
    color: currentColor;
    position: absolute;
}
#title {
    left: 0.5rem;
    top: 0.5rem;
}
#fps {
    right: 0.5rem;
    top: 0.5rem;
}
#dimension {
    left: 0.5rem;
    bottom: 0.5rem;
}
.hidden {
    display: none;
}
:host([debug]) .container {
    outline: 6px dashed rgba(0, 0, 0, 0.1);
    outline-offset: -4px;
    background-color: rgba(0, 0, 0, 0.1);
}
:host([mode="${MODE_NOSCALE}"]) canvas {
    margin: 0;
    top: 0;
    left: 0;
}
:host([mode="${MODE_FIT}"]), :host([mode="${MODE_CENTER}"]), :host([mode="${MODE_STRETCH}"]) {
    width: 100%;
    height: 100%;
}
:host([full]) {
    width: 100vw!important;
    height: 100vh!important;
}
:host([disabled]) {
    display: none;
}
slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    pointer-events: none;
}
::slotted(*) {
    pointer-events: auto;
}`;

  const TEMPLATE_KEY = Symbol('template');
  const STYLE_KEY = Symbol('style');

  /**
   * @version 1.2.2
   * @description
   * # Changelog
   * ## 1.2.2
   * - Removed 'contexttype'
   * ## 1.2.1
   * - Added 'contexttype' for getContext()
   * ## 1.2.0
   * - Moved template creation to static time
   * - Removed default export
   * ## 1.1.2
   * - Added clear()
   * - Added delta time for frame events
   * ## 1.1.1
   * - Added onframe and onresize attribute callbacks
   * - Added "stretch" mode
   * ## 1.1.0
   * - Changed "topleft" to "noscale"
   * - Changed default size to 640 x 480
   * - Changed "center" and "fit" to fill container instead of viewport
   * - Added "full" property to override and fill viewport
   * ## 1.0.2
   * - Moved default values to the top
   * ## 1.0.1
   * - Fixed scaling issues when dimensions do not match
   * ## 1.0.0
   * - Created DisplayPort
   * 
   * @fires frame Every time a new frame is rendered.
   * @fires resize When the display is resized.
   */
  class DisplayPort extends HTMLElement
  {
      static get [TEMPLATE_KEY]()
      {
          let template = document.createElement('template');
          template.innerHTML = INNER_HTML;
          Object.defineProperty(this, TEMPLATE_KEY, { value: template });
          return template;
      }

      static get [STYLE_KEY]()
      {
          let style = document.createElement('style');
          style.innerHTML = INNER_STYLE;
          Object.defineProperty(this, STYLE_KEY, { value: style });
          return style;
      }

      /** @override */
      static get observedAttributes()
      {
          return [
              'width',
              'height',
              'disabled',
              // Event handlers...
              'onframe',
              /*
              // NOTE: Already handled by GlobalEventHandlers...
              'onresize',
              */
              // NOTE: For debuggin purposes...
              'debug',
              // ...listening for built-in attribs...
              'id',
              'class',
          ];
      }

      constructor()
      {
          super();

          this.attachShadow({ mode: 'open' });
          this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
          this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

          this._canvasElement = this.shadowRoot.querySelector('canvas');

          this._titleElement = this.shadowRoot.querySelector('#title');
          this._fpsElement = this.shadowRoot.querySelector('#fps');
          this._dimensionElement = this.shadowRoot.querySelector('#dimension');

          this._animationRequestHandle = 0;
          this._prevAnimationFrameTime = 0;

          this._width = DEFAULT_WIDTH;
          this._height = DEFAULT_HEIGHT;

          this._onframe = null;
          /*
          // NOTE: Already handled by GlobalEventHandlers...
          this._onresize = null;
          */

          this.update = this.update.bind(this);
      }

      get canvas() { return this._canvasElement; }
      
      /** @override */
      connectedCallback()
      {
          if (!this.hasAttribute('mode')) this.mode = DEFAULT_MODE;
          
          // Allows this element to be focusable
          if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', 0);

          this.updateCanvasSize();
          this.resume();
      }

      /** @override */
      disconnectedCallback()
      {
          this.pause();
      } 

      /** @override */
      attributeChangedCallback(attribute, prev, value)
      {
          switch(attribute)
          {
              case 'width':
                  this._width = value;
                  break;
              case 'height':
                  this._height = value;
                  break;
              case 'disabled':
                  if (value)
                  {
                      this.update(0);
                      this.pause();
                  }
                  else
                  {
                      this.resume();
                  }
                  break;
              // Event handlers...
              case 'onframe':
                  this.onframe = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                  break;
              /*
              // NOTE: Already handled by GlobalEventHandlers...
              case 'onresize':
                  this.onresize = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                  break;
              */
              // NOTE: For debugging purposes...
              case 'id':
              case 'class':
                  this._titleElement.innerHTML = `display-port${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
                  break;
              case 'debug':
                  this._titleElement.classList.toggle('hidden', value);
                  this._fpsElement.classList.toggle('hidden', value);
                  this._dimensionElement.classList.toggle('hidden', value);
                  break;
          }
      }

      update(now)
      {
          this._animationRequestHandle = requestAnimationFrame(this.update);

          this.updateCanvasSize();
          const deltaTime = now - this._prevAnimationFrameTime;
          this._prevAnimationFrameTime = now;

          // NOTE: For debugging purposes...
          if (this.debug)
          {
              // Update FPS...
              const frames = deltaTime <= 0 ? '--' : String(Math.round(1000 / deltaTime)).padStart(2, '0');
              if (this._fpsElement.innerText !== frames)
              {
                  this._fpsElement.innerText = frames;
              }

              // Update dimensions...
              if (this.mode === MODE_NOSCALE)
              {
                  let result = `${this._width}x${this._height}`;
                  if (this._dimensionElement.innerText !== result)
                  {
                      this._dimensionElement.innerText = result;
                  }
              }
              else
              {
                  let result = `${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;
                  if (this._dimensionElement.innerText !== result)
                  {
                      this._dimensionElement.innerText = result;
                  }
              }
          }

          this.dispatchEvent(new CustomEvent('frame', {
              detail: {
                  now,
                  prevTime: this._prevAnimationFrameTime,
                  deltaTime: deltaTime,
                  canvas: this._canvasElement,
                  /** @deprecated */
                  get context() { let ctx = this.canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; return ctx; },
              },
              bubbles: false,
              composed: true
          }));
      }

      pause()
      {
          cancelAnimationFrame(this._animationRequestHandle);
      }

      resume()
      {
          this._animationRequestHandle = requestAnimationFrame(this.update);
      }
      
      updateCanvasSize()
      {
          let clientRect = this.shadowRoot.host.getBoundingClientRect();
          const clientWidth = clientRect.width;
          const clientHeight = clientRect.height;

          let canvas = this._canvasElement;
          let canvasWidth = this._width;
          let canvasHeight = this._height;

          const mode = this.mode;

          if (mode === MODE_STRETCH)
          {
              canvasWidth = clientWidth;
              canvasHeight = clientHeight;
          }
          else if (mode !== MODE_NOSCALE)
          {
              let flag = clientWidth < canvasWidth || clientHeight < canvasHeight || mode === MODE_FIT;
              if (flag)
              {
                  let ratioX = clientWidth / canvasWidth;
                  let ratioY = clientHeight / canvasHeight;

                  if (ratioX < ratioY)
                  {
                      canvasWidth = clientWidth;
                      canvasHeight = canvasHeight * ratioX;
                  }
                  else
                  {
                      canvasWidth = canvasWidth * ratioY;
                      canvasHeight = clientHeight;
                  }
              }
          }

          canvasWidth = Math.floor(canvasWidth);
          canvasHeight = Math.floor(canvasHeight);

          if (canvas.clientWidth !== canvasWidth || canvas.clientHeight !== canvasHeight)
          {
              canvas.width = this._width;
              canvas.height = this._height;
              canvas.style = `width: ${canvasWidth}px; height: ${canvasHeight}px`;
              this.dispatchEvent(new CustomEvent('resize', { detail: { width: canvasWidth, height: canvasHeight }, bubbles: false, composed: true }));
          }
      }

      /*
      // NOTE: Already handled by GlobalEventHandlers...
      get onresize() { return this._onresize; }
      set onresize(value)
      {
          if (this._onresize) this.removeEventListener('resize', this._onresize);
          this._onresize = value;
          if (this._onresize) this.addEventListener('resize', value);
      }
      */

      get onframe() { return this._onframe; }
      set onframe(value)
      {
          if (this._onframe) this.removeEventListener('frame', this._onframe);
          this._onframe = value;
          if (this._onframe) this.addEventListener('frame', value);
      }

      get width() { return this._width; }
      set width(value) { this.setAttribute('width', value); }

      get height() { return this._height; }
      set height(value) { this.setAttribute('height', value); }

      get mode() { return this.getAttribute('mode'); }
      set mode(value) { this.setAttribute('mode', value); }

      get disabled() { return this.hasAttribute('disabled'); }
      set disabled(value) { if (value) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }

      // NOTE: For debugging purposes...
      get debug() { return this.hasAttribute('debug'); }
      set debug(value) { if (value) this.setAttribute('debug', ''); else this.removeAttribute('debug'); }
  }
  window.customElements.define('display-port', DisplayPort);

  class InputDevice
  {
      /** @abstract */
      static addInputEventListener(elementTarget, listener) {}
      
      /** @abstract */
      static removeInputEventListener(elementTarget, listener) {}

      constructor(eventTarget)
      {
          this.eventTarget = eventTarget;
      }
  }

  class Button
  {
      constructor()
      {
          this.down = 0;
          this.up = 0;
          this.value = 0;

          this.next = {
              up: 0,
              down: 0,
          };
      }

      update(event, value)
      {
          if (event === 'down')
          {
              this.next.down = value;
          }
          else
          {
              this.next.up = value;
          }
      }

      poll()
      {
          if (this.value)
          {
              if (this.up && !this.next.up)
              {
                  this.value = 0;
              }
          }
          else if (this.next.down)
          {
              this.value = 1;
          }

          this.down = this.next.down;
          this.up = this.next.up;

          this.next.down = 0;
          this.next.up = 0;
      }

      /** @override */
      toString()
      {
          return this.value;
      }
  }

  class Axis
  {
      constructor()
      {
          this.value = 0;
      }

      update(event, value)
      {
          this.value = value;
      }

      poll() {}

      /** @override */
      toString()
      {
          return this.value;
      }
  }

  class AggregatedAxis extends Axis
  {
      constructor()
      {
          super();

          this.next = 0;
      }

      /** @override */
      update(event, value)
      {
          this.next += value;
      }

      /** @override */
      poll()
      {
          this.value = this.next;
          this.next = 0;
      }
  }

  const KEYBOARD_CONTEXT_KEY = Symbol('keyboardEventContext');

  class Keyboard extends InputDevice
  {
      /** @override */
      static addInputEventListener(eventTarget, listener)
      {
          let ctx;
          if (!(KEYBOARD_CONTEXT_KEY in listener))
          {
              ctx = {
                  handler: listener,
                  target: eventTarget,
                  down: null,
                  up: null,
                  _keyEvent: {
                      type: 'key',
                      target: eventTarget,
                      device: 'keyboard',
                      key: null,
                      event: null,
                      value: null,
                      control: false,
                      shift: false,
                      alt: false,
                  },
              };
      
              let down = onKeyDown.bind(ctx);
              let up = onKeyUp.bind(ctx);
          
              ctx.down = down;
              ctx.up = up;
          
              listener[KEYBOARD_CONTEXT_KEY] = ctx;
          }
          else
          {
              ctx = listener[KEYBOARD_CONTEXT_KEY];
          }

          eventTarget.addEventListener('keyup', ctx.up);
          eventTarget.addEventListener('keydown', ctx.down);
      
          return eventTarget;
      }

      /** @override */
      static removeInputEventListener(eventTarget, listener)
      {
          if (KEYBOARD_CONTEXT_KEY in listener)
          {
              let ctx = listener[KEYBOARD_CONTEXT_KEY];
          
              eventTarget.removeEventListener('keyup', ctx.up);
              eventTarget.removeEventListener('keydown', ctx.down);
          }
      
          return eventTarget;
      }

      constructor(eventTarget, keyList = undefined)
      {
          super(eventTarget);

          this._buttons = [];
          this._managed = Array.isArray(keyList);

          this.onManagedKeyEvent = this.onManagedKeyEvent.bind(this);
          this.onUnmanagedKeyEvent = this.onUnmanagedKeyEvent.bind(this);

          if (this._managed)
          {
              for(let key of keyList)
              {
                  let button = new Button();
                  this[key] = button;
                  this._buttons.push(button);
              }

              Keyboard.addInputEventListener(eventTarget, this.onManagedKeyEvent);
          }
          else
          {
              Keyboard.addInputEventListener(eventTarget, this.onUnmanagedKeyEvent);
          }
      }

      get Up() { return Math.min((this.ArrowUp || 0) + (this.KeyW || 0), 1); }
      get Down() { return Math.min((this.ArrowDown || 0) + (this.KeyS || 0), 1); }
      get Left() { return Math.min((this.ArrowLeft || 0) + (this.KeyA || 0), 1); }
      get Right() { return Math.min((this.ArrowRight || 0) + (this.KeyD || 0), 1); }

      destroy()
      {
          if (this._managed)
          {
              Keyboard.removeInputEventListener(this.eventTarget, this.onManagedKeyEvent);
          }
          else
          {
              Keyboard.removeInputEventListener(this.eventTarget, this.onUnmanagedKeyEvent);
          }
          this.eventTarget = null;
      }

      poll()
      {
          for(let button of this._buttons)
          {
              button.poll();
          }
          return this;
      }

      onUnmanagedKeyEvent(e)
      {
          if (!(e.key in this))
          {
              let button = new Button();
              this[e.key] = button;
              this._buttons.push(button);
          }
          
          this[e.key].update(e.event, e.value);
          
          return true;
      }

      onManagedKeyEvent(e)
      {
          if (e.key in this)
          {
              this[e.key].update(e.event, e.value);

              return true;
          }
      }
  }

  function onKeyDown(e)
  {
      // Ignore repeat events.
      if (e.repeat)
      {
          e.preventDefault();
          e.stopPropagation();
          return false;
      }

      let event = this._keyEvent;
      // NOTE: You could use `e.key`, but we care about location rather than printable character.
      event.key = e.code;
      event.event = 'down';
      event.value = 1;
      event.control = e.ctrlKey;
      event.shift = e.shiftKey;
      event.alt = e.altKey;

      let result = this.handler.call(undefined, event);

      if (result)
      {
          e.preventDefault();
          e.stopPropagation();
          return false;
      }
  }

  function onKeyUp(e)
  {
      let event = this._keyEvent;
      // NOTE: You could use `e.key`, but we care about location rather than printable character.
      event.key = e.code;
      event.event = 'up';
      event.value = 1;
      event.control = e.ctrlKey;
      event.shift = e.shiftKey;
      event.alt = e.altKey;

      let result = this.handler.call(undefined, event);

      if (result)
      {
          e.preventDefault();
          e.stopPropagation();
          return false;
      }
  }

  const MOUSE_CONTEXT_KEY = Symbol('mouseEventContext');

  class Mouse extends InputDevice
  {
      /** @override */
      static addInputEventListener(eventTarget, listener)
      {
          let ctx;
          if (!(MOUSE_CONTEXT_KEY in listener))
          {
              ctx = {
                  handler: listener,
                  target: eventTarget,
                  down: null,
                  up: null,
                  move: null,
                  contextmenu: null,
                  _down: false,
                  _keyEvent: {
                      type: 'key',
                      target: eventTarget,
                      device: 'mouse',
                      key: null,
                      event: null,
                      value: null,
                  },
                  _posEvent: {
                      type: 'pos',
                      target: eventTarget,
                      device: 'mouse',
                      key: 'pos',
                      event: 'move',
                      x: 0, y: 0, dx: 0, dy: 0,
                  },
              };
      
              let down = onMouseDown.bind(ctx);
              let up = onMouseUp.bind(ctx);
              let move = onMouseMove.bind(ctx);
              let contextmenu = onContextMenu.bind(ctx);
          
              ctx.down = down;
              ctx.up = up;
              ctx.move = move;
              ctx.contextmenu = contextmenu;
          
              listener[MOUSE_CONTEXT_KEY] = ctx;
          }
          else
          {
              ctx = listener[MOUSE_CONTEXT_KEY];
          }
      
          eventTarget.addEventListener('mousedown', ctx.down);
          document.addEventListener('mouseup', ctx.up);
          eventTarget.addEventListener('contextmenu', ctx.contextmenu);
          document.addEventListener('mousemove', ctx.move);
      
          return eventTarget;
      }

      /** @override */
      static removeInputEventListener(eventTarget, listener)
      {
          if (MOUSE_CONTEXT_KEY in listener)
          {
              let ctx = listener[MOUSE_CONTEXT_KEY];
          
              eventTarget.removeEventListener('mousedown', ctx.down);
              document.removeEventListener('mouseup', ctx.up);
              eventTarget.removeEventListener('contextmenu', ctx.contextmenu);
              document.removeEventListener('mousemove', ctx.move);
          }
      
          return eventTarget;
      }

      constructor(eventTarget)
      {
          super(eventTarget);

          this.x = new Axis();
          this.y = new Axis();
          this.dx = new AggregatedAxis();
          this.dy = new AggregatedAxis();
          this.Button0 = new Button();
          this.Button1 = new Button();
          this.Button2 = new Button();
          this.Button3 = new Button();
          this.Button4 = new Button();

          this.onMouseEvent = this.onMouseEvent.bind(this);

          Mouse.addInputEventListener(eventTarget, this.onMouseEvent);
      }

      get Left() { return this.Button0; }
      get Middle() { return this.Button1; }
      get Right() { return this.Button2; }

      destroy()
      {
          Mouse.removeInputEventListener(this.eventTarget, this.onMouseEvent);
          this.eventTarget = null;
      }

      poll()
      {
          this.x.poll();
          this.y.poll();
          this.dx.poll();
          this.dy.poll();
          this.Button0.poll();
          this.Button1.poll();
          this.Button2.poll();
          this.Button3.poll();
          this.Button4.poll();

          return this;
      }

      onMouseEvent(e)
      {
          let { key, event } = e;
          switch(key)
          {
              case 0:
                  this.Button0.update(event, e.value);
                  break;
              case 1:
                  this.Button1.update(event, e.value);
                  break;
              case 2:
                  this.Button2.update(event, e.value);
                  break;
              case 3:
                  this.Button3.update(event, e.value);
                  break;
              case 4:
                  this.Button4.update(event, e.value);
                  break;
              case 'pos':
                  this.x.update(event, e.x);
                  this.y.update(event, e.y);
                  this.dx.update(event, e.dx);
                  this.dy.update(event, e.dy);
                  
                  // Cannot consume a position event.
                  return;
          }

          return true;
      }
  }

  function onMouseDown(e)
  {
      this._down = true;

      let event = this._keyEvent;
      event.key = e.button;
      event.event = 'down';
      event.value = 1;

      let result = this.handler.call(undefined, event);

      if (result)
      {
          if (document.activeElement === this.target)
          {
              e.preventDefault();
              e.stopPropagation();
              return false;
          }
      }
  }

  function onMouseUp(e)
  {
      if (this._down)
      {
          this._down = false;

          let event = this._keyEvent;
          event.key = e.button;
          event.event = 'up';
          event.value = 1;
          
          let result = this.handler.call(undefined, event);
      
          if (result)
          {
              e.preventDefault();
              e.stopPropagation();
              return false;
          }
      }
  }

  function onMouseMove(e)
  {
      let element = this.target;
      let { clientWidth, clientHeight } = element;

      let rect = this.target.getBoundingClientRect();

      let dx = e.movementX / clientWidth;
      let dy = e.movementY / clientHeight;
      let x = (e.clientX - rect.left) / clientWidth;
      let y = (e.clientY - rect.top) / clientHeight;

      let event = this._posEvent;
      event.x = x;
      event.y = y;
      event.dx = dx;
      event.dy = dy;

      let result = this.handler.call(undefined, event);

      if (typeof result !== 'undefined')
      {
          throw new Error(`Return value must be 'undefined'. Mouse position and movement events cannot be consumed.`);
      }
  }

  function onContextMenu(e)
  {
      e.preventDefault();
      e.stopPropagation();
      return false;
  }

  const INNER_HTML$1 = `
<kbd></kbd>`;
  const INNER_STYLE$1 = `
:host {
    display: inline-block;
}
kbd {
    background-color: #EEEEEE;
    border-radius: 3px;
    border: 1px solid #B4B4B4;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;
    color: #333333;
    font-size: 0.85em;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    white-space: nowrap;
}
`;

  const TEMPLATE_KEY$1 = Symbol('template');
  const STYLE_KEY$1 = Symbol('style');

  class InputKey extends HTMLElement
  {
      static toInputMap(nodes)
      {
          let inputMap = {};
          
          for(let node of nodes)
          {
              if (node instanceof InputKey)
              {
                  let inputName = node.input;
      
                  let keys;
                  if (inputName in inputMap)
                  {
                      keys = inputMap[inputName];
                  }
                  else
                  {
                      inputMap[inputName] = keys = [];
                  }
      
                  let inputType = node.type;
                  switch(inputType)
                  {
                      case 'action':
                          keys.push({
                              key: node.key,
                              event: node.event,
                          });
                          break;
                      case 'range':
                          keys.push({
                              key: node.key,
                              scale: node.scale,
                          });
                          break;
                      default:
                          throw new Error('Unknown input type.');
                  }
              }
          }

          return inputMap;
      }

      static get [TEMPLATE_KEY$1]()
      {
          let template = document.createElement('template');
          template.innerHTML = INNER_HTML$1;
          Object.defineProperty(this, TEMPLATE_KEY$1, { value: template });
          return template;
      }

      static get [STYLE_KEY$1]()
      {
          let style = document.createElement('style');
          style.innerHTML = INNER_STYLE$1;
          Object.defineProperty(this, STYLE_KEY$1, { value: style });
          return style;
      }

      /** @override */
      static get observedAttributes()
      {
          return [
              'input',
              'key',
              'scale',
              'event'
          ];
      }

      constructor()
      {
          super();

          this.attachShadow({ mode: 'open' });
          this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY$1].content.cloneNode(true));
          this.shadowRoot.appendChild(this.constructor[STYLE_KEY$1].cloneNode(true));

          this.keyElement = this.shadowRoot.querySelector('kbd');
      }

      /** @override */
      attributeChangedCallback(attribute, prev, value)
      {
          switch(attribute)
          {
              case 'key':
                  this.keyElement.textContent = value;
                  break;
          }
      }

      get type() { return this.hasAttribute('event') ? 'action' : 'range'; }

      get input() { return this.getAttribute('input'); }
      set input(value) { this.setAttribute('input', value); }

      get key() { return this.getAttribute('key'); }
      set key(value) { this.setAttribute('key', value); }

      get scale() { return Number(this.getAttribute('scale')); }
      set scale(value) { this.setAttribute('scale', value); }

      get event() { return this.getAttribute('event'); }
      set event(value) { this.setAttribute('event', value); }
  }
  window.customElements.define('input-key', InputKey);

  class Input
  {
      constructor(inputName, inputType)
      {
          this.inputName = inputName;
          this.inputType = inputType;
          
          this.value = 0;

          this._onchange = null;
          this._eventListeners = new Map();
      }

      update(value)
      {
          if (this.value !== value)
          {
              this.value = value;
              
              if (this._eventListeners.has('change'))
              {
                  for(let listener of this._eventListeners.get('change'))
                  {
                      listener.call(undefined, this);
                  }
              }

              return true;
          }
          return false;
      }

      get onchange()
      {
          return this._onchange;
      }

      set onchange(callback)
      {
          if (this._onchange)
          {
              this.removeEventListener('change', this._onchange);
          }

          this._onchange = callback;
          this.addEventListener('change', callback);
      }

      addEventListener(event, listener)
      {
          if (this._eventListeners.has(event))
          {
              let listeners = this._eventListeners.get(event);
              listeners.push(listener);
          }
          else
          {
              this._eventListeners.set(event, [ listener ]);
          }
      }

      removeEventListener(event, listener)
      {
          if (this._eventListeners.has(event))
          {
              let listeners = this._eventListeners.get(event);
              listeners.splice(listeners.indexOf(listener), 1);
          }
      }

      /** @override */
      toString()
      {
          return this.value;
      }
  }

  // TODO: Maybe this should be InputMap.getContext()?

  const INNER_HTML$1$1 = `
<table>
    <thead>
        <tr class="header">
            <th id="title" colspan=3>input-context</th>
            <th id="poll">&nbsp;</th>
        </tr>
        <tr class="hint">
            <th>input</th>
            <th>key</th>
            <th>mod</th>
            <th>value</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
<slot></slot>`;
  const INNER_STYLE$1$1 = `
:host {
    display: inline-block;
}
slot {
    display: none;
}
table {
    border-collapse: collapse;
}
table, th, td {
    border: 1px solid gray;
}
#poll {
    position: relative;
    font-size: 0.9em;
}
#poll:after {
    content: "(poll)";
    position: absolute;
    left: 0;
    right: 0;
    z-index: -1;
    opacity: 0.1;
    font-family: monospace;
    letter-spacing: 3px;
    overflow: hidden;
}
.hint > th {
    font-size: 0.5em;
    font-family: monospace;
    padding: 0 10px;
    letter-spacing: 3px;
    background-color: #AAA;
    color: #666666;
}
th, td {
    padding: 5px 10px;
}
td {
    text-align: center;
}
kbd {
    display: inline-block;
    background-color: #EEEEEE;
    border-radius: 3px;
    border: 1px solid #B4B4B4;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;
    color: #333333;
    font-size: 0.85em;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    white-space: nowrap;
}
output {
    font-family: monospace;
    border-radius: 0.3em;
    padding: 3px;
}
.flash {
    animation: fadein 4s;
}
@keyframes fadein {
    0%, 10% { background-color: rgba(0, 0, 255, 0.3); }
    100% { background-color: rgba(0, 0, 255, 0); }
}
`;

  class InputKeyPair
  {
      constructor(keyName, keyEvent, scale)
      {
          this.keyName = keyName;
          this.keyEvent = keyEvent;
          this.scale = scale;

          this.value = 0;
      }

      consumeKey()
      {
          this.value = 0;
      }

      updateKey(e, keyName)
      {
          // NOTE: This condition is only really used for parameterized key events.
          if (keyName === this.keyName)
          {
              if (this.keyEvent)
              {
                  if (this.keyEvent === e.event)
                  {
                      this.value = e.value * this.scale;
                      return true;
                  }
              }
              else
              {
                  switch(e.event)
                  {
                      case 'down':
                          this.value = this.scale;
                          return true;
                      case 'up':
                          this.value = 0;
                          return true;
                      default:
                          this.value = e.value * this.scale;
                          return;
                  }
              }
          }
      }
  }

  const NONE_POLL_TEXT = '✗';
  const ACTIVE_POLL_TEXT = '✓';

  const TEMPLATE_KEY$1$1 = Symbol('template');
  const STYLE_KEY$1$1 = Symbol('style');

  const POLL_WARNING_TIME = 3000;

  class InputContext extends HTMLElement
  {
      static get [TEMPLATE_KEY$1$1]()
      {
          let template = document.createElement('template');
          template.innerHTML = INNER_HTML$1$1;
          Object.defineProperty(this, TEMPLATE_KEY$1$1, { value: template });
          return template;
      }

      static get [STYLE_KEY$1$1]()
      {
          let style = document.createElement('style');
          style.innerHTML = INNER_STYLE$1$1;
          Object.defineProperty(this, STYLE_KEY$1$1, { value: style });
          return style;
      }

      /** @override */
      static get observedAttributes()
      {
          return [
              'for',
              'strict',
              'onattach',
              'ondetach',
              // ...listening for built-in attribs...
              'id',
              'class',
          ];
      }

      constructor(inputMap = null)
      {
          super();

          this.attachShadow({ mode: 'open' });
          this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY$1$1].content.cloneNode(true));
          this.shadowRoot.appendChild(this.constructor[STYLE_KEY$1$1].cloneNode(true));

          this._onattach = null;
          this._ondetach = null;

          this._titleElement = this.shadowRoot.querySelector('#title');
          this._pollElement = this.shadowRoot.querySelector('#poll');

          this._tableBody = this.shadowRoot.querySelector('tbody');
          this._children = this.shadowRoot.querySelector('slot');
          this._tableInputs = {};

          this._lastPollTime = 0;
          this._pollWarningTimeoutHandle = 0;
          this._animationFrameHandle = 0;

          this._inputTarget = null;
          this._inputMap = inputMap;
          this._inputs = {};
          this._inputKeys = {};
          this._keys = {};

          this.onInputEvent = this.onInputEvent.bind(this);
          this.onAnimationFrame = this.onAnimationFrame.bind(this);

          if (inputMap)
          {
              parseInputMapping(this, inputMap);
          }
      }

      /** @override */
      connectedCallback()
      {
          if (!this.hasAttribute('for')) this.setAttribute('for', '');

          // Setup keys and inputs from the input mapping
          if (!this._inputMap)
          {
              this._inputMap = {};

              const childInputMap = InputKey.toInputMap(this._children.assignedNodes());
              const inputMapSource = this.src;
      
              if (inputMapSource)
              {
                  fetch(inputMapSource)
                      .then(blob => blob.json())
                      .then(data => {
                          this._inputMap = { ...data, ...childInputMap };
                          parseInputMapping(this, this._inputMap);
                      });
              }
              else
              {
                  this._inputMap = { ...childInputMap };
                  parseInputMapping(this, this._inputMap);
              }
          }

          // Check to see if polling cause it is easy to forget it :P
          this._lastPollTime = 0;
          this._pollWarningTimeoutHandle = setTimeout(() => {
              if (this._lastPollTime <= 0)
              {
                  this._pollElement.textContent = NONE_POLL_TEXT;
                  console.warn('[INPUT] No input updated. Did you forget to poll() the input context?');
              }
              else
              {
                  this._pollElement.textContent = ACTIVE_POLL_TEXT;
              }
          }, POLL_WARNING_TIME);

          this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
      }

      /** @override */
      disconnectedCallback()
      {
          cancelAnimationFrame(this._animationFrameHandle);
          clearTimeout(this._pollWarningTimeoutHandle);
      }

      /** @override */
      attributeChangedCallback(attribute, prev, value)
      {
          switch(attribute)
          {
              case 'for':
                  let target;
                  if (value)
                  {
                      target = document.getElementById(value);
                  }
                  else
                  {
                      target = document.querySelector('display-port') || document.querySelector('canvas');
                  }

                  if (this._inputTarget)
                  {
                      this.detach();
                  }

                  if (target)
                  {
                      this.attach(target);
                  }
                  break;
              // Event handlers...
              case 'onattach':
                  this.onattach = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                  break;
              case 'ondetach':
                  this.ondetach = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                  break;
              // NOTE: For debugging purposes...
              case 'id':
              case 'class':
                  this._titleElement.innerHTML = `input-context${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
                  break;
          }
      }

      get src() { return this.getAttribute('src'); }
      set src(value) { this.setAttribute('src', value); }

      get for() { return this.getAttribute('for'); }
      set for(value) { this.setAttribute('for', value); }

      get strict() { return this.hasAttribute('strict'); }
      set strict(value) { if (value) this.setAttribute('strict', ''); else this.removeAttribute('strict'); }

      get auto() { return this.hasAttribute('auto'); }
      set auto(value) { if (value) this.setAttribute('auto', ''); else this.removeAttribute('auto'); }

      get onattach() { return this._onattach; }
      set onattach(value)
      {
          if (this._onattach) this.removeEventListener('attach', this._onattach);
          this._onattach = value;
          if (this._onattach) this.addEventListener('attach', value);
      }

      get ondetach() { return this._ondetach; }
      set ondetach(value)
      {
          if (this._ondetach) this.removeEventListener('detach', this._ondetach);
          this._ondetach = value;
          if (this._ondetach) this.addEventListener('detach', value);
      }

      attach(targetElement)
      {
          if (!targetElement)
          {
              throw new Error('Cannot attach input context to null.');
          }

          if (this._inputTarget)
          {
              if (this._inputTarget !== targetElement)
              {
                  throw new Error('Input context already attached to another element.');
              }
              else
              {
                  // It's already attached.
                  return this;
              }
          }

          let target = targetElement;
          if (target)
          {
              if (target.canvas)
              {
                  Keyboard.addInputEventListener(target, this.onInputEvent);
                  Mouse.addInputEventListener(target.canvas, this.onInputEvent);
              }
              else
              {
                  Keyboard.addInputEventListener(target, this.onInputEvent);
                  Mouse.addInputEventListener(target, this.onInputEvent);
              }

              this.dispatchEvent(new CustomEvent('attach', {
                  composed: true, bubbles: false, detail: { eventTarget: target, inputCallback: this.onInputEvent }
              }));
          }

          this._inputTarget = target;
          return this;
      }

      detach()
      {
          if (!this._inputTarget) return this;

          let target = this._inputTarget;
          this._inputTarget = null;

          if (target.canvas)
          {
              Keyboard.removeInputEventListener(target, this.onInputEvent);
              Mouse.removeInputEventListener(target.canvas, this.onInputEvent);
          }
          else
          {
              Keyboard.removeInputEventListener(target, this.onInputEvent);
              Mouse.removeInputEventListener(target, this.onInputEvent);
          }

          this.dispatchEvent(new CustomEvent('detach', {
              composed: true, bubbles: false, detail: { eventTarget: target, inputCallback: this.onInputEvent }
          }));

          return this;
      }

      poll()
      {
          this._lastPollTime = performance.now();

          // Update all inputs to the current key's values.
          for(let inputName in this._inputs)
          {
              let input = this._inputs[inputName];
              let inputType = input.inputType;
              switch(inputType)
              {
                  case 'action':
                      // Action should be any key value.
                      let consumed = false;
                      for(let inputKey of this._inputKeys[inputName])
                      {
                          let value = inputKey.value;
                          if (value)
                          {
                              input.update(value, inputKey);
                              inputKey.consumeKey();
                              consumed = true;
                              break;
                          }
                      }
                      if (!consumed)
                      {
                          input.update(0, null);
                      }
                      break;
                  case 'range':
                      // Range should be sum of keys.
                      let value = 0;
                      for(let inputKey of this._inputKeys[inputName])
                      {
                          value += inputKey.value;
                      }
                      input.update(value, null);
                      break;
                  default:
                      throw new Error('Unknown input type.');
              }
          }
      }

      onInputEvent(e)
      {
          let eventType = e.type;
          switch(eventType)
          {
              case 'key':
                  {
                      const keyName = e.device + ':' + e.key;
                      if (keyName in this._keys)
                      {
                          let flag = false;
                          for(let key of this._keys[keyName])
                          {
                              if (key.updateKey(e, keyName))
                              {
                                  flag = true;
                              }
                          }
                          if (flag)
                          {
                              return true;
                          }
                      }
                  }
                  break;
              case 'pos':
                  {
                      const params = [
                          'x',
                          'y',
                          'dx',
                          'dy'
                      ];
                      for(let param of params)
                      {
                          e.value = e[param];
                          const keyName = e.device + ':' + e.key + '.' + param;
                          if (keyName in this._keys)
                          {
                              let flag = false;
                              for(let key of this._keys[keyName])
                              {
                                  if (key.updateKey(e, keyName))
                                  {
                                      flag = true;
                                  }
                              }
                              if (flag)
                              {
                                  return true;
                              }
                          }
                      }
                  }
                  break;
              default:
                  throw new Error(`Unknown input event type '${eventType}'.`);
          }
      }

      onAnimationFrame(now)
      {
          this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);

          // If enabled, do auto-polling
          if (this.auto) this.poll();

          // Update all inputs to the current key's values.
          for(let inputName in this._inputs)
          {
              let input = this._inputs[inputName];
              let result;
              if (input.value)
              {
                  result = Number(input.value).toFixed(2);
              }
              else
              {
                  result = 0;
              }
              let element = this._tableInputs[inputName];
              if (element.textContent != result)
              {
                  element.textContent = result;
                  let parent = element.parentNode;
                  element.parentNode.removeChild(element);
                  parent.appendChild(element);
              }
          }
      }

      getInput(inputName)
      {
          if (inputName in this._inputs)
          {
              return this._inputs[inputName];
          }
          else if (!this.strict)
          {
              let result = new Input(inputName, 'range');
              this._inputs[inputName] = result;
              return result;
          }
          else
          {
              throw new Error(`Cannot find input with name '${inputName}'.`);
          }
      }

      getInputValue(inputName)
      {
          if (inputName in this._inputs)
          {
              return this._inputs[inputName].value;
          }
          else if (!this.strict)
          {
              return 0;
          }
          else
          {
              throw new Error(`Cannot find input with name '${inputName}'.`);
          }
      }
  }
  window.customElements.define('input-context', InputContext);

  function parseInputMapping(inputContext, inputMapping)
  {
      for(let inputName in inputMapping)
      {
          let inputOptions = inputMapping[inputName];
          if (Array.isArray(inputOptions))
          {
              for(let inputOption of inputOptions)
              {
                  parseInputOption(inputContext, inputName, inputOption);
                  if (typeof inputOption === 'string')
                  {
                      inputOption = { key: inputOption, event: 'down' };
                  }
                  appendInputOption(inputContext, inputName, inputOption);
              }
          }
          else
          {
              parseInputOption(inputContext, inputName, inputOptions);
              if (typeof inputOptions === 'string')
              {
                  inputOptions = { key: inputOptions, event: 'down' };
              }
              appendInputOption(inputContext, inputName, inputOptions);
          }
      }
  }

  function evaluateInputOptionType(inputOption)
  {
      if (typeof inputOption === 'object')
      {
          if ('type' in inputOption)
          {
              return inputOption.type;
          }
          else if ('scale' in inputOption)
          {
              return 'range';
          }
          else if ('event' in inputOption)
          {
              return 'action';
          }
          else
          {
              throw new Error(`Missing 'scale' or 'event' for input option '${inputName}'.`);
          }
      }
      else if (typeof inputOption === 'string')
      {
          return 'action';
      }
      else
      {
          throw new Error('Invalid type for input mapping option.');
      }
  }

  function appendInputOption(inputContext, inputName, inputOption)
  {
      let row = document.createElement('tr');
      
      // Name
      {
          let inputCell = document.createElement('td');
          inputCell.textContent = inputName;
          inputCell.classList.add('name');
          row.appendChild(inputCell);
      }

      // Key
      {
          let keyCell = document.createElement('td');
          keyCell.classList.add('key');
          let keyLabel = document.createElement('kbd');
          keyLabel.textContent = inputOption.key;
          keyCell.appendChild(keyLabel);
          row.appendChild(keyCell);
      }

      // Mods
      {
          let modCell = document.createElement('td');
          let modSample = document.createElement('samp');
          let inputType = evaluateInputOptionType(inputOption);
          switch(inputType)
          {
              case 'action':
                  modSample.textContent = inputOption.event;
                  break;
              case 'range':
                  modSample.textContent = Number(inputOption.scale).toFixed(2);
                  break;
              default:
                  modSample.textContent = '<?>';
          }
          modCell.classList.add('mod');
          modCell.appendChild(modSample);
          row.appendChild(modCell);
      }

      // Value
      if (!(inputName in inputContext._tableInputs))
      {
          let outputCell = document.createElement('td');
          let outputValue = document.createElement('output');
          outputValue.textContent = 0;
          outputValue.classList.add('flash');
          outputCell.classList.add('value');
          outputCell.appendChild(outputValue);
          row.appendChild(outputCell);
          inputContext._tableInputs[inputName] = outputValue;
      }
      else
      {
          let outputCell = document.createElement('td');
          outputCell.classList.add('value');
          row.appendChild(outputCell);
      }

      inputContext._tableBody.appendChild(row);
  }

  function parseInputOption(inputContext, inputName, inputOption)
  {
      let inputType = evaluateInputOptionType(inputOption);
      switch(inputType)
      {
          case 'action':
              if (typeof inputOption === 'string')
              {
                  parseActionOption(inputContext, inputName, { key: inputOption, event: 'down' });
              }
              else
              {
                  parseActionOption(inputContext, inputName, inputOption);
              }
              break;
          case 'range':
              parseRangeOption(inputContext, inputName, inputOption);
              break;
          default:
              throw new Error(`Unknown input type '${inputType}'.`);
      }
  }

  function parseRangeOption(inputContext, inputName, inputOption)
  {
      const { key, scale } = inputOption;

      // Update _inputs, _inputKeys, _keys
      let input;
      let inputKeys;
      if (inputName in inputContext._inputs)
      {
          input = inputContext._inputs[inputName];
          inputKeys = inputContext._inputKeys[inputName];

          if (input.inputType !== 'range')
          {
              throw new Error(`Cannot register mismatched 'range' type input for '${input.inputType}' type input '${inputName}'.`);
          }
      }
      else
      {
          input = new Input(inputName, 'range');
          inputKeys = [];

          inputContext._inputs[inputName] = input;
          inputContext._inputKeys[inputName] = inputKeys;
      }

      let keys;
      if (key in inputContext._keys)
      {
          keys = inputContext._keys[key];
      }
      else
      {
          keys = [];
          inputContext._keys[key] = keys;
      }
      
      let inputKey = new InputKeyPair(key, null, scale);
      keys.push(inputKey);
      inputKeys.push(inputKey);
  }

  function parseActionOption(inputContext, inputName, inputOption)
  {
      const { key, event } = inputOption;

      // Update _inputs, _inputKeys, _keys
      let input;
      let inputKeys;
      if (inputName in inputContext._inputs)
      {
          input = inputContext._inputs[inputName];
          inputKeys = inputContext._inputKeys[inputName];

          if (input.inputType !== 'action')
          {
              throw new Error(`Cannot register mismatched 'action' type input for '${input.inputType}' type input '${inputName}'.`);
          }
      }
      else
      {
          input = new Input(inputName, 'action');
          inputKeys = [];

          inputContext._inputs[inputName] = input;
          inputContext._inputKeys[inputName] = inputKeys;
      }

      let keys;
      if (key in inputContext._keys)
      {
          keys = inputContext._keys[key];
      }
      else
      {
          keys = [];
          inputContext._keys[key] = keys;
      }
      
      let inputKey = new InputKeyPair(key, event, 1);
      keys.push(inputKey);
      inputKeys.push(inputKey);
  }

  async function loadText(filepath, opts)
  {
      let result = await fetch(filepath);
      return result.text();
  }

  var TextLoader = /*#__PURE__*/Object.freeze({
      __proto__: null,
      loadText: loadText
  });

  async function loadOBJ(filepath, opts)
  {
      let result = await fetch(filepath);
      let string = await result.text();
      {
          // console.log('ORIGINAL');
          const attempts = 10;
          for(let i = 0; i < attempts; ++i)
          {
              let then = performance.now();
              parse(string);
              let now = performance.now();
          }
          // console.log(sum / attempts);
      }
      {
          // console.log('UPDATE');
          const attempts = 10;
          for(let i = 0; i < attempts; ++i)
          {
              let then = performance.now();
              parse2(string);
              let now = performance.now();
          }
          // console.log(sum / attempts);
      }
      return parse2(string);
  }

  function parse2(string)
  {
      const vertexList = [];
      const texcoordList = [];
      const normalList = [];

      const vertexIndices = [];
      const texcoordIndices = [];
      const normalIndices = [];

      // # comments
      const commentPattern = /^#.*/g;
      // v float float float
      const vertexPattern = /v\s+(\S+)\s+(\S+)\s+(\S+)/g;
      // vn float float float
      const normalPattern = /vn\s+(\S+)\s+(\S+)\s+(\S+)/g;
      // vt float float float
      const texcoordPattern = /vt\s+(\S+)\s+(\S+)/g;
      // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
      const facePattern = /f\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*))\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*))\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*))(\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*)))?/g;
      // f float float float
      const faceVertexPattern = /f\s+([^\/\s]+)\s+([^\/\s]+)\s+([^\/\s]+)/g;

      let quad = false;
      let result = null;
      let x, y, z, w;

      // Remove all comments
      string = string.replace(commentPattern, '');

      // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
      while ((result = vertexPattern.exec(string)) != null) {
          x = Number.parseFloat(result[1]);
          y = Number.parseFloat(result[2]);
          z = Number.parseFloat(result[3]);
          vertexList.push(x);
          vertexList.push(y);
          vertexList.push(z);
      }

      // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
      while ((result = normalPattern.exec(string)) != null) {
          x = Number.parseFloat(result[1]);
          y = Number.parseFloat(result[2]);
          z = Number.parseFloat(result[3]);
          normalList.push(x);
          normalList.push(y);
          normalList.push(z);
      }

      // ["vt 1.0 2.0", "1.0", "2.0"]
      while ((result = texcoordPattern.exec(string)) != null) {
          x = Number.parseFloat(result[1]);
          y = Number.parseFloat(result[2]);
          texcoordList.push(x);
          texcoordList.push(y);
      }

      // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]
      while ((result = facePattern.exec(string)) != null) {
          // Vertex indices
          x = Number.parseInt(result[2]);
          if (Number.isNaN(x)) x = 1;
          y = Number.parseInt(result[6]);
          if (Number.isNaN(y)) y = 1;
          z = Number.parseInt(result[10]);
          if (Number.isNaN(z)) z = 1;
          vertexIndices.push(x);
          vertexIndices.push(y);
          vertexIndices.push(z);

          // Normal indices
          x = Number.parseInt(result[4]);
          if (Number.isNaN(x))
          {
              // No UVs.
              x = Number.parseInt(result[3]);
              y = Number.parseInt(result[7]);
              z = Number.parseInt(result[11]);
              normalIndices.push(x);
              normalIndices.push(y);
              normalIndices.push(z);

              texcoordIndices.push(1);
              texcoordIndices.push(1);
              texcoordIndices.push(1);
          }
          else
          {
              // Maybe UVs.
              y = Number.parseInt(result[8]);
              if (Number.isNaN(y)) y = 1;
              z = Number.parseInt(result[12]);
              if (Number.isNaN(z)) z = 1;
              normalIndices.push(x);
              normalIndices.push(y);
              normalIndices.push(z);

              // UV indices
              x = Number.parseInt(result[3]);
              if (Number.isNaN(x)) x = 1;
              y = Number.parseInt(result[7]);
              if (Number.isNaN(y)) y = 1;
              z = Number.parseInt(result[11]);
              if (Number.isNaN(z)) z = 1;
              texcoordIndices.push(x);
              texcoordIndices.push(y);
              texcoordIndices.push(z);
          }

          // Quad face
          if (typeof result[13] !== 'undefined') {
              
              // Vertex indices
              w = Number.parseInt(result[15]);
              if (Number.isNaN(w)) w = 1;
              vertexIndices.push(w);

              // Normal indices
              w = Number.parseInt(result[17]);
              if (Number.isNaN(w))
              {
                  // No UVs.
                  w = Number.parseInt(result[16]);
                  normalIndices.push(w);
                  texcoordIndices.push(1);
              }
              else
              {
                  // Maybe UVs.
                  normalIndices.push(w);

                  w = Number.parseInt(result[16]);
                  texcoordIndices.push(w);
              }

              quad = true;
          }
      }

      // ["f 1 2 3 4", "1", "2", "3", "4"]
      while ((result = faceVertexPattern.exec(string)) != null) {
          // Vertex indices
          x = Number.parseInt(result[2]);
          y = Number.parseInt(result[6]);
          z = Number.parseInt(result[10]);
          vertexIndices.push(x);
          vertexIndices.push(y);
          vertexIndices.push(z);

          // UV indices
          texcoordIndices.push(1);
          texcoordIndices.push(1);
          texcoordIndices.push(1);

          // Normal indices
          normalIndices.push(1);
          normalIndices.push(1);
          normalIndices.push(1);

          // Quad face
          if (typeof result[13] !== 'undefined') {

              // Vertex indices
              w = Number.parseInt(result[14]);
              vertexIndices.push(w);

              // UV indices
              texcoordIndices.push(1);
              // Normal indices
              normalIndices.push(1);

              quad = true;
          }
      }

      let index, size;

      size = vertexIndices.length;
      const positions = new Float32Array(size * 3);
      for (let i = 0; i < size; ++i) {
          index = vertexIndices[i] - 1;
          positions[i * 3 + 0] = vertexList[index * 3 + 0];
          positions[i * 3 + 1] = vertexList[index * 3 + 1];
          positions[i * 3 + 2] = vertexList[index * 3 + 2];
      }

      size = texcoordIndices.length;
      const texcoords = new Float32Array(size * 2);
      for (let i = 0; i < size; ++i) {
          index = texcoordIndices[i] - 1;
          texcoords[i * 2 + 0] = texcoordList[index * 2 + 0];
          texcoords[i * 2 + 1] = texcoordList[index * 2 + 1];
      }

      size = normalIndices.length;
      const normals = new Float32Array(size * 3);
      for (let i = 0; i < size; ++i) {
          index = normalIndices[i] - 1;
          normals[i * 3 + 0] = normalList[index * 3 + 0];
          normals[i * 3 + 1] = normalList[index * 3 + 1];
          normals[i * 3 + 2] = normalList[index * 3 + 2];
      }

      // Must be either unsigned short or unsigned byte.
      size = vertexIndices.length;
      const indices = new Uint16Array(size);
      for (let i = 0; i < size; ++i) {
          indices[i] = i;
      }

      if (quad) {
          console.warn('WebGL does not support quad faces, only triangles.');
      }

      return {
          positions,
          texcoords,
          normals,
          indices,
      };
  }

  function parse(string)
  {
      const vertexList = [];
      const texcoordList = [];
      const normalList = [];

      const vertexIndices = [];
      const texcoordIndices = [];
      const normalIndices = [];

      // # comments
      const commentPattern = /^#.*/g;
      // v float float float
      const vertexPattern = /v( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;
      // vn float float float
      const normalPattern = /vn( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;
      // vt float float float
      const texcoordPattern = /vt( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;
      // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
      const facePattern = /f( +([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))?/g;
      // f float float float
      const faceVertexPattern = /f( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;

      let quad = false;
      let result = null;
      let x, y, z, w;

      // Remove all comments
      string = string.replace(commentPattern, '');

      // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
      while ((result = vertexPattern.exec(string)) != null) {
          x = Number.parseFloat(result[1]);
          y = Number.parseFloat(result[2]);
          z = Number.parseFloat(result[3]);
          vertexList.push(x);
          vertexList.push(y);
          vertexList.push(z);
      }

      // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
      while ((result = normalPattern.exec(string)) != null) {
          x = Number.parseFloat(result[1]);
          y = Number.parseFloat(result[2]);
          z = Number.parseFloat(result[3]);
          normalList.push(x);
          normalList.push(y);
          normalList.push(z);
      }

      // ["vt 1.0 2.0", "1.0", "2.0"]
      while ((result = texcoordPattern.exec(string)) != null) {
          x = Number.parseFloat(result[1]);
          y = Number.parseFloat(result[2]);
          texcoordList.push(x);
          texcoordList.push(y);
      }

      // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]
      while ((result = facePattern.exec(string)) != null) {
          // Vertex indices
          x = Number.parseInt(result[2]);
          if (Number.isNaN(x)) x = 1;
          y = Number.parseInt(result[6]);
          if (Number.isNaN(y)) y = 1;
          z = Number.parseInt(result[10]);
          if (Number.isNaN(z)) z = 1;
          vertexIndices.push(x);
          vertexIndices.push(y);
          vertexIndices.push(z);

          // UV indices
          x = Number.parseInt(result[3]);
          if (Number.isNaN(x)) x = 1;
          y = Number.parseInt(result[7]);
          if (Number.isNaN(y)) y = 1;
          z = Number.parseInt(result[11]);
          if (Number.isNaN(z)) z = 1;
          texcoordIndices.push(x);
          texcoordIndices.push(y);
          texcoordIndices.push(z);

          // Normal indices
          x = Number.parseInt(result[4]);
          if (Number.isNaN(x)) x = 1;
          y = Number.parseInt(result[8]);
          if (Number.isNaN(y)) y = 1;
          z = Number.parseInt(result[12]);
          if (Number.isNaN(z)) z = 1;
          normalIndices.push(x);
          normalIndices.push(y);
          normalIndices.push(z);

          // Quad face
          if (typeof result[13] !== 'undefined') {
              
              // Vertex indices
              w = Number.parseInt(result[14]);
              if (Number.isNaN(w)) w = 1;
              vertexIndices.push(w);

              // UV indices
              w = Number.parseInt(result[15]);
              if (Number.isNaN(w)) w = 1;
              texcoordIndices.push(w);

              // Normal indices
              w = Number.parseInt(result[16]);
              if (Number.isNaN(w)) w = 1;
              normalIndices.push(w);

              quad = true;
          }
      }

      // ["f 1 2 3 4", "1", "2", "3", "4"]
      while ((result = faceVertexPattern.exec(string)) != null) {
          // Vertex indices
          x = Number.parseInt(result[2]);
          y = Number.parseInt(result[6]);
          z = Number.parseInt(result[10]);
          vertexIndices.push(x);
          vertexIndices.push(y);
          vertexIndices.push(z);

          // UV indices
          texcoordIndices.push(1);
          texcoordIndices.push(1);
          texcoordIndices.push(1);

          // Normal indices
          normalIndices.push(1);
          normalIndices.push(1);
          normalIndices.push(1);

          // Quad face
          if (typeof result[13] !== 'undefined') {

              // Vertex indices
              w = Number.parseInt(result[14]);
              vertexIndices.push(w);

              // UV indices
              texcoordIndices.push(1);
              // Normal indices
              normalIndices.push(1);

              quad = true;
          }
      }

      let index, size;

      size = vertexIndices.length;
      const positions = new Float32Array(size * 3);
      for (let i = 0; i < size; ++i) {
          index = vertexIndices[i] - 1;
          positions[i * 3 + 0] = vertexList[index * 3 + 0];
          positions[i * 3 + 1] = vertexList[index * 3 + 1];
          positions[i * 3 + 2] = vertexList[index * 3 + 2];
      }

      size = texcoordIndices.length;
      const texcoords = new Float32Array(size * 2);
      for (let i = 0; i < size; ++i) {
          index = texcoordIndices[i] - 1;
          texcoords[i * 2 + 0] = texcoordList[index * 2 + 0];
          texcoords[i * 2 + 1] = texcoordList[index * 2 + 1];
      }

      size = normalIndices.length;
      const normals = new Float32Array(size * 3);
      for (let i = 0; i < size; ++i) {
          index = normalIndices[i] - 1;
          normals[i * 3 + 0] = normalList[index * 3 + 0];
          normals[i * 3 + 1] = normalList[index * 3 + 1];
          normals[i * 3 + 2] = normalList[index * 3 + 2];
      }

      // Must be either unsigned short or unsigned byte.
      size = vertexIndices.length;
      const indices = new Uint16Array(size);
      for (let i = 0; i < size; ++i) {
          indices[i] = i;
      }

      if (quad) {
          console.warn('WebGL does not support quad faces, only triangles.');
      }

      return {
          positions,
          texcoords,
          normals,
          indices,
      };
  }

  var OBJLoader = /*#__PURE__*/Object.freeze({
      __proto__: null,
      loadOBJ: loadOBJ
  });

  const AUDIO_CONTEXT = new AudioContext();
  autoUnlock(AUDIO_CONTEXT);

  async function autoUnlock(ctx)
  {
      const callback = () => {
          if (ctx.state === 'suspended') {
              ctx.resume();
          }
      };
      document.addEventListener('click', callback);
  }

  // Bresenham's Line Algorithm

  const TO_RAD_FACTOR = Math.PI / 180;
  function toRadians(degrees)
  {
      return degrees * TO_RAD_FACTOR;
  }

  /**
   * @typedef TypeInfo
   * @property {Array} TypedArray
   * @property {Number} size
   * @property {Function} uniform
   * @property {Function} [arrayUniform]
   * @property {Number} [arrayType]
   * @property {Function} [sampler]
   * @property {Function} [arraySampler]
   * @property {Number} [bindPoint]
   */

  let TYPE_INFO = null;

  /**
   * @param {WebGLRenderingContext} gl 
   * @param {Number} type 
   * @returns {TypeInfo}
   */
  function getTypeInfo(gl, type) {
      if (!TYPE_INFO) {
          TYPE_INFO = createTypeInfo(gl);
      }
      return TYPE_INFO[type];
  }

  /** Whether the type should be a uniform sampler. */
  function isUniformSamplerType(gl, type) {
      let typeInfo = getTypeInfo(gl, type);
      return 'sampler' in typeInfo;
  }

  /**
   * Get the component type if the passed-in type is a vertex type. Otherwise,
   * returns the same type (treated as a single component vector).
   * 
   * @param {WebGLRenderingContext} gl
   * @param {Number} type
   * @returns {Number} The vertex component type.
   */
  function getVertexComponentType(gl, type)
  {
      let typeInfo = getTypeInfo(gl, type);
      if ('arrayType' in typeInfo)
      {
          return typeInfo.arrayType;
      }
      else
      {
          return type;
      }
  }

  function getUniformFunction(gl, type) {
      let typeInfo = getTypeInfo(gl, type);
      return typeInfo.uniform;
  }

  function getUniformSamplerFunction(gl, samplerType, textureUnit) {
      let typeInfo = getTypeInfo(gl, samplerType);
      return typeInfo.sampler(typeInfo.bindPoint, textureUnit);
  }

  function createTypeInfo(gl) {
      let result = {};

      if (gl instanceof WebGLRenderingContext)
      {
          result[gl.FLOAT]                         = { TypedArray: Float32Array, size:  4, uniform: gl.uniform1f,     arrayUniform: gl.uniform1fv, };
          result[gl.FLOAT_VEC2]                    = { TypedArray: Float32Array, size:  8, uniform: gl.uniform2fv,    arrayType: gl.FLOAT };
          result[gl.FLOAT_VEC3]                    = { TypedArray: Float32Array, size: 12, uniform: gl.uniform3fv,    arrayType: gl.FLOAT };
          result[gl.FLOAT_VEC4]                    = { TypedArray: Float32Array, size: 16, uniform: gl.uniform4fv,    arrayType: gl.FLOAT };
          result[gl.INT]                           = { TypedArray: Int32Array,   size:  4, uniform: gl.uniform1i,     arrayUniform: gl.uniform1iv, };
          result[gl.INT_VEC2]                      = { TypedArray: Int32Array,   size:  8, uniform: gl.uniform2iv,    arrayType: gl.INT };
          result[gl.INT_VEC3]                      = { TypedArray: Int32Array,   size: 12, uniform: gl.uniform3iv,    arrayType: gl.INT};
          result[gl.INT_VEC4]                      = { TypedArray: Int32Array,   size: 16, uniform: gl.uniform4iv,    arrayType: gl.INT};
          result[gl.UNSIGNED_INT]                  = { TypedArray: Uint32Array,  size:  4, uniform: gl.uniform1ui,    arrayUniform: gl.uniform1uiv, };
          result[gl.UNSIGNED_INT_VEC2]             = { TypedArray: Uint32Array,  size:  8, uniform: gl.uniform2uiv,   arrayType: gl.UNSIGNED_INT };
          result[gl.UNSIGNED_INT_VEC3]             = { TypedArray: Uint32Array,  size: 12, uniform: gl.uniform3uiv,   arrayType: gl.UNSIGNED_INT };
          result[gl.UNSIGNED_INT_VEC4]             = { TypedArray: Uint32Array,  size: 16, uniform: gl.uniform4uiv,   arrayType: gl.UNSIGNED_INT };
          result[gl.BOOL]                          = { TypedArray: Uint32Array,  size:  4, uniform: gl.uniform1i,     arrayUniform: gl.uniform1iv, };
          result[gl.BOOL_VEC2]                     = { TypedArray: Uint32Array,  size:  8, uniform: gl.uniform2iv,    arrayType: gl.BOOL };
          result[gl.BOOL_VEC3]                     = { TypedArray: Uint32Array,  size: 12, uniform: gl.uniform3iv,    arrayType: gl.BOOL };
          result[gl.BOOL_VEC4]                     = { TypedArray: Uint32Array,  size: 16, uniform: gl.uniform4iv,    arrayType: gl.BOOL };
          result[gl.FLOAT_MAT2]                    = { TypedArray: Float32Array, size: 16, uniform: _uniformMatrix2fv,  arrayType: gl.FLOAT };
          result[gl.FLOAT_MAT3]                    = { TypedArray: Float32Array, size: 36, uniform: _uniformMatrix3fv,  arrayType: gl.FLOAT };
          result[gl.FLOAT_MAT4]                    = { TypedArray: Float32Array, size: 64, uniform: _uniformMatrix4fv,  arrayType: gl.FLOAT };

          result[gl.UNSIGNED_BYTE]                 = { TypedArray: Uint8Array,   size: 1 };
          result[gl.UNSIGNED_SHORT]                = { TypedArray: Uint16Array,  size: 2 };
      }
      else
      {
          throw new Error('Unknown gl context provided.');
      }

      if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext)
      {
          result[gl.FLOAT_MAT2x3]                  = { TypedArray: Float32Array, size: 24, uniform: _uniformMatrix2x3fv, arrayType: gl.FLOAT };
          result[gl.FLOAT_MAT2x4]                  = { TypedArray: Float32Array, size: 32, uniform: _uniformMatrix2x4fv, arrayType: gl.FLOAT };
          result[gl.FLOAT_MAT3x2]                  = { TypedArray: Float32Array, size: 24, uniform: _uniformMatrix3x2fv, arrayType: gl.FLOAT };
          result[gl.FLOAT_MAT3x4]                  = { TypedArray: Float32Array, size: 48, uniform: _uniformMatrix3x4fv, arrayType: gl.FLOAT };
          result[gl.FLOAT_MAT4x2]                  = { TypedArray: Float32Array, size: 32, uniform: _uniformMatrix4x2fv, arrayType: gl.FLOAT };
          result[gl.FLOAT_MAT4x3]                  = { TypedArray: Float32Array, size: 48, uniform: _uniformMatrix4x3fv, arrayType: gl.FLOAT };
          loadSamplerTypeInfos(gl, result, _uniformSamplerWebGL2, _uniformSamplerArrayWebGL2);
      }
      else
      {
          loadSamplerTypeInfos(gl, result, _uniformSamplerWebGL1, _uniformSamplerArrayWebGL1);
      }

      return result;
  }

  function loadSamplerTypeInfos(gl, result, samplerSetter, samplerArraySetter) {
      result[gl.SAMPLER_2D]                    = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D,       };
      result[gl.SAMPLER_CUBE]                  = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_CUBE_MAP, };
      result[gl.SAMPLER_3D]                    = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_3D,       };
      result[gl.SAMPLER_2D_SHADOW]             = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D,       };
      result[gl.SAMPLER_2D_ARRAY]              = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D_ARRAY, };
      result[gl.SAMPLER_2D_ARRAY_SHADOW]       = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D_ARRAY, };
      result[gl.SAMPLER_CUBE_SHADOW]           = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_CUBE_MAP, };
      result[gl.INT_SAMPLER_2D]                = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D,       };
      result[gl.INT_SAMPLER_3D]                = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_3D,       };
      result[gl.INT_SAMPLER_CUBE]              = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_CUBE_MAP, };
      result[gl.INT_SAMPLER_2D_ARRAY]          = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D_ARRAY, };
      result[gl.UNSIGNED_INT_SAMPLER_2D]       = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D,       };
      result[gl.UNSIGNED_INT_SAMPLER_3D]       = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_3D,       };
      result[gl.UNSIGNED_INT_SAMPLER_CUBE]     = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_CUBE_MAP, };
      result[gl.UNSIGNED_INT_SAMPLER_2D_ARRAY] = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D_ARRAY, };
      return result;
  }

  function _uniformMatrix2fv(location, v) {
      this.uniformMatrix2fv(location, false, v);
  }

  function _uniformMatrix3fv(location, v) {
      this.uniformMatrix3fv(location, false, v);
  }

  function _uniformMatrix4fv(location, v) {
      this.uniformMatrix4fv(location, false, v);
  }

  function _uniformMatrix2x3fv(location, v) {
      this.uniformMatrix2x3fv(location, false, v);
  }

  function _uniformMatrix3x2fv(location, v) {
      this.uniformMatrix3x2fv(location, false, v);
  }

  function _uniformMatrix2x4fv(location, v) {
      this.uniformMatrix2x4fv(location, false, v);
  }

  function _uniformMatrix4x2fv(location, v) {
      this.uniformMatrix4x2fv(location, false, v);
  }

  function _uniformMatrix3x4fv(location, v) {
      this.uniformMatrix3x4fv(location, false, v);
  }

  function _uniformMatrix4x3fv(location, v) {
      this.uniformMatrix4x3fv(location, false, v);
  }

  function _uniformSamplerWebGL1(bindPoint, unit) {
      return function (location, texture) {
          this.uniform1i(location, unit);
          this.activeTexture(this.TEXTURE0 + unit);
          this.bindTexture(bindPoint, texture);
      };
  }

  function _uniformSamplerArrayWebGL1(bindPoint, unit, size) {
      const units = new Int32Array(size);
      for (let ii = 0; ii < size; ++ii) {
          units[ii] = unit + ii;
      }
      return function (location, textures) {
          this.uniform1iv(location, units);
          textures.forEach(function (texture, index) {
              this.activeTexture(this.TEXTURE0 + units[index]);
              this.bindTexture(bindPoint, texture);
          });
      };
  }

  function _uniformSamplerWebGL2(bindPoint, unit) {
      return function (location, textureOrPair) {
          let texture;
          let sampler;
          if (textureOrPair instanceof WebGLTexture) {
              texture = textureOrPair;
              sampler = null;
          } else {
              texture = textureOrPair.texture;
              sampler = textureOrPair.sampler;
          }
          this.uniform1i(location, unit);
          this.activeTexture(this.TEXTURE0 + unit);
          this.bindTexture(bindPoint, texture);
          this.bindSampler(unit, sampler);
      };
  }

  function _uniformSamplerArrayWebGL2(bindPoint, unit, size) {
      const units = new Int32Array(size);
      for (let ii = 0; ii < size; ++ii) {
          units[ii] = unit + ii;
      }
      return function (location, textures) {
          this.uniform1iv(location, units);
          textures.forEach(function (textureOrPair, index) {
              this.activeTexture(this.TEXTURE0 + units[index]);
              let texture;
              let sampler;
              if (textureOrPair instanceof WebGLTexture) {
                  texture = textureOrPair;
                  sampler = null;
              } else {
                  texture = textureOrPair.texture;
                  sampler = textureOrPair.sampler;
              }
              this.bindSampler(unit, sampler);
              this.bindTexture(bindPoint, texture);
          });
      };
  }

  /**
   * Creates a buffer source given the type and data.
   * 
   * @param {WebGLRenderingContext} gl 
   * @param {Number} type
   * @param {Array} data The buffer source data array.
   */
  function createBufferSource(gl, type, data)
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
  function draw(gl, mode, offset, count, elementBuffer = null)
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

  function Program(gl)
  {
      return new ProgramBuilder(gl);
  }

  class ProgramBuilder
  {
      constructor(gl)
      {
          this.handle = gl.createProgram();
          this.shaders = [];
          this.gl = gl;
      }

      shader(type, shaderSource)
      {
          const gl = this.gl;
          let shader = createShader(gl, type, shaderSource);
          this.shaders.push(shader);
          return this;
      }

      link()
      {
          const gl = this.gl;
          createShaderProgram(gl, this.handle, this.shaders);
          this.shaders.length = 0;
          return this.handle;
      }
  }

  /**
   * @typedef ActiveUniformInfo
   * @property {String} type
   * @property {Number} length
   * @property {Number} location
   * @property {Function} set
   */

  /**
   * Get object mapping of all active uniforms to their info.
   * @param {WebGLRenderingContext} gl The current webgl context.
   * @param {WebGLProgram} program The program to get active uniforms from.
   * @returns {Record<String, ActiveUniformInfo>} An object mapping of uniform names to info.
   */
  function findActiveUniforms(gl, program)
  {
      let result = {};
      let activeUniformInfos = getActiveUniformInfos(gl, program);
      for(let uniformInfo of activeUniformInfos)
      {
          let uniformType = uniformInfo.type;
          let uniformName = uniformInfo.name;
          let uniformSize = uniformInfo.size;
          let uniformLocation = gl.getUniformLocation(program, uniformName);

          let uniformSetter;
          if (isUniformSamplerType(gl, uniformType))
          {
              let textureUnit = 0;
              let func = getUniformSamplerFunction(gl, uniformType, textureUnit);
              uniformSetter = function(gl, location, value) {
                  func.call(gl, location, value);
              };

              throw new Error('Samplers are not yet supported.');
          }
          else
          {
              let func = getUniformFunction(gl, uniformType);
              uniformSetter = function(gl, location, value) {
                  func.call(gl, location, value);
              };
          }

          result[uniformName] = {
              type: uniformType,
              length: uniformSize,
              location: uniformLocation,
              set: uniformSetter,
          };
      }
      return result;
  }

  /**
   * @typedef ActiveAttributeInfo
   * @property {String} type
   * @property {Number} length
   * @property {Number} location
   */

  /**
   * Get object mapping of all active attributes to their info.
   * @param {WebGLRenderingContext} gl The current webgl context.
   * @param {WebGLProgram} program The program to get active attributes from.
   * @returns {Record<String, ActiveAttributeInfo>} An object mapping of attribute names to info.
   */
  function findActiveAttributes(gl, program)
  {
      let result = {};
      let attributeInfos = getActiveAttributeInfos(gl, program);
      for(let attributeInfo of attributeInfos)
      {
          let attributeType = attributeInfo.type;
          let attributeName = attributeInfo.name;
          let attributeSize = attributeInfo.size;
          let attributeLocation = gl.getAttribLocation(program, attributeName);

          result[attributeName] = {
              type: attributeType,
              length: attributeSize,
              location: attributeLocation,
          };
      }
      return result;
  }

  function createShader(gl, type, shaderSource)
  {
      let shader = gl.createShader(type);
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);

      let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (status)
      {
          return shader;
      }

      console.error(gl.getShaderInfoLog(shader) + '\nFailed to compile shader:\n' + shaderSource);
      gl.deleteShader(shader);
  }

  function createShaderProgram(gl, program, shaders)
  {
      // Attach to the program.
      for(let shader of shaders)
      {
          gl.attachShader(program, shader);
      }

      // Link'em!
      gl.linkProgram(program);

      // Don't forget to clean up the shaders! It's no longer needed.
      for(let shader of shaders)
      {
          gl.detachShader(program, shader);
          gl.deleteShader(shader);
      }

      let status = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (status)
      {
          return program;
      }
      
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
  }

  /**
   * Get info for all active attributes in program.
   * @param {WebGLRenderingContext} gl The current webgl context.
   * @param {WebGLProgram} program The program to get the active attributes from.
   * @returns {Array<WebGLActiveInfo>} An array of active attributes.
   */
  function getActiveAttributeInfos(gl, program)
  {
      let result = [];
      const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
      for(let i = 0; i < attributeCount; ++i)
      {
          let attributeInfo = gl.getActiveAttrib(program, i);
          if (!attributeInfo) continue;
          result.push(attributeInfo);
      }
      return result;
  }

  /**
   * Get info for all active uniforms in program.
   * @param {WebGLRenderingContext} gl The current webgl context.
   * @param {WebGLProgram} program The program to get the active uniforms from.
   * @returns {Array<WebGLActiveInfo>} An array of active uniforms.
   */
  function getActiveUniformInfos(gl, program)
  {
      let result = [];
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for(let i = 0; i < uniformCount; ++i)
      {
          let uniformInfo = gl.getActiveUniform(program, i);
          if (!uniformInfo) break;
          result.push(uniformInfo);
      }
      return result;
  }

  function createProgramInfo(gl, program)
  {
      return new ProgramInfo(gl, program);
  }

  class ProgramInfo
  {
      constructor(gl, program)
      {
          this.handle = program;

          this.activeUniforms = findActiveUniforms(gl, program);
          this.activeAttributes = findActiveAttributes(gl, program);

          this.drawContext = new ProgramInfoDrawContext(this);
      }

      bind(gl)
      {
          gl.useProgram(this.handle);

          this.drawContext.gl = gl;
          return this.drawContext;
      }
  }

  class ProgramInfoDrawContext
  {
      constructor(programInfo)
      {
          this.parent = programInfo;

          // Must be set by parent.
          this.gl = null;
      }
      
      uniform(uniformName, value)
      {
          const gl = this.gl;
          const activeUniforms = this.parent.activeUniforms;
          if (uniformName in activeUniforms)
          {
              let uniform = activeUniforms[uniformName];
              let location = uniform.location;
              uniform.set(gl, location, value);
          }
          return this;
      }

      /**
       * 
       * @param {String} attributeName Name of the attribute.
       * @param {WebGLBuffer} buffer The buffer handle.
       * @param {Number} size The size of each vector in the buffer.
       * @param {Boolean} [normalize=false] Whether to normalize the vectors in the buffer.
       * @param {Number} [stride=0] The stride for each vector in the buffer.
       * @param {Number} [offset=0] The initial offset in the buffer.
       */
      attribute(attributeName, buffer, size, normalize = false, stride = 0, offset = 0)
      {
          const gl = this.gl;
          const activeAttributes = this.parent.activeAttributes;
          if (attributeName in activeAttributes)
          {
              let attribute = activeAttributes[attributeName];
              let location = attribute.location;
              if (buffer)
              {
                  let type = getVertexComponentType(gl, attribute.type);
                  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                  gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
                  gl.enableVertexAttribArray(location);
              }
              else
              {
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
      draw(gl, mode, offset, count, elementBuffer = null)
      {
          draw(gl, mode, offset, count, elementBuffer);
          return this.parent;
      }
  }

  const UP = fromValues(0, 1, 0);

  /**
   * Creates a camera controller that behaves like a traditional
   * first person camera. Pitch is restricted to prevent gimbal lock
   * and roll is ignored.
   * 
   * NOTE: Don't forget to lock your pointer, i.e. `canvas.requestPointerLock()`.
   */
  function createFirstPersonCameraController(opts = {})
  {
      const { xzlock = false } = opts;

      return {
          position: create$2(),
          forward: fromValues(0, 0, -1),
          right: fromValues(1, 0, 0),
          up: fromValues(0, 1, 0),
          forwardAmount: 0,
          rightAmount: 0,
          upAmount: 0,
          pitch: 0,
          yaw: -90,
          look(dx, dy, dt = 1)
          {
              this.pitch = Math.min(90, Math.max(-90, this.pitch + dy * dt));
              this.yaw = (this.yaw + dx * dt) % 360;
              return this;
          },
          move(forward, right = 0, up = 0, dt = 1)
          {
              this.forwardAmount += forward * dt;
              this.rightAmount += right * dt;
              this.upAmount += up * dt;
              return this;
          },
          apply(out)
          {
              let {
                  position,
                  forward, right, up,
                  forwardAmount, rightAmount, upAmount,
                  pitch, yaw
              } = this;

              // Calculate forward and right vectors
              let rady = toRadians(yaw);
              let radp = toRadians(pitch);
              let cosy = Math.cos(rady);
              let cosp = Math.cos(radp);
              let siny = Math.sin(rady);
              let sinp = Math.sin(radp);
              let dx = cosy * cosp;
              let dy = sinp;
              let dz = siny * cosp;
              normalize(forward, set(forward, dx, dy, dz));
              normalize(right, cross(right, forward, up));

              let move = create$2();
              let prevY = position[1];
              // Move forward
              scale(move, forward, forwardAmount);
              add(position, position, move);
              // Move right
              scale(move, right, rightAmount);
              add(position, position, move);
              if (xzlock) position[1] = prevY;
              // Move up
              scale(move, up, upAmount);
              add(position, position, move);
              // Reset movement
              this.forwardAmount = 0;
              this.rightAmount = 0;
              this.upAmount = 0;
              
              let target = add(move, position, forward);
              lookAt(out, position, target, up);
              return out;
          }
      };
  }

  const DEFAULT_FOVY = Math.PI / 3;
  function createPerspectiveCamera(canvas, fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000)
  {
      return new PerspectiveCamera(canvas, fieldOfView, near, far);
  }

  class PerspectiveCamera
  {
      constructor(canvas, fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000)
      {
          this.canvas = canvas;
          this.fieldOfView = fieldOfView;
          this.clippingPlane = {
              near,
              far,
          };
          this.projectionMatrix = create$1();
          this.viewMatrix = create$1();

          this.resize = this.resize.bind(this);

          canvas.addEventListener('resize', this.resize);
          this.resize();
      }

      destroy()
      {
          this.canvas.removeEventListener('resize', this.resize);
      }

      resize()
      {
          const aspectRatio = this.canvas.width / this.canvas.height;
          const { near, far } = this.clippingPlane;
          perspective(this.projectionMatrix, this.fieldOfView, aspectRatio, near, far);
      }
  }

  /**
   * An enum for input types.
   * 
   * @readonly
   * @enum {Number}
   */
  const InputType = {
      NULL: 0,
      KEY: 1,
      POS: 2,
      WHEEL: 3,
  };

  /**
   * An enum for input events.
   * 
   * @readonly
   * @enum {Number}
   */
  const InputEventCode = {
      NULL: 0,
      DOWN: 1,
      UP: 2,
      MOVE: 3,
      parse(string)
      {
          if (typeof string === 'string')
          {
              switch(string.toLowerCase())
              {
                  case 'down': return InputEventCode.DOWN;
                  case 'up': return InputEventCode.UP;
                  case 'move': return InputEventCode.MOVE;
                  default: return InputEventCode.NULL;
              }
          }
          else
          {
              return InputEventCode.NULL;
          }
      }
  };

  const WILDCARD_KEY_MATCHER = '*';

  /**
   * @typedef InputEvent
   * @property {EventTarget} target
   * @property {String} deviceName
   * @property {String} keyCode
   * @property {InputEventCode} event
   * @property {InputType} type
   * @property {Number} [value] If type is `key`, it is defined to be the input
   * value of the triggered event (usually this is 1). Otherwise, it is undefined.
   * @property {Boolean} [control] If type is `key`, it is defined to be true if
   * any control key is down (false if up). Otherwise, it is undefined.
   * @property {Boolean} [shift] If type is `key`, it is defined to be true if
   * any shift key is down (false if up). Otherwise, it is undefined.
   * @property {Boolean} [alt] If type is `key`, it is defined to be true if any
   * alt key is down (false if up). Otherwise, it is undefined.
   * @property {Number} [x] If type is `pos`, it is defined to be the x value
   * of the position event. Otherwise, it is undefined.
   * @property {Number} [y] If type is `pos`, it is defined to be the y value
   * of the position event. Otherwise, it is undefined.
   * @property {Number} [dx] If type is `pos` or `wheel`, it is defined to be
   * the change in the x value from the previous to the current position.
   * Otherwise, it is undefined.
   * @property {Number} [dy] If type is `pos` or `wheel`, it is defined to be
   * the change in the y value from the previous to the current position.
   * Otherwise, it is undefined.
   * @property {Number} [dz] If type is `wheel`, it is defined to be the change
   * in the z value from the previous to the current position. Otherwise, it
   * is undefined.
   * 
   * @callback InputDeviceListener
   * @param {InputEvent} e
   * @returns {Boolean} Whether to consume the input after all other
   * listeners had a chance to handle the event.
   */

  class InputDevice$1
  {
      constructor(deviceName, eventTarget)
      {
          this.deviceName = deviceName;
          this.eventTarget = eventTarget;

          /** @private */
          this.listeners = {};
      }

      destroy()
      {
          /** @private */
          this.listeners = {};
      }

      /**
       * @param {String} keyMatcher
       * @param {InputDeviceListener} listener
       */
      addInputListener(keyMatcher, listener)
      {
          let inputListeners = this.listeners[keyMatcher];
          if (!inputListeners)
          {
              inputListeners = [listener];
              this.listeners[keyMatcher] = inputListeners;
          }
          else
          {
              inputListeners.push(listener);
          }
      }

      /**
       * @param {String} keyMatcher
       * @param {InputDeviceListener} listener
       */
      removeInputListener(keyMatcher, listener)
      {
          let inputListeners = this.listeners[keyMatcher];
          if (inputListeners)
          {
              inputListeners.indexOf(listener);
              inputListeners.splice(listener, 1);
          }
      }

      /**
       * @param {InputEvent} e
       * @returns {Boolean} Whether the input event should be consumed.
       */
      dispatchInput(e)
      {
          const { keyCode } = e;
          const listeners = this.listeners[keyCode];
          let flag = false;
          if (listeners)
          {
              // KeyCode listeners
              for(let listener of listeners)
              {
                  flag |= listener(e);
              }
              return flag;
          }
          // Wildcard listeners
          for(let listener of this.listeners[WILDCARD_KEY_MATCHER])
          {
              flag |= listener(e);
          }
          return flag;
      }
  }

  /**
   * A class that listens to the keyboard events from the event target and
   * transforms the events into a valid {@link InputEvent} for the added
   * listeners.
   */
  class Keyboard$1 extends InputDevice$1
  {
      /**
       * Constructs a listening keyboard with no listeners (yet).
       * 
       * @param {EventTarget} eventTarget 
       * @param {Object} [opts] Any additional options.
       * @param {Boolean} [opts.repeat=false] Whether to accept repeated key
       * events.
       */
      constructor(eventTarget, opts = {})
      {
          super('Keyboard', eventTarget);

          const { repeat = false } = opts;
          this.repeat = repeat;

          /** @private */
          this._eventObject = {
              target: eventTarget,
              deviceName: this.deviceName,
              keyCode: '',
              event: InputEventCode.NULL,
              type: InputType.KEY,
              // Key values
              value: 0,
              control: false,
              shift: false,
              alt: false,
          };

          /** @private */
          this.onKeyDown = this.onKeyDown.bind(this);
          /** @private */
          this.onKeyUp = this.onKeyUp.bind(this);

          eventTarget.addEventListener('keydown', this.onKeyDown);
          eventTarget.addEventListener('keyup', this.onKeyUp);
      }

      /** @override */
      destroy()
      {
          let eventTarget = this.eventTarget;
          eventTarget.removeEventListener('keydown', this.onKeyDown);
          eventTarget.removeEventListener('keyup', this.onKeyUp);

          super.destroy();
      }

      /**
       * @private
       * @param {KeyboardEvent} e
       */
      onKeyDown(e)
      {
          if (e.repeat)
          {
              e.preventDefault();
              e.stopPropagation();
              return false;
          }

          let event = this._eventObject;
          // We care more about location (code) than print char (key).
          event.keyCode = e.code;
          event.event = InputEventCode.DOWN;
          event.value = 1;
          event.control = e.ctrlKey;
          event.shift = e.shiftKey;
          event.alt = e.altKey;

          let result = this.dispatchInput(event);
          if (result)
          {
              e.preventDefault();
              e.stopPropagation();
              return false;
          }
      }

      /**
       * @private
       * @param {KeyboardEvent} e
       */
      onKeyUp(e)
      {
          let event = this._eventObject;
          // We care more about location (code) than print char (key).
          event.keyCode = e.code;
          event.event = InputEventCode.UP;
          event.value = 1;
          event.control = e.ctrlKey;
          event.shift = e.shiftKey;
          event.alt = e.altKey;

          let result = this.dispatchInput(event);
          if (result)
          {
              e.preventDefault();
              e.stopPropagation();
              return false;
          }
      }
  }

  const DEFAULT_LINE_PIXELS = 10;
  const DEFAULT_PAGE_PIXELS = 100;

  /**
   * A class that listens to the keyboard events from the event target and
   * transforms the events into a valid {@link InputEvent} for the added
   * listeners.
   */
  class Mouse$1 extends InputDevice$1
  {
      /**
       * Constructs a listening mouse with no listeners (yet).
       * 
       * @param {EventTarget} eventTarget
       * @param {Object} [opts] Any additional options.
       * @param {Boolean} [opts.eventsOnFocus=true] Whether to capture events only when it has focus.
       */
      constructor(eventTarget, opts = { eventsOnFocus: true })
      {
          super('Mouse', eventTarget);

          this.canvasTarget = (eventTarget instanceof HTMLCanvasElement && eventTarget)
              || eventTarget.canvas
              || eventTarget.querySelector('canvas')
              || (eventTarget.shadowRoot && eventTarget.shadowRoot.querySelector('canvas'));
          this.eventsOnFocus = opts.eventsOnFocus;
          this._downHasFocus = false;

          /** @private */
          this._eventObject = {
              target: eventTarget,
              deviceName: this.deviceName,
              keyCode: '',
              event: InputEventCode.NULL,
              type: InputType.KEY,
              // Key values
              value: 0,
              control: false,
              shift: false,
              alt: false,
          };
          /** @private */
          this._positionObject = {
              target: eventTarget,
              deviceName: this.deviceName,
              keyCode: 'Position',
              event: InputEventCode.MOVE,
              type: InputType.POS,
              // Pos values
              x: 0, y: 0,
              dx: 0, dy: 0,
          };
          /** @private */
          this._wheelObject = {
              target: eventTarget,
              deviceName: this.deviceName,
              keyCode: 'Wheel',
              event: InputEventCode.MOVE,
              type: InputType.WHEEL,
              // Wheel values
              dx: 0, dy: 0, dz: 0,
          };

          /** @private */
          this.onMouseDown = this.onMouseDown.bind(this);
          /** @private */
          this.onMouseUp = this.onMouseUp.bind(this);
          /** @private */
          this.onMouseMove = this.onMouseMove.bind(this);
          /** @private */
          this.onContextMenu = this.onContextMenu.bind(this);
          /** @private */
          this.onWheel = this.onWheel.bind(this);

          eventTarget.addEventListener('mousedown', this.onMouseDown);
          eventTarget.addEventListener('contextmenu', this.onMouseDown);
          eventTarget.addEventListener('wheel', this.onWheel);
          eventTarget.addEventListener('mousemove', this.onMouseMove);
          document.addEventListener('mouseup', this.onMouseUp);
      }

      /** @override */
      destroy()
      {
          let eventTarget = this.eventTarget;
          eventTarget.removeEventListener('mousedown', this.onMouseDown);
          eventTarget.removeEventListener('contextmenu', this.onMouseDown);
          eventTarget.removeEventListener('wheel', this.onWheel);
          eventTarget.removeEventListener('mousemove', this.onMouseMove);
          document.removeEventListener('mouseup', this.onMouseUp);

          super.destroy();
      }

      setPointerLock(force = true)
      {
          if (force)
          {
              this.eventTarget.requestPointerLock();
          }
          else
          {
              this.eventTarget.exitPointerLock();
          }
      }

      hasPointerLock()
      {
          return document.pointerLockElement === this.eventTarget;
      }

      /**
       * @private
       * @param {MouseEvent} e
       */
      onMouseDown(e)
      {
          this._downHasFocus = true;
          
          let event = this._eventObject;
          // We care more about location (code) than print char (key).
          event.keyCode = 'Button' + e.button;
          event.event = InputEventCode.DOWN;
          event.value = 1;
          event.control = e.ctrlKey;
          event.shift = e.shiftKey;
          event.alt = e.altKey;

          let result = this.dispatchInput(event);
          if (result)
          {
              // Make sure it has focus first.
              if (document.activeElement === this.eventTarget)
              {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
              }
          }
      }

      /**
       * @private
       * @param {MouseEvent} e
       */
      onContextMenu(e)
      {
          e.preventDefault();
          e.stopPropagation();
          return false;
      }

      /**
       * @private
       * @param {WheelEvent} e
       */
      onWheel(e)
      {
          let event = this._wheelObject;
          switch(e.deltaMode)
          {
              case WheelEvent.DOM_DELTA_LINE:
                  event.dx = e.deltaX * DEFAULT_LINE_PIXELS;
                  event.dy = e.deltaY * DEFAULT_LINE_PIXELS;
                  event.dz = e.deltaZ * DEFAULT_LINE_PIXELS;
                  break;
              case WheelEvent.DOM_DELTA_PAGE:
                  event.dx = e.deltaX * DEFAULT_PAGE_PIXELS;
                  event.dy = e.deltaY * DEFAULT_PAGE_PIXELS;
                  event.dz = e.deltaZ * DEFAULT_PAGE_PIXELS;
                  break;
              case WheelEvent.DOM_DELTA_PIXEL:
              default:
                  event.dx = e.deltaX;
                  event.dy = e.deltaY;
                  event.dz = e.deltaZ;
                  break;
          }

          let result = this.dispatchInput(event);
          if (result)
          {
              e.preventDefault();
              e.stopPropagation();
              return false;
          }
      }

      /**
       * @private
       * @param {MouseEvent} e
       */
      onMouseUp(e)
      {
          // Make sure mouse down was pressed before this (with focus).
          if (!this._downHasFocus) return;
          this._downHasFocus = false;

          let event = this._eventObject;
          // We care more about location (code) than print char (key).
          event.keyCode = 'Button' + e.button;
          event.event = InputEventCode.UP;
          event.value = 1;
          event.control = e.ctrlKey;
          event.shift = e.shiftKey;
          event.alt = e.altKey;

          let result = this.dispatchInput(event);
          if (result)
          {
              e.preventDefault();
              e.stopPropagation();
              return false;
          }
      }

      /**
       * @private
       * @param {MouseEvent} e
       */
      onMouseMove(e)
      {
          if (this.eventsOnFocus && document.activeElement !== this.eventTarget) return;

          const element = this.canvasTarget;
          const { clientWidth, clientHeight } = element;
          const rect = element.getBoundingClientRect();
      
          let dx = e.movementX / clientWidth;
          let dy = e.movementY / clientHeight;
          let x = (e.clientX - rect.left) / clientWidth;
          let y = (e.clientY - rect.top) / clientHeight;
      
          let event = this._positionObject;
          event.x = x;
          event.y = y;
          event.dx = dx;
          event.dy = dy;

          this.dispatchInput(event);
      }
  }

  class Input$1
  {
      constructor()
      {
          /** The current state of the input. */
          this.value = 0;
      }

      update(value) { this.value = value; }
      poll() { this.value = 0; }

      /**
       * @param {import('../device/InputDevice.js').InputEventCode} eventCode
       * @returns {Number} The event state.
       */
      getEvent(eventCode) { return 0; }
      getState() { return this.value; }
  }

  class Axis$1 extends Input$1
  {
      constructor()
      {
          super();

          this.delta = 0;

          /** @private */
          this.next = {
              delta: 0,
          };
      }

      /** @override */
      update(value, delta)
      {
          this.value = value;
          this.next.delta += delta;
      }

      /** @override */
      poll()
      {
          this.delta = this.next.delta;
          this.next.delta = 0;
      }

      /** @override */
      getEvent(eventCode)
      {
          switch(eventCode)
          {
              case InputEventCode.MOVE: return this.delta;
              default: return super.getEvent(eventCode);
          }
      }
  }

  class Button$1 extends Input$1
  {
      constructor()
      {
          super();

          /** Whether the button is just pressed. Is updated on poll(). */
          this.down = false;
          /** Whether the button is just released. Is updated on poll(). */
          this.up = false;

          /** @private */
          this.next = {
              down: false,
              up: false,
          };
      }

      /** @override */
      update(value)
      {
          if (value)
          {
              this.next.down = true;
          }
          else
          {
              this.next.up = true;
          }
      }

      /** @override */
      poll()
      {
          const { up: nextUp, down: nextDown } = this.next;
          if (this.value)
          {
              if (this.up && !nextUp)
              {
                  this.value = 0;
              }
          }
          else if (nextDown)
          {
              this.value = 1;
          }

          this.down = nextDown;
          this.up = nextUp;

          this.next.down = false;
          this.next.up = false;
      }

      /** @override */
      getEvent(eventCode)
      {
          switch(eventCode)
          {
              case InputEventCode.DOWN: return (this.down & 1);
              case InputEventCode.UP: return (this.up & 1);
              default: return super.getEvent(eventCode);
          }
      }
  }

  /**
   * @readonly
   * @enum {Number}
   */
  const InputSourceStage = {
      NULL: 0,
      UPDATE: 1,
      POLL: 2,
  };

  /**
   * Whether the given key code for device is an axis input.
   * 
   * @param {String} deviceName 
   * @param {String} keyCode 
   */
  function isInputAxis(deviceName, keyCode)
  {
      return deviceName === 'Mouse'
          && (keyCode === 'PosX'
          || keyCode === 'PosY'
          || keyCode === 'ScrollX'
          || keyCode === 'ScrollY'
          || keyCode === 'ScrollZ');
  }

  /**
   * @typedef InputSourceInputEvent
   * @property {InputSourceStage} stage
   * @property {String} deviceName
   * @property {String} keyCode
   * @property {Axis|Button} input
   * 
   * @typedef InputSourcePollEvent
   * 
   * @callback InputSourceEventListener
   * @param {InputSourceInputEvent|InputSourcePollEvent} e
   */

  /**
   * A class to model the current input state with buttons and axes.
   */
  class InputSource
  {
      static from(eventTarget)
      {
          return new InputSource([
              new Keyboard$1(eventTarget),
              new Mouse$1(eventTarget),
          ]);
      }

      constructor(deviceList)
      {
          /** @private */
          this.onInputEvent = this.onInputEvent.bind(this);

          let deviceMap = {};
          let inputMap = {};
          for(let device of deviceList)
          {
              const deviceName = device.deviceName;
              deviceMap[deviceName] = device;
              inputMap[deviceName] = {};
              device.addInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
          }
          this.devices = deviceMap;
          /** @private */
          this.inputs = inputMap;

          /** @private */
          this.listeners = {
              poll: [],
              update: [],
          };
      }

      destroy()
      {
          this.clear();
          
          for(let deviceName in this.devices)
          {
              let device = this.devices[deviceName];
              device.removeInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
              device.destroy();
          }
      }

      /**
       * Add listener to listen for event, in order by most
       * recently added. In other words, this listener will
       * be called BEFORE the previously added listener (if
       * there exists one) and so on.
       * 
       * @param {String} event 
       * @param {InputSourceEventListener} listener 
       */
      addEventListener(event, listener)
      {
          if (event in this.listeners)
          {
              this.listeners[event].unshift(listener);
          }
          else
          {
              this.listeners[event] = [listener];
          }
      }

      /**
       * Removes the listener from listening to the event.
       * 
       * @param {String} event 
       * @param {InputSourceEventListener} listener 
       */
      removeEventListener(event, listener)
      {
          if (event in this.listeners)
          {
              let list = this.listeners[event];
              let i = list.indexOf(listener);
              list.splice(i, 1);
          }
      }

      /**
       * Dispatches an event to the listeners.
       * 
       * @param {String} eventName The name of the event.
       * @param {InputSourceInputEvent|InputSourcePollEvent} event The event object to pass to listeners.
       */
      dispatchEvent(eventName, event)
      {
          for(let listener of this.listeners[eventName])
          {
              listener(event);
          }
      }

      /**
       * @private
       * @param {InputSourceStage} stage 
       * @param {String} deviceName 
       * @param {String} keyCode 
       * @param {Axis|Button} input 
       */
      _dispatchInputEvent(stage, deviceName, keyCode, input)
      {
          this.dispatchEvent('input', { stage, deviceName, keyCode, input });
      }

      /** @private */
      _dispatchPollEvent()
      {
          this.dispatchEvent('poll', {});
      }
      
      /**
       * Poll the devices and update the input state.
       */
      poll()
      {
          for(const deviceName in this.inputs)
          {
              const inputMap = this.inputs[deviceName];
              for(const keyCode in inputMap)
              {
                  let input = inputMap[keyCode];
                  input.poll();
                  this._dispatchInputEvent(InputSourceStage.POLL, deviceName, keyCode, input);
              }
          }
          this._dispatchPollEvent();
      }

      /** @private */
      onInputEvent(e)
      {
          const deviceName = e.deviceName;
          switch(e.type)
          {
              case InputType.KEY:
                  {
                      const keyCode = e.keyCode;
                      let button = this.inputs[deviceName][keyCode];
                      if (button)
                      {
                          button.update(e.event === InputEventCode.DOWN);
                          this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, keyCode, button);
                      }
                  }
                  break;
              case InputType.POS:
                  {
                      let inputs = this.inputs[deviceName];
                      let xAxis = inputs.PosX;
                      if (xAxis)
                      {
                          xAxis.update(e.x, e.dx);
                          this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'PosX', xAxis);
                      }
                      let yAxis = inputs.PosY;
                      if (yAxis)
                      {
                          yAxis.update(e.y, e.dy);
                          this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'PosY', yAxis);
                      }
                  }
                  break;
              case InputType.WHEEL:
                  {
                      let inputs = this.inputs[deviceName];
                      let xAxis = inputs.ScrollX;
                      if (xAxis)
                      {
                          xAxis.update(e.dx, e.dx);
                          this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'ScrollX', xAxis);
                      }
                      let yAxis = inputs.ScrollY;
                      if (yAxis)
                      {
                          yAxis.update(e.dy, e.dy);
                          this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'ScrollY', yAxis);
                      }
                      let zAxis = inputs.ScrollZ;
                      if (zAxis)
                      {
                          zAxis.update(e.dz, e.dz);
                          this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'ScrollZ', zAxis);
                      }
                  }
                  break;
          }
      }
      
      /**
       * Add an input for the given device and key code.
       * 
       * @param {String} deviceName 
       * @param {String} keyCode 
       */
      add(deviceName, keyCode)
      {
          if (!(deviceName in this.devices))
          {
              throw new Error('Invalid device name - missing device with name in source.');
          }

          let result = isInputAxis(deviceName, keyCode)
              ? new Axis$1()
              : new Button$1();
          this.inputs[deviceName][keyCode] = result;
          return this;
      }

      /**
       * Remove the input for the given device and key code.
       * 
       * @param {String} deviceName 
       * @param {String} keyCode 
       */
      delete(deviceName, keyCode)
      {
          delete this.inputs[deviceName][keyCode];
      }

      /** @returns {Button|Axis} */
      get(deviceName, keyCode)
      {
          return this.inputs[deviceName][keyCode];
      }
      
      /**
       * @param {String} deviceName 
       * @param {String} keyCode 
       * @returns {Boolean} Whether the device and key code has been added.
       */
      has(deviceName, keyCode)
      {
          return deviceName in this.inputs && keyCode in this.inputs[deviceName];
      }

      /**
       * Removes all registered inputs from all devices.
       */
      clear()
      {
          for(let deviceName in this.devices)
          {
              this.inputs[deviceName] = {};
          }
      }
  }

  /**
   * @typedef AdapterInput
   * @property {Function} update
   * @property {Function} poll
   * @property {Function} reset
   * 
   * @typedef Adapter
   * @property {AdapterInput} target
   * @property {Number} adapterId
   * @property {String} deviceName
   * @property {String} keyCode
   * @property {Number} scale
   * @property {Number} eventCode
   */

  const WILDCARD_DEVICE_MATCHER = '*';

  class AdapterManager
  {
      /**
       * Creates a new adapter for the given values.
       * 
       * @param {AdapterInput} target The target callback to update the value.
       * @param {Number} adapterId The adapter id (unique within the target).
       * @param {String} deviceName The name of the device to listen to.
       * @param {String} keyCode The key code to listen to.
       * @param {Number} scale The input value multiplier.
       * @param {Number} eventCode The event code to listen for.
       * @returns {Adapter} The new adapter.
       */
      static createAdapter(target, adapterId, deviceName, keyCode, scale, eventCode)
      {
          return {
              target,
              adapterId,
              deviceName,
              keyCode,
              scale,
              eventCode,
          };
      }

      constructor()
      {
          /** @private */
          this.adapters = { [WILDCARD_DEVICE_MATCHER]: createKeyCodeMap() };
      }
      
      /**
       * @param {Array<Adapter>} adapters 
       */
      add(adapters)
      {
          for(let adapter of adapters)
          {
              const { deviceName, keyCode } = adapter;
              let adapterMap;
              if (!(deviceName in this.adapters))
              {
                  adapterMap = createKeyCodeMap();
                  this.adapters[deviceName] = adapterMap;
              }
              else
              {
                  adapterMap = this.adapters[deviceName];
              }

              if (keyCode in adapterMap)
              {
                  adapterMap[keyCode].push(adapter);
              }
              else
              {
                  adapterMap[keyCode] = [adapter];
              }
          }
      }

      /**
       * @param {Array<Adapter>} adapters
       */
      delete(adapters)
      {
          for(let adapter of adapters)
          {
              const { deviceName, keyCode } = adapter;
              if (deviceName in this.adapters)
              {
                  let adapterMap = this.adapters[deviceName];
                  if (keyCode in adapterMap)
                  {
                      let list = adapterMap[keyCode];
                      let index = list.indexOf(adapter);
                      if (index >= 0)
                      {
                          list.splice(index, 1);
                      }
                  }
              }
          }
      }

      clear()
      {
          for(let deviceName in this.adapters)
          {
              this.adapters[deviceName] = createKeyCodeMap();
          }
      }

      poll(deviceName, keyCode, input)
      {
          const adapters = this.findAdapters(deviceName, keyCode);
          for(let adapter of adapters)
          {
              const eventCode = adapter.eventCode;
              if (eventCode === InputEventCode.NULL)
              {
                  const { target, scale } = adapter;
                  const nextValue = input.value * scale;
                  target.poll(nextValue, adapter);
              }
              else
              {
                  const { target, scale } = adapter;
                  const nextValue = input.getEvent(eventCode) * scale;
                  target.poll(nextValue, adapter);
              }
          }
          return adapters.length > 0;
      }

      update(deviceName, keyCode, input)
      {
          let flag = false;
          for(let adapter of this.findAdapters(deviceName, keyCode))
          {
              const eventCode = adapter.eventCode;
              if (eventCode !== InputEventCode.NULL)
              {
                  const { target, scale } = adapter;
                  const nextValue = input.getEvent(eventCode) * scale;
                  target.update(nextValue, adapter);
                  flag = true;
              }
          }
          return flag;
      }

      reset(deviceName, keyCode, input)
      {
          let flag = false;
          for(let adapter of this.findAdapters(deviceName, keyCode))
          {
              adapter.target.reset();
              flag = true;
          }
          return flag;
      }
      
      /**
       * Find all adapters for the given device and key code.
       * 
       * @param {String} deviceName The name of the target device.
       * @param {String} keyCode The target key code.
       * @returns {Array<Adapter>} The associated adapters for the device and key code.
       */
      findAdapters(deviceName, keyCode)
      {
          let result = [];
          if (deviceName in this.adapters)
          {
              let adapterMap = this.adapters[deviceName];
              if (keyCode in adapterMap) result.push(...adapterMap[keyCode]);
              result.push(...adapterMap[WILDCARD_KEY_MATCHER]);
          }
          let wildMap = this.adapters[WILDCARD_DEVICE_MATCHER];
          if (keyCode in wildMap) result.push(...wildMap[keyCode]);
          result.push(...wildMap[WILDCARD_KEY_MATCHER]);
          return result;
      }
  }

  function createKeyCodeMap()
  {
      return { [WILDCARD_KEY_MATCHER]: [] };
  }

  const KEY_STRING_DEVICE_SEPARATOR = ':';

  class Synthetic extends Input$1
  {
      constructor(adapterOptions)
      {
          super();

          this.update = this.update.bind(this);

          if (!Array.isArray(adapterOptions))
          {
              adapterOptions = [adapterOptions];
          }
          let adapterList = [];
          let adapterId = 0;
          for(let adapterOption of adapterOptions)
          {
              if (typeof adapterOption === 'string')
              {
                  adapterOption = { key: adapterOption };
              }
              const { key, scale = 1, event = 'null' } = adapterOption;
              const { deviceName, keyCode } = parseKeyString(key);
              const eventCode = InputEventCode.parse(event);
              const scaleValue = Number(scale);
              let adapter = AdapterManager.createAdapter(
                  this, adapterId,
                  deviceName, keyCode,
                  scaleValue, eventCode);
              adapterList.push(adapter);
              ++adapterId;
          }

          /** @private */
          this.adapters = adapterList;
          /** @private */
          this.values = new Array(adapterList.length).fill(0);
          /** @private */
          this.next = {
              values: new Array(adapterList.length).fill(0),
              value: 0,
          };
      }

      /** @override */
      poll(value, adapter)
      {
          const adapterId = adapter.adapterId;
          let prevValue = this.values[adapterId];
          this.values[adapterId] = value;
          this.value = this.value - prevValue + value;

          this.next.values[adapterId] = 0;
          this.next.value += value - prevValue;
      }

      /** @override */
      update(value, adapter)
      {
          const adapterId = adapter.adapterId;
          let prevValue = this.next.values[adapterId];
          this.next.values[adapterId] = value;
          this.next.value += value - prevValue;
      }

      reset()
      {
          this.values.fill(0);
          this.value = 0;
          this.next.values.fill(0);
          this.next.value = 0;
      }
  }

  function parseKeyString(keyString)
  {
      let i = keyString.indexOf(KEY_STRING_DEVICE_SEPARATOR);
      if (i >= 0)
      {
          return {
              deviceName: keyString.substring(0, i),
              keyCode: keyString.substring(i + 1),
          };
      }
      else
      {
          throw new Error(`Invalid key string - missing device separator '${KEY_STRING_DEVICE_SEPARATOR}'.`);
      }
  }

  function stringifyDeviceKeyCodePair(deviceName, keyCode)
  {
      return `${deviceName}${KEY_STRING_DEVICE_SEPARATOR}${keyCode}`;
  }

  class InputContext$1
  {
      /**
       * Constructs a disabled InputContext with the given adapters and inputs.
       * 
       * @param {Object} [opts] Any additional options.
       * @param {Boolean} [opts.disabled=false] Whether the context should start disabled.
       */
      constructor(opts = {})
      {
          const { disabled = true } = opts;

          /** @type {import('./source/InputSource.js').InputSource} */
          this.inputSource = null;

          /** @private */
          this._disabled = disabled;
          /** @private */
          this._ignoreInput = disabled;

          /** @private */
          this.adapters = new AdapterManager();
          /** @private */
          this.inputs = {};

          /** @private */
          this.onSourceInput = this.onSourceInput.bind(this);
          /** @private */
          this.onSourcePoll = this.onSourcePoll.bind(this);
      }

      get disabled() { return this._disabled; }
      set disabled(value) { this.toggle(!value); }

      /**
       * @param {Object} inputMap The input to adapter options object map.
       * @returns {InputContext} Self for method-chaining.
       */
      setInputMap(inputMap)
      {
          this._setupInputs(this.inputSource, inputMap);
          return this;
      }

      /**
       * @param {import('./source/InputSource.js').InputSource} inputSource The
       * source of all inputs listened to.
       * @returns {InputContext} Self for method-chaining.
       */
      attach(inputSource)
      {
          this._setupInputs(inputSource, null);
          this.toggle(true);
          return this;
      }

      /**
       * @returns {InputContext} Self for method-chaining.
       */
      detach()
      {
          this.toggle(false);
          this._setupInputs(null, null);
          return this;
      }

      /** @private */
      _setupInputs(inputSource, inputMap)
      {
          // Make sure this context is disabled before changing it...
          const prevDisabled = this.disabled;
          this.disabled = true;

          // Prepare previous state...
          const prevInputSource = this.inputSource;
          const prevInputs = this.inputs;
          const isPrevSourceReplaced = (prevInputSource !== inputSource) && prevInputSource;
          const isPrevInputsReplaced = this.inputs && inputMap;
          
          // Tear down
          if (isPrevSourceReplaced || isPrevInputsReplaced)
          {
              if (isPrevSourceReplaced)
              {
                  prevInputSource.removeEventListener('poll', this.onSourcePoll);
                  prevInputSource.removeEventListener('input', this.onSourceInput);
              }
              
              for(let inputName in prevInputs)
              {
                  let { adapters } = prevInputs[inputName];
                  for(let adapter of adapters)
                  {
                      const { deviceName, keyCode } = adapter;
                      let refCount = removeSourceRef(prevInputSource, deviceName, keyCode);
                      if (refCount === 0)
                      {
                          prevInputSource.delete(deviceName, keyCode);
                      }
                  }
              }

              if (isPrevInputsReplaced)
              {
                  this.adapters.clear();
                  this.inputs = {};
              }
          }

          // Set up
          if (inputMap)
          {
              let inputs = {};
              for(let inputName in inputMap)
              {
                  let adapterOptions = inputMap[inputName];
                  let synthetic = new Synthetic(adapterOptions);
                  let syntheticAdapters = synthetic.adapters;
                  this.adapters.add(syntheticAdapters);
                  inputs[inputName] = synthetic;
              }
              this.inputs = inputs;
          }

          if (inputSource)
          {
              initSourceRefs(inputSource);

              const inputs = this.inputs;
              for(let inputName in inputs)
              {
                  let { adapters } = inputs[inputName];
                  for(let adapter of adapters)
                  {
                      const { deviceName, keyCode } = adapter;
                      let refCount = addSourceRef(inputSource, deviceName, keyCode);
                      if (refCount === 1)
                      {
                          inputSource.add(deviceName, keyCode);
                      }
                  }
              }

              if (this.inputSource !== inputSource)
              {
                  inputSource.addEventListener('poll', this.onSourcePoll);
                  inputSource.addEventListener('input', this.onSourceInput);
                  this.inputSource = inputSource;
              }
          }

          // Make sure this context returns to its previous expected state...
          this.disabled = prevDisabled;
      }

      /**
       * @private
       * @param {import('./source/InputSource.js').SourceInputEvent} e
       */
      onSourceInput(e)
      {
          if (!e.consumed && !this._ignoreInput)
          {
              const { stage, deviceName, keyCode, input } = e;
              switch(stage)
              {
                  case InputSourceStage.POLL:
                      this.adapters.poll(deviceName, keyCode, input);
                      break;
                  case InputSourceStage.UPDATE:
                      this.adapters.update(deviceName, keyCode, input);
                      break;
              }
              e.consumed = true;
          }
          else
          {
              const { deviceName, keyCode, input } = e;
              this.adapters.reset(deviceName, keyCode, input);
          }
      }

      /**
       * @private
       * @param {import('./source/InputSource.js').SourcePollEvent} e
       */
      onSourcePoll(e)
      {
          if (this._ignoreInput !== this.disabled)
          {
              this._ignoreInput = this.disabled;
          }
      }

      /**
       * Set the context to enabled/disabled.
       * 
       * @param {Boolean} [force] If defined, the context is enabled if true,
       * disabled if false. If undefined, it will toggle the current value.
       * @returns {InputContext} Self for method chaining.
       */
      toggle(force = this._disabled)
      {
          if (force)
          {
              if (!this.inputSource)
              {
                  throw new Error('Input source must be set before enabling input context.');
              }
      
              if (Object.keys(this.inputs).length <= 0)
              {
                  console.warn('No inputs found for enabled input context - did you forget to setInputMap()?');
              }
          }
          this._disabled = !force;
          return this;
      }

      /**
       * Get the synthetic input object by name.
       * 
       * @param {String} inputName 
       * @returns {Synthetic} The synthetic input for the given input name.
       */
      getInput(inputName)
      {
          return this.inputs[inputName];
      }

      /**
       * Get the current value of the input by name.
       * 
       * @param {String} inputName
       * @returns {Number} The input value.
       */
      getInputValue(inputName)
      {
          if (inputName in this.inputs)
          {
              return this.inputs[inputName].value;
          }
          else
          {
              return 0;
          }
      }
  }

  const INPUT_SOURCE_INPUT_REF_COUNTS = Symbol('inputRefCounts');

  function initSourceRefs(inputSource)
  {
      if (!(INPUT_SOURCE_INPUT_REF_COUNTS in inputSource))
      {
          inputSource[INPUT_SOURCE_INPUT_REF_COUNTS] = {};
      }
  }

  function addSourceRef(inputSource, deviceName, keyCode)
  {
      const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
      let refCounts = inputSource[INPUT_SOURCE_INPUT_REF_COUNTS];
      let value = (refCounts[keyString] + 1) || 1;
      refCounts[keyString] = value;
      return value;
  }

  function removeSourceRef(inputSource, deviceName, keyCode)
  {
      const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
      let refCounts = inputSource[INPUT_SOURCE_INPUT_REF_COUNTS];
      let value = (refCounts[keyString] - 1) || 0;
      refCounts[keyString] = Math.max(value, 0);
      return value;
  }

  // TODO: Should print the key code of any key somewhere, so we know what to use.
  // NOTE: https://keycode.info/
  const INPUT_MAPPING = {
      PointerX: { key: 'Mouse:PosX', scale: 1 },
      PointerY: { key: 'Mouse:PosY', scale: 1 },
      PointerMovementX: { key: 'Mouse:PosX', event: 'move' },
      PointerMovementY: { key: 'Mouse:PosY', event: 'move' },
      PointerDown: [
          { key: 'Mouse:Button0', scale: 1 },
          { key: 'Mouse:Button2', scale: 1 },
      ],
      MoveLeft: [ { key: 'Keyboard:ArrowLeft', scale: 1 }, { key: 'Keyboard:KeyA', scale: 1 } ],
      MoveRight: [ { key: 'Keyboard:ArrowLeft', scale: 1 }, { key: 'Keyboard:KeyD', scale: 1 } ],
      MoveUp: [ { key: 'Keyboard:ArrowUp', scale: 1 }, { key: 'Keyboard:KeyW', scale: 1 } ],
      MoveDown: [ { key: 'Keyboard:ArrowDown', scale: 1 }, { key: 'Keyboard:KeyS', scale: 1 } ],
  };

  const inputSource = InputSource.from(document.querySelector('#main'));
  const INPUT_CONTEXT = new InputContext$1().setInputMap(INPUT_MAPPING).attach(inputSource);

  document.addEventListener('DOMContentLoaded', main);

  async function main()
  {
      const display = document.querySelector('display-port');
      const input = INPUT_CONTEXT;
      display.addEventListener('focus', () => {
          if (document.pointerLockElement !== display)
          {
              display.requestPointerLock();
          }
      });
      document.addEventListener('pointerlockchange', () => {
          if (document.pointerLockElement !== display)
          {
              display.blur();
          }
      });

      /** @type {WebGLRenderingContext} */
      const gl = display.canvas.getContext('webgl');
      if (!gl) throw new Error('Your browser does not support WebGL.');

      gl.enable(gl.DEPTH_TEST);

      const assets = {
          mainVertexShaderSource: await TextLoader.loadText('main.vert'),
          mainFragmentShaderSource: await TextLoader.loadText('main.frag'),
          cubeObj: await OBJLoader.loadOBJ('cube.obj'),
      };

      const mainProgram = createProgramInfo(gl,
          Program(gl)
              .shader(gl.VERTEX_SHADER, assets.mainVertexShaderSource)
              .shader(gl.FRAGMENT_SHADER, assets.mainFragmentShaderSource)
              .link());
      
      const positionBufferSource = createBufferSource(gl, gl.FLOAT, assets.cubeObj.positions);
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positionBufferSource, gl.STATIC_DRAW);

      const elementBufferSource = createBufferSource(gl, gl.UNSIGNED_SHORT, assets.cubeObj.indices);
      const elementBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementBufferSource, gl.STATIC_DRAW);

      const mainCamera = createPerspectiveCamera(gl.canvas);
      const mainCameraController = createFirstPersonCameraController({ xzlock: true });

      function createCube(x = 0, y = 0, z = 0, dx = 1, dy = 1, dz = 1)
      {
          return {
              transform: fromRotationTranslationScale(
                  create$1(),
                  create$4(),
                  fromValues(x, y, z),
                  fromValues(dx, dy, dz)),
              color: fromValues$1(Math.random(), Math.random(), Math.random(), 1),
          };
      }

      let cubes = [
          createCube(-1, -1, -1),
          createCube(1, 1, 1),
      ];

      display.addEventListener('frame', e => {
          const dt = (e.detail.deltaTime / 1000) * 60;
          input.inputSource.poll();

          const lookX = input.getInputValue('PointerMovementX');
          const lookY = input.getInputValue('PointerMovementY');
          const moveX = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
          const moveZ = input.getInputValue('MoveUp') - input.getInputValue('MoveDown');

          gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          let program = mainProgram;
          let camera = mainCamera;
          
          mainCameraController.look(lookX * 100, -lookY * 60);
          mainCameraController.move(moveZ, moveX);
          mainCameraController.apply(camera.viewMatrix);
          
          /*
          let target = vec3.create();
          let invProjection = mat4.invert(mat4.create(), camera.projectionMatrix);
          vec3.transformMat4(target, [(cursorX - 0.5) * 2, -(cursorY - 0.5) * 2, 0], invProjection);
          CameraUtil.panTo(camera.viewMatrix, target[0], target[1], 0, 0.1);
          */
          const ctx = program.bind(gl);
          {
              ctx.uniform('u_projection', camera.projectionMatrix);
              ctx.uniform('u_view', camera.viewMatrix);
              ctx.attribute('a_position', positionBuffer, 3);
              for(let cube of cubes)
              {
                  ctx.uniform('u_model', cube.transform);
                  ctx.uniform('u_color', cube.color);
                  ctx.draw(gl, gl.TRIANGLES, 0, elementBufferSource.length, elementBuffer);
              }
          }
      });
  }

}());
//# sourceMappingURL=index.js.map
