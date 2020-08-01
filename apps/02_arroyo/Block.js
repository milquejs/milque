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

    onBlockPlace(world, blockPos)
    {
        NeighborBehavior.onBlockPlace(world, blockPos, this, this.blockId);
    }

    onBlockBreak(world, blockPos)
    {
        NeighborBehavior.onBlockBreak(world, blockPos, this, this.blockId);
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
    onBlockPlace(world, blockPos)
    {
        world.setBlockMeta(blockPos, BlockFluid.MAX_FLUID_LEVELS);
    }

    /** @override */
    onBlockBreak(world, blockPos)
    {
        // Do nothing.
    }
}

export const NeighborBehavior = {
    onBlockPlace(world, blockPos, block, blockId)
    {
        let neighbor = 0b000;
        let out = blockPos.clone();
        if (world.isWithinBounds(blockPos.right(out))
            && world.getBlockId(out) === blockId)
        {
            neighbor |= 0b0001;
            world.setBlockNeighbor(out, world.getBlockNeighbor(out) | 0b0100);
        }
        if (world.isWithinBounds(blockPos.up(out))
            && world.getBlockId(out) === blockId)
        {
            neighbor |= 0b0010;
            world.setBlockNeighbor(out, world.getBlockNeighbor(out) | 0b1000);
        }
        if (world.isWithinBounds(blockPos.left(out))
            && world.getBlockId(out) === blockId)
        {
            neighbor |= 0b0100;
            world.setBlockNeighbor(out, world.getBlockNeighbor(out) | 0b0001);
        }
        if (world.isWithinBounds(blockPos.down(out))
            && world.getBlockId(out) === blockId)
        {
            neighbor |= 0b1000;
            world.setBlockNeighbor(out, world.getBlockNeighbor(out) | 0b0010);
        }
        world.setBlockNeighbor(blockPos, neighbor);
    },
    onBlockBreak(world, blockPos, block, blockId)
    {
        let out = blockPos.clone();
        if (world.isWithinBounds(blockPos.right(out))
            && world.getBlockId(out) === blockId)
        {
            world.setBlockNeighbor(out, world.getBlockNeighbor(out) & 0b1011);
        }
        if (world.isWithinBounds(blockPos.up(out))
            && world.getBlockId(out) === blockId)
        {
            world.setBlockNeighbor(out, world.getBlockNeighbor(out) & 0b0111);
        }
        if (world.isWithinBounds(blockPos.left(out))
            && world.getBlockId(out) === blockId)
        {
            world.setBlockNeighbor(out, world.getBlockNeighbor(out) & 0b1110);
        }
        if (world.isWithinBounds(blockPos.down(out))
            && world.getBlockId(out) === blockId)
        {
            world.setBlockNeighbor(out, world.getBlockNeighbor(out) & 0b1101);
        }
        world.setBlockNeighbor(blockPos, 0);
    }
};
