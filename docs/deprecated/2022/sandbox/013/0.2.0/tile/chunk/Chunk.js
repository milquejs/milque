export class Chunk {
  constructor(chunkX, chunkY, layerCount) {
    this.chunkX = chunkX;
    this.chunkY = chunkY;
    this.layers = new Array(layerCount);
  }
}
