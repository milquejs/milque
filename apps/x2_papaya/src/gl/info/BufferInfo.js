import { BufferBuilder } from '../buffer/BufferBuilder.js';

export function createBufferInfo(gl, buffer)
{
    return new BufferInfo(gl, buffer);
}

export class BufferInfoBuilder extends BufferBuilder
{
    constructor(gl)
    {
        super(gl);
    }

    /** @override */
    bind()
    {
        const handle = super.bind();
        return new BufferInfo(this.gl, handle);
    }
}

export class BufferInfo
{
    static from(gl)
    {
        return new BufferInfoBuilder(gl);
    }

    constructor(gl, buffer)
    {
        this.gl = gl;
        this.handle = buffer;
    }
}