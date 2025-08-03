import { getAttributeFunction } from './ProgramAttributeFunctions.js';
import { getAttribVertexSize } from './ProgramAttributeHelper.js';
import { getActiveAttribs } from './helper/ProgramActives.js';

/**
 * @typedef {import('./ProgramAttributeFunctions.js').AttributeFunction} AttributeFunction
 */

/**
 * @typedef ActiveAttributeInfo
 * @property {GLenum} type
 * @property {number} length
 * @property {number} location
 * @property {number} size
 * @property {AttributeFunction} applier
 * @property {number|Float32List|Int32List|Uint32List} value
 */

/**
 * Get map of all active attributes to their info in the shader program.
 *
 * @param {WebGLRenderingContextBase} gl The webgl context.
 * @param {WebGLProgram} program The program to get active attributes from.
 * @returns {Record<string, ActiveAttributeInfo>} An object mapping of attribute names to info.
 */
export function getActiveAttribsInfo(gl, program) {
  /** @type {Record<string, ActiveAttributeInfo>} */
  let result = {};
  const activeAttributes = getActiveAttribs(gl, program);
  for (let activeInfo of activeAttributes) {
    const attributeName = activeInfo.name;
    const attributeLength = activeInfo.size;
    const attributeType = activeInfo.type;
    const attributeLocation = gl.getAttribLocation(program, attributeName);
    const attributeApplier = getAttributeFunction(gl, attributeType);
    const attributeSize = getAttribVertexSize(gl, attributeType);
    result[attributeName] = {
      type: attributeType,
      length: attributeLength,
      location: attributeLocation,
      size: attributeSize,
      applier: attributeApplier,
      /**
       * @param {[
       *   buffer: WebGLBuffer,
       *   vertexSize: number,
       *   bufferType: GLenum,
       *   normalize: boolean,
       *   stride: number,
       *   offset: number,
       *   divisor: number,
       * ]} args
       */
      set value([
        buffer,
        vertexSize,
        bufferType,
        normalize,
        stride,
        offset,
        divisor,
      ]) {
        this.applier(
          this.location,
          buffer,
          vertexSize,
          bufferType,
          normalize,
          stride,
          offset,
          divisor,
        );
      },
    };
  }
  return result;
}
