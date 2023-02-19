export class TileMap {
  constructor(width, height = width, depth = 1) {
    this.data = new Array(width * height * depth);

    this.width = width;
    this.height = height;
    this.depth = depth;
    this.length = width * height;
  }

  get(tileX, tileY, layerIndex = 0) {
    return this.data[tileX + tileY * this.width + layerIndex * this.length];
  }

  set(tileX, tileY, value, layerIndex = 0) {
    this.data[tileX + tileY * this.width + layerIndex * this.length] = value;
  }

  fill(
    value,
    fromTileX = 0,
    fromTileY = 0,
    toTileX = this.width,
    toTileY = this.height,
    layerIndex = 0
  ) {
    let offset = layerIndex * this.length;
    for (let i = fromTileY; i < toTileY; ++i) {
      for (let j = fromTileX; j < toTileX; ++j) {
        this.data[j + i * this.width + offset] = value;
      }
    }
  }
}
