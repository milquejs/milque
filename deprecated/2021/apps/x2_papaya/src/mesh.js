import { BufferInfo } from '@milque/mogli';

function createVertexData(gl, objData)
{
    const { positions, texcoords, normals, indices } = objData;
    const positionBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(positions)
        .build();
    const texcoordBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(texcoords)
        .build();
    const normalBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(normals)
        .build();
    const elementBufferInfo = BufferInfo.from(gl, gl.ELEMENT_ARRAY_BUFFER)
        .data(indices)
        .build();
    const elementOffset = 0;
    const elementCount = indices.length;
    let layout = {
        position: { size: 3 },
        texcoord: { size: 2 },
        normal: { size: 3 },
    };
    let buffers = {
        vertex: positionBufferInfo,
        texcoord: texcoordBufferInfo,
        normal: normalBufferInfo,
        element: elementBufferInfo,
    };
    return {
        layout,
        buffers,
        offset: elementOffset,
        count: elementCount,
    };
}

/**
 * 
 * @param {WebGLRenderingContext} gl The gl context.
 * @param {VertexData} vertexData The shared vertex data to create
 */
export function createMesh(gl, vertexData)
{
    const positionBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(vertexData.positions)
        .build();
    const texcoordBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(vertexData.texcoords)
        .build();
    const normalBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(vertexData.normals)
        .build();
    const elementBufferInfo = BufferInfo.from(gl, gl.ELEMENT_ARRAY_BUFFER)
        .data(vertexData.indices)
        .build();
    const elementOffset = 0;
    const elementCount = vertexData.indices.length;
    return {
        position: positionBufferInfo,
        texcoord: texcoordBufferInfo,
        normal: normalBufferInfo,
        element: elementBufferInfo,
        elementOffset,
        elementCount,
    };
}
