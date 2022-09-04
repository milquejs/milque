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
     * @param {WebGLRenderingContext} gl The webgl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
     * new buffer will be created.
     */
    constructor(gl: WebGLRenderingContext, target: GLenum, buffer?: WebGLBuffer);
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

declare class BufferInfo$2 {
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
     * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
     * new buffer will be created.
     */
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, target: GLenum, buffer?: WebGLBuffer);
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
    build(): BufferInfo$2;
}

type AttributeFunction$1 = (index: number, buffer: WebGLBuffer, vertexSize: number, bufferType: GLenum, normalize: boolean, stride: number, offset: number, divisor: number) => any;

type AttributeFunction = AttributeFunction$1;
type ActiveAttributeInfo = {
    type: GLenum;
    size: number;
    location: number;
    applier: AttributeFunction;
    value: number | Float32List | Int32List | Uint32List;
};

/**
 * @callback UniformArrayFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {Float32List|Int32List|Uint32List} value The vector array.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @callback UniformComponentFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {...number} values The components of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @typedef {UniformArrayFunction|UniformComponentFunction} UniformFunction
 */
/**
 * Gets the uniform modifier function by uniform type. For uniform vectors
 * of size 1, it accepts a single number value. For vectors of greater
 * size, it takes an array of numbers.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformFunction} The uniform modifier function.
 */
declare function getUniformFunction(gl: WebGLRenderingContextBase, uniformType: GLenum): UniformFunction$1;
/**
 * Get the per component uniform modifier function by uniform type.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformComponentFunction} The per component uniform modifier function.
 */
declare function getUniformComponentFunction(gl: WebGLRenderingContext | WebGL2RenderingContext, uniformType: GLenum): UniformComponentFunction;
/**
 * Get the array uniform modifier function by uniform type.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformArrayFunction} The array uniform modifier function.
 */
declare function getUniformArrayFunction(gl: WebGLRenderingContext | WebGL2RenderingContext, uniformType: GLenum): UniformArrayFunction;
type UniformArrayFunction = (location: WebGLUniformLocation, value: Float32List | Int32List | Uint32List) => any;
type UniformComponentFunction = (location: WebGLUniformLocation, ...values: number[]) => any;
type UniformFunction$1 = UniformArrayFunction | UniformComponentFunction;

declare const ProgramUniformFunctions_getUniformFunction: typeof getUniformFunction;
declare const ProgramUniformFunctions_getUniformComponentFunction: typeof getUniformComponentFunction;
declare const ProgramUniformFunctions_getUniformArrayFunction: typeof getUniformArrayFunction;
type ProgramUniformFunctions_UniformArrayFunction = UniformArrayFunction;
type ProgramUniformFunctions_UniformComponentFunction = UniformComponentFunction;
declare namespace ProgramUniformFunctions {
  export {
    ProgramUniformFunctions_getUniformFunction as getUniformFunction,
    ProgramUniformFunctions_getUniformComponentFunction as getUniformComponentFunction,
    ProgramUniformFunctions_getUniformArrayFunction as getUniformArrayFunction,
    ProgramUniformFunctions_UniformArrayFunction as UniformArrayFunction,
    ProgramUniformFunctions_UniformComponentFunction as UniformComponentFunction,
    UniformFunction$1 as UniformFunction,
  };
}

type UniformFunction = UniformFunction$1;
type ActiveUniformInfo = {
    type: number;
    size: number;
    location: WebGLUniformLocation;
    applier: UniformFunction;
    value: number | Float32List | Int32List | Uint32List;
};

/**
 * @typedef {import('../buffer/BufferInfoHelper.js').BufferInfo} BufferInfo
 * @typedef {import('../buffer/BufferInfoHelper.js').VertexArrayObjectInfo} VertexArrayObjectInfo
 */
/**
 * @typedef ProgramInfo
 * @property {WebGLProgram} handle
 * @property {Record<string, import('./ProgramUniformInfo.js').ActiveUniformInfo>} uniforms
 * @property {Record<string, import('./ProgramAttributeInfo.js').ActiveAttributeInfo>} attributes
 */
/**
 * Assumes all shaders already compiled and linked successfully.
 *
 * @param {WebGLRenderingContextBase} gl
 * @param {WebGLProgram} program
 * @returns {ProgramInfo}
 */
declare function createProgramInfo(gl: WebGLRenderingContextBase, program: WebGLProgram): ProgramInfo$1;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {WebGLProgram} program
 * @param {Array<string>} shaderSources
 * @param {Array<GLenum>} [shaderTypes]
 * @returns {Promise<WebGLProgram>}
 */
declare function linkProgramShaders(gl: WebGLRenderingContextBase, program: WebGLProgram, shaderSources: Array<string>, shaderTypes?: Array<GLenum>): Promise<WebGLProgram>;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {ReturnType<createProgramInfo>} programInfo
 * @param {BufferInfo|VertexArrayObjectInfo} bufferOrVertexArrayObjectInfo
 */
declare function bindProgramAttributes(gl: WebGLRenderingContextBase, programInfo: ReturnType<typeof createProgramInfo>, bufferOrVertexArrayObjectInfo: BufferInfo$1 | VertexArrayObjectInfo$1): void;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {ReturnType<createProgramInfo>} programInfo
 * @param {Record<string, number|Float32List|Int32List|Uint32List>} uniforms
 */
declare function bindProgramUniforms(gl: WebGLRenderingContextBase, programInfo: ReturnType<typeof createProgramInfo>, uniforms: Record<string, number | Float32List | Int32List | Uint32List>): void;
type BufferInfo$1 = BufferInfo;
type VertexArrayObjectInfo$1 = VertexArrayObjectInfo;
type ProgramInfo$1 = {
    handle: WebGLProgram;
    uniforms: Record<string, ActiveUniformInfo>;
    attributes: Record<string, ActiveAttributeInfo>;
};

/**
 * @typedef {WebGLBuffer|BufferSource|Array<number>} AttribBufferLike
 *
 * @typedef ArrayAttribOption
 * @property {AttribBufferLike} buffer
 * @property {string} [name]
 * @property {number} [size]
 * @property {GLenum} [type]
 * @property {boolean} [normalize]
 * @property {number} [stride]
 * @property {number} [offset]
 * @property {number} [divisor]
 * @property {GLenum} [usage]
 * @property {number} [length]
 *
 * @typedef ElementAttribOption
 * @property {AttribBufferLike} buffer
 * @property {GLenum} [type]
 * @property {GLenum} [usage]
 * @property {number} [length]
 *
 * @typedef {ReturnType<createArrayAttrib>} ArrayAttrib
 * @typedef {ReturnType<createElementAttrib>} ElementAttrib
 *
 * @typedef BufferInfo
 * @property {Record<string, ArrayAttrib>} attributes
 * @property {number} vertexCount
 * @property {ElementAttrib} element
 *
 * @typedef VertexArrayObjectInfo
 * @property {WebGLVertexArrayObject} handle
 * @property {number} vertexCount
 * @property {ElementAttrib} element
 */
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {Record<string, ArrayAttribOption>} arrays
 * @param {ElementAttribOption} [elementArray]
 * @returns {BufferInfo}
 */
declare function createBufferInfo(gl: WebGLRenderingContextBase, arrays: Record<string, ArrayAttribOption>, elementArray?: ElementAttribOption): BufferInfo;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {BufferInfo} bufferInfo
 * @param {Array<import('../program/ProgramInfoHelper.js').ProgramInfo>} programInfos
 * @returns {VertexArrayObjectInfo}
 */
declare function createVertexArrayInfo(gl: WebGLRenderingContextBase, bufferInfo: BufferInfo, programInfos: Array<ProgramInfo$1>): VertexArrayObjectInfo;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {BufferInfo|VertexArrayObjectInfo} bufferOrVertexArrayObjectInfo
 */
declare function drawBufferInfo(gl: WebGLRenderingContextBase, bufferOrVertexArrayObjectInfo: BufferInfo | VertexArrayObjectInfo, mode?: number, offset?: number, vertexCount?: number, instanceCount?: any): void;
type AttribBufferLike = WebGLBuffer | BufferSource | Array<number>;
type ArrayAttribOption = {
    buffer: AttribBufferLike;
    name?: string;
    size?: number;
    type?: GLenum;
    normalize?: boolean;
    stride?: number;
    offset?: number;
    divisor?: number;
    usage?: GLenum;
    length?: number;
};
type ElementAttribOption = {
    buffer: AttribBufferLike;
    type?: GLenum;
    usage?: GLenum;
    length?: number;
};
type ArrayAttrib = ReturnType<typeof createArrayAttrib>;
type ElementAttrib = ReturnType<typeof createElementAttrib>;
type BufferInfo = {
    attributes: Record<string, ArrayAttrib>;
    vertexCount: number;
    element: ElementAttrib;
};
type VertexArrayObjectInfo = {
    handle: WebGLVertexArrayObject;
    vertexCount: number;
    element: ElementAttrib;
};
/**
 * @param {string} name
 * @param {WebGLBuffer} buffer
 * @param {number} length
 * @param {number} size
 * @param {GLenum} type
 * @param {boolean} normalize
 * @param {number} stride
 * @param {number} offset
 * @param {number} divisor
 */
declare function createArrayAttrib(name: string, buffer: WebGLBuffer, length: number, size: number, type: GLenum, normalize: boolean, stride: number, offset: number, divisor: number): {
    name: string;
    buffer: WebGLBuffer;
    length: number;
    size: number;
    type: number;
    normalize: boolean;
    stride: number;
    offset: number;
    divisor: number;
};
/**
 * @param {WebGLBuffer} buffer
 * @param {GLenum} type
 * @param {number} length
 */
declare function createElementAttrib(buffer: WebGLBuffer, type: GLenum, length: number): {
    buffer: WebGLBuffer;
    type: number;
    length: number;
};

/**
 * Creates a buffer source given the type and data.
 *
 * @param {WebGLRenderingContextBase} gl The gl context.
 * @param {GLenum} type The data type of the elements in the buffer. Usually,
 * this is `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
 * array buffers. It must be either `gl.BYTE`, `gl.UNSIGNED_BYTE`, `gl.SHORT`,
 * `gl.UNSIGNED_SHORT`, `gl.FLOAT`, or `gl.HALF_FLOAT` for WebGL2.
 * @param {Array<number>} data The buffer source data array.
 * @returns {BufferSource} The typed array buffer containing the given data.
 */
declare function createBufferSource(gl: WebGLRenderingContextBase, type: GLenum, data: Array<number>): BufferSource;
/**
 * Create a buffer with the given source.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The gl context.
 * @param {GLenum} target The buffer bind target. Usually, this is `gl.ARRAY_BUFFER` or
 * `gl.ELEMENT_ARRAY_BUFFER`.
 * @param {BufferSource} bufferSource The buffer source array.
 * @param {GLenum} [usage] The buffer usage hint. By default, this is `gl.STATIC_DRAW`.
 * @returns {WebGLBuffer} The created and bound data buffer.
 */
declare function createBuffer(gl: WebGLRenderingContext | WebGL2RenderingContext, target: GLenum, bufferSource: BufferSource, usage?: GLenum): WebGLBuffer;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {GLenum} bufferType
 */
declare function getTypedArrayForBufferType(gl: WebGLRenderingContextBase, bufferType: GLenum): Uint16ArrayConstructor | Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {BufferSource} bufferSource
 * @returns {GLenum}
 */
declare function getBufferTypeForBufferSource(gl: WebGLRenderingContextBase, bufferSource: BufferSource): GLenum;
declare function getByteCountForBufferType(gl: any, bufferType: any): number;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {Int8ArrayConstructor
 * |Uint8ArrayConstructor
 * |Int16ArrayConstructor
 * |Uint16ArrayConstructor
 * |Int32ArrayConstructor
 * |Uint32ArrayConstructor
 * |Float32ArrayConstructor} typedArray
 * @returns {GLenum}
 */
declare function getBufferTypeForTypedArray(gl: WebGLRenderingContextBase, typedArray: Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor): GLenum;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {GLenum} target
 * @param {WebGLBuffer} buffer
 * @returns {GLenum}
 */
declare function getBufferUsage(gl: WebGLRenderingContextBase, target: GLenum, buffer: WebGLBuffer): GLenum;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {GLenum} target
 * @param {WebGLBuffer} buffer
 * @returns {GLenum}
 */
declare function getBufferByteCount(gl: WebGLRenderingContextBase, target: GLenum, buffer: WebGLBuffer): GLenum;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {GLenum} target
 * @param {WebGLBuffer} buffer
 * @returns {GLenum}
 */
declare function getBufferLength(gl: WebGLRenderingContextBase, target: GLenum, buffer: WebGLBuffer, type: any): GLenum;

declare const BufferHelper_createBufferSource: typeof createBufferSource;
declare const BufferHelper_createBuffer: typeof createBuffer;
declare const BufferHelper_getTypedArrayForBufferType: typeof getTypedArrayForBufferType;
declare const BufferHelper_getBufferTypeForBufferSource: typeof getBufferTypeForBufferSource;
declare const BufferHelper_getByteCountForBufferType: typeof getByteCountForBufferType;
declare const BufferHelper_getBufferTypeForTypedArray: typeof getBufferTypeForTypedArray;
declare const BufferHelper_getBufferUsage: typeof getBufferUsage;
declare const BufferHelper_getBufferByteCount: typeof getBufferByteCount;
declare const BufferHelper_getBufferLength: typeof getBufferLength;
declare const BufferHelper_createBufferInfo: typeof createBufferInfo;
declare const BufferHelper_createVertexArrayInfo: typeof createVertexArrayInfo;
declare const BufferHelper_drawBufferInfo: typeof drawBufferInfo;
type BufferHelper_AttribBufferLike = AttribBufferLike;
type BufferHelper_ArrayAttribOption = ArrayAttribOption;
type BufferHelper_ElementAttribOption = ElementAttribOption;
type BufferHelper_ArrayAttrib = ArrayAttrib;
type BufferHelper_ElementAttrib = ElementAttrib;
type BufferHelper_BufferInfo = BufferInfo;
type BufferHelper_VertexArrayObjectInfo = VertexArrayObjectInfo;
declare namespace BufferHelper {
  export {
    BufferHelper_createBufferSource as createBufferSource,
    BufferHelper_createBuffer as createBuffer,
    BufferHelper_getTypedArrayForBufferType as getTypedArrayForBufferType,
    BufferHelper_getBufferTypeForBufferSource as getBufferTypeForBufferSource,
    BufferHelper_getByteCountForBufferType as getByteCountForBufferType,
    BufferHelper_getBufferTypeForTypedArray as getBufferTypeForTypedArray,
    BufferHelper_getBufferUsage as getBufferUsage,
    BufferHelper_getBufferByteCount as getBufferByteCount,
    BufferHelper_getBufferLength as getBufferLength,
    BufferHelper_createBufferInfo as createBufferInfo,
    BufferHelper_createVertexArrayInfo as createVertexArrayInfo,
    BufferHelper_drawBufferInfo as drawBufferInfo,
    BufferHelper_AttribBufferLike as AttribBufferLike,
    BufferHelper_ArrayAttribOption as ArrayAttribOption,
    BufferHelper_ElementAttribOption as ElementAttribOption,
    BufferHelper_ArrayAttrib as ArrayAttrib,
    BufferHelper_ElementAttrib as ElementAttrib,
    BufferHelper_BufferInfo as BufferInfo,
    BufferHelper_VertexArrayObjectInfo as VertexArrayObjectInfo,
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

declare class ProgramInfo {
    /**
     * @param {WebGLRenderingContextBase} gl
     * @param {WebGLProgram} program
     */
    constructor(gl: WebGLRenderingContextBase, program: WebGLProgram);
    handle: WebGLProgram;
    activeUniforms: Record<string, ActiveUniformInfo>;
    activeAttributes: Record<string, ActiveAttributeInfo>;
    drawContext: ProgramInfoDrawContext;
    /**
     * Bind the program and prepare to draw. This returns the bound context
     * that can modify the draw state.
     *
     * @param {WebGLRenderingContextBase} gl
     * @returns {ProgramInfoDrawContext} The bound context to draw with.
     */
    bind(gl: WebGLRenderingContextBase): ProgramInfoDrawContext;
}
declare class ProgramInfoDrawContext {
    constructor(gl: any, programInfo: any);
    gl: any;
    /** @private */
    private parent;
    uniform(uniformName: any, value: any): ProgramInfoDrawContext;
    /**
     * @param {string} attributeName Name of the attribute.
     * @param {GLenum} bufferType The buffer data type. This is usually `gl.FLOAT`
     * but can also be one of `gl.BYTE`, `gl.UNSIGNED_BYTE`, `gl.SHORT`, `gl.UNSIGNED_SHORT`
     * or `gl.HALF_FLOAT` for WebGL2.
     * @param {WebGLBuffer} buffer The buffer handle.
     * @param {boolean} [normalize=false] Whether to normalize the vectors in the buffer.
     * @param {number} [stride=0] The stride for each vector in the buffer.
     * @param {number} [offset=0] The initial offset in the buffer.
     */
    attribute(attributeName: string, bufferType: GLenum, buffer: WebGLBuffer, normalize?: boolean, stride?: number, offset?: number): ProgramInfoDrawContext;
    /**
     * Draws using this program.
     *
     * @param {WebGLRenderingContext} gl
     * @param {number} mode
     * @param {number} offset
     * @param {number} count
     * @param {WebGLBuffer} elementBuffer
     */
    draw(gl: WebGLRenderingContext, mode: number, offset: number, count: number, elementBuffer?: WebGLBuffer): any;
}

declare class ProgramInfoBuilder {
    /**
     * @param {WebGLRenderingContextBase} gl
     * @param {WebGLProgram} [program]
     */
    constructor(gl: WebGLRenderingContextBase, program?: WebGLProgram);
    /** @private */
    private programBuilder;
    get gl(): WebGLRenderingContextBase;
    get handle(): WebGLProgram;
    get shaders(): any[];
    /**
     * @param {GLenum} shaderType
     * @param {string} shaderSource
     * @returns {ProgramInfoBuilder}
     */
    shader(shaderType: GLenum, shaderSource: string): ProgramInfoBuilder;
    /**
     * @returns {ProgramInfo}
     */
    link(): ProgramInfo;
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
 * Create and compile shader from source text.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {GLenum} shaderType The type of the shader. This is usually `gl.VERTEX_SHADER`
 * or `gl.FRAGMENT_SHADER`.
 * @param {string} shaderSource The shader source text.
 * @returns {WebGLShader} The compiled shader.
 */
declare function createShader(gl: WebGLRenderingContextBase, shaderType: GLenum, shaderSource: string): WebGLShader;
/**
 * Link the given shader program from list of compiled shaders.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The shader program handle.
 * @param {Array<WebGLShader>} shaders The list of compiled shaders
 * to link in the program.
 * @returns {Promise<WebGLProgram>} The linked shader program.
 */
declare function createShaderProgram(gl: WebGLRenderingContextBase, program: WebGLProgram, shaders: Array<WebGLShader>): Promise<WebGLProgram>;
/**
 * Draw the currently bound render context.
 *
 * @param {WebGLRenderingContextBase} gl
 * @param {number} mode
 * @param {number} offset
 * @param {number} count
 * @param {WebGLBuffer} [elementBuffer]
 */
declare function draw(gl: WebGLRenderingContextBase, mode: number, offset: number, count: number, elementBuffer?: WebGLBuffer): void;
/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 */
declare function getProgramStatus(gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram): {
    /** @type {GLboolean} */
    linkStatus: GLboolean;
    /** @type {GLboolean} */
    deleteStatus: GLboolean;
    /** @type {GLboolean} */
    validateStatus: GLboolean;
    /** @type {string} */
    infoLog: string;
};

declare const ProgramHelper_createShader: typeof createShader;
declare const ProgramHelper_createShaderProgram: typeof createShaderProgram;
declare const ProgramHelper_draw: typeof draw;
declare const ProgramHelper_getProgramStatus: typeof getProgramStatus;
declare const ProgramHelper_getActiveUniforms: typeof getActiveUniforms;
declare const ProgramHelper_getActiveAttribs: typeof getActiveAttribs;
declare const ProgramHelper_createProgramInfo: typeof createProgramInfo;
declare const ProgramHelper_linkProgramShaders: typeof linkProgramShaders;
declare const ProgramHelper_bindProgramAttributes: typeof bindProgramAttributes;
declare const ProgramHelper_bindProgramUniforms: typeof bindProgramUniforms;
declare namespace ProgramHelper {
  export {
    ProgramHelper_createShader as createShader,
    ProgramHelper_createShaderProgram as createShaderProgram,
    ProgramHelper_draw as draw,
    ProgramHelper_getProgramStatus as getProgramStatus,
    ProgramHelper_getActiveUniforms as getActiveUniforms,
    ProgramHelper_getActiveAttribs as getActiveAttribs,
    ProgramHelper_createProgramInfo as createProgramInfo,
    ProgramHelper_linkProgramShaders as linkProgramShaders,
    ProgramHelper_bindProgramAttributes as bindProgramAttributes,
    ProgramHelper_bindProgramUniforms as bindProgramUniforms,
    BufferInfo$1 as BufferInfo,
    VertexArrayObjectInfo$1 as VertexArrayObjectInfo,
    ProgramInfo$1 as ProgramInfo,
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

export { BufferBuilder, BufferDataContext, BufferEnums, BufferHelper, BufferInfo$2 as BufferInfo, BufferInfoBuilder, GLHelper, ProgramAttributeEnums, ProgramBuilder, ProgramHelper, ProgramInfo, ProgramInfoBuilder, ProgramInfoDrawContext, ProgramUniformEnums, ProgramUniformFunctions };
