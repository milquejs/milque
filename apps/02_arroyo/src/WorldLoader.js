import { Chunk, ChunkData, toChunkCoords } from './chunk/Chunk.js';

export function loadWorld(world, worldData) {
  const chunkWidth = world.map.chunkWidth;
  const chunkHeight = world.map.chunkHeight;
  if (
    chunkWidth !== worldData.chunkWidth ||
    chunkHeight !== worldData.chunkHeight
  )
    return null;

  world.score = worldData.score || 0;
  world.cameraX = worldData.cameraX || 0;
  world.cameraY = worldData.cameraY || 0;

  const length = chunkWidth * chunkHeight;
  for (let chunkId of Object.keys(worldData.chunks)) {
    const chunkData = worldData.chunks[chunkId];
    const [chunkCoordX, chunkCoordY] = toChunkCoords(chunkId);

    let data = new ChunkData(chunkWidth, chunkHeight);
    for (let i = 0; i < length; ++i) {
      data.block[i] = chunkData.block[i];
      data.meta[i] = chunkData.meta[i];
      data.neighbor[i] = chunkData.neighbor[i];
    }
    let chunk = new Chunk(this, chunkId, chunkCoordX, chunkCoordY, data);
    world.map.chunks[chunkId] = chunk;
  }

  return world;
}

export function saveWorld(world, worldData) {
  const chunkWidth = world.map.chunkWidth;
  const chunkHeight = world.map.chunkHeight;

  worldData.score = world.score;
  worldData.cameraX = world.cameraX;
  worldData.cameraY = world.cameraY;
  worldData.chunkWidth = chunkWidth;
  worldData.chunkHeight = chunkHeight;

  let chunks = {};
  const length = chunkWidth * chunkHeight;
  for (let chunk of world.map.getLoadedChunks()) {
    const chunkId = chunk.chunkId;
    let data = {
      block: new Array(length),
      meta: new Array(length),
      neighbor: new Array(length),
    };
    for (let i = 0; i < length; ++i) {
      data.block[i] = chunk.data.block[i];
      data.meta[i] = chunk.data.meta[i];
      data.neighbor[i] = chunk.data.neighbor[i];
    }
    chunks[chunkId] = data;
  }

  worldData.chunks = chunks;
  return worldData;
}
