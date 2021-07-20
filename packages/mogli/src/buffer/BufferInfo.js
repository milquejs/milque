import { BufferDataContext } from './BufferBuilder.js';

export class BufferInfo
{
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
        this.bindContext = new BufferDataContext(gl, this.target);
    }

    bind(gl)
    {
        gl.bindBuffer(this.target, this.handle);
        this.bindContext.gl = gl;
        return this.bindContext;
    }
}
