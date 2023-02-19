import * as TilePos from './TilePos.js';

export class TilePosBase {
  constructor(tileMap, x = 0, y = 0) {
    this.source = tileMap;
    this.x = x;
    this.y = y;
    this.index = x + y * tileMap.width;
  }

  copy(target) {
    TilePos.copy(this, target);
    return this;
  }

  offset(dx = 0, dy = 0) {
    TilePos.offset(this, this, dx, dy);
    return this;
  }

  left(offset = 1) {
    TilePos.left(this, this, offset);
    return this;
  }

  right(offset = 1) {
    TilePos.right(this, this, offset);
    return this;
  }

  up(offset = 1) {
    TilePos.up(this, this, offset);
    return this;
  }

  down(offset = 1) {
    TilePos.down(this, this, offset);
    return this;
  }

  next(amount = 1) {
    TilePos.next(this, this, amount);
    return this;
  }

  prev(amount = 1) {
    TilePos.prev(this, this, amount);
    return this;
  }

  hasPrev(amount = 1) {
    return TilePos.hasPrev(this, amount);
  }

  hasNext(amount = 1) {
    return TilePos.hasNext(this, amount);
  }

  withinBounds(dx = 0, dy = 0) {
    return TilePos.withinBounds(this, dx, dy);
  }
}
