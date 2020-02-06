
class BaseChunkLoader
{
    /** @abstract */
    async load(chunkX, chunkY) { return null; }
    /** @abstract */
    async unload(chunkX, chunkY, chunk) {}
}

function createChunkLoader(load = defaultLoad, unload = defaultUnload)
{
    return {
        load,
        unload
    };
}
async function defaultLoad(chunkX, chunkY)
{
    let result = new Chunk(chunkX, chunkY);
    let tileMap = new TileMap(result.width, result.height);
    for(let pos of tileMap.keys())
    {
        tileMap.set(pos.x, pos.y, Math.floor(Math.random() * 2));
    }
    result.setData(tileMap);
    return result;
}
async function defaultUnload(chunkX, chunkY, chunk)
{
    chunk.data.fill(0);
}

class ChunkWorld
{
    constructor(chunkLoader = createChunkLoader(), chunkSize = 16)
    {
        this.chunkLoader = chunkLoader;
        this.chunkSize = 16;

        this.chunkMap = new Map();
        this.defaultChunk = new Chunk(0, 0, this.chunkSize, this.chunkSize);
    }

    tileAt(posX, posY)
    {

    }

    chunkAt(posX, posY)
    {
        let chunkX = Math.trunc(posX / this.chunkSize);
        let chunkY = Math.trunc(posY / this.chunkSize);
        if (this.isChunkLoaded(chunkX, chunkY))
        {
            return this.getLoadedChunk(chunkX, chunkY);
        }
        else
        {
            this.loadChunk(chunkX, chunkY);
            return this.getDefaultChunk(chunkX, chunkY);
        }
    }

    async loadChunk(chunkX, chunkY, force = false)
    {
        if (this.isChunkLoaded(chunkX, chunkY))
        {
            if (force)
            {
                await this.unloadChunk(chunkX, chunkY);
            }
            else
            {
                return this.getLoadedChunk(chunkX, chunkY);
            }
        }
        
        let result = await this.chunkLoader.load(chunkX, chunkY);
        this.chunkMap.set(result.key, result);
        return result;
    }

    async unloadChunk(chunkX, chunkY)
    {
        const key = Chunk.computeKey(chunkX, chunkY);
        if (this.isChunkLoaded(chunkX, chunkY))
        {
            let chunk = this.getLoadedChunk(chunkX, chunkY);

            this.chunkMap.delete(key);
            await this.chunkLoader.unload(chunkX, chunkY, chunk);
        }
    }

    isChunkLoaded(chunkX, chunkY)
    {
        const key = Chunk.computeKey(chunkX, chunkY);
        return this.chunkMap.has(key);
    }

    getLoadedChunk(chunkX, chunkY)
    {
        const key = Chunk.computeKey(chunkX, chunkY);
        return this.chunkMap.get(key);
    }

    getDefaultChunk(chunkX, chunkY)
    {
        return this.defaultChunk;
    }
}

/** Dynamically loadable segments of the world. */
class Chunk
{
    static computeKey(chunkX, chunkY)
    {
        return `${chunkX},${chunkY}`;
    }

    constructor(chunkX, chunkY, width = 16, height = width)
    {
        this.key = Chunk.computeKey(chunkX, chunkY);
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.width = width;
        this.height = height;
        this.data = null;
    }

    setData(data)
    {
        this.data = data;
        return this;
    }
}
