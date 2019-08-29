export class BufferInfo
{
    constructor(gl, type, data, size, normalize = false, stride = 0, offset = 0, bufferTarget = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW)
    {
        const bufferHandle = gl.createBuffer();
        gl.bindBuffer(bufferTarget, bufferHandle);
    
        const bufferTypeInfo = getBufferTypeInfo(gl, type);
        if (!bufferTypeInfo)
        {
            throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);
        }
        const BufferTypedArray = bufferTypeInfo.TypedArray;
        if (!(data instanceof BufferTypedArray))
        {
            data = new BufferTypedArray(data);
        }
        gl.bufferData(bufferTarget, data, usage);
    
        this.handle = bufferHandle;
        this.size = size;
        this.type = type;
        this.normalize = normalize;
        this.stride = stride;
        this.offset = offset;
    }
}

export class ElementBufferInfo extends BufferInfo
{
    constructor(gl, type, data, stride = 0, offset = 0, usage = gl.STATIC_DRAW)
    {
        // NOTE: Element buffer arrays can only be UNSIGNED bytes/shorts/ints.
        super(gl, type, data, 1, false, stride, offset, gl.ELEMENT_ARRAY_BUFFER, usage);
    }
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
