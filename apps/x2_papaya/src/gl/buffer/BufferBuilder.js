import { isWebGL2Supported } from '../GLHelper.js';

export class BufferDataContext
{
    /**
     * @param {WebGLRenderingContext} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     */
    constructor(gl, target)
    {
        this.gl = gl;
        this.target = target;
    }

    /**
     * @param {BufferSource|number} srcData The buffer data source or the buffer size in bytes.
     * @param {GLenum} [usage] The buffer data usage.
     */
    data(srcData, usage = undefined)
    {
        const gl = this.gl;
        const target = this.target;
        if (!ArrayBuffer.isView(srcData)) throw new Error('Source data must be a typed array.');
        gl.bufferData(target, srcData, usage || gl.STATIC_DRAW);
        return this;
    }

    /**
     * @param {BufferSource} srcData The buffer data source.
     * @param {number} [dstOffset] The destination byte offset to put the data.
     * @param {number} [srcOffset] The source array index offset to copy the data from.
     * @param {number} [srcLength] The source array count to copy the data until.
     */
    subData(srcData, dstOffset = 0, srcOffset = undefined, srcLength = undefined)
    {
        const gl = this.gl;
        const target = this.target;
        if (!ArrayBuffer.isView(srcData)) throw new Error('Source data must be a typed array.');
        if (srcOffset)
        {
            if (isWebGL2Supported(gl))
            {
                gl.bufferSubData(target, dstOffset, srcData, srcOffset, srcLength);
            }
            else
            {
                const srcSubData = srcLength
                    ? srcData.subarray(srcOffset, srcOffset + srcLength)
                    : srcData.subarray(srcOffset);
                gl.bufferSubData(target, dstOffset, srcSubData);
            }
        }
        else
        {
            gl.bufferSubData(target, dstOffset, srcData);
        }
        return this;
    }
}

export class BufferBuilder extends BufferDataContext
{
    /**
     * @param {WebGLRenderingContext} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
     * new buffer will be created.
     */
    static from(gl, target, buffer = undefined)
    {
        return new BufferBuilder(gl, target, buffer);
    }

    /**
     * @param {WebGLRenderingContext} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
     * new buffer will be created.
     */
    constructor(gl, target, buffer = undefined)
    {
        super(gl, target);
        this.handle = buffer || gl.createBuffer();

        gl.bindBuffer(target, this.handle);
    }
    
    build()
    {
        return this.handle;
    }
}
