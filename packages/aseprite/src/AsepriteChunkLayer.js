import { readAsepriteStringBytes } from './AsepriteBytesHelper';
import { ByteReader } from './ByteReader';

/** @typedef {AsepriteBlendModes[keyof AsepriteBlendModes]} AsepriteBlendMode */

export const AsepriteBlendModes = /** @type {const} */ ({
  NORMAL: 0,
  MULTIPLY: 1,
  SCREEN: 2,
  OVERLAY: 3,
  DARKEN: 4,
  LIGHTEN: 5,
  COLOR_DODGE: 6,
  COLOR_BURN: 7,
  HARD_LIGHT: 8,
  SOFT_LIGHT: 9,
  DIFFERENCE: 10,
  EXCLUSION: 11,
  HUE: 12,
  SATURATION: 13,
  COLOR: 14,
  LUMINOSITY: 15,
  ADDITION: 16,
  SUBTRACT: 17,
  DIVIDE: 18
});

export const AsepriteLayerFlags = /** @type {const} */ ({
  VISIBLE: 1,
  EDITABLE: 2,
  LOCK_MOVEMENT: 4,
  BACKGROUND: 8,
  PREFER_LINKED_CELS: 16,
  COLLAPSED_LAYER_GROUP: 32,
  IS_REFERENCE_LAYER: 64
});

/**
 * @param {ByteReader} data 
 * @param {TextDecoder} textDecoder
 */
export function readAsepriteChunkLayer(data, textDecoder) {
  const flags = data.nextWord();
  const layerType = data.nextWord();
  const childLevel = data.nextWord();
  data.nextWord(); // Ignored (default layer width in pixels)
  data.nextWord(); // Ignored (default layer height in pixels)
  const blendMode = /** @type {AsepriteBlendMode} */ (data.nextWord());
  const opacity = data.nextByte();
  data.skipBytes(3); // Zeroes (for future)
  const layerName = readAsepriteStringBytes(data, textDecoder);
  let tilesetIndex = 0;
  if (layerType === 2) {
    tilesetIndex = data.nextDoubleWord();
  }
  return {
    flags,
    layerType,
    childLevel,
    blendMode,
    opacity,
    layerName,
    tilesetIndex,
  };
}
