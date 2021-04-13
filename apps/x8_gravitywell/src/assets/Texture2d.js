export class Texture2d
{
    /**
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl)
    {
        if (!gl)
        {
            throw new Error('Missing webgl context for texture.');
        }

        let handle = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, handle);
        
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);
        gl.texImage2D(
            gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);
        
        this.gl = gl;
        this.handle = handle;

        /** @private */
        this._width = width;
        /** @private */
        this._height = height;
    }

    get width()
    {
        return this._width;
    }

    get height()
    {
        return this._height;
    }

    /**
     * @param {Image} image
     * @returns {Texture2d} Self for method-chaining.
     */
    setImage(image)
    {
        let gl = this.gl;
        let handle = this.handle;
        
        const width = image.width;
        const height = image.height;

        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        
        gl.bindTexture(gl.TEXTURE_2D, handle);
        gl.texImage2D(
            gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        if (isPowerOf2(width) && isPowerOf2(height))
        {
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        this._width = width;
        this._height = height;
        return this;
    }
}

function isPowerOf2(value)
{
    return (value & (value - 1)) == 0;
}
