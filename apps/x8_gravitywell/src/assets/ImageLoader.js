/**
 * @param {string} url The asset path.
 * @param {object} [opts] Additional options.
 * @returns {Image}
 */
export async function loadImage(url, opts = undefined)
{
    let image = new Image();
    return new Promise((resolve, reject) => {
        image.addEventListener(
            'load',
            resolve.bind(undefined, image));
        image.addEventListener(
            'error',
            reject.bind(undefined, 'Image not found.'));
        image.src = url;
    });
}
