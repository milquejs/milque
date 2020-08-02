import { isUniformSamplerType, getUniformFunction, getUniformSamplerFunction } from './GLTypeInfo.js';

export function Program(gl)
{
    let program = gl.createProgram();
    let shaders = [];
    
    return {
        shader(type, shaderSource)
        {
            let shader = createShader(gl, type, shaderSource);
            shaders.push(shader);
            return this;
        },
        link()
        {
            createShaderProgram(gl, program, shaders);
            shaders.length = 0;
            return program;
        }
    };
}

export function ProgramAttributes(gl, program)
{
    let attributes = {};
    let activeAttributeInfos = getActiveAttributeInfos(gl, program);
    for(let attributeInfo of activeAttributeInfos)
    {
        let attributeName = attributeInfo.name;
        attributes[attributeName] = createAttribute(gl, program, attributeName);
    }
    return attributes;
}

export function ProgramUniforms(gl, program)
{
    let uniforms = {};
    let activeUniformInfos = getActiveUniformInfos(gl, program);
    for(let uniformInfo of activeUniformInfos)
    {
        let uniformName = uniformInfo.name;
        let uniformType = uniformInfo.type;
        if (isUniformSamplerType(gl, uniformType))
        {
            let textureUnit = 0;
            let location = gl.getUniformLocation(program, uniformName);
            let uniformSamplerFunction = getUniformSamplerFunction(gl, uniformType, textureUnit);
            Object.defineProperty(uniforms, uniformName, {
                set(value) {
                    uniformSamplerFunction.call(gl, location, value);
                }
            });
            throw new Error('Samplers are not yet supported.');
        }
        else
        {
            let location = gl.getUniformLocation(program, uniformName);
            let uniformFunction = getUniformFunction(gl, uniformType);
            Object.defineProperty(uniforms, uniformName, {
                set(value) {
                    uniformFunction.call(gl, location, value);
                }
            });
        }
    }
    return uniforms;
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

    console.error(gl.getShaderInfoLog(shader));
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

function createAttribute(gl, program, attributeName)
{
    let location = gl.getAttribLocation(program, attributeName);
    return {
        location,
        useBuffer(target, type, buffer, size, normalize = false, stride = 0, offset = 0)
        {
            if (buffer)
            {
                switch(target)
                {
                    case gl.ARRAY_BUFFER:
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                        gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
                        gl.enableVertexAttribArray(location);
                        break;
                    case gl.ELEMENT_ARRAY_BUFFER:
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                        break;
                    default:
                        throw new Error(`GLTarget ${target} not supported.`);
                }
            }
            else
            {
                gl.disableVertexAttribArray(attribute.location);
            }
        }
    };
}

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
