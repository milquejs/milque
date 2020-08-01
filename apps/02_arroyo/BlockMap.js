import { Block, BlockFluid, BlockAir } from './Block.js';
import { BlockPos } from './BlockPos.js';

export class BlockMap
{
    constructor(width, height)
    {
        this.chunkWidth = width;
        this.chunkHeight = height;
        
        const length = width * height;
        this.data = {
            block: new Uint8Array(length).fill(0),
            meta: new Uint8Array(length).fill(0),
            neighbor: new Uint8Array(length).fill(0b1111),
        };
    }

    placeBlock(x, y, block)
    {
        let pos = this.at(x, y);
        if (!(block instanceof BlockFluid))
        {
            let prevBlockId = this.getBlockId(pos);
            let prevBlock = Block.getBlock(prevBlockId);
            prevBlock.onBlockBreak(this, pos);
        }
        else
        {
            let prevBlockId = this.getBlockId(pos);
            let prevBlock = Block.getBlock(prevBlockId);
            if (!(prevBlock instanceof BlockAir))
            {
                return this;
            }
        }
        this.setBlockId(pos, block.blockId);
        block.onBlockPlace(this, pos);
        return this;
    }

    isWithinBounds(blockPos)
    {
        if (!blockPos) return false;
        const { x, y } = blockPos;
        return (x <= this.chunkWidth)
            && (x > 0)
            && (y <= this.chunkHeight)
            && (y > 0);
    }

    getBlockId(blockPos)
    {
        return this.data.block[blockPos.index];
    }

    getBlockMeta(blockPos)
    {
        return this.data.meta[blockPos.index];
    }

    getBlockNeighbor(blockPos)
    {
        return this.data.neighbor[blockPos.index];
    }

    setBlockId(blockPos, value)
    {
        this.data.block[blockPos.index] = value;
        return this;
    }
    
    setBlockMeta(blockPos, value)
    {
        this.data.meta[blockPos.index] = value;
        return this;
    }

    setBlockNeighbor(blockPos, value)
    {
        this.data.neighbor[blockPos.index] = value;
        return this;
    }

    at(x, y)
    {
        return new BlockPos(this).set(x, y);
    }
}
