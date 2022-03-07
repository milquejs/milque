import { BLOCKS } from '../BlockRegistry.js';
import { WORLD_UPDATE_EVENT } from '../WorldEvents.js';

export const AIR_COMPONENT = 'air';
export const FALLING_COMPONENT = 'falling';

export function initialize(world) {
  world.on(WORLD_UPDATE_EVENT, onWorldUpdate);
}

// TODO: What happens if it falls in water?
// TODO: It should not update neighbor until it is stable.

function onWorldUpdate(world) {
  let sortedChunks = sortChunksByBottomFirst(world.map.getLoadedChunks());

  for (let chunk of sortedChunks) {
    updateFallingInChunk(world, chunk);
  }
}

function sortChunksByBottomFirst(chunks) {
  return chunks.sort((a, b) => {
    if (a.chunkCoordY < b.chunkCoordY) {
      return 1;
    } else if (a.chunkCoordY > b.chunkCoordY) {
      return -1;
    } else if (a.chunkCoordX < b.chunkCoordX) {
      return 1;
    } else if (a.chunkCoordX > b.chunkCoordX) {
      return -1;
    } else {
      return 0;
    }
  });
}

function updateFallingInChunk(world, chunk) {
  const worldMap = world.map;
  const chunkX = chunk.chunkCoordX * worldMap.chunkWidth;
  const chunkY = chunk.chunkCoordY * worldMap.chunkHeight;

  // Do falling physics.
  let blockPos = worldMap.at(0, 0);
  for (let y = worldMap.chunkHeight - 1; y >= 0; --y) {
    for (let x = 0; x < worldMap.chunkWidth; ++x) {
      blockPos.set(x + chunkX, y + chunkY);
      let blockId = worldMap.getBlockId(blockPos);
      if (BLOCKS.hasComponent(FALLING_COMPONENT, blockId)) {
        updateFallingBlock(world, blockPos);
      }
    }
  }
}

function updateFallingBlock(world, blockPos) {
  const worldMap = world.map;
  if (!tryFallingDown(worldMap, blockPos)) {
    // TODO: Check for stability to optimize.
  }
}

function tryFallingDown(worldMap, blockPos) {
  let toBlockPos = blockPos.copy().down();
  return fallBlock(worldMap, blockPos, toBlockPos);
}

function fallBlock(worldMap, fromBlockPos, toBlockPos) {
  if (!worldMap.isWithinBounds(toBlockPos)) return false;
  if (!worldMap.isWithinLoaded(toBlockPos)) {
    worldMap.setBlockId(fromBlockPos, 0);
    return true;
  }

  let fromBlock = worldMap.getBlockId(fromBlockPos);
  let toBlock = worldMap.getBlockId(toBlockPos);

  if (BLOCKS.hasComponent(AIR_COMPONENT, toBlock)) {
    worldMap.setBlockId(toBlockPos, fromBlock).setBlockId(fromBlockPos, 0);
    return true;
  }
}
