import { createShaderProgramAttributeSetter } from './ShaderProgram.js';
import { getBufferTypeInfo } from './Buffer.js';

export class VertexArrayInfo
{
    constructor(gl, sharedAttributes = [])
    {
        const vertexArrayHandle = gl.createVertexArray();

        const attributes = {};
        for(let i = 0; i < sharedAttributes.length; ++i)
        {
            attributes[sharedAttributes[i]] = {
                location: i,
                setter: createShaderProgramAttributeSetter(i)
            };
        }

        this.handle = vertexArrayHandle;
        this._attributes = attributes;
        this._gl = gl;
        this.elementBuffer = null;
        this.elementType = null;
        this.elementCount = 0;
    }

    setElementCount(count)
    {
        this.elementCount = count;
        return this;
    }

    elementAttribute(bufferInfo)
    {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo.handle);

        const bufferTypeInfo = getBufferTypeInfo(this._gl, bufferInfo.type);
        // NOTE: Number of bytes in buffer divided by the number of bytes of element type
        this.elementCount = this._gl.getBufferParameter(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.BUFFER_SIZE) / bufferTypeInfo.size;
        this.elementBuffer = bufferInfo;
        this.elementType = bufferInfo.type;
        return this;
    }

    sharedAttribute(name, bufferInfo)
    {
        if (name in this._attributes)
        {
            this._attributes[name].setter(this._gl, bufferInfo);
        }
        return this;
    }

    programAttribute(name, bufferInfo, ...programInfos)
    {
        for(const program of programInfos)
        {
            program.attribute(name, bufferInfo);
        }
        return this;
    }
}
