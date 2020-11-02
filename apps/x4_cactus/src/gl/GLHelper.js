import { getTypeInfo } from './GLTypeInfo.js';

export function createArrayBuffer(gl, type, data = [], usage = gl.STATIC_DRAW)
{
    const { TypedArray } = getTypeInfo(gl, type);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    if (data instanceof TypedArray)
    {
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    }
    else
    {
        gl.bufferData(gl.ARRAY_BUFFER, new TypedArray(data), usage);
    }
    return {
        handle: buffer,
        type,
        target: gl.ARRAY_BUFFER,
        length: data.length,
    };
}

export function createElementArrayBuffer(gl, data = [], usage = gl.STATIC_DRAW)
{
    const { TypedArray } = getTypeInfo(gl, gl.UNSIGNED_SHORT);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    if (data instanceof TypedArray)
    {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, usage);
    }
    else
    {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new TypedArray(data), usage);
    }
    return {
        handle: buffer,
        type: gl.UNSIGNED_SHORT,
        target: gl.ELEMENT_ARRAY_BUFFER,
        length: data.length,
    };
}

export function draw(gl, mode, offset, count, elements = null)
{
    if (elements)
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
        gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset);
    }
    else
    {
        gl.drawArrays(mode, offset, count);
    }
}
