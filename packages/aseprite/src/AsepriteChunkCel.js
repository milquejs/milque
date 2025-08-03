import { countPixelFormatBytesPerPixel } from './AsepritePixelFormats';
import { ByteReader } from './ByteReader';

/** @typedef {AsepriteCelTypes[keyof AsepriteCelTypes]} AsepriteCelType */

export const AsepriteCelTypes = /** @type {const} */ ({
  RAW_IMAGE_DATA: 0,
  LINKED_CEL: 1,
  COMPRESSED_IMAGE: 2,
  COMPRESSED_TILEMAP: 3
});

/** @typedef {ReturnType<readAsepriteChunkCel>} AsepriteChunkCel */

/**
 * @param {ByteReader} data 
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
export function readAsepriteChunkCel(data, pixelFormat) {
  const layerIndex = data.nextWord();
  const posX = data.nextShort();
  const posY = data.nextShort();
  const opacityLevel = data.nextByte();
  const celType = /** @type {AsepriteCelType} */ (data.nextWord());
  const zIndex = data.nextShort();
  data.skipBytes(5); // Zeroes (for future)
  /** @type {AsepriteRawImageData|AsepriteLinkedCel|AsepriteCompressedImage|AsepriteCompressedTilemap} */
  let celData;
  switch(celType) {
    case AsepriteCelTypes.RAW_IMAGE_DATA:
      celData = readAsepriteChunkCelRawImageData(data, pixelFormat);
      break;
    case AsepriteCelTypes.LINKED_CEL:
      celData = readAsepriteChunkCelLinkedCel(data);
      break;
    case AsepriteCelTypes.COMPRESSED_IMAGE:
      celData = readAsepriteChunkCelCompressedImage(data);
      break;
    case AsepriteCelTypes.COMPRESSED_TILEMAP:
      celData = readAsepriteChunkCelCompressedTilemap(data);
      break;
    default:
      throw new Error(`Unsupported cel type "${celType}".`);
  }
  return {
    layerIndex,
    posX,
    posY,
    opacityLevel,
    celType,
    zIndex,
    celData,
  };
}

/** @typedef {ReturnType<readAsepriteChunkCelRawImageData>} AsepriteRawImageData */

/**
 * @param {ByteReader} data 
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat 
 */
function readAsepriteChunkCelRawImageData(data, pixelFormat) {
  const width = data.nextWord();
  const height = data.nextWord();
  const length = width * height;
  const bytesPerPixel = countPixelFormatBytesPerPixel(pixelFormat);
  const numBytes = bytesPerPixel * length;
  const pixelData = data.nextBytes(numBytes);
  return {
    width,
    height,
    length,
    pixelFormat,
    pixelData,
  };
}

/** @typedef {ReturnType<readAsepriteChunkCelLinkedCel>} AsepriteLinkedCel */

/**
 * @param {ByteReader} data
 */
function readAsepriteChunkCelLinkedCel(data) {
  const linkedFrame = data.nextWord();
  return {
    linkedFrame
  };
}

/** @typedef {Awaited<ReturnType<readAsepriteChunkCelCompressedImage>>} AsepriteCompressedImage */

/**
 * @param {ByteReader} data
 */
function readAsepriteChunkCelCompressedImage(data) {
  const width = data.nextWord();
  const height = data.nextWord();
  const compressedPixels = data.remainingBytes(); // zlib compressed.
  return {
    width,
    height,
    compressedPixels,
  };
}

/** @typedef {ReturnType<readAsepriteChunkCelCompressedTilemap>} AsepriteCompressedTilemap */

/**
 * @param {ByteReader} data
 */
function readAsepriteChunkCelCompressedTilemap(data) {
  const width = data.nextWord();
  const height = data.nextWord();
  const bitsPerTile = data.nextWord(); // Always 32-bits, at the moment.
  const bitmaskForTileId = data.nextDoubleWord();
  const bitmaskForFlipX = data.nextDoubleWord();
  const bitmaskForFlipY = data.nextDoubleWord();
  const bitmaskForDiagonalFlip = data.nextDoubleWord();
  data.skipBytes(10); // Reserved bytes.
  const compressedTiles = data.remainingBytes(); // zlib compressed.
  return {
    width,
    height,
    bitsPerTile,
    bitmaskForTileId,
    bitmaskForFlipX,
    bitmaskForFlipY,
    bitmaskForDiagonalFlip,
    compressedTiles,
  };
}
