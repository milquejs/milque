import { grayscale, rgba } from '@milquejs/color';

import { ByteReader } from './ByteReader';

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder 
 */
export function readAsepriteStringBytes(data, textDecoder) {
  const numBytes = data.nextWord();
  const stringBuffer = data.nextBytes(numBytes);
  return textDecoder.decode(stringBuffer);
}

/**
 * @param {ByteReader} data
 */
export function readAsepriteRGBAPixelBytes(data) {
  const red = data.nextByte();
  const green = data.nextByte();
  const blue = data.nextByte();
  const alpha = data.nextByte();
  return rgba.fromBytes(red, green, blue, alpha);
}

/**
 * @param {ByteReader} data
 */
export function readAsepriteGrayscalePixelBytes(data) {
  const gray = data.nextByte();
  const alpha = data.nextByte();
  return grayscale.fromBytes(gray, alpha);
}

/**
 * @param {ByteReader} data
 */
export function readAsepriteIndexedPixelBytes(data) {
  const index = data.nextByte();
  return index;
}
