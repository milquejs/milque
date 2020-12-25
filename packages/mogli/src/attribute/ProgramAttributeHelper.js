export function getAttribVertexSize(gl, attribType)
{
    // https://www.khronos.org/registry/OpenGL-Refpages/es2.0/xhtml/glGetActiveAttrib.xml
    switch(attribType)
    {
        case gl.FLOAT: return 1;
        case gl.FLOAT_VEC2: return 2;
        case gl.FLOAT_VEC3: return 3;
        case gl.FLOAT_VEC4: return 4;
        case gl.FLOAT_MAT2: return 4;
        case gl.FLOAT_MAT3: return 9;
        case gl.FLOAT_MAT4: return 16;
        default: throw new Error('Invalid vertex attribute type.');
    }
}
