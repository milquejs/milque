/**
 * @callback UniformArrayFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {Float32List|Int32List} value The vector array.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 * 
 * @callback UniformElementFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {...Number} values The elements of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 * 
 * @typedef {UniformArrayFunction|UniformElementFunction} UniformFunction
 */

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {GLenum} vertexAttribType 
 */
function getVertexAttribTypeInfo(gl, vertexAttribType)
{
    gl.BYTE;
    gl.UNSIGNED_BYTE;
    gl.SHORT;
    gl.UNSIGNED_SHORT;
    gl.FLOAT;
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
export const UNIFORM_ENUMS =  {
    // WebGL1
    FLOAT:                          0x1406,
    FLOAT_VEC2:                     0x8B50,
    FLOAT_VEC3:                     0x8B51,
    FLOAT_VEC4:                     0x8B52,
    INT:                            0x1404,
    INT_VEC2:                       0x8B53,
    INT_VEC3:                       0x8B54,
    INT_VEC4:                       0x8B55,
    BOOL:                           0x8B56,
    BOOL_VEC2:                      0x8B57,
    BOOL_VEC3:                      0x8B58,
    BOOL_VEC4:                      0x8B59,
    FLOAT_MAT2:                     0x8B5A,
    FLOAT_MAT3:                     0x8B5B,
    FLOAT_MAT4:                     0x8B5C,
    SAMPLER_2D:                     0x8B5E,
    SAMPLER_CUBE:                   0x8B60,
    // WebGL2
    UNSIGNED_INT:                   0x1405,
    UNSIGNED_INT_VEC2:              0x8DC6,
    UNSIGNED_INT_VEC3:              0x8DC7,
    UNSIGNED_INT_VEC4:              0x8DC8,
    FLOAT_MAT2x3:                   0x8B65,
    FLOAT_MAT2x4:                   0x8B66,
    FLOAT_MAT3x2:                   0x8B67,
    FLOAT_MAT3x4:                   0x8B68,
    FLOAT_MAT4x2:                   0x8B69,
    FLOAT_MAT4x3:                   0x8B6A,
    SAMPLER_3D:                     0x8B5F,
    SAMPLER_2D_SHADOW:              0x8B62,
    SAMPLER_2D_ARRAY:               0x8DC1,
    SAMPLER_2D_ARRAY_SHADOW:        0x8DC4,
    SAMPLER_CUBE_SHADOW:            0x8DC5,
    INT_SAMPLER_2D:                 0x8DCA,
    INT_SAMPLER_3D:                 0x8DCB,
    INT_SAMPLER_CUBE:               0x8DCC,
    INT_SAMPLER_2D_ARRAY:           0x8DCF,
    UNSIGNED_INT_SAMPLER_2D:        0x8DD2,
    UNSIGNED_INT_SAMPLER_3D:        0x8DD3,
    UNSIGNED_INT_SAMPLER_CUBE:      0x8DD4,
    UNSIGNED_INT_SAMPLER_2D_ARRAY:  0x8DD7,
};

/**
 * Checks whether the context supports WebGL2 features.
 * 
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @returns {Boolean} True if WebGL2 is supported. Otherwise, false.
 */
function isWebGL2Supported(gl)
{
    return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
}

/**
 * Gets the uniform modifier function by data type. For uniform vectors
 * of size 1, it accepts a single number value. For vectors of greater
 * size, it takes an array of numbers.
 * 
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformFunction} The uniform modifier function.
 */
export function getUniformFunction(gl, uniformType)
{
    switch(uniformType)
    {
        // WebGL1
        case gl.FLOAT: return gl.uniform1f;
        case gl.FLOAT_VEC2: return gl.uniform2fv;
        case gl.FLOAT_VEC3: return gl.uniform3fv;
        case gl.FLOAT_VEC4: return gl.uniform4fv;
        case gl.INT: return gl.uniform1i;
        case gl.INT_VEC2: return gl.uniform2iv;
        case gl.INT_VEC3: return gl.uniform3iv;
        case gl.INT_VEC4: return gl.uniform4iv;
        case gl.BOOL: return gl.uniform1i;
        case gl.BOOL_VEC2: return gl.uniform2iv;
        case gl.BOOL_VEC3: return gl.uniform3iv;
        case gl.BOOL_VEC4: return gl.uniform4iv;
        case gl.FLOAT_MAT2: return uniformMatrix2fv;
        case gl.FLOAT_MAT3: return uniformMatrix3fv;
        case gl.FLOAT_MAT4: return uniformMatrix4fv;
        // WeblGL1 Samplers
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            return gl.uniform1i;
    }

    if (isWebGL2Supported(gl))
    {
        switch(uniformType)
        {
            // WebGL2
            case gl.UNSIGNED_INT: return gl.uniform1ui;
            case gl.UNSIGNED_INT_VEC2: return gl.uniform2uiv;
            case gl.UNSIGNED_INT_VEC3: return gl.uniform3uiv;
            case gl.UNSIGNED_INT_VEC4: return gl.uniform4uiv;
            case gl.FLOAT_MAT2x3: return uniformMatrix2x3fv;
            case gl.FLOAT_MAT2x4: return uniformMatrix2x4fv;
            case gl.FLOAT_MAT3x2: return uniformMatrix3x2fv;
            case gl.FLOAT_MAT3x4: return uniformMatrix3x4fv;
            case gl.FLOAT_MAT4x2: return uniformMatrix4x2fv;
            case gl.FLOAT_MAT4x3: return uniformMatrix4x3fv;
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

    throw new Error('Cannot find uniform function for data type.');
}

/**
 * Get the per element uniform modifier function by data type.
 * 
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformElementFunction} The per element uniform modifier function.
 */
export function getUniformElementFunction(gl, uniformType)
{
    switch(uniformType)
    {
        // WebGL1
        case gl.FLOAT: return gl.uniform1f;
        case gl.FLOAT_VEC2: return gl.uniform2f;
        case gl.FLOAT_VEC3: return gl.uniform3f;
        case gl.FLOAT_VEC4: return gl.uniform4f;
        case gl.INT: return gl.uniform1i;
        case gl.INT_VEC2: return gl.uniform2i;
        case gl.INT_VEC3: return gl.uniform3i;
        case gl.INT_VEC4: return gl.uniform4i;
        case gl.BOOL: return gl.uniform1i;
        case gl.BOOL_VEC2: return gl.uniform2i;
        case gl.BOOL_VEC3: return gl.uniform3i;
        case gl.BOOL_VEC4: return gl.uniform4i;
        case gl.FLOAT_MAT2: return uniformMatrix2f;
        case gl.FLOAT_MAT3: return uniformMatrix3f;
        case gl.FLOAT_MAT4: return uniformMatrix4f;
        // WeblGL1 Samplers
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            return gl.uniform1i;
    }

    if (isWebGL2Supported(gl))
    {
        switch(uniformType)
        {
            // WebGL2
            case gl.UNSIGNED_INT: return gl.uniform1ui;
            case gl.UNSIGNED_INT_VEC2: return gl.uniform2ui;
            case gl.UNSIGNED_INT_VEC3: return gl.uniform3ui;
            case gl.UNSIGNED_INT_VEC4: return gl.uniform4ui;
            case gl.FLOAT_MAT2x3: return uniformMatrix2x3f;
            case gl.FLOAT_MAT2x4: return uniformMatrix2x4f;
            case gl.FLOAT_MAT3x2: return uniformMatrix3x2f;
            case gl.FLOAT_MAT3x4: return uniformMatrix3x4f;
            case gl.FLOAT_MAT4x2: return uniformMatrix4x2f;
            case gl.FLOAT_MAT4x3: return uniformMatrix4x3f;
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

    throw new Error('Cannot find element uniform function for data type.');
}

/**
 * Get the array uniform modifier function by data type.
 * 
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformArrayFunction} The array uniform modifier function.
 */
export function getUniformArrayFunction(gl, uniformType)
{
    switch(uniformType)
    {
        // WebGL1
        case gl.FLOAT: return gl.uniform1fv;
        case gl.FLOAT_VEC2: return gl.uniform2fv;
        case gl.FLOAT_VEC3: return gl.uniform3fv;
        case gl.FLOAT_VEC4: return gl.uniform4fv;
        case gl.INT: return gl.uniform1iv;
        case gl.INT_VEC2: return gl.uniform2iv;
        case gl.INT_VEC3: return gl.uniform3iv;
        case gl.INT_VEC4: return gl.uniform4iv;
        case gl.BOOL: return gl.uniform1iv;
        case gl.BOOL_VEC2: return gl.uniform2iv;
        case gl.BOOL_VEC3: return gl.uniform3iv;
        case gl.BOOL_VEC4: return gl.uniform4iv;
        case gl.FLOAT_MAT2: return uniformMatrix2fv;
        case gl.FLOAT_MAT3: return uniformMatrix3fv;
        case gl.FLOAT_MAT4: return uniformMatrix4fv;
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            return gl.uniform1iv;
    }

    if (isWebGL2Supported(gl))
    {
        switch(uniformType)
        {
            // WebGL2
            case gl.UNSIGNED_INT: return gl.uniform1uiv;
            case gl.UNSIGNED_INT_VEC2: return gl.uniform2uiv;
            case gl.UNSIGNED_INT_VEC3: return gl.uniform3uiv;
            case gl.UNSIGNED_INT_VEC4: return gl.uniform4uiv;
            case gl.FLOAT_MAT2x3: return uniformMatrix2x3fv;
            case gl.FLOAT_MAT2x4: return uniformMatrix2x4fv;
            case gl.FLOAT_MAT3x2: return uniformMatrix3x2fv;
            case gl.FLOAT_MAT3x4: return uniformMatrix3x4fv;
            case gl.FLOAT_MAT4x2: return uniformMatrix4x2fv;
            case gl.FLOAT_MAT4x3: return uniformMatrix4x3fv;
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

    throw new Error('Cannot find array uniform function for data type.');
}

function uniformMatrix2fv(location, value)
{
    this.uniformMatrix2fv(location, false, value);
}

function uniformMatrix2f(location, m00, m01, m10, m11)
{
    this.uniformMatrix2fv(location, false, [
        m00, m01,
        m10, m11
    ]);
}

function uniformMatrix3fv(location, value)
{
    this.uniformMatrix3fv(location, false, value);
}

function uniformMatrix3f(location, m00, m01, m02, m10, m11, m12, m20, m21, m22)
{
    this.uniformMatrix3fv(location, false, [
        m00, m01, m02,
        m10, m11, m12,
        m20, m21, m22
    ]);
}

function uniformMatrix4fv(location, value)
{
    this.uniformMatrix4fv(location, false, value);
}

function uniformMatrix4f(location, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)
{
    this.uniformMatrix4fv(location, false, [
        m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23,
        m30, m31, m32, m33
    ]);
}

function uniformMatrix2x3fv(location, value)
{
    this.uniformMatrix2x3fv(location, false, value);
}

function uniformMatrix2x3f(location, m00, m01, m02, m10, m11, m12)
{
    this.uniformMatrix2x3fv(location, false, [
        m00, m01, m02,
        m10, m11, m12
    ]);
}

function uniformMatrix2x4fv(location, value)
{
    this.uniformMatrix2x4fv(location, false, value);
}

function uniformMatrix2x4f(location, m00, m01, m02, m03, m10, m11, m12, m13)
{
    this.uniformMatrix2x4fv(location, false, [
        m00, m01, m02, m03,
        m10, m11, m12, m13
    ]);
}

function uniformMatrix3x2fv(location, value)
{
    this.uniformMatrix3x2fv(location, false, value);
}

function uniformMatrix3x2f(location, m00, m01, m10, m11, m20, m21)
{
    this.uniformMatrix3x2fv(location, false, [
        m00, m01,
        m10, m11,
        m20, m21
    ]);
}

function uniformMatrix3x4fv(location, value)
{
    this.uniformMatrix3x4fv(location, false, value);
}

function uniformMatrix3x4f(location, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23)
{
    this.uniformMatrix3x4fv(location, false, [
        m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23
    ]);
}

function uniformMatrix4x2fv(location, value)
{
    this.uniformMatrix4x2fv(location, false, value);
}

function uniformMatrix4x2f(location, m00, m01, m10, m11, m20, m21, m30, m31)
{
    this.uniformMatrix4x2fv(location, false, [
        m00, m01,
        m10, m11,
        m20, m21,
        m30, m31
    ]);
}

function uniformMatrix4x3fv(location, value)
{
    this.uniformMatrix4x3fv(location, false, value);
}

function uniformMatrix4x3f(location, m00, m01, m02, m10, m11, m12, m20, m21, m22, m30, m31, m32)
{
    this.uniformMatrix4x3fv(location, false, [
        m00, m01, m02,
        m10, m11, m12,
        m20, m21, m22,
        m30, m31, m32
    ]);
}
