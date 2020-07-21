const BLOCKS = {};

export const AIR = registerBlock(0, 'transparent');
export const WATER = registerBlock(1, 'dodgerblue');
export const WATER_STABLE = registerBlock(2, 'cornflowerblue');
export const DIRT = registerBlock(3, 'saddlebrown');
export const GOLD = registerBlock(4, 'gold');
export const GRASS = registerBlock(5, 'limegreen');
export const STONE = registerBlock(6, 'slategray');

function registerBlock(blockId, blockColor)
{
    return BLOCKS[blockId] = { blockId, color: blockColor };
}

export function getBlocks()
{
    return BLOCKS;
}

export function getBlockById(blockId)
{
    return BLOCKS[blockId];
}

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
    let block = getBlockById(blockId);
    if (block)
    {
        return block.color;
    }
    else
    {
        return 'white';
    }
}
