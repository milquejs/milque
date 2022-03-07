import { BLOCK_UPDATE_EVENT } from '../WorldEvents.js';
import { BLOCKS } from '../BlockRegistry.js';
import { FLUID_COMPONENT } from '../fluid/FluidSystem.js';

import { placeBlock } from '../placement/PlacementSystem.js';

export const HYDRATABLE_COMPONENT = 'hydratable';
export const MAX_HYDRATE_LEVELS = 1;

const AIR_BLOCK_ID = 0;

export function initialize(world) {
  // TODO: Fix this.
  // world.on(BLOCK_UPDATE_EVENT, onBlockUpdate);
}

function onBlockUpdate(world, chunk, blockPos) {
  const worldMap = world.map;
  let fluidPos = blockPos.clone();
  let blockId = worldMap.getBlockId(blockPos);
  if (BLOCKS.hasComponent(HYDRATABLE_COMPONENT, blockId)) {
    let blockMeta = worldMap.getBlockMeta(blockPos);
    if (blockMeta < MAX_HYDRATE_LEVELS) {
      blockPos.right(fluidPos);
      if (tryHydrateFromFluid(world, blockPos, fluidPos, blockMeta)) return;

      blockPos.left(fluidPos);
      if (tryHydrateFromFluid(world, blockPos, fluidPos, blockMeta)) return;

      blockPos.up(fluidPos);
      if (tryHydrateFromFluid(world, blockPos, fluidPos, blockMeta)) return;

      blockPos.down(fluidPos);
      if (tryHydrateFromFluid(world, blockPos, fluidPos, blockMeta)) return;
    }
  }
}

function tryHydrateFromFluid(world, blockPos, fluidPos, blockMeta) {
  const worldMap = world.map;
  let fluidBlockId = worldMap.getBlockId(fluidPos);
  if (BLOCKS.hasComponent(FLUID_COMPONENT, fluidBlockId)) {
    let fluidMeta = worldMap.getBlockMeta(fluidPos);
    let total = blockMeta + fluidMeta;
    if (total > MAX_HYDRATE_LEVELS) {
      let remainder = MAX_HYDRATE_LEVELS - blockMeta;
      let newFluidMeta = fluidMeta - remainder;
      worldMap.setBlockMeta(blockPos, MAX_HYDRATE_LEVELS);
      worldMap.setBlockMeta(fluidPos, newFluidMeta);
      return true;
    } else {
      worldMap.setBlockMeta(blockPos, total);
      placeBlock(world, fluidPos, AIR_BLOCK_ID);
    }
  }
  return false;
}
