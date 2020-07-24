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
    onBlockBreak(blockMap, x, y, i) {}

    /** @override */
    toString()
    {
        return `${this.blockName}#${this.blockId}`;
    }
}

export class BlockAir extends Block
{
    constructor(blockName)
    {
        super(blockName, 'transparent');
    }

    /** @override */
    onBlockPlace()
    {
        // Do nothing.
    }

    /** @override */
    onBlockBreak()
    {
        // Do nothing.
    }
}

export class BlockFluid extends Block
{
    static get MAX_FLUID_LEVELS() { return 3; }

    constructor(blockName, blockColor)
    {
        super(blockName, blockColor);
    }

    /** @override */
    onBlockPlace(blockMap, x, y, i)
    {
        blockMap.meta[i] = BlockFluid.MAX_FLUID_LEVELS;
    }
}

export const NeighborBehavior = {
    onBlockPlace(blockMap, x, y, i, blockId)
    {
        let neighbor = 0b000;
        let pos = blockMap.at(x, y);
        let out = pos.copy();
        if (pos.right(out) && out.block === blockId)
        {
            neighbor |= 0b0001;
            out.neighbor |= 0b0100;
        }
        if (pos.up(out) && out.block === blockId)
        {
            neighbor |= 0b0010;
            out.neighbor |= 0b1000;
        }
        if (pos.left(out) && out.block === blockId)
        {
            neighbor |= 0b0100;
            out.neighbor |= 0b0001;
        }
        if (pos.down(out) && out.block === blockId)
        {
            neighbor |= 0b1000;
            out.neighbor |= 0b0010;
        }
        blockMap.neighbor[i] = neighbor;
    },
    onBlockBreak(blockMap, x, y, i, blockId)
    {
        let pos = blockMap.at(x, y);
        let out = pos.copy();
        if (pos.right(out) && out.block === blockId)
        {
            out.neighbor &= 0b1011;
        }
        if (pos.up(out) && out.block === blockId)
        {
            out.neighbor &= 0x0111;
        }
        if (pos.left(out) && out.block === blockId)
        {
            out.neighbor &= 0b1110;
        }
        if (pos.down(out) && out.block === blockId)
        {
            out.neighbor &= 0b1101;
        }
        blockMap.neighbor[i] = 0;
    }
};
