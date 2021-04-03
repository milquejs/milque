/**
 * @param {string} url The asset path.
 * @param {object} opts Additional options.
 * @param {WebGLRenderingContext} opts.gl The webgl context.
 * @returns {WebGLTexture}
 */
export function load(url, opts)
{
    const { gl } = opts;

    if (!gl)
    {
        throw new Error('Missing webgl context for texture loader.');
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
    
    let image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, handle);
        gl.texImage2D(
            gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);
        
        if (isPowerOf2(image.width) && isPowerOf2(image.height))
        {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
    };
    image.src = url;

    return handle;
}

function isPowerOf2(value)
{
    return (value & (value - 1)) == 0;
}
