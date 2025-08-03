import { ByteReader } from './ByteReader';

/**
 * @param {ByteReader} data
 */
export function readAsepriteChunkCelExtra(data) {
  const flags = data.nextDoubleWord();
  const posX = data.nextFixed(); // precision float
  const posY = data.nextFixed(); // precision float
  const celWidth = data.nextFixed();
  const celHeight = data.nextFixed();
  data.skipBytes(16); // Zeroes (for future)
  return {
    flags,
    posX,
    posY,
    celWidth,
    celHeight,
  };
}
