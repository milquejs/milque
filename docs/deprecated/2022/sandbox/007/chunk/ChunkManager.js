import { Chunk, ChunkData, toChunkId, toChunkCoords } from './Chunk.js';

export class ChunkManager {
  constructor(chunkWidth, chunkHeight) {
    this.chunkWidth = chunkWidth;
    this.chunkHeight = chunkHeight;

    this.chunks = {};
  }

  clear() {
    this.chunks = {};
  }

  getChunkById(chunkId) {
    if (chunkId in this.chunks) {
      return this.chunks[chunkId];
    } else {
      const [chunkCoordX, chunkCoordY] = toChunkCoords(chunkId);
      let chunkData = new ChunkData(this.chunkWidth, this.chunkHeight);
      let chunk = new Chunk(this, chunkId, chunkCoordX, chunkCoordY, chunkData);
      this.chunks[chunkId] = chunk;
      return chunk;
    }
  }

  getChunkByCoord(chunkCoordX, chunkCoordY) {
    const chunkId = toChunkId(chunkCoordX, chunkCoordY);
    return this.getChunkById(chunkId);
  }

  getChunksWithinBounds(fromBlockPos, toBlockPos) {
    let dst = [];
    const fromChunkCoordX = fromBlockPos.chunkCoordX;
    const fromChunkCoordY = fromBlockPos.chunkCoordY;
    const toChunkCoordX = toBlockPos.chunkCoordX;
    const toChunkCoordY = toBlockPos.chunkCoordY;
    for (
      let chunkCoordY = fromChunkCoordY;
      chunkCoordY <= toChunkCoordY;
      ++chunkCoordY
    ) {
      for (
        let chunkCoordX = fromChunkCoordX;
        chunkCoordX <= toChunkCoordX;
        ++chunkCoordX
      ) {
        const chunkId = toChunkId(chunkCoordX, chunkCoordY);
        dst.push(this.getChunkById(chunkId));
      }
    }
    return dst;
  }

  getLoadedChunks() {
    let dst = [];
    for (let chunkId of Object.keys(this.chunks)) {
      let chunk = this.chunks[chunkId];
      dst.push(chunk);
    }
    return dst;
  }
}
