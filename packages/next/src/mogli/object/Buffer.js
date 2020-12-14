export function createBufferInfo(gl, type, data, size, normalize = false, stride = 0, offset = 0, bufferTarget = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW)
{
    const bufferHandle = gl.createBuffer();

    const bufferTypeInfo = getBufferTypeInfo(gl, type);
    if (!bufferTypeInfo) throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);    

    if (data instanceof bufferTypeInfo.TypedArray)
    {
        gl.bindBuffer(bufferTarget, bufferHandle);
        gl.bufferData(bufferTarget, data, usage);
    }
    else if (Array.isArray(data))
    {
        data = new bufferTypeInfo.TypedArray(data);
        gl.bindBuffer(bufferTarget, bufferHandle);
        gl.bufferData(bufferTarget, data, usage);
    }
    else if (typeof data === 'number')
    {
        gl.bindBuffer(bufferTarget, bufferHandle);
        gl.bufferData(bufferTarget, data, usage);
    }
    else
    {
        throw new Error('Unknown buffer data type - can only be a TypedArray, an Array, or a number.');
    }

    return {
        handle: bufferHandle,
        size,
        type,
        normalize,
        stride,
        offset,
        /** TODO: It binds the buffer to ARRAY_BUFFER, does this still work for ELEMENT_ARRAY_BUFFER? */
        updateData(gl, data, offset = 0, usage = gl.STATIC_DRAW)
        {
            // NOTE: All vertex array objects should NOT be bound. Otherwise, it will cause weird errors.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
            const bufferTypeInfo = getBufferTypeInfo(gl, type);
            if (!(data instanceof bufferTypeInfo.TypedArray))
            {
                data = new bufferTypeInfo.TypedArray(data);
            }

            if (offset > 0)
            {
                gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
            }
            else
            {
                gl.bufferData(gl.ARRAY_BUFFER, data, usage);
            }
        }
    };
}

export function createElementBufferInfo(gl, type, data, stride = 0, offset = 0, usage = gl.STATIC_DRAW)
{
    // NOTE: Element buffer arrays can only be UNSIGNED bytes/shorts/ints.
    return createBufferInfo(gl, type, data, 1, false, stride, offset, gl.ELEMENT_ARRAY_BUFFER, usage);
}

let BUFFER_TYPE_MAP = null;
export function getBufferTypeInfo(gl, type)
{
    if (BUFFER_TYPE_MAP) return BUFFER_TYPE_MAP[type];

    BUFFER_TYPE_MAP = {
        [gl.BYTE]: {
            TypedArray: Int8Array,
            size: 1
        },
        [gl.SHORT]: {
            TypedArray: Int16Array,
            size: 2
        },
        [gl.UNSIGNED_BYTE]: {
            TypedArray: Uint8Array,
            size: 1
        },
        [gl.UNSIGNED_SHORT]: {
            TypedArray: Uint16Array,
            size: 2
        },
        [gl.FLOAT]: {
            TypedArray: Float32Array,
            size: 4
        },
        // HALF_FLOAT
    };

    return BUFFER_TYPE_MAP[type];
}
