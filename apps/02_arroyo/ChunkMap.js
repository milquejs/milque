import { BlockPos } from './BlockPos.js';
import { Block, BlockFluid, BlockAir } from './Block.js';
import { ChunkManager } from './Chunk.js';

export class ChunkMap extends ChunkManager
{
    constructor(left = -Infinity, top = -Infinity,
        right = Infinity, bottom = Infinity,
        chunkWidth = Number.isFinite(right - left) ? right - left : 16, chunkHeight = Number.isFinite(bottom - top) ? bottom - top : 16)
    {
        super(chunkWidth, chunkHeight);

        this.bounds = {
            left,
            right,
            top,
            bottom,
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
        return (x <= this.bounds.right)
            && (x >= this.bounds.left)
            && (y <= this.bounds.bottom)
            && (y >= this.bounds.top);
    }

    isWithinLoaded(blockPos)
    {
        return blockPos.chunkId in this.chunks;
    }

    getChunk(blockPos)
    {
        return this.getChunkById(blockPos.chunkId);
    }

    getBlockId(blockPos)
    {
        return this.getChunkById(blockPos.chunkId).data.block[blockPos.index];
    }

    getBlockMeta(blockPos)
    {
        return this.getChunkById(blockPos.chunkId).data.meta[blockPos.index];
    }

    getBlockNeighbor(blockPos)
    {
        return this.getChunkById(blockPos.chunkId).data.neighbor[blockPos.index];
    }

    setBlockId(blockPos, value)
    {
        this.getChunkById(blockPos.chunkId).data.block[blockPos.index] = value;
        return this;
    }
    
    setBlockMeta(blockPos, value)
    {
        this.getChunkById(blockPos.chunkId).data.meta[blockPos.index] = value;
        return this;
    }

    setBlockNeighbor(blockPos, value)
    {
        this.getChunkById(blockPos.chunkId).data.neighbor[blockPos.index] = value;
        return this;
    }

    at(x, y)
    {
        return new BlockPos(this).set(x, y);
    }
}
