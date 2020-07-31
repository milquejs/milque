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
        blockMap.setBlockMeta(blockPos, BlockFluid.MAX_FLUID_LEVELS);
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
        let neighbor = 0b000;
        let out = blockPos.clone();
        if (blockMap.isWithinBounds(blockPos.right(out))
            && blockMap.getBlockId(out) === blockId)
        {
            neighbor |= 0b0001;
            blockMap.setBlockNeighbor(out, blockMap.getBlockNeighbor(out) | 0b0100);
        }
        if (blockMap.isWithinBounds(blockPos.up(out))
            && blockMap.getBlockId(out) === blockId)
        {
            neighbor |= 0b0010;
            blockMap.setBlockNeighbor(out, blockMap.getBlockNeighbor(out) | 0b1000);
        }
        if (blockMap.isWithinBounds(blockPos.left(out))
            && blockMap.getBlockId(out) === blockId)
        {
            neighbor |= 0b0100;
            blockMap.setBlockNeighbor(out, blockMap.getBlockNeighbor(out) | 0b0001);
        }
        if (blockMap.isWithinBounds(blockPos.down(out))
            && blockMap.getBlockId(out) === blockId)
        {
            neighbor |= 0b1000;
            blockMap.setBlockNeighbor(out, blockMap.getBlockNeighbor(out) | 0b0010);
        }
        blockMap.setBlockNeighbor(blockPos, neighbor);
    },
    onBlockBreak(blockMap, blockPos, block, blockId)
    {
        let out = blockPos.clone();
        if (blockMap.isWithinBounds(blockPos.right(out))
            && blockMap.getBlockId(out) === blockId)
        {
            blockMap.setBlockNeighbor(out, blockMap.getBlockNeighbor(out) & 0b1011);
        }
        if (blockMap.isWithinBounds(blockPos.up(out))
            && blockMap.getBlockId(out) === blockId)
        {
            blockMap.setBlockNeighbor(out, blockMap.getBlockNeighbor(out) & 0b0111);
        }
        if (blockMap.isWithinBounds(blockPos.left(out))
            && blockMap.getBlockId(out) === blockId)
        {
            blockMap.setBlockNeighbor(out, blockMap.getBlockNeighbor(out) & 0b1110);
        }
        if (blockMap.isWithinBounds(blockPos.down(out))
            && blockMap.getBlockId(out) === blockId)
        {
            blockMap.setBlockNeighbor(out, blockMap.getBlockNeighbor(out) & 0b1101);
        }
        blockMap.setBlockNeighbor(blockPos, 0);
    }
};
