export function createTextureInfo(gl)
{
    const textureHandle = gl.createTexture();
    return {
        handle: textureHandle
    };
}
