/**
 * Get the number of expected elements in the attribute vertex type.
 *
 * @param {WebGLRenderingContextBase} gl The gl context.
 * @param {GLenum} attribType The attribute gl type.
 * @returns {number} The number of expected elements in the attribute vertex type.
 */
export function getAttribVertexSize(gl, attribType) {
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
