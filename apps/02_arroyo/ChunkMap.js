import { BlockPos } from './BlockPos.js';
import { Block, BlockFluid, BlockAir } from './Block.js';
import { toChunkId, toChunkCoords } from './ChunkUtils.js';

export class ChunkMap
{
    constructor(left = -Infinity, top = -Infinity,
        right = Infinity, bottom = Infinity,
        chunkWidth = Number.isFinite(right - left) ? right - left : 16, chunkHeight = Number.isFinite(bottom - top) ? bottom - top : 16)
    {
        this.bounds = {
            left,
            right,
            top,
            bottom,
        };
        this.chunkWidth = chunkWidth;
        this.chunkHeight = chunkHeight;
        this.chunks = {};
    }

    clear()
    {
        this.chunks = {};
    }

    getChunkById(chunkId)
    {
        if (chunkId in this.chunks)
        {
            return this.chunks[chunkId];
        }
        else
        {
            const [chunkCoordX, chunkCoordY] = toChunkCoords(chunkId);
            let chunk = new Chunk(this, chunkId, chunkCoordX, chunkCoordY);
            this.chunks[chunkId] = chunk;
            return chunk;
        }
    }

    getChunkByCoord(chunkCoordX, chunkCoordY)
    {
        const chunkId = toChunkId(chunkCoordX, chunkCoordY);
        return this.getChunkById(chunkId);
    }

    getChunksWithinBounds(fromBlockPos, toBlockPos)
    {
        let dst = [];
        const fromChunkCoordX = fromBlockPos.chunkCoordX;
        const fromChunkCoordY = fromBlockPos.chunkCoordY;
        const toChunkCoordX = toBlockPos.chunkCoordX;
        const toChunkCoordY = toBlockPos.chunkCoordY;
        for(let chunkCoordY = fromChunkCoordY; chunkCoordY <= toChunkCoordY; ++chunkCoordY)
        {
            for(let chunkCoordX = fromChunkCoordX; chunkCoordX <= toChunkCoordX; ++chunkCoordX)
            {
                const chunkId = toChunkId(chunkCoordX, chunkCoordY);
                dst.push(this.getChunkById(chunkId));
            }
        }
        return dst;
    }

    getLoadedChunks()
    {
        let dst = [];
        for(let chunkId of Object.keys(this.chunks))
        {
            let chunk = this.chunks[chunkId];
            dst.push(chunk);
        }
        return dst;
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

export class Chunk
{
    constructor(chunkManager, chunkId, chunkCoordX, chunkCoordY)
    {
        const width = chunkManager.chunkWidth;
        const height = chunkManager.chunkHeight;

        this.chunkWidth = width;
        this.chunkHeight = height;

        this.chunkId = chunkId;
        this.chunkCoordX = chunkCoordX;
        this.chunkCoordY = chunkCoordY;

        this.data = new ChunkData(width, height);
    }
}

export class ChunkData
{
    constructor(width, height)
    {
        const length = width * height;
        this.block = new Uint8Array(length).fill(0);
        this.meta = new Uint8Array(length).fill(0);
        this.neighbor = new Uint8Array(length).fill(0b1111);
    }
}
