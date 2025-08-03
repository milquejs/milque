import { readAsepriteStringBytes } from './AsepriteBytesHelper';
import { ByteReader } from './ByteReader';

/** @typedef {AsepriteAnimationDirections[keyof AsepriteAnimationDirections]} AsepriteAnimationDirection */

export const AsepriteAnimationDirections = /** @type {const} */ ({
  FORWARD: 0,
  REVERSE: 1,
  PING_PONG: 2,
  PING_PONG_REVERSE: 3,
});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
export function readAsepriteChunkTags(data, textDecoder) {
  /** @type {Array<AsepriteTag>} */
  let tags = [];
  const numTags = data.nextWord();
  data.skipBytes(8); // Zeroes (for future)
  for(let i = 0; i < numTags; ++i) {
    const fromFrame = data.nextWord();
    const toFrame = data.nextWord();
    const direction = /** @type {AsepriteAnimationDirection} */ (data.nextByte());
    const nTimes = data.nextWord();
    data.skipBytes(6); // Zeroes (for future)
    data.skipBytes(3); // Deprecated tag color
    data.skipBytes(1); // Zeroes (extra)
    const tagName = readAsepriteStringBytes(data, textDecoder);
    tags.push(createAsepriteTag(fromFrame, toFrame, direction, nTimes, tagName));
  }
  return {
    tags,
  };
}

/** @typedef {ReturnType<createAsepriteTag>} AsepriteTag */

/**
 * @param {number} fromFrame 
 * @param {number} toFrame 
 * @param {number} direction 
 * @param {number} nTimes 
 * @param {string} tagName
 */
function createAsepriteTag(fromFrame, toFrame, direction, nTimes, tagName) {
  return {
    fromFrame,
    toFrame,
    direction,
    nTimes,
    tagName,
  };
}
