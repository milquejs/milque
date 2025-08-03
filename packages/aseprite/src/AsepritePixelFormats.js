/** @typedef {AsepritePixelFormats[keyof AsepritePixelFormats]} AsepritePixelFormat */

export const AsepritePixelFormats = /** @type {const} */ ({
  RGBA: 1,
  GRAYSCALE: 2,
  INDEXED: 3,
});

/**
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
export function countPixelFormatBytesPerPixel(pixelFormat) {
  switch(pixelFormat) {
    case AsepritePixelFormats.RGBA:
      return 4;
    case AsepritePixelFormats.GRAYSCALE:
      return 2;
    case AsepritePixelFormats.INDEXED:
      return 1;
    default:
      throw new Error(`Unsupported image pixel format "${pixelFormat}".`);
  }
}

/**
 * @param {number} colorDepth
 */
export function getPixelFormatFromColorDepth(colorDepth) {
  if (colorDepth === 32) return AsepritePixelFormats.RGBA;
  if (colorDepth === 16) return AsepritePixelFormats.GRAYSCALE;
  if (colorDepth === 8) return AsepritePixelFormats.INDEXED;
  throw new Error(`Unsupported color depth "${colorDepth}" for image pixel format.`);
}
