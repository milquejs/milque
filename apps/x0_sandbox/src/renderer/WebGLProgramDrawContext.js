import { ProgramHelper } from '@milque/mogli';

export class WebGLProgramDrawContext
{
    /**
     * @param {WebGLRenderingContextBase} gl 
     * @param {WebGLProgram} program 
     */
    constructor(gl, program)
    {
        this.gl = gl;
        /** @private */
        this.parent = ProgramHelper.getProgramInfo(gl, program);
    }
    
    uniform(uniformName, value)
    {
        const activeUniforms = this.parent.activeUniforms;
        if (uniformName in activeUniforms)
        {
            let uniform = activeUniforms[uniformName];
            let location = uniform.location;
            uniform.set.call(this.gl, location, value);
        }
        return this;
    }

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
    attribute(attributeName, bufferType, buffer, normalize = false, stride = 0, offset = 0)
    {
        const gl = this.gl;
        const activeAttributes = this.parent.activeAttributes;
        if (attributeName in activeAttributes)
        {
            let attribute = activeAttributes[attributeName];
            let location = attribute.location;
            let size = attribute.size;
            if (buffer)
            {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, size, bufferType, normalize, stride, offset);
            }
            else
            {
                gl.disableVertexAttribArray(location);
            }
        }
        return this;
    }
    
    /**
     * Draws using this program.
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {number} mode 
     * @param {number} offset 
     * @param {number} count 
     * @param {WebGLBuffer} elementBuffer 
     */
    draw(gl, mode, offset, count, elementBuffer = null)
    {
        draw(gl, mode, offset, count, elementBuffer);
        return this.parent;
    }
}


/**
 * Draw the currently bound render context.
 * 
 * @param {WebGLRenderingContextBase} gl 
 * @param {Number} mode 
 * @param {Number} offset 
 * @param {Number} count 
 * @param {WebGLBuffer} [elementBuffer]
 */
export function draw(gl, mode, offset, count, elementBuffer = undefined)
{
    if (elementBuffer)
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset);
    }
    else
    {
        gl.drawArrays(mode, offset, count);
    }
}
