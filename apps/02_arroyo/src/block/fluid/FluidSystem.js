import { Random } from '@milque/random';

import { BLOCKS } from '../BlockRegistry.js';
import { PLACE_EVENT } from '../placement/PlacementEvents.js';
import { WORLD_UPDATE_EVENT } from '../WorldEvents.js';

export const AIR_COMPONENT = 'air';
export const FLUID_COMPONENT = 'fluid';

export const MAX_FLUID_LEVELS = 3;

export function initialize(world) {
  world.on(PLACE_EVENT, onBlockPlace);
  world.on(WORLD_UPDATE_EVENT, onWorldUpdate);
}

function onBlockPlace(world, blockPos, blockId) {
  if (BLOCKS.hasComponent(FLUID_COMPONENT, blockId)) {
    world.map.setBlockMeta(blockPos, MAX_FLUID_LEVELS);
  }
}

function onWorldUpdate(world) {
  let sortedChunks = sortChunksByBottomFirst(world.map.getLoadedChunks());

  for (let chunk of sortedChunks) {
    updateFluidsInChunk(world, chunk);
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

function updateFluidsInChunk(world, chunk) {
  const worldMap = world.map;
  const chunkX = chunk.chunkCoordX * worldMap.chunkWidth;
  const chunkY = chunk.chunkCoordY * worldMap.chunkHeight;

  // Do water physics.
  let blockPos = worldMap.at(0, 0);
  for (let y = worldMap.chunkHeight - 1; y >= 0; --y) {
    for (let x = 0; x < worldMap.chunkWidth; ++x) {
      blockPos.set(x + chunkX, y + chunkY);
      let blockId = worldMap.getBlockId(blockPos);
      if (BLOCKS.hasComponent(FLUID_COMPONENT, blockId)) {
        updateFluidBlock(world, blockPos);
      }
    }
  }
}

function updateFluidBlock(world, blockPos) {
  const worldMap = world.map;
  if (
    !tryFlowWaterDown(worldMap, blockPos) &&
    !tryFlowWaterSide(worldMap, blockPos)
  ) {
    // TODO: Check for stability to optimize.
  }
}

function tryFlowWaterDown(worldMap, blockPos) {
  let toBlockPos = blockPos.copy().down();
  return flowWater(worldMap, blockPos, toBlockPos, MAX_FLUID_LEVELS);
}

function tryFlowWaterSide(worldMap, blockPos) {
  let flag = false;
  let meta = worldMap.getBlockMeta(blockPos);
  let toBlockPos = blockPos.copy();
  if (meta <= 1) {
    blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
    flag |= flowWater(worldMap, blockPos, toBlockPos, 1, false);
  } else {
    blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
    flag |= flowWater(worldMap, blockPos, toBlockPos, 1, false);
    blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
    flag |= flowWater(worldMap, blockPos, toBlockPos, 1, false);
  }
  return flag;
}

function flowWater(
  worldMap,
  fromBlockPos,
  toBlockPos,
  amount,
  allowBackflow = true
) {
  if (!worldMap.isWithinBounds(toBlockPos)) return false;
  if (!worldMap.isWithinLoaded(toBlockPos)) {
    worldMap.setBlockId(fromBlockPos, 0);
    worldMap.setBlockMeta(fromBlockPos, 0);
    return true;
  }

  let fromBlock = worldMap.getBlockId(fromBlockPos);
  let fromMeta = worldMap.getBlockMeta(fromBlockPos);
  let toBlock = worldMap.getBlockId(toBlockPos);
  let toMeta = worldMap.getBlockMeta(toBlockPos);

  if (amount > fromMeta) amount = fromMeta;

  if (BLOCKS.hasComponent(AIR_COMPONENT, toBlock)) {
    let remainder = fromMeta - amount;
    if (remainder <= 0) {
      worldMap
        .setBlockId(toBlockPos, fromBlock)
        .setBlockMeta(toBlockPos, fromMeta)
        .setBlockId(fromBlockPos, 0)
        .setBlockMeta(fromBlockPos, 0);
      return true;
    } else {
      worldMap
        .setBlockId(toBlockPos, fromBlock)
        .setBlockMeta(toBlockPos, amount)
        .setBlockMeta(fromBlockPos, remainder);
      return true;
    }
  } else if (
    BLOCKS.hasComponent(FLUID_COMPONENT, toBlock) &&
    toMeta < MAX_FLUID_LEVELS
  ) {
    if (!allowBackflow && fromMeta <= toMeta) return false;

    if (toMeta + amount <= MAX_FLUID_LEVELS) {
      worldMap.setBlockMeta(toBlockPos, toMeta + amount);

      if (amount >= fromMeta) {
        worldMap.setBlockId(fromBlockPos, 0).setBlockMeta(fromBlockPos, 0);
      } else {
        worldMap.setBlockMeta(fromBlockPos, fromMeta - amount);
      }
      return true;
    } else {
      worldMap.setBlockMeta(toBlockPos, MAX_FLUID_LEVELS);

      let remainder = amount - (MAX_FLUID_LEVELS - toMeta);
      worldMap.setBlockMeta(fromBlockPos, remainder);
      return true;
    }
  }
}
