import * as Fluids from './Fluids.js';

const BLOCKS = {};

export class Block
{
    static getBlock(blockId)
    {
        return BLOCKS[blockId];
    }

    static getBlocks()
    {
        return Object.values(BLOCKS);
    }

    static getBlockIds()
    {
        return Object.keys(BLOCKS);
    }

    static registerBlock(id, block)
    {
        BLOCKS[id] = block;
        block.blockId = id;
        return block;
    }

    constructor(blockName, blockColor)
    {
        this.blockName = blockName;
        this.blockId = -1;

        this.blockColor = blockColor;
    }

    onBlockPlace(blockMap, x, y, i) {}

    /** @override */
    toString()
    {
        return `${this.blockName}#${this.blockId}`;
    }
}

export class BlockFluid extends Block
{
    constructor(blockName, blockColor)
    {
        super(blockName, blockColor);
    }

    /** @override */
    onBlockPlace(blockMap, x, y, i)
    {
        blockMap.meta[i] = Fluids.MAX_FLUID_LEVELS;
    }
}
