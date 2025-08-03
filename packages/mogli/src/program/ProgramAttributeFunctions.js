import { isWebGL2Supported } from '../GLHelper.js';
import { getAttribVertexSize } from './ProgramAttributeHelper.js';

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
export function getAttributeFunction(gl, attributeType) {
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
