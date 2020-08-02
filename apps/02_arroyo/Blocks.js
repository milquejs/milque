import { Block, BlockFluid, BlockAir } from './Block.js';

export const AIR = Block.registerBlock(0, new BlockAir('air'));
export const WATER = Block.registerBlock(1, new BlockFluid('water', 'dodgerblue'));
export const WATER_STABLE = Block.registerBlock(2, new Block('stableWater', 'cornflowerblue'));
export const DIRT = Block.registerBlock(3, new Block('dirt', 'saddlebrown'));
export const GOLD = Block.registerBlock(4, new Block('goldOre', 'gold'));
export const GRASS = Block.registerBlock(5, new Block('grass', 'limegreen'));
export const STONE = Block.registerBlock(6, new Block('stone', 'slategray'));

export function isBlockAir(blockId)
{
    return blockId === 0;
}

export function isBlockFluid(blockId)
{
    return blockId === 1;
}

export function isBlockSolid(blockId)
{
    return !isBlockAir(blockId) && !isBlockFluid(blockId);
}

export function getBlockColor(blockId)
{
    let block = Block.getBlock(blockId);
    if (block)
    {
        return block.blockColor;
    }
    else
    {
        return 'white';
    }
}
