import * as PlacementEvents from './PlacementEvents.js';
import * as NeighborBehavior from '../NeighborBehavior.js';
import { BLOCKS } from '../BlockRegistry.js';
import { FLUID_COMPONENT, AIR_COMPONENT } from '../fluid/FluidSystem.js';

export const SOLID_COMPONENT = 'solid';

export function initialize(world) {
  // Do nothing.
}

export function placeBlock(world, blockPos, blockId, blockMeta = 0) {
  const prevBlockId = world.map.getBlockId(blockPos);
  const isNextFluid = BLOCKS.hasComponent(FLUID_COMPONENT, blockId);

  // Break the previous block, as long as the next block is NOT a fluid.
  if (!isNextFluid) {
    PlacementEvents.emitBreakEvent(world, blockPos, prevBlockId);

    const isPrevFluid = BLOCKS.hasComponent(FLUID_COMPONENT, prevBlockId);
    if (!isPrevFluid) {
      NeighborBehavior.onBlockBreak(world, blockPos, prevBlockId);
    }
  } else if (!BLOCKS.hasComponent(AIR_COMPONENT, prevBlockId)) {
    // If it IS a fluid, then it should not replace anything but AIR.
    return;
  }

  world.map.setBlockId(blockPos, blockId);
  world.map.setBlockMeta(blockPos, blockMeta);

  if (!isNextFluid) {
    NeighborBehavior.onBlockPlace(world, blockPos, blockId);
  }
  PlacementEvents.emitPlaceEvent(world, blockPos, blockId);
}
