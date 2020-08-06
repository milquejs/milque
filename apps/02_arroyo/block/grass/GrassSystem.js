import { Random } from '../../lib.js';
import { BLOCK_UPDATE_EVENT } from '../WorldEvents.js';
import { BLOCKS } from '../BlockRegistry.js';
import { AIR_COMPONENT } from '../fluid/FluidSystem.js';
import * as PlacementSystem from '../placement/PlacementSystem.js';

export const GRASS_SOIL_COMPONENT = 'grassSoil';
export const GRASS_BLOCK_ID = 5;

export function initialize(world)
{
    world.on(BLOCK_UPDATE_EVENT, onBlockUpdate);
}

function onBlockUpdate(world, chunk, blockPos)
{
    const worldMap = world.map;
    let blockId = worldMap.getBlockId(blockPos);
    if (BLOCKS.hasComponent(GRASS_SOIL_COMPONENT, blockId))
    {
        let upBlockId = worldMap.getBlockId(blockPos.up());
        if (BLOCKS.hasComponent(AIR_COMPONENT, upBlockId))
        {
            if (Random.next() < 0.001)
            {
                PlacementSystem.placeBlock(world, blockPos, GRASS_BLOCK_ID);
            }
        }
    }
}

