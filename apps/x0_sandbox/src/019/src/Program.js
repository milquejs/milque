import { isUniformSamplerType, getUniformFunction, getUniformSamplerFunction } from './GLTypeInfo.js';

export function createProgram(gl)
{
    return new ProgramBuilder(gl);
}

export class ProgramBuilder
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

    link(gl)
    {
        createShaderProgram(gl, this.handle, this.shaders);
        this.shaders.length = 0;
        return this.handle;
    }
}

/**
 * Get object mapping of all active uniforms to their info.
 * @param {WebGLRenderingContext} gl The current webgl context.
 * @param {WebGLProgram} program The program to get active uniforms from.
 * @returns {Object} An object mapping of uniform names to info.
 */
export function findActiveUniforms(gl, program)
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
 * Get object mapping of all active attributes to their info.
 * @param {WebGLRenderingContext} gl The current webgl context.
 * @param {WebGLProgram} program The program to get active attributes from.
 * @returns {Object} An object mapping of attribute names to info.
 */
export function findActiveAttributes(gl, program)
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

export function createShader(gl, type, shaderSource)
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

export function createShaderProgram(gl, program, shaders)
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
export function getActiveAttributeInfos(gl, program)
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
export function getActiveUniformInfos(gl, program)
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
