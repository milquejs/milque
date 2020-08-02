export function createDrawInfo(programInfo, vertexArrayInfo, uniforms, drawArrayOffset = 0, drawMode = null)
{
    return {
        programInfo,
        vertexArrayInfo,
        uniforms,
        drawArrayOffset,
        drawMode
    };
}

export function draw(gl, drawInfos, sharedUniforms = {})
{
    for(const drawInfo of drawInfos)
    {
        const programInfo = drawInfo.programInfo;
        const vertexArrayInfo = drawInfo.vertexArrayInfo;
        const uniforms = drawInfo.uniforms;
        const drawArrayOffset = drawInfo.drawArrayOffset;
        const drawMode = drawInfo.drawMode || gl.TRIANGLES;

        // Prepare program...
        gl.useProgram(programInfo.handle);

        // Prepare vertex array...
        gl.bindVertexArray(vertexArrayInfo.handle);

        // Prepare shared uniforms...
        for(const [name, value] of Object.entries(sharedUniforms))
        {
            programInfo.uniform(name, value);
        }

        // Prepare uniforms...
        for(const [name, value] of Object.entries(uniforms))
        {
            programInfo.uniform(name, value);
        }

        // Depends on buffers in attributes...
        if (vertexArrayInfo.elementBuffer)
        {
            // NOTE: The offset is in BYTES, whereas drawArrayOffset is the number of elements.
            gl.drawElements(drawMode, vertexArrayInfo.elementCount, vertexArrayInfo.elementType, drawArrayOffset * vertexArrayInfo.elementBuffer.size);
        }
        else
        {
            gl.drawArrays(drawMode, drawArrayOffset, vertexArrayInfo.elementCount);
        }
    }
}
