import { Chunk } from '../Chunk.js';
import { TileMap } from '../../TileMap.js';

export class DefaultChunkLoader extends ChunkLoaderBase {
  constructor(chunkWidth = 16, chunkHeight = chunkWidth) {
    this.chunkWidth = chunkWidth;
    this.chunkHeight = chunkHeight;
  }

  /** @override */
  async load(chunkX, chunkY) {
    let result = new Chunk(chunkX, chunkY, 1);
    let tileMap = new TileMap(this.chunkWidth, this.chunkHeight);
    result.layers[0] = tileMap;
    return result;
  }

  /** @override */
  async unload(chunkX, chunkY, chunk) {
    chunk.layers[0] = null;
  }
}
