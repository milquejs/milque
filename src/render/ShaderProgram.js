export class ShaderProgramInfo
{
    constructor(gl, vertexShaderSource, fragmentShaderSource, sharedAttributes = [])
    {
        const vertexShaderHandle = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShaderHandle = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const programHandle = createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributes);

        // Don't forget to clean up the shaders! It's no longer needed...
        gl.detachShader(programHandle, vertexShaderHandle);
        gl.detachShader(programHandle, fragmentShaderHandle);
        gl.deleteShader(vertexShaderHandle);
        gl.deleteShader(fragmentShaderHandle);

        // But do keep around the program :P
        this.handle = programHandle;
        this._gl = gl;
        this._uniforms = createShaderProgramUniformSetters(gl, programHandle);
        this._attributes = createShaderProgramAttributeSetters(gl, programHandle);
    }

    uniform(name, value)
    {
        // If the uniform exists, since it may have been optimized away by the compiler :(
        if (name in this._uniforms)
        {
            this._uniforms[name](this._gl, value);
        }
        return this;
    }

    attribute(name, bufferInfo)
    {
        // If the attribute exists, since it may have been optimized away by the compiler :(
        if (name in this._attributes)
        {
            this._attributes[name](this._gl, bufferInfo);
        }
        return this;
    }

    elementBuffer(bufferInfo)
    {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo);
        return this;
    }
}

export function createShader(gl, type, source)
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

export function createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributes = [])
{
    const programHandle = gl.createProgram();
    gl.attachShader(programHandle, vertexShaderHandle);
    gl.attachShader(programHandle, fragmentShaderHandle);

    // Bind the attribute locations, (either this or use 'layout(location = ?)' in the shader)
    // NOTE: Unfortunately, this must happen before program linking to take effect.
    for(let i = 0; i < sharedAttributes.length; ++i)
    {
        gl.bindAttribLocation(programHandle, i, sharedAttributes[i]);
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

export function createShaderProgramAttributeSetters(gl, programHandle)
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

export function createShaderProgramAttributeSetter(attributeIndex)
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

export function createShaderProgramUniformSetters(gl, programHandle)
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

export function createShaderProgramUniformSetter(gl, programHandle, uniformInfo, ctx)
{
    const name = uniformInfo.name;
    const location = gl.getUniformLocation(programHandle, name);
    const type = uniformInfo.type;
    const array = (uniformInfo.size > 1 && name.substring(name.length - 3) === '[0]')

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
export function getUniformTypeInfo(gl, type)
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
