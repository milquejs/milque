import { BufferInfo } from './BufferInfo.js';
import { BufferBuilder } from './BufferBuilder.js';
import { getTypedArrayBufferType } from './BufferHelper.js';

export class BufferInfoBuilder
{
    /**
     * @param {WebGLRenderingContextBase} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
     * new buffer will be created.
     */
    constructor(gl, target, buffer = undefined)
    {
        /** @private */
        this.bufferBuilder = new BufferBuilder(gl, target, buffer);
        /** @private */
        this.bufferType = gl.FLOAT;
    }

    get gl()
    {
        return this.bufferBuilder.gl;
    }

    get handle()
    {
        return this.bufferBuilder.handle;
    }

    get target()
    {
        return this.bufferBuilder.target;
    }

    /**
     * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
     * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
     * @returns {BufferInfoBuilder}
     */
    data(srcDataOrSize, usage = undefined)
    {
        this.bufferBuilder.data(srcDataOrSize, usage);
        if (typeof srcDataOrSize !== 'number')
        {
            const typedArray = srcDataOrSize.constructor;
            this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
        }
        return this;
    }

    /**
     * @param {BufferSource} srcData The buffer data source.
     * @param {number} [dstOffset] The destination byte offset to put the data.
     * @param {number} [srcOffset] The source array index offset to copy the data from.
     * @param {number} [srcLength] The source array count to copy the data until.
     * @returns {BufferInfoBuilder}
     */
    subData(srcData, dstOffset = undefined, srcOffset = undefined, srcLength = undefined)
    {
        this.bufferBuilder.subData(srcData, dstOffset, srcOffset, srcLength);
        const typedArray = srcData.constructor;
        this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
        return this;
    }

    /**
     * @returns {BufferInfo}
     */
    build()
    {
        const handle = this.bufferBuilder.build();
        const gl = this.gl;
        const target = this.target;
        const type = this.bufferType;
        return new BufferInfo(gl, target, type, handle);
    }
}
