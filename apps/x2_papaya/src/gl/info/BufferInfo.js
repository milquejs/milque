import { BufferBuilder, BufferDataContext } from '../buffer/BufferBuilder.js';
import { getTypedArrayBufferType } from '../buffer/BufferHelper.js';

export class BufferInfoBuilder extends BufferBuilder
{
    constructor(gl, target)
    {
        super(gl, target);

        /** @private */
        this.bufferType = gl.FLOAT;
    }

    /** @override */
    data(srcData, usage = undefined)
    {
        let result = super.data(srcData, usage);
        const typedArray = srcData.constructor;
        this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
        return result;
    }

    /** @override */
    subData(srcData, dstOffset = undefined, srcOffset = undefined, srcLength = undefined)
    {
        let result = super.subData(srcData, dstOffset, srcOffset, srcLength);
        const typedArray = srcData.constructor;
        this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
        return result;
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

export class BufferInfo
{
    /**
     * 
     * @param {WebGLRenderingContext} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     */
    static from(gl, target)
    {
        return new BufferInfoBuilder(gl, target);
    }

    /**
     * @param {WebGlRenderingContext} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {GLenum} bufferType The buffer data type.
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
