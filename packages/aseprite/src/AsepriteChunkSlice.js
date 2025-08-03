import { readAsepriteStringBytes } from './AsepriteBytesHelper';
import { ByteReader } from './ByteReader';

const AsepriteSliceFlags = /** @type {const} */ ({
  HAS_9_PATCHES: 1,
  HAS_PIVOT_INFO: 2,
});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
export function readAsepriteChunkSlice(data, textDecoder) {
  const numKeys = data.nextDoubleWord();
  const flags = data.nextDoubleWord();
  data.nextDoubleWord(); // Reserved.
  const name = readAsepriteStringBytes(data, textDecoder);
  let keys = [];
  for(let i = 0; i < numKeys; ++i) {
    const frameNumber = data.nextDoubleWord();
    const originX = data.nextLong();
    const originY = data.nextLong();
    const sliceWidth = data.nextDoubleWord();
    const sliceHeight= data.nextDoubleWord();
    let ninePatch = null;
    if (flags & AsepriteSliceFlags.HAS_9_PATCHES) {
      const centerX = data.nextLong();
      const centerY = data.nextLong();
      const centerWidth = data.nextDoubleWord();
      const centerHeight = data.nextDoubleWord();
      ninePatch = {
        centerX,
        centerY,
        centerWidth,
        centerHeight,
      };
    }
    let pivot = null;
    if (flags & AsepriteSliceFlags.HAS_PIVOT_INFO) {
      const pivotX = data.nextLong();
      const pivotY = data.nextLong();
      pivot = {
        pivotX,
        pivotY,
      };
    }
    keys.push(createAsepriteSliceKey(frameNumber, originX, originY, sliceWidth, sliceHeight, ninePatch, pivot));
  }
  return {
    name,
    keys,
  };
}

/** @typedef {ReturnType<createAsepriteSliceKey>} AsepriteSliceKey */

/**
 * @param {number} frameNumber 
 * @param {number} originX 
 * @param {number} originY 
 * @param {number} sliceWidth 
 * @param {number} sliceHeight 
 * @param {{ centerX: number, centerY: number, centerWidth: number, centerHeight: number }|null} [ninePatch] 
 * @param {{ pivotX: number, pivotY: number }|null} [pivot]
 */
function createAsepriteSliceKey(frameNumber, originX, originY, sliceWidth, sliceHeight, ninePatch = null, pivot = null) {
  return {
    frameNumber,
    originX,
    originY,
    sliceWidth,
    sliceHeight,
    ninePatch,
    pivot,
  };
}
