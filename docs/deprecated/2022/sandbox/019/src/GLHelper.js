import { getTypeInfo } from './GLTypeInfo.js';

export function createArrayBuffer(gl, type, usage, data = []) {
  const { TypedArray } = getTypeInfo(gl, type);
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  if (data instanceof TypedArray) {
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  } else {
    gl.bufferData(gl.ARRAY_BUFFER, new TypedArray(data), usage);
  }
  return {
    handle: buffer,
    type,
    target: gl.ARRAY_BUFFER,
    length: data.length,
  };
}

export function createElementArrayBuffer(gl, type, usage, data = []) {
  const { TypedArray } = getTypeInfo(gl, type);
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  if (data instanceof TypedArray) {
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, usage);
  } else {
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new TypedArray(data), usage);
  }
  return {
    handle: buffer,
    type,
    target: gl.ELEMENT_ARRAY_BUFFER,
    length: data.length,
  };
}

export function draw(gl, mode, offset, count, elements = null) {
  if (elements) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements.handle);
    gl.drawElements(mode, count, elements.type, offset);
  } else {
    gl.drawArrays(mode, offset, count);
  }
}
