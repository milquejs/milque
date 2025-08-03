import { BufferBuilder } from './BufferBuilder.js';
import { BufferInfo } from './BufferInfo.js';
import {
  getBufferTypeForBufferSource,
  getBufferTypeForTypedArray,
} from './helper/BufferHelper.js';

export class BufferInfoBuilder {
  /**
   * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is
   * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
   * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
   * new buffer will be created.
   */
  constructor(gl, target, buffer = undefined) {
    /** @private */
    this.bufferBuilder = new BufferBuilder(gl, target, buffer);
    /** @private */
    this.bufferType = gl.FLOAT;
  }

  get gl() {
    return this.bufferBuilder.gl;
  }

  get handle() {
    return this.bufferBuilder.handle;
  }

  get target() {
    return this.bufferBuilder.target;
  }

  /**
   * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
   * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
   * @returns {BufferInfoBuilder}
   */
  data(srcDataOrSize, usage = undefined) {
    this.bufferBuilder.data(srcDataOrSize, usage);
    if (typeof srcDataOrSize !== 'number') {
      this.bufferType = getBufferTypeForBufferSource(this.gl, srcDataOrSize);
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
  subData(
    srcData,
    dstOffset = undefined,
    srcOffset = undefined,
    srcLength = undefined,
  ) {
    this.bufferBuilder.subData(srcData, dstOffset, srcOffset, srcLength);
    this.bufferType = getBufferTypeForBufferSource(this.gl, srcData);
    return this;
  }

  /**
   * @returns {BufferInfo}
   */
  build() {
    const handle = this.bufferBuilder.build();
    const gl = this.gl;
    const target = this.target;
    const type = this.bufferType;
    return new BufferInfo(gl, target, type, handle);
  }
}
