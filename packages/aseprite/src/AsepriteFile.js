import { ByteReader } from './ByteReader';
import { parseAsepriteChunk } from './AsepriteChunks';
import { getPixelFormatFromColorDepth } from './AsepritePixelFormats';

const HEADER_MAGIC_NUMBER = 0xa5e0;
const FRAME_HEADER_MAGIC_NUMBER = 0xf1fa;

/** @typedef {ReturnType<readAsepriteFileBytes>} AsepriteFile */

/**
 * @see https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md
 * @param {ByteReader} data 
 */
export function readAsepriteFileBytes(data) {
  const header = readAsepriteHeaderBytes(data);
  let frames = [];
  for(let i = 0; i < header.frames; ++i) {
    const frameHeader = readAsepriteFrameHeaderBytes(data);
    let chunks = [];
    for(let j = 0; j < frameHeader.chunks; ++j) {
      const chunk = readAsepriteChunkBytes(data);
      let result = parseAsepriteChunk(
        chunk.chunkType,
        chunk.chunkData,
        getPixelFormatFromColorDepth(header.colorDepth));
      chunks.push({
        chunkHeader: {
          chunkType: chunk.chunkType,
          chunkSize: chunk.chunkSize,
        },
        ...result,
      });
    }
    frames.push({
      frameHeader,
      chunks,
    });
  }
  return {
    header,
    frames,
  };
}

/**
 * @param {ByteReader} data
 */
export function readAsepriteHeaderBytes(data) {
  const fileSize = data.nextDoubleWord();
  const magicNumber = data.nextWord();
  if (magicNumber !== HEADER_MAGIC_NUMBER) {
    throw new Error('Invalid Aseprite header byte format.');
  }
  const frames = data.nextWord();
  const width = data.nextWord();
  const height = data.nextWord();
  const colorDepth = data.nextWord();
  data.nextDoubleWord(); // Layer opacity flag
  data.nextWord(); // Deprecated speed (ms) between frames
  data.nextDoubleWord(); // Zeroes
  data.nextDoubleWord(); // Zeroes
  const paletteIndex = data.nextByte();
  data.skipBytes(3); // Zeroes (ignored bytes)
  const numColors = data.nextWord();
  const pixelWidth = data.nextByte();
  const pixelHeight = data.nextByte();
  const gridX = data.nextShort();
  const gridY = data.nextShort();
  const gridWidth = data.nextWord();
  const gridHeight = data.nextWord();
  data.skipBytes(84); // Zeroes (reserved for the future)
  return {
    /** Bytes in this file. */
    fileSize,
    /** Number of frames in this file. */
    frames,
    width,
    height,
    colorDepth,
    paletteIndex,
    numColors,
    pixelWidth,
    pixelHeight,
    gridX,
    gridY,
    gridWidth,
    gridHeight,
  };
}

/**
 * @param {ByteReader} data
 */
export function readAsepriteFrameHeaderBytes(data) {
  const frameSize = data.nextDoubleWord();
  const magicNumber = data.nextWord();
  if (magicNumber !== FRAME_HEADER_MAGIC_NUMBER) {
    throw new Error('Invalid Aseprite frame header byte format.');
  }
  const oldChunks = data.nextWord(); // Old num chunks field
  const frameDuration = data.nextWord(); // In milliseconds
  data.skipBytes(2); // Zeroes (for future)
  const newChunks = data.nextDoubleWord(); // If 0, use old num chunks field
  return {
    /** Bytes in this frame. */
    frameSize,
    /** Duration of this frame in milliseconds. */
    frameDuration,
    /** Number of chunks in this frame. */
    chunks: newChunks > 0 ? newChunks : oldChunks,
  };
}

/** @typedef {ReturnType<readAsepriteChunkBytes>} AsepriteChunk */

/**
 * @param {ByteReader} data
 */
export function readAsepriteChunkBytes(data) {
  const chunkSize = data.nextDoubleWord();
  const chunkType = /** @type {import('./AsepriteChunkTypes').AsepriteChunkType} */ (data.nextWord());
  const numBytes = chunkSize - 6;
  if (numBytes < 0) {
    throw new Error('Invalid Aseprite chunk size - must be at least 6 bytes (to include chunk size and type info).');
  }
  const chunkData = data.nextBytes(numBytes);
  return {
    /** Bytes in this chunk. */
    chunkSize,
    chunkType,
    chunkData,
  };
}
