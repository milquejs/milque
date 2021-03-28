import { BufferBuilder, BufferDataContext } from './BufferBuilder.js';
import { getTypedArrayBufferType } from './BufferHelper.js';

export class BufferInfo
{
    /**
     * @param {WebGLRenderingContextBase} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     */
    static builder(gl, target)
    {
        return new BufferInfoBuilder(gl, target);
    }

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
    constructor(gl, target, bufferType, buffer)
    {
        this.gl = gl;
        this.target = target;
        this.handle = buffer;
        this.type = bufferType;

        /** @private */
        this.bindContext = new BufferInfoBindContext(gl, this);
    }

    bind(gl)
    {
        gl.bindBuffer(this.target, this.handle);
        this.bindContext.gl = gl;
        return this.bindContext;
    }
}

export class BufferInfoBindContext extends BufferDataContext
{
    constructor(gl, bufferInfo)
    {
        super(gl, bufferInfo.target);

        /** @private */
        this.parent = bufferInfo;
    }
}

export class BufferInfoBuilder extends BufferBuilder
{
    constructor(gl, target)
    {
        super(gl, target);

        /** @private */
        this.bufferType = gl.FLOAT;
    }

    /**
     * @override
     * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
     * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
     * @returns {BufferInfoBuilder}
     */
    data(srcDataOrSize, usage = undefined)
    {
        super.data(srcDataOrSize, usage);
        if (typeof srcDataOrSize !== 'number')
        {
            const typedArray = srcDataOrSize.constructor;
            this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
        }
        return this;
    }

    /**
     * @override
     * @param {BufferSource} srcData The buffer data source.
     * @param {number} [dstOffset] The destination byte offset to put the data.
     * @param {number} [srcOffset] The source array index offset to copy the data from.
     * @param {number} [srcLength] The source array count to copy the data until.
     * @returns {BufferInfoBuilder}
     */
    subData(srcData, dstOffset = undefined, srcOffset = undefined, srcLength = undefined)
    {
        super.subData(srcData, dstOffset, srcOffset, srcLength);
        const typedArray = srcData.constructor;
        this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
        return this;
    }

    /** @override */
    build()
    {
        const handle = super.build();
        const gl = this.gl;
        const target = this.target;
        const type = this.bufferType;
        return new BufferInfo(gl, target, type, handle);
    }
}
