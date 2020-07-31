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

    onBlockPlace(blockMap, blockPos)
    {
        NeighborBehavior.onBlockPlace(blockMap, blockPos, this, this.blockId);
    }

    onBlockBreak(blockMap, blockPos)
    {
        NeighborBehavior.onBlockBreak(blockMap, blockPos, this, this.blockId);
    }

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
}

export class BlockFluid extends Block
{
    static get MAX_FLUID_LEVELS() { return 3; }

    constructor(blockName, blockColor)
    {
        super(blockName, blockColor);
    }

    /** @override */
    onBlockPlace(blockMap, blockPos)
    {
        blockMap.meta[blockPos.index] = BlockFluid.MAX_FLUID_LEVELS;
    }

    /** @override */
    onBlockBreak(blockMap, blockPos)
    {
        // Do nothing.
    }
}

export const NeighborBehavior = {
    onBlockPlace(blockMap, blockPos, block, blockId)
    {
        const { x, y, index: i } = blockPos;
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
    onBlockBreak(blockMap, blockPos, block, blockId)
    {
        const { x, y, index: i } = blockPos;
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
