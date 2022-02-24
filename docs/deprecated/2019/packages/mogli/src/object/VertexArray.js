import { createShaderProgramAttributeSetter } from './Shader.js';
import { getBufferTypeInfo } from './Buffer.js';

export function createVertexArrayInfo(gl, sharedAttributeLayout = [])
{
    const vertexArrayHandle = gl.createVertexArray();

    const attributes = {};
    for(let i = 0; i < sharedAttributeLayout.length; ++i)
    {
        attributes[sharedAttributeLayout[i]] = {
            location: i,
            setter: createShaderProgramAttributeSetter(i)
        };
    }

    return {
        handle: vertexArrayHandle,
        attributes: attributes,
        _gl: gl,
        elementBuffer: null,
        elementType: null,
        elementCount: 0,
        attributeBuffers: {},
        setElementCount(count)
        {
            this.elementCount = count;
            return this;
        },
        elementAttribute(bufferInfo)
        {
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo.handle);

            const bufferTypeInfo = getBufferTypeInfo(this._gl, bufferInfo.type);
            // NOTE: Number of bytes in buffer divided by the number of bytes of element type
            this.elementCount = this._gl.getBufferParameter(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.BUFFER_SIZE) / bufferTypeInfo.size;
            this.elementBuffer = bufferInfo;
            this.elementType = bufferInfo.type;
            return this;
        },
        sharedAttribute(name, bufferInfo)
        {
            if (name in this.attributes)
            {
                this.attributes[name].setter(this._gl, bufferInfo);
            }
            this.attributeBuffers[name] = bufferInfo;
            return this;
        },
        programAttribute(name, bufferInfo, ...programInfos)
        {
            for(const program of programInfos)
            {
                program.attribute(name, bufferInfo);
            }
            this.attributeBuffers[name] = bufferInfo;
            return this;
        }
    };
}
