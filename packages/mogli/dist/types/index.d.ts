/**
 * Checks whether the context supports WebGL2 features.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @returns {boolean} Whether WebGL2 is supported.
 */
declare function isWebGL2Supported(gl: WebGLRenderingContextBase): boolean;

declare const GLHelper_isWebGL2Supported: typeof isWebGL2Supported;
declare namespace GLHelper {
  export {
    GLHelper_isWebGL2Supported as isWebGL2Supported,
  };
}

declare class BufferDataContext {
    /**
     * @param {WebGLRenderingContextBase} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     */
    constructor(gl: WebGLRenderingContextBase, target: GLenum);
    gl: WebGLRenderingContextBase;
    target: number;
    /**
     * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
     * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
     * @returns {BufferDataContext}
     */
    data(srcDataOrSize: BufferSource | number, usage?: GLenum): BufferDataContext;
    /**
     * @param {BufferSource} srcData The buffer data source.
     * @param {number} [dstOffset] The destination byte offset to put the data.
     * @param {number} [srcOffset] The source array index offset to copy the data from.
     * @param {number} [srcLength] The source array count to copy the data until.
     * @returns {BufferDataContext}
     */
    subData(srcData: BufferSource, dstOffset?: number, srcOffset?: number, srcLength?: number): BufferDataContext;
}
declare class BufferBuilder {
    /**
     * @param {WebGLRenderingContextBase} gl The webgl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
     * new buffer will be created.
     */
    constructor(gl: WebGLRenderingContextBase, target: GLenum, buffer?: WebGLBuffer);
    /** @private */
    private dataContext;
    handle: WebGLBuffer;
    get gl(): WebGLRenderingContextBase;
    get target(): number;
    /**
     * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
     * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
     * @returns {BufferBuilder}
     */
    data(srcDataOrSize: BufferSource | number, usage?: GLenum): BufferBuilder;
    /**
     * @param {BufferSource} srcData The buffer data source.
     * @param {number} [dstOffset] The destination byte offset to put the data.
     * @param {number} [srcOffset] The source array index offset to copy the data from.
     * @param {number} [srcLength] The source array count to copy the data until.
     * @returns {BufferBuilder}
     */
    subData(srcData: BufferSource, dstOffset?: number, srcOffset?: number, srcLength?: number): BufferBuilder;
    /** @returns {WebGLBuffer} */
    build(): WebGLBuffer;
}

declare class BufferInfo {
    /**
     * @param {WebGLRenderingContextBase} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {GLenum} bufferType The buffer data type. Usually, this is
     * `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
     * array buffers. It must be either `gl.BYTE`, `gl.UNSIGNED_BYTE`,
     * `gl.SHORT`, `gl.UNSIGNED_SHORT`, `gl.FLOAT`, or `gl.HALF_FLOAT`
     * for WebGL2.
     * @param {WebGLBuffer} buffer The buffer handle.
     */
    constructor(gl: WebGLRenderingContextBase, target: GLenum, bufferType: GLenum, buffer: WebGLBuffer);
    gl: WebGLRenderingContextBase;
    target: number;
    handle: WebGLBuffer;
    type: number;
    /** @private */
    private bindContext;
    bind(gl: any): BufferDataContext;
}

declare class BufferInfoBuilder {
    /**
     * @param {WebGLRenderingContextBase} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
     * new buffer will be created.
     */
    constructor(gl: WebGLRenderingContextBase, target: GLenum, buffer?: WebGLBuffer);
    /** @private */
    private bufferBuilder;
    /** @private */
    private bufferType;
    get gl(): WebGLRenderingContextBase;
    get handle(): WebGLBuffer;
    get target(): number;
    /**
     * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
     * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
     * @returns {BufferInfoBuilder}
     */
    data(srcDataOrSize: BufferSource | number, usage?: GLenum): BufferInfoBuilder;
    /**
     * @param {BufferSource} srcData The buffer data source.
     * @param {number} [dstOffset] The destination byte offset to put the data.
     * @param {number} [srcOffset] The source array index offset to copy the data from.
     * @param {number} [srcLength] The source array count to copy the data until.
     * @returns {BufferInfoBuilder}
     */
    subData(srcData: BufferSource, dstOffset?: number, srcOffset?: number, srcLength?: number): BufferInfoBuilder;
    /**
     * @returns {BufferInfo}
     */
    build(): BufferInfo;
}

/**
 * Creates a buffer source given the type and data.
 *
 * @param {WebGLRenderingContextBase} gl The gl context.
 * @param {GLenum} type The data type of the elements in the buffer. Usually,
 * this is `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
 * array buffers. It must be either `gl.BYTE`, `gl.UNSIGNED_BYTE`, `gl.SHORT`,
 * `gl.UNSIGNED_SHORT`, `gl.FLOAT`, or `gl.HALF_FLOAT` for WebGL2.
 * @param {Array} data The buffer data array.
 * @returns {BufferSource} The typed array buffer containing the given data.
 */
declare function createBufferSource(gl: WebGLRenderingContextBase, type: GLenum, data: any[]): BufferSource;
/**
 * Create a buffer with the given source.
 *
 * @param {WebGLRenderingContextBase} gl The gl context.
 * @param {GLenum} target The buffer bind target. Usually, this is `gl.ARRAY_BUFFER` or
 * `gl.ELEMENT_ARRAY_BUFFER`.
 * @param {BufferSource} bufferSource The typed array buffer containing the given data.
 * For convenience, you can use `BufferHelper.createBufferSource()` to convert a data array
 * to the appropriate typed array.
 * @param {GLenum} [usage] The buffer usage hint. By default, this is `gl.STATIC_DRAW`.
 * @returns {WebGLBuffer} The created and bound data buffer.
 */
declare function createBuffer(gl: WebGLRenderingContextBase, target: GLenum, bufferSource: BufferSource, usage?: GLenum): WebGLBuffer;
/**
 * Create a buffer with the given number array.
 *
 * @param {WebGLRenderingContextBase} gl The gl context.
 * @param {GLenum} target The buffer bind target. Usually, this is `gl.ARRAY_BUFFER`
 * or `gl.ELEMENT_ARRAY_BUFFER`.
 * @param {GLenum} type The data type of the elements in the buffer. Usually,
 * this is `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
 * array buffers. It must be either `gl.BYTE`, `gl.UNSIGNED_BYTE`, `gl.SHORT`,
 * `gl.UNSIGNED_SHORT`, `gl.FLOAT`, or `gl.HALF_FLOAT` for WebGL2.
 * @param {Array<number>} data The buffer data array.
 * @param {GLenum} [usage] The buffer usage hint. By default, this is `gl.STATIC_DRAW`.
 */
declare function createBufferFromArray(gl: WebGLRenderingContextBase, target: GLenum, type: GLenum, data: Array<number>, usage?: GLenum): WebGLBuffer;
declare function getBufferTypedArray(gl: any, bufferType: any): Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor;
declare function getTypedArrayBufferType(gl: any, typedArray: any): any;
declare function getBufferUsage(gl: any, target: any, buffer: any): any;

declare const BufferHelper_createBufferSource: typeof createBufferSource;
declare const BufferHelper_createBuffer: typeof createBuffer;
declare const BufferHelper_createBufferFromArray: typeof createBufferFromArray;
declare const BufferHelper_getBufferTypedArray: typeof getBufferTypedArray;
declare const BufferHelper_getTypedArrayBufferType: typeof getTypedArrayBufferType;
declare const BufferHelper_getBufferUsage: typeof getBufferUsage;
declare namespace BufferHelper {
  export {
    BufferHelper_createBufferSource as createBufferSource,
    BufferHelper_createBuffer as createBuffer,
    BufferHelper_createBufferFromArray as createBufferFromArray,
    BufferHelper_getBufferTypedArray as getBufferTypedArray,
    BufferHelper_getTypedArrayBufferType as getTypedArrayBufferType,
    BufferHelper_getBufferUsage as getBufferUsage,
  };
}

declare namespace BufferEnums {
    const BYTE: number;
    const UNSIGNED_BYTE: number;
    const SHORT: number;
    const UNSIGNED_SHORT: number;
    const INT: number;
    const UNSIGNED_INT: number;
    const FLOAT: number;
    const HALF_FLOAT: number;
}

declare class ProgramBuilder {
    /**
     * @param {WebGLRenderingContextBase} gl
     * @param {WebGLProgram} [program]
     */
    constructor(gl: WebGLRenderingContextBase, program?: WebGLProgram);
    handle: WebGLProgram;
    shaders: any[];
    /** @type {WebGLRenderingContextBase} */
    gl: WebGLRenderingContextBase;
    /**
     * @param {GLenum} shaderType
     * @param {string} shaderSource
     * @returns {ProgramBuilder}
     */
    shader(shaderType: GLenum, shaderSource: string): ProgramBuilder;
    /**
     * @returns {WebGLProgram}
     */
    link(): WebGLProgram;
}

/**
 * Get list of parameter infos for all active uniforms in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The program to get the active uniforms from.
 * @returns {Array<WebGLActiveInfo>} An array of active uniforms.
 */
declare function getActiveUniforms(gl: WebGLRenderingContextBase, program: WebGLProgram): Array<WebGLActiveInfo>;
/**
 * Get list of parameter infos for all active attributes in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The program to get the active attributes from.
 * @returns {Array<WebGLActiveInfo>} An array of active attributes.
 */
declare function getActiveAttribs(gl: WebGLRenderingContextBase, program: WebGLProgram): Array<WebGLActiveInfo>;

/**
 * @typedef ProgramInfo
 * @property {WebGLProgram} handle
 * @property {boolean} linkStatus
 * @property {boolean} deleteStatus
 * @property {boolean} validateStatus
 * @property {Record<string, ActiveUniformInfo>} activeUniforms
 * @property {Record<string, ActiveAttributeInfo>} activeAttributes
 */
/**
 * Create and compile shader from source text.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {GLenum} type The type of the shader. This is usually `gl.VERTEX_SHADER`
 * or `gl.FRAGMENT_SHADER`.
 * @param {string} shaderSource The shader source text.
 * @returns {WebGLShader} The compiled shader.
 */
declare function createShader(gl: WebGLRenderingContextBase, shaderType: any, shaderSource: string): WebGLShader;
/**
 * Link the given shader program from list of compiled shaders.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The type of the shader.
 * This is usually `gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`.
 * @param {Array<WebGLShader>} shaders The list of compiled shaders
 * to link in the program.
 * @returns {WebGLProgram} The linked shader program.
 */
declare function createShaderProgram(gl: WebGLRenderingContextBase, program: WebGLProgram, shaders: Array<WebGLShader>): WebGLProgram;
/**
 * Get additional info about the target program. The program does not need to be currently bound.
 *
 * @param {WebGLRenderingContextBase} gl
 * @param {WebGLProgram} program
 * @returns {ProgramInfo}
 */
declare function getProgramInfo(gl: WebGLRenderingContextBase, program: WebGLProgram): ProgramInfo;

type ProgramInfo = {
    handle: WebGLProgram;
    linkStatus: boolean;
    deleteStatus: boolean;
    validateStatus: boolean;
    activeUniforms: Record<string, any>;
    activeAttributes: Record<string, any>;
};

declare const ProgramHelper_createShader: typeof createShader;
declare const ProgramHelper_createShaderProgram: typeof createShaderProgram;
declare const ProgramHelper_getProgramInfo: typeof getProgramInfo;
type ProgramHelper_ProgramInfo = ProgramInfo;
declare const ProgramHelper_getActiveUniforms: typeof getActiveUniforms;
declare const ProgramHelper_getActiveAttribs: typeof getActiveAttribs;
declare namespace ProgramHelper {
  export {
    ProgramHelper_createShader as createShader,
    ProgramHelper_createShaderProgram as createShaderProgram,
    ProgramHelper_getProgramInfo as getProgramInfo,
    ProgramHelper_ProgramInfo as ProgramInfo,
    ProgramHelper_getActiveUniforms as getActiveUniforms,
    ProgramHelper_getActiveAttribs as getActiveAttribs,
  };
}

declare namespace ProgramUniformEnums {
    const FLOAT: number;
    const FLOAT_VEC2: number;
    const FLOAT_VEC3: number;
    const FLOAT_VEC4: number;
    const INT: number;
    const INT_VEC2: number;
    const INT_VEC3: number;
    const INT_VEC4: number;
    const BOOL: number;
    const BOOL_VEC2: number;
    const BOOL_VEC3: number;
    const BOOL_VEC4: number;
    const FLOAT_MAT2: number;
    const FLOAT_MAT3: number;
    const FLOAT_MAT4: number;
    const SAMPLER_2D: number;
    const SAMPLER_CUBE: number;
    const UNSIGNED_INT: number;
    const UNSIGNED_INT_VEC2: number;
    const UNSIGNED_INT_VEC3: number;
    const UNSIGNED_INT_VEC4: number;
    const FLOAT_MAT2x3: number;
    const FLOAT_MAT2x4: number;
    const FLOAT_MAT3x2: number;
    const FLOAT_MAT3x4: number;
    const FLOAT_MAT4x2: number;
    const FLOAT_MAT4x3: number;
    const SAMPLER_3D: number;
    const SAMPLER_2D_SHADOW: number;
    const SAMPLER_2D_ARRAY: number;
    const SAMPLER_2D_ARRAY_SHADOW: number;
    const SAMPLER_CUBE_SHADOW: number;
    const INT_SAMPLER_2D: number;
    const INT_SAMPLER_3D: number;
    const INT_SAMPLER_CUBE: number;
    const INT_SAMPLER_2D_ARRAY: number;
    const UNSIGNED_INT_SAMPLER_2D: number;
    const UNSIGNED_INT_SAMPLER_3D: number;
    const UNSIGNED_INT_SAMPLER_CUBE: number;
    const UNSIGNED_INT_SAMPLER_2D_ARRAY: number;
}

declare namespace ProgramAttributeEnums {
    const BYTE: number;
    const UNSIGNED_BYTE: number;
    const SHORT: number;
    const UNSIGNED_SHORT: number;
    const FLOAT: number;
    const HALF_FLOAT: number;
}

/**
 * @callback UniformArrayFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {Float32List|Int32List} value The vector array.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @callback UniformComponentFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {...Number} values The components of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @typedef {UniformArrayFunction|UniformComponentFunction} UniformFunction
 */
/**
 * Gets the uniform modifier function by uniform type. For uniform vectors
 * of size 1, it accepts a single number value. For vectors of greater
 * size, it takes an array of numbers.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformFunction} The uniform modifier function.
 */
declare function getUniformFunction(gl: WebGLRenderingContext | WebGL2RenderingContext, uniformType: GLenum): UniformFunction;
/**
 * Get the per component uniform modifier function by uniform type.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformComponentFunction} The per component uniform modifier function.
 */
declare function getUniformFunctionForComponent(gl: WebGLRenderingContext | WebGL2RenderingContext, uniformType: GLenum): UniformComponentFunction;
/**
 * Get the array uniform modifier function by uniform type.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformArrayFunction} The array uniform modifier function.
 */
declare function getUniformFunctionForArray(gl: WebGLRenderingContext | WebGL2RenderingContext, uniformType: GLenum): UniformArrayFunction;
type UniformArrayFunction = (location: WebGLUniformLocation, value: Float32List | Int32List) => any;
type UniformComponentFunction = (location: WebGLUniformLocation, ...values: number[]) => any;
type UniformFunction = UniformArrayFunction | UniformComponentFunction;

declare const ProgramUniformFunctions_getUniformFunction: typeof getUniformFunction;
declare const ProgramUniformFunctions_getUniformFunctionForComponent: typeof getUniformFunctionForComponent;
declare const ProgramUniformFunctions_getUniformFunctionForArray: typeof getUniformFunctionForArray;
type ProgramUniformFunctions_UniformArrayFunction = UniformArrayFunction;
type ProgramUniformFunctions_UniformComponentFunction = UniformComponentFunction;
type ProgramUniformFunctions_UniformFunction = UniformFunction;
declare namespace ProgramUniformFunctions {
  export {
    ProgramUniformFunctions_getUniformFunction as getUniformFunction,
    ProgramUniformFunctions_getUniformFunctionForComponent as getUniformFunctionForComponent,
    ProgramUniformFunctions_getUniformFunctionForArray as getUniformFunctionForArray,
    ProgramUniformFunctions_UniformArrayFunction as UniformArrayFunction,
    ProgramUniformFunctions_UniformComponentFunction as UniformComponentFunction,
    ProgramUniformFunctions_UniformFunction as UniformFunction,
  };
}

export { BufferBuilder, BufferDataContext, BufferEnums, BufferHelper, BufferInfo, BufferInfoBuilder, GLHelper, ProgramAttributeEnums, ProgramBuilder, ProgramHelper, ProgramUniformEnums, ProgramUniformFunctions };
