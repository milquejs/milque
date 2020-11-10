import { findActiveAttributes, findActiveUniforms } from './ProgramHelper.js';
import { getVertexComponentType } from './GLTypeInfo.js';
import { draw } from './GLHelper.js';

export function createProgramInfo(gl, program)
{
    return new ProgramInfo(gl, program);
}

export class ProgramInfo
{
    constructor(gl, program)
    {
        this.handle = program;

        this.activeUniforms = findActiveUniforms(gl, program);
        this.activeAttributes = findActiveAttributes(gl, program);

        this.drawContext = new ProgramInfoDrawContext(this);
    }

    bind(gl)
    {
        gl.useProgram(this.handle);

        this.drawContext.gl = gl;
        return this.drawContext;
    }
}

export class ProgramInfoDrawContext
{
    constructor(programInfo)
    {
        this.parent = programInfo;

        // Must be set by parent.
        this.gl = null;
    }
    
    uniform(uniformName, value)
    {
        const gl = this.gl;
        const activeUniforms = this.parent.activeUniforms;
        if (uniformName in activeUniforms)
        {
            let uniform = activeUniforms[uniformName];
            let location = uniform.location;
            uniform.set(gl, location, value);
        }
        return this;
    }

    /**
     * 
     * @param {String} attributeName Name of the attribute.
     * @param {WebGLBuffer} buffer The buffer handle.
     * @param {Number} size The size of each vector in the buffer.
     * @param {Boolean} [normalize=false] Whether to normalize the vectors in the buffer.
     * @param {Number} [stride=0] The stride for each vector in the buffer.
     * @param {Number} [offset=0] The initial offset in the buffer.
     */
    attribute(attributeName, buffer, size, normalize = false, stride = 0, offset = 0)
    {
        const gl = this.gl;
        const activeAttributes = this.parent.activeAttributes;
        if (attributeName in activeAttributes)
        {
            let attribute = activeAttributes[attributeName];
            let location = attribute.location;
            if (buffer)
            {
                let type = getVertexComponentType(gl, attribute.type);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
                gl.enableVertexAttribArray(location);
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
     * @param {Number} mode 
     * @param {Number} offset 
     * @param {Number} count 
     * @param {WebGLBuffer} elementBuffer 
     */
    draw(gl, mode, offset, count, elementBuffer = null)
    {
        draw(gl, mode, offset, count, elementBuffer);
        return this.parent;
    }
}
