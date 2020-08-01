export function toChunkId(chunkCoordX, chunkCoordY)
{
    return chunkCoordX + ',' + chunkCoordY;
}

export function toChunkCoords(chunkId)
{
    let separator = chunkId.indexOf(',');
    let chunkCoordX = Number(chunkId.substring(0, separator));
    let chunkCoordY = Number(chunkId.substring(separator + 1));
    return [ chunkCoordX, chunkCoordY ];
}

export class ChunkManager
{
    constructor(chunkWidth, chunkHeight)
    {
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
            let chunkData = new ChunkData(this.chunkWidth, this.chunkHeight);
            let chunk = new Chunk(this, chunkId, chunkCoordX, chunkCoordY, chunkData);
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
}

class Chunk
{
    constructor(chunkManager, chunkId, chunkCoordX, chunkCoordY, chunkData)
    {
        this.chunkManager = chunkManager;
        this.chunkId = chunkId;
        this.chunkCoordX = chunkCoordX;
        this.chunkCoordY = chunkCoordY;
        this._data = chunkData;
    }

    get data()
    {
        return this._data;
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

// TODO: Not done yet. Should this be a chunkloader instead?
export class ChunkDataLoader
{
    constructor()
    {
        this.chunksLoading = {};
    }

    async onLoadChunkData(chunkData) {}

    async onUnloadChunkData(chunkData) {}

    createChunkData(width, height)
    {
        return new ChunkData(width, height);
    }

    async loadChunkData(chunk, chunkData)
    {
        let loading = this.onLoadChunkData(chunkData);
        this.chunksLoading[chunk.chunkId] = loading;
    }

    unloadChunkData(chunk, chunkData)
    {
        this.onUnloadChunkData(chunkData);
    }
}
