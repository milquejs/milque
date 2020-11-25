/**
 * @param {WebGL2RenderingContext} gl
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

/**
 * @param {WebGL2RenderingContext} gl
 * @param {GLenum} uniformType 
 */
export function getUniformTypeInfo(gl, uniformType)
{
    switch(uniformType)
    {
        // WebGL1
        case gl.FLOAT:
        case gl.FLOAT_VEC2:
        case gl.FLOAT_VEC3:
        case gl.FLOAT_VEC4:
        case gl.INT:
        case gl.INT_VEC2:
        case gl.INT_VEC3:
        case gl.INT_VEC4:
        case gl.BOOL:
        case gl.BOOL_VEC2:
        case gl.BOOL_VEC3:
        case gl.BOOL_VEC4:
        case gl.FLOAT_MAT2:
        case gl.FLOAT_MAT3:
        case gl.FLOAT_MAT4:
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            break;
        // WebGL2
        case gl.UNSIGNED_INT:
        case gl.UNSIGNED_INT_VEC2:
        case gl.UNSIGNED_INT_VEC3:
        case gl.UNSIGNED_INT_VEC4:
        case gl.FLOAT_MAT2x3:
        case gl.FLOAT_MAT2x4:
        case gl.FLOAT_MAT3x2:
        case gl.FLOAT_MAT3x4:
        case gl.FLOAT_MAT4x2:
        case gl.FLOAT_MAT4x3:
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
            break;
    }
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {GLenum} uniformType 
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
        case gl.FLOAT_MAT2: return uniformMatrix2fv.bind(gl);
        case gl.FLOAT_MAT3: return uniformMatrix3fv.bind(gl);
        case gl.FLOAT_MAT4: return uniformMatrix4fv.bind(gl);
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            return gl.uniform1iv;
        // WebGL2
        case gl.UNSIGNED_INT: return gl.uniform1uiv;
        case gl.UNSIGNED_INT_VEC2: return gl.uniform2uiv;
        case gl.UNSIGNED_INT_VEC3: return gl.uniform3uiv;
        case gl.UNSIGNED_INT_VEC4: return gl.uniform4uiv;
        case gl.FLOAT_MAT2x3: return uniformMatrix2x3fv.bind(gl);
        case gl.FLOAT_MAT2x4: return uniformMatrix2x4fv.bind(gl);
        case gl.FLOAT_MAT3x2: return uniformMatrix3x2fv.bind(gl);
        case gl.FLOAT_MAT3x4: return uniformMatrix3x4fv.bind(gl);
        case gl.FLOAT_MAT4x2: return uniformMatrix4x2fv.bind(gl);
        case gl.FLOAT_MAT4x3: return uniformMatrix4x3fv.bind(gl);
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

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {GLenum} uniformType 
 */
export function getUniformFunction(gl, uniformType)
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
        case gl.FLOAT_MAT2: return uniformMatrix2f.bind(gl);
        case gl.FLOAT_MAT3: return uniformMatrix3f.bind(gl);
        case gl.FLOAT_MAT4: return uniformMatrix4f.bind(gl);
        // WeblGL1 Samplers
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            return gl.uniform1i;
        // WebGL2
        case gl.UNSIGNED_INT: return gl.uniform1ui;
        case gl.UNSIGNED_INT_VEC2: return gl.uniform2ui;
        case gl.UNSIGNED_INT_VEC3: return gl.uniform3ui;
        case gl.UNSIGNED_INT_VEC4: return gl.uniform4ui;
        case gl.FLOAT_MAT2x3: return uniformMatrix2x3f.bind(gl);
        case gl.FLOAT_MAT2x4: return uniformMatrix2x4f.bind(gl);
        case gl.FLOAT_MAT3x2: return uniformMatrix3x2f.bind(gl);
        case gl.FLOAT_MAT3x4: return uniformMatrix3x4f.bind(gl);
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
