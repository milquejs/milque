import { vec2 } from 'gl-matrix';

export const CHUNK_SIZE = 16;
export const TILE_SIZE = 16;
export const HALF_TILE_SIZE = TILE_SIZE / 2;
export const CHUNK_TILE_SIZE = CHUNK_SIZE * TILE_SIZE;
export const POS_TO_CHUNK_COORD = 1 / CHUNK_TILE_SIZE;
export const CHUNK_COORD_TO_POS = CHUNK_TILE_SIZE;

export class TileMap {
  constructor() {
    this.chunks = new Map();
    this.emptyChunk = new Chunk(0, 0);
  }

  getTile(posX, posY, posZ = 0) {
    let chunkCoordX = Math.floor(posX * POS_TO_CHUNK_COORD);
    let chunkCoordY = Math.floor(posY * POS_TO_CHUNK_COORD);
    if (!this.isChunkLoaded(chunkCoordX, chunkCoordY)) return 0;
    let chunk = this.getChunkByCoord(chunkCoordX, chunkCoordY);

    let tileCoordX = Math.round(posX / TILE_SIZE) % CHUNK_SIZE;
    let tileCoordY = Math.round(posY / TILE_SIZE) % CHUNK_SIZE;
    let tile = chunk.getTileByCoord(tileCoordX, tileCoordY);
    return tile;
  }

  async loadChunk(chunkCoordX, chunkCoordY) {
    const chunkKey = this.getChunkKey(chunkCoordX, chunkCoordY);
    if (this.chunks.has(chunkKey)) {
      return this.chunks.get(chunkKey);
    } else {
      let chunk = new Chunk(chunkCoordX, chunkCoordY);
      this.chunks.set(chunkKey, chunk);
      return chunk;
    }
  }

  isChunkLoaded(chunkCoordX, chunkCoordY) {
    const chunkKey = this.getChunkKey(chunkCoordX, chunkCoordY);
    return this.chunks.has(chunkKey);
  }

  getChunk(chunkCoordX, chunkCoordY) {
    const chunkKey = this.getChunkKey(chunkCoordX, chunkCoordY);
    return this.chunks.get(chunkKey) || this.emptyChunk;
  }

  getChunkCoord(out, posX, posY) {
    let chunkCoordX = Math.floor(posX * POS_TO_CHUNK_COORD);
    let chunkCoordY = Math.floor(posY * POS_TO_CHUNK_COORD);
    out[0] = chunkCoordX;
    out[1] = chunkCoordY;
    return out;
  }

  getChunkKey(chunkCoordX, chunkCoordY) {
    return `${chunkCoordX},${chunkCoordY}`;
  }
}

export class Chunk {
  constructor(chunkCoordX, chunkCoordY) {
    this.chunkCoordX = chunkCoordX;
    this.chunkCoordY = chunkCoordY;

    const size = CHUNK_SIZE * CHUNK_SIZE;
    this.size = size;
    this.data = {
      tiles: new Uint8Array(size),
    };
  }

  getTileByIndex(tileIndex) {
    return this.data.tiles[tileIndex];
  }

  getTileByCoord(tileCoordX, tileCoordY) {
    let tileIndex = tileCoordX + tileCoordY * CHUNK_SIZE;
    return this.getTileByIndex(tileIndex);
  }
}

/**
 * @param {FixedSpriteGLRenderer2d} renderer
 * @param {Chunk} chunk
 */
export function renderChunk(renderer, chunk, tileRenderer, opts = {}) {
  const { isTargetChunk } = opts;

  let vec = vec2.create();
  const { chunkCoordX, chunkCoordY } = chunk;
  const chunkCart = isoToCart(vec, chunkCoordX, chunkCoordY);
  renderer.pushTranslation(chunkCart[0] * TILE_SIZE, chunkCart[1] * TILE_SIZE);
  for (let i = 0; i < CHUNK_SIZE; ++i) {
    let x = i + chunkCoordX * CHUNK_SIZE;
    for (let j = 0; j < CHUNK_SIZE; ++j) {
      if (isTargetChunk) {
        renderer.color(0xaaaaaa);
      } else if (i === 0 || j === 0) {
        renderer.color(0x565656);
      } else {
        renderer.color(0x111111);
      }
      let y = j + chunkCoordY * CHUNK_SIZE;
      renderer.zLevel((-x + y) / 1000);
      isoToCart(vec, i, j);
      tileRenderer(renderer, vec[0], vec[1]);
    }
  }
  renderer.popTransform();
}

export function isoToCart(out, isoX, isoY) {
  out[0] = isoX * TILE_SIZE + isoY * TILE_SIZE;
  out[1] = isoY * HALF_TILE_SIZE - isoX * HALF_TILE_SIZE;
  return out;
}

export function cartToIso(out, cartX, cartY) {
  out[0] = Math.trunc((cartX / TILE_SIZE - cartY / HALF_TILE_SIZE) / 2);
  out[1] = Math.trunc((cartX / TILE_SIZE + cartY / HALF_TILE_SIZE) / 2);
  return out;
}

export function getTileCoord(posX, posY, posZ = 0) {
  const tileSize = 16;
  const halfTileSize = tileSize / 2;

  posX += tileSize;
  posY += halfTileSize;
  return [
    Math.trunc((posX / tileSize - posY / halfTileSize) / 2),
    Math.trunc((posX / tileSize + posY / halfTileSize) / 2),
  ];
}
