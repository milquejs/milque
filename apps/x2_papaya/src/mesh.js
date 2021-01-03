import { BufferInfo } from '@milque/mogli';

export function createMesh(gl, obj)
{
    const positionBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(obj.positions)
        .build();
    const texcoordBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(obj.texcoords)
        .build();
    const normalBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(obj.normals)
        .build();
    const elementBufferInfo = BufferInfo.from(gl, gl.ELEMENT_ARRAY_BUFFER)
        .data(obj.indices)
        .build();
    const elementOffset = 0;
    const elementCount = obj.indices.length;
    return {
        position: positionBufferInfo,
        texcoord: texcoordBufferInfo,
        normal: normalBufferInfo,
        element: elementBufferInfo,
        elementOffset,
        elementCount,
    };
}
