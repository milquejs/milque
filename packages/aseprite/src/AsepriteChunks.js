import { ByteReader } from './ByteReader';
import { readAsepriteChunkPalette } from './AsepriteChunkPalette';
import { readAsepriteChunkLayer } from './AsepriteChunkLayer';
import { readAsepriteChunkCel } from './AsepriteChunkCel';
import { readAsepriteChunkCelExtra } from './AsepriteChunkCelExtra';
import { readAsepriteChunkColorProfile } from './AsepriteChunkColorProfile';
import { readAsepriteChunkExternalFiles } from './AsepriteChunkExternalFiles';
import { readAsepriteChunkTags } from './AsepriteChunkTags';
import { readAsepriteChunkUserData } from './AsepriteChunkUserData';
import { readAsepriteChunkSlice } from './AsepriteChunkSlice';
import { readAsepriteChunkTileset } from './AsepriteChunkTileset';
import { AsepriteChunkTypes } from './AsepriteChunkTypes';

/**
 * @param {import('./AsepriteChunkTypes').AsepriteChunkType} chunkType 
 * @param {ArrayBuffer} chunkData
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
export function parseAsepriteChunk(chunkType, chunkData, pixelFormat) {
  const data = new ByteReader(chunkData);
  switch(chunkType) {
    case AsepriteChunkTypes.PALETTE_0004: // Skip in favor of new palette chunk
    case AsepriteChunkTypes.PALETTE_0011: // Skip in favor of new palette chunk
      return null;
    case AsepriteChunkTypes.LAYER:
      return readAsepriteChunkLayer(data, new TextDecoder());
    case AsepriteChunkTypes.CEL:
      return readAsepriteChunkCel(data, pixelFormat);
    case AsepriteChunkTypes.CEL_EXTRA:
      return readAsepriteChunkCelExtra(data);
    case AsepriteChunkTypes.COLOR_PROFILE:
      return readAsepriteChunkColorProfile(data);
    case AsepriteChunkTypes.EXTERNAL_FILE:
      return readAsepriteChunkExternalFiles(data, new TextDecoder());
    case AsepriteChunkTypes.MASK: // Deprecated
      return null;
    case AsepriteChunkTypes.PATH: // Never used
      return null;
    case AsepriteChunkTypes.TAGS:
      return readAsepriteChunkTags(data, new TextDecoder());
    case AsepriteChunkTypes.PALETTE:
      return readAsepriteChunkPalette(data, new TextDecoder());
    case AsepriteChunkTypes.USER_DATA:
      return readAsepriteChunkUserData(data, new TextDecoder());
    case AsepriteChunkTypes.SLICE:
      return readAsepriteChunkSlice(data, new TextDecoder());
    case AsepriteChunkTypes.TILESET:
      return readAsepriteChunkTileset(data, new TextDecoder());
  }
}
