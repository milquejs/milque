import { readAsepriteStringBytes } from './AsepriteBytesHelper';
import { ByteReader } from './ByteReader';

const AsepriteTilesetFlags = /** @type {const} */ ({
  EXTERNAL_TILESET: 1,
  INCLUDED_TILESET: 2,
  NEW_EMPTY_TILE_FORMAT: 4,
  MATCH_FLIPPED_X: 8,
  MATCH_FLIPPED_Y: 16,
  MATCH_FLIPPED_DIAG: 32,
});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
export function readAsepriteChunkTileset(data, textDecoder) {
  const tilesetId = data.nextDoubleWord();
  const flags = data.nextDoubleWord();
  const numTiles = data.nextDoubleWord();
  const tileWidth = data.nextWord();
  const tileHeight = data.nextWord();
  const baseIndex = data.nextShort();
  data.skipBytes(14); // Zeroes (for future)
  const name = readAsepriteStringBytes(data, textDecoder);
  let externalTileset = null;
  if (flags & AsepriteTilesetFlags.EXTERNAL_TILESET) {
    const entryId = data.nextDoubleWord();
    const externalTilesetId = data.nextDoubleWord();
    externalTileset = {
      entryId,
      externalTilesetId,
    };
  }
  let includedTileset = null;
  if (flags & AsepriteTilesetFlags.INCLUDED_TILESET) {
    const imageSize = data.nextDoubleWord();
    const compressedPixels = data.nextBytes(imageSize);
    includedTileset = {
      compressedPixels
    };
  }
  return {
    tilesetId,
    numTiles,
    tileWidth,
    tileHeight,
    baseIndex,
    name,
    externalTileset,
    includedTileset,
  };
}
