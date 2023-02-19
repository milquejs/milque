export class TileRegistry {
  register(tileName, tile) {
    tile.name = tileName;
    return this;
  }

  unregister(tileName, tile) {
    tile.name = tileName;
    return this;
  }
}
