/**
 * @param {string|ArrayBuffer} src
 * @param {object} [opts]
 * @param {string} [opts.imageType]
 * @returns {Promise<HTMLImageElement>}
 */
export async function ImageLoader(src, opts = undefined) {
  let { imageType = undefined } = opts || {};
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    if (typeof imageType === 'undefined') {
      let i = src.lastIndexOf('.');
      if (i < 0) {
        throw new Error('Cannot load from url - unknown image type.');
      } else {
        imageType = 'image/' + src.slice(i + 1);
      }
    }
    return ImageLoader(arrayBuffer, { ...opts, imageType });
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      `Cannot load from source - must be an ArrayBuffer or fetchable url, but got instead: ${src}`,
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  if (typeof imageType === 'undefined') {
    imageType = 'image/png';
  }
  let blob = new Blob([arrayBuffer], { type: imageType });
  let imageUrl = URL.createObjectURL(blob);
  let image = new Image();
  return new Promise((resolve, reject) => {
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.addEventListener('error', (e) => {
      reject(e);
    });
    image.src = imageUrl;
  });
}
