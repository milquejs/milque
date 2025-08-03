import { readAsepriteStringBytes } from './AsepriteBytesHelper';
import { ByteReader } from './ByteReader';

/** @typedef {AsepriteExternalFileEntryTypes[keyof AsepriteExternalFileEntryTypes]} AsepriteExternalFileEntryType */

export const AsepriteExternalFileEntryTypes = /** @type {const} */ ({
  EXTERNAL_PALETTE: 0,
  EXTERNAL_TILESET: 1,
  PROPERTIES_EXTENSION_NAME: 2,
  TILE_MANAGER_EXTENSION_NAME: 3,
});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
export function readAsepriteChunkExternalFiles(data, textDecoder) {
  /** @type {Array<AsepriteExternalFileEntry>} */
  let entries = [];
  const numEntries = data.nextDoubleWord();
  data.skipBytes(8); // Zeroes (reserved)
  for(let i = 0; i < numEntries; ++i) {
    const entryId = data.nextDoubleWord();
    const entryType = /** @type {AsepriteExternalFileEntryType} */ (data.nextByte());
    data.skipBytes(7); // Zeroes (reserved)
    const extensionId = readAsepriteStringBytes(data, textDecoder);
    entries.push(createAsepriteExternalFileEntry(entryId, entryType, extensionId));
  }
  return {
    entries
  };
}

/** @typedef {ReturnType<createAsepriteExternalFileEntry>} AsepriteExternalFileEntry */

/**
 * @param {number} entryId 
 * @param {AsepriteExternalFileEntryType} entryType 
 * @param {string} extensionId
 */
function createAsepriteExternalFileEntry(entryId, entryType, extensionId) {
  return {
    entryId,
    entryType,
    extensionId,
  };
}
