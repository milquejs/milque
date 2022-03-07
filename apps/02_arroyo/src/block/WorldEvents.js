export const UPDATE_EVENT = 'update';
export const WORLD_UPDATE_EVENT = 'worldUpdate';
export const CHUNK_UPDATE_EVENT = 'chunkUpdate';
export const BLOCK_UPDATE_EVENT = 'blockUpdate';

export function emitUpdateEvent(world) {
  world.emit(UPDATE_EVENT, world);
}

export function emitWorldUpdateEvent(world) {
  world.emit(WORLD_UPDATE_EVENT, world);
}

export function emitChunkUpdateEvent(world, chunk) {
  world.emit(CHUNK_UPDATE_EVENT, world, chunk);
}

export function emitBlockUpdateEvent(world, chunk, blockPos) {
  world.emit(BLOCK_UPDATE_EVENT, world, chunk, blockPos);
}
