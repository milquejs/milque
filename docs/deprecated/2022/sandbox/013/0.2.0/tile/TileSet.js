export class TileSet {
  constructor() {
    this._idNames = new Map();
    this._nameIds = new Map();
    this._nextAvailableTileId = 1;
  }

  add(tileName) {
    let tileId = this.getNextAvailableTileId();
    this._nameIds.set(tileName, tileId);
    this._idNames.set(tileId, tileName);
    return this;
  }

  remove(tileName) {
    let tileId = this._nameIds.get(tileName);
    this._idNames.delete(tileId);
    this._nameIds.delete(tileName);
    return this;
  }

  clear() {
    this._idNames.clear();
    this._nameIds.clear();
  }

  getTileNameById(tileId) {
    return this._idNames.get(tileId);
  }

  getTileIdByName(tileName) {
    return this._nameIds.get(tileName);
  }

  getTileIds() {
    return this._idNames.keys();
  }

  getTileNames() {
    return this._nameIds.keys();
  }

  getNextAvailableTileId() {
    return this._nextAvailableTileId++;
  }
}
