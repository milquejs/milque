export async function loadImage(src, imageType = undefined)
{
    if (typeof src === 'string')
    {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        if (typeof imageType === 'undefined')
        {
            let i = src.lastIndexOf('.');
            if (i < 0)
            {
                throw new Error('Cannot load from url - unknown image type.');
            }
            else
            {
                imageType = 'image/' + src.slice(i + 1);
            }
        }
        return loadImage(arrayBuffer, imageType);
    }
    else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src)))
    {
        throw new Error(
            'Cannot load from source - must be '
            + 'an array buffer or fetchable url');
    }
    /** @type {ArrayBuffer} */
    const arrayBuffer = src;
    if (typeof imageType === 'undefined')
    {
        imageType = 'image/png';
    }
    let blob = new Blob([ arrayBuffer ], { type: imageType });
    let imageUrl = URL.createObjectURL(blob);
    let image = new Image();
    return new Promise((resolve, reject) => {
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.addEventListener('error', e => {
            reject(e);
        });
        image.src = imageUrl;
    });
}
