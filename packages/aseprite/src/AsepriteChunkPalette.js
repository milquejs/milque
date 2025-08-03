import { rgba } from '@milquejs/color';
import { readAsepriteStringBytes } from './AsepriteBytesHelper';
import { ByteReader } from './ByteReader';

/**
 * @param {ByteReader} data 
 * @param {TextDecoder} textDecoder
 */
export function readAsepriteChunkPalette(data, textDecoder) {
  /** @type {Array<AsepritePaletteColor>} */
  let colors = [];
  const paletteSize = data.nextDoubleWord();
  const firstColor = data.nextDoubleWord();
  const lastColor = data.nextDoubleWord();
  data.skipBytes(8); // Zeroes (for future)
  for(let i = 0; i < paletteSize; ++i) {
    const flags = data.nextWord();
    const red = data.nextByte();
    const green = data.nextByte();
    const blue = data.nextByte();
    const alpha = data.nextByte();
    let name;
    if (flags === 1) {
      name = readAsepriteStringBytes(data, textDecoder);
    }
    let color = createAsepritePaletteColor(red, green, blue, alpha, name);
    colors.push(color);
  }
  return {
    /** Number of color entries. */
    paletteSize,
    /** Index of the first color to change. */
    firstColor,
    /** Index of the last color to change. */
    lastColor,
    colors,
  };
}

/** @typedef {ReturnType<createAsepritePaletteColor>} AsepritePaletteColor */

/**
 * @param {number} red
 * @param {number} green 
 * @param {number} blue
 * @param {number} alpha
 * @param {string} [name]
 */
function createAsepritePaletteColor(red, green, blue, alpha, name = 'none') {
  return {
    name,
    value: rgba.fromBytes(red, green, blue, alpha),
  };
}
