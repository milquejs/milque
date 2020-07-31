export class ChunkMap
{
    static toBlockIndex(blockX, blockY, chunkSize)
    {
        return blockX + blockY * chunkSize;
    }
    
    static toChunkId(chunkX, chunkY)
    {
        return chunkX + ',' + chunkY;
    }
    
    static toChunkPos(chunkId)
    {
        let separator = chunkId.indexOf(',');
        let chunkX = Number(chunkId.substring(1, separator));
        let chunkY = Number(chunkId.substring(separator + 1));
        return [ chunkX, chunkY ];
    }
    
    constructor(chunkSize = 16)
    {
        this.chunkSize = chunkSize;
        this.chunks = {};
    }

    placeBlock(x, y, block)
    {
        let pos = this.at(x, y);
        if (!(block instanceof BlockFluid))
        {
            let prevBlockId = pos.blockId;
            let prevBlock = Block.getBlock(prevBlockId);
            prevBlock.onBlockBreak(this, pos);
        }
        else
        {
            let prevBlockId = pos.blockId;
            let prevBlock = Block.getBlock(prevBlockId);
            if (!(prevBlock instanceof BlockAir))
            {
                return this;
            }
        }
        pos.blockId = block.blockId;
        block.onBlockPlace(this, pos);
        return this;
    }

    at(x, y)
    {
        return new BlockPos(this, x, y);
    }

    getChunkById(chunkId)
    {
        if (chunkId in this.chunks)
        {
            return this.chunks[chunkId];
        }
        else
        {
            let [ chunkX, chunkY ] = ChunkMap.toChunkPos(chunkId);
            let chunk = new Chunk(this, chunkId, chunkX, chunkY);
            this.chunks[chunkId] = chunk;
            return chunk;
        }
    }

    getChunk(chunkX, chunkY)
    {
        return this.getChunkById(ChunkMap.toChunkId(chunkX, chunkY));
    }

    getChunksWithinBounds(fromBlockPos, toBlockPos)
    {
        let dst = [];
        let fromChunkX = fromBlockPos.chunkX;
        let fromChunkY = fromBlockPos.chunkY;
        let toChunkX = toBlockPos.chunkX;
        let toChunkY = toBlockPos.chunkY;
        for(let chunkY = fromChunkY; chunkY <= toChunkY; ++chunkY)
        {
            for(let chunkX = fromChunkX; chunkX <= toChunkX; ++chunkX)
            {
                let chunkId = ChunkMap.toChunkId(chunkX, chunkY);
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
}
