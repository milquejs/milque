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
    /** @type {WebGLBuffer} */
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
    length: number;
    location: number;
    size: number;
    applier: AttributeFunction;
    value: number | Float32List | Int32List | Uint32List;
};

/** @typedef {Float32List|Int32List|Uint32List} UniformVector */
/**
 * @callback WebGL1UniformArrayFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {UniformVector} value The vector array.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @callback WebGL2UniformArrayFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {UniformVector} value The vector array.
 * @this {WebGL2RenderingContext}
 *
 * @typedef {WebGL1UniformArrayFunction|WebGL2UniformArrayFunction} UniformArrayFunction
 *
 * @callback UniformOneComponentFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {GLfloat|GLint} x The x component of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @typedef {UniformOneComponentFunction|UniformArrayFunction} UniformMixedFunction
 */
/**
 * Gets the uniform modifier function by uniform type. For uniform vectors
 * of size 1, it accepts a single number value. For vectors of greater
 * size, it takes an array of numbers.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformMixedFunction} The uniform modifier function.
 */
declare function getUniformFunction(gl: WebGLRenderingContextBase, uniformType: GLenum): UniformMixedFunction;
/**
 * @callback UniformXYFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {GLfloat|GLint} x The first component of the vector.
 * @param {GLfloat|GLint} y The second component of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @callback UniformXYZFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {GLfloat|GLint} x The first component of the vector.
 * @param {GLfloat|GLint} y The second component of the vector.
 * @param {GLfloat|GLint} z The third component of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @callback UniformXYZWFunction
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {GLfloat|GLint} x The first component of the vector.
 * @param {GLfloat|GLint} y The second component of the vector.
 * @param {GLfloat|GLint} z The third component of the vector.
 * @param {GLfloat|GLint} w The fourth component of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @callback Uniform17Function
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {GLfloat} m1 The first component of the vector.
 * @param {GLfloat} m2 The second component of the vector.
 * @param {GLfloat} m3 The third component of the vector.
 * @param {GLfloat} m4 The fourth component of the vector.
 * @param {GLfloat} m5 The fifth component of the vector.
 * @param {GLfloat} m6 The sixth component of the vector.
 * @param {GLfloat} m7 The seventh component of the vector.
 * @param {GLfloat} m8 The eighth component of the vector.
 * @param {GLfloat} m9 The ninth component of the vector.
 * @param {GLfloat} m10 The tenth component of the vector.
 * @param {GLfloat} m11 The eleventh component of the vector.
 * @param {GLfloat} m12 The twelth component of the vector.
 * @param {GLfloat} m13 The thirteenth component of the vector.
 * @param {GLfloat} m14 The fourteenth component of the vector.
 * @param {GLfloat} m15 The fifteenth component of the vector.
 * @param {GLfloat} m16 The sixteenth component of the vector.
 * @param {GLfloat} m17 The seventeenth component of the vector.
 * @this {WebGLRenderingContext|WebGL2RenderingContext}
 *
 * @callback WebGL2Uniform10Function
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {GLfloat} m1 The first component of the vector.
 * @param {GLfloat} m2 The second component of the vector.
 * @param {GLfloat} m3 The third component of the vector.
 * @param {GLfloat} m4 The fourth component of the vector.
 * @param {GLfloat} m5 The fifth component of the vector.
 * @param {GLfloat} m6 The sixth component of the vector.
 * @param {GLfloat} m7 The seventh component of the vector.
 * @param {GLfloat} m8 The eighth component of the vector.
 * @param {GLfloat} m9 The ninth component of the vector.
 * @param {GLfloat} m10 The tenth component of the vector.
 * @this {WebGL2RenderingContext}
 *
 * @callback WebGL2Uniform13Function
 * @param {WebGLUniformLocation} location The uniform location.
 * @param {GLfloat} m1 The first component of the vector.
 * @param {GLfloat} m2 The second component of the vector.
 * @param {GLfloat} m3 The third component of the vector.
 * @param {GLfloat} m4 The fourth component of the vector.
 * @param {GLfloat} m5 The fifth component of the vector.
 * @param {GLfloat} m6 The sixth component of the vector.
 * @param {GLfloat} m7 The seventh component of the vector.
 * @param {GLfloat} m8 The eighth component of the vector.
 * @param {GLfloat} m9 The ninth component of the vector.
 * @param {GLfloat} m10 The tenth component of the vector.
 * @param {GLfloat} m11 The eleventh component of the vector.
 * @param {GLfloat} m12 The twelth component of the vector.
 * @param {GLfloat} m13 The thirteenth component of the vector.
 * @this {WebGL2RenderingContext}
 *
 * @typedef {UniformOneComponentFunction
 * | UniformXYFunction
 * | UniformXYZFunction
 * | UniformXYZWFunction
 * | Uniform17Function
 * | WebGL2Uniform10Function
 * | WebGL2Uniform13Function} UniformManyComponentFunction
 */
/**
 * Get the per component uniform modifier function by uniform type.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformManyComponentFunction} The per component uniform modifier function.
 */
declare function getUniformManyComponentFunction(gl: WebGLRenderingContext | WebGL2RenderingContext, uniformType: GLenum): UniformManyComponentFunction;
/**
 * Get the array uniform modifier function by uniform type.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @param {GLenum} uniformType The uniform data type.
 * @returns {UniformArrayFunction|WebGL2UniformArrayFunction} The array uniform modifier function.
 */
declare function getUniformArrayFunction(gl: WebGLRenderingContext | WebGL2RenderingContext, uniformType: GLenum): UniformArrayFunction | WebGL2UniformArrayFunction;
type UniformVector = Float32List | Int32List | Uint32List;
type WebGL1UniformArrayFunction = (this: WebGLRenderingContext | WebGL2RenderingContext, location: WebGLUniformLocation, value: UniformVector) => any;
type WebGL2UniformArrayFunction = (this: WebGL2RenderingContext, location: WebGLUniformLocation, value: UniformVector) => any;
type UniformArrayFunction = WebGL1UniformArrayFunction | WebGL2UniformArrayFunction;
type UniformOneComponentFunction = (this: WebGLRenderingContext | WebGL2RenderingContext, location: WebGLUniformLocation, x: GLfloat | GLint) => any;
type UniformMixedFunction = UniformOneComponentFunction | UniformArrayFunction;
type UniformXYFunction = (this: WebGLRenderingContext | WebGL2RenderingContext, location: WebGLUniformLocation, x: GLfloat | GLint, y: GLfloat | GLint) => any;
type UniformXYZFunction = (this: WebGLRenderingContext | WebGL2RenderingContext, location: WebGLUniformLocation, x: GLfloat | GLint, y: GLfloat | GLint, z: GLfloat | GLint) => any;
type UniformXYZWFunction = (this: WebGLRenderingContext | WebGL2RenderingContext, location: WebGLUniformLocation, x: GLfloat | GLint, y: GLfloat | GLint, z: GLfloat | GLint, w: GLfloat | GLint) => any;
type Uniform17Function = (this: WebGLRenderingContext | WebGL2RenderingContext, location: WebGLUniformLocation, m1: GLfloat, m2: GLfloat, m3: GLfloat, m4: GLfloat, m5: GLfloat, m6: GLfloat, m7: GLfloat, m8: GLfloat, m9: GLfloat, m10: GLfloat, m11: GLfloat, m12: GLfloat, m13: GLfloat, m14: GLfloat, m15: GLfloat, m16: GLfloat, m17: GLfloat) => any;
type WebGL2Uniform10Function = (this: WebGL2RenderingContext, location: WebGLUniformLocation, m1: GLfloat, m2: GLfloat, m3: GLfloat, m4: GLfloat, m5: GLfloat, m6: GLfloat, m7: GLfloat, m8: GLfloat, m9: GLfloat, m10: GLfloat) => any;
type WebGL2Uniform13Function = (this: WebGL2RenderingContext, location: WebGLUniformLocation, m1: GLfloat, m2: GLfloat, m3: GLfloat, m4: GLfloat, m5: GLfloat, m6: GLfloat, m7: GLfloat, m8: GLfloat, m9: GLfloat, m10: GLfloat, m11: GLfloat, m12: GLfloat, m13: GLfloat) => any;
type UniformManyComponentFunction = UniformOneComponentFunction | UniformXYFunction | UniformXYZFunction | UniformXYZWFunction | Uniform17Function | WebGL2Uniform10Function | WebGL2Uniform13Function;

type ProgramUniformFunctions_Uniform17Function = Uniform17Function;
type ProgramUniformFunctions_UniformArrayFunction = UniformArrayFunction;
type ProgramUniformFunctions_UniformManyComponentFunction = UniformManyComponentFunction;
type ProgramUniformFunctions_UniformMixedFunction = UniformMixedFunction;
type ProgramUniformFunctions_UniformOneComponentFunction = UniformOneComponentFunction;
type ProgramUniformFunctions_UniformVector = UniformVector;
type ProgramUniformFunctions_UniformXYFunction = UniformXYFunction;
type ProgramUniformFunctions_UniformXYZFunction = UniformXYZFunction;
type ProgramUniformFunctions_UniformXYZWFunction = UniformXYZWFunction;
type ProgramUniformFunctions_WebGL1UniformArrayFunction = WebGL1UniformArrayFunction;
type ProgramUniformFunctions_WebGL2Uniform10Function = WebGL2Uniform10Function;
type ProgramUniformFunctions_WebGL2Uniform13Function = WebGL2Uniform13Function;
type ProgramUniformFunctions_WebGL2UniformArrayFunction = WebGL2UniformArrayFunction;
declare const ProgramUniformFunctions_getUniformArrayFunction: typeof getUniformArrayFunction;
declare const ProgramUniformFunctions_getUniformFunction: typeof getUniformFunction;
declare const ProgramUniformFunctions_getUniformManyComponentFunction: typeof getUniformManyComponentFunction;
declare namespace ProgramUniformFunctions {
  export { ProgramUniformFunctions_getUniformArrayFunction as getUniformArrayFunction, ProgramUniformFunctions_getUniformFunction as getUniformFunction, ProgramUniformFunctions_getUniformManyComponentFunction as getUniformManyComponentFunction };
  export type { ProgramUniformFunctions_Uniform17Function as Uniform17Function, ProgramUniformFunctions_UniformArrayFunction as UniformArrayFunction, ProgramUniformFunctions_UniformManyComponentFunction as UniformManyComponentFunction, ProgramUniformFunctions_UniformMixedFunction as UniformMixedFunction, ProgramUniformFunctions_UniformOneComponentFunction as UniformOneComponentFunction, ProgramUniformFunctions_UniformVector as UniformVector, ProgramUniformFunctions_UniformXYFunction as UniformXYFunction, ProgramUniformFunctions_UniformXYZFunction as UniformXYZFunction, ProgramUniformFunctions_UniformXYZWFunction as UniformXYZWFunction, ProgramUniformFunctions_WebGL1UniformArrayFunction as WebGL1UniformArrayFunction, ProgramUniformFunctions_WebGL2Uniform10Function as WebGL2Uniform10Function, ProgramUniformFunctions_WebGL2Uniform13Function as WebGL2Uniform13Function, ProgramUniformFunctions_WebGL2UniformArrayFunction as WebGL2UniformArrayFunction };
}

type ActiveUniformInfo = {
    type: number;
    length: number;
    location: WebGLUniformLocation;
    applier: UniformMixedFunction;
    value: number | Float32List | Int32List | Uint32List;
};

/**
 * @typedef {import('../../buffer/helper/BufferInfoHelper.js').BufferInfo} BufferInfo
 * @typedef {import('../../buffer/helper/BufferInfoHelper.js').VertexArrayObjectInfo} VertexArrayObjectInfo
 */
/**
 * @typedef ProgramInfo
 * @property {WebGLProgram} handle
 * @property {Record<string, import('../ProgramUniformInfo.js').ActiveUniformInfo>} uniforms
 * @property {Record<string, import('../ProgramAttributeInfo.js').ActiveAttributeInfo>} attributes
 */
/**
 * Assumes all shaders already compiled and linked successfully.
 *
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {ProgramInfo}
 */
declare function createProgramInfo(gl: WebGL2RenderingContext, program: WebGLProgram): ProgramInfo$1;
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
 * @param {WebGL2RenderingContext} gl
 * @param {ReturnType<createProgramInfo>} programInfo
 * @param {Record<string, number|Float32List|Int32List|Uint32List>} uniforms
 */
declare function bindProgramUniforms(gl: WebGL2RenderingContext, programInfo: ReturnType<typeof createProgramInfo>, uniforms: Record<string, number | Float32List | Int32List | Uint32List>): void;
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
 * @param {Array<import('../../program/helper/ProgramInfoHelper.js').ProgramInfo>} programInfos
 * @returns {VertexArrayObjectInfo}
 */
declare function createVertexArrayInfo(gl: WebGLRenderingContextBase, bufferInfo: BufferInfo, programInfos: Array<ProgramInfo$1>): VertexArrayObjectInfo;
/**
 * @param {WebGLRenderingContextBase} gl
 * @param {BufferInfo|VertexArrayObjectInfo} bufferOrVertexArrayObjectInfo
 */
declare function drawBufferInfo(gl: WebGLRenderingContextBase, bufferOrVertexArrayObjectInfo: BufferInfo | VertexArrayObjectInfo, mode?: 4, offset?: number, vertexCount?: number, instanceCount?: undefined): void;
type AttribBufferLike = WebGLBuffer | BufferSource | Array<number>;
type ArrayAttribOption = {
    buffer: AttribBufferLike;
    name?: string | undefined;
    size?: number | undefined;
    type?: number | undefined;
    normalize?: boolean | undefined;
    stride?: number | undefined;
    offset?: number | undefined;
    divisor?: number | undefined;
    usage?: number | undefined;
    length?: number | undefined;
};
type ElementAttribOption = {
    buffer: AttribBufferLike;
    type?: number | undefined;
    usage?: number | undefined;
    length?: number | undefined;
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
declare function getTypedArrayForBufferType(gl: WebGLRenderingContextBase, bufferType: GLenum): Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor;
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

type index$1_ArrayAttrib = ArrayAttrib;
type index$1_ArrayAttribOption = ArrayAttribOption;
type index$1_AttribBufferLike = AttribBufferLike;
type index$1_BufferInfo = BufferInfo;
type index$1_ElementAttrib = ElementAttrib;
type index$1_ElementAttribOption = ElementAttribOption;
type index$1_VertexArrayObjectInfo = VertexArrayObjectInfo;
declare const index$1_createBuffer: typeof createBuffer;
declare const index$1_createBufferInfo: typeof createBufferInfo;
declare const index$1_createBufferSource: typeof createBufferSource;
declare const index$1_createVertexArrayInfo: typeof createVertexArrayInfo;
declare const index$1_drawBufferInfo: typeof drawBufferInfo;
declare const index$1_getBufferByteCount: typeof getBufferByteCount;
declare const index$1_getBufferLength: typeof getBufferLength;
declare const index$1_getBufferTypeForBufferSource: typeof getBufferTypeForBufferSource;
declare const index$1_getBufferTypeForTypedArray: typeof getBufferTypeForTypedArray;
declare const index$1_getBufferUsage: typeof getBufferUsage;
declare const index$1_getByteCountForBufferType: typeof getByteCountForBufferType;
declare const index$1_getTypedArrayForBufferType: typeof getTypedArrayForBufferType;
declare namespace index$1 {
  export { index$1_createBuffer as createBuffer, index$1_createBufferInfo as createBufferInfo, index$1_createBufferSource as createBufferSource, index$1_createVertexArrayInfo as createVertexArrayInfo, index$1_drawBufferInfo as drawBufferInfo, index$1_getBufferByteCount as getBufferByteCount, index$1_getBufferLength as getBufferLength, index$1_getBufferTypeForBufferSource as getBufferTypeForBufferSource, index$1_getBufferTypeForTypedArray as getBufferTypeForTypedArray, index$1_getBufferUsage as getBufferUsage, index$1_getByteCountForBufferType as getByteCountForBufferType, index$1_getTypedArrayForBufferType as getTypedArrayForBufferType };
  export type { index$1_ArrayAttrib as ArrayAttrib, index$1_ArrayAttribOption as ArrayAttribOption, index$1_AttribBufferLike as AttribBufferLike, index$1_BufferInfo as BufferInfo, index$1_ElementAttrib as ElementAttrib, index$1_ElementAttribOption as ElementAttribOption, index$1_VertexArrayObjectInfo as VertexArrayObjectInfo };
}

declare namespace BufferEnums {
    let BYTE: number;
    let UNSIGNED_BYTE: number;
    let SHORT: number;
    let UNSIGNED_SHORT: number;
    let INT: number;
    let UNSIGNED_INT: number;
    let FLOAT: number;
    let HALF_FLOAT: number;
}

declare class ProgramInfo {
    /**
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLProgram} program
     */
    constructor(gl: WebGL2RenderingContext, program: WebGLProgram);
    handle: WebGLProgram;
    activeUniforms: Record<string, ActiveUniformInfo>;
    activeAttributes: Record<string, ActiveAttributeInfo>;
    drawContext: ProgramInfoDrawContext;
    /**
     * Bind the program and prepare to draw. This returns the bound context
     * that can modify the draw state.
     *
     * @param {WebGL2RenderingContext} gl
     * @returns {ProgramInfoDrawContext} The bound context to draw with.
     */
    bind(gl: WebGL2RenderingContext): ProgramInfoDrawContext;
}
declare class ProgramInfoDrawContext {
    /**
     * @param {WebGL2RenderingContext} gl
     * @param {ProgramInfo} programInfo
     */
    constructor(gl: WebGL2RenderingContext, programInfo: ProgramInfo);
    gl: WebGL2RenderingContext;
    /** @private */
    private parent;
    /**
     * @param {string} uniformName
     * @param {any} value
     */
    uniform(uniformName: string, value: any): this;
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
    attribute(attributeName: string, bufferType: GLenum, buffer: WebGLBuffer, normalize?: boolean, stride?: number, offset?: number): this;
    /**
     * Draws using this program.
     *
     * @param {WebGL2RenderingContext} gl
     * @param {number} mode
     * @param {number} offset
     * @param {number} count
     * @param {WebGLBuffer} [elementBuffer]
     */
    draw(gl: WebGL2RenderingContext, mode: number, offset: number, count: number, elementBuffer?: WebGLBuffer): ProgramInfo;
}

declare class ProgramInfoBuilder {
    /**
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLProgram} [program]
     */
    constructor(gl: WebGL2RenderingContext, program?: WebGLProgram);
    /** @private */
    private programBuilder;
    get gl(): WebGL2RenderingContext;
    get handle(): WebGLProgram;
    get shaders(): WebGLShader[];
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
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLProgram} [program]
     */
    constructor(gl: WebGL2RenderingContext, program?: WebGLProgram);
    handle: WebGLProgram;
    /** @type {Array<WebGLShader>} */
    shaders: Array<WebGLShader>;
    /** @type {WebGL2RenderingContext} */
    gl: WebGL2RenderingContext;
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

declare const index_bindProgramAttributes: typeof bindProgramAttributes;
declare const index_bindProgramUniforms: typeof bindProgramUniforms;
declare const index_createProgramInfo: typeof createProgramInfo;
declare const index_createShader: typeof createShader;
declare const index_createShaderProgram: typeof createShaderProgram;
declare const index_draw: typeof draw;
declare const index_getActiveAttribs: typeof getActiveAttribs;
declare const index_getActiveUniforms: typeof getActiveUniforms;
declare const index_getProgramStatus: typeof getProgramStatus;
declare const index_linkProgramShaders: typeof linkProgramShaders;
declare namespace index {
  export { index_bindProgramAttributes as bindProgramAttributes, index_bindProgramUniforms as bindProgramUniforms, index_createProgramInfo as createProgramInfo, index_createShader as createShader, index_createShaderProgram as createShaderProgram, index_draw as draw, index_getActiveAttribs as getActiveAttribs, index_getActiveUniforms as getActiveUniforms, index_getProgramStatus as getProgramStatus, index_linkProgramShaders as linkProgramShaders };
  export type { BufferInfo$1 as BufferInfo, ProgramInfo$1 as ProgramInfo, VertexArrayObjectInfo$1 as VertexArrayObjectInfo };
}

declare namespace ProgramUniformEnums {
    let FLOAT: number;
    let FLOAT_VEC2: number;
    let FLOAT_VEC3: number;
    let FLOAT_VEC4: number;
    let INT: number;
    let INT_VEC2: number;
    let INT_VEC3: number;
    let INT_VEC4: number;
    let BOOL: number;
    let BOOL_VEC2: number;
    let BOOL_VEC3: number;
    let BOOL_VEC4: number;
    let FLOAT_MAT2: number;
    let FLOAT_MAT3: number;
    let FLOAT_MAT4: number;
    let SAMPLER_2D: number;
    let SAMPLER_CUBE: number;
    let UNSIGNED_INT: number;
    let UNSIGNED_INT_VEC2: number;
    let UNSIGNED_INT_VEC3: number;
    let UNSIGNED_INT_VEC4: number;
    let FLOAT_MAT2x3: number;
    let FLOAT_MAT2x4: number;
    let FLOAT_MAT3x2: number;
    let FLOAT_MAT3x4: number;
    let FLOAT_MAT4x2: number;
    let FLOAT_MAT4x3: number;
    let SAMPLER_3D: number;
    let SAMPLER_2D_SHADOW: number;
    let SAMPLER_2D_ARRAY: number;
    let SAMPLER_2D_ARRAY_SHADOW: number;
    let SAMPLER_CUBE_SHADOW: number;
    let INT_SAMPLER_2D: number;
    let INT_SAMPLER_3D: number;
    let INT_SAMPLER_CUBE: number;
    let INT_SAMPLER_2D_ARRAY: number;
    let UNSIGNED_INT_SAMPLER_2D: number;
    let UNSIGNED_INT_SAMPLER_3D: number;
    let UNSIGNED_INT_SAMPLER_CUBE: number;
    let UNSIGNED_INT_SAMPLER_2D_ARRAY: number;
}

declare namespace ProgramAttributeEnums {
    let BYTE: number;
    let UNSIGNED_BYTE: number;
    let SHORT: number;
    let UNSIGNED_SHORT: number;
    let FLOAT: number;
    let HALF_FLOAT: number;
}

export { BufferBuilder, BufferDataContext, BufferEnums, index$1 as BufferHelper, BufferInfo$2 as BufferInfo, BufferInfoBuilder, GLHelper, ProgramAttributeEnums, ProgramBuilder, index as ProgramHelper, ProgramInfo, ProgramInfoBuilder, ProgramInfoDrawContext, ProgramUniformEnums, ProgramUniformFunctions };
