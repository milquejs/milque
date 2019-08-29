export class TextureInfo
{
    constructor(gl)
    {
        const textureHandle = gl.createTexture();
        this.handle = textureHandle;
    }
}
