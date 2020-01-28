import { ChunkMap } from './ChunkMap.js';

export class ChunkHandler
{
    constructor()
    {
        this.chunkMaps = new Map();
        this.loadedChunks = new Map();
        this.defaultChunk = null;
    }

    setDefaultChunk(chunk)
    {
        this.defaultChunk = chunk;
        return this;
    }

    addChunkLoader(chunkLoader)
    {
        this.chunkMaps.set(chunkLoader, new ChunkMap(chunkLoader));
        return this;
    }
    
    removeChunkLoader(chunkLoader)
    {
        if (this.chunkMaps.has(chunkLoader))
        {
            let chunkMap = this.chunkMaps.get(chunkLoader);
            this.chunkMaps.delete(chunkLoader);

            for(let key of chunkMap.keys())
            {
                this.loadedChunks.delete(key);
            }

            // NOTE: Although this is asynchronous, it is already removed from the
            // manager and therefore we can safely assume that we don't need to depend
            // on its outcome since there is no way to reach it.
            chunkMap.unloadAll();
        }
        return this;
    }

    getChunk(chunkX, chunkY)
    {
        let key = ChunkMap.computeKey(chunkX, chunkY);
        if (this.loadedChunks.has(key))
        {
            return this.loadedChunks.get(key);
        }
        else
        {
            return this.defaultChunk;
        }
    }

    async getLoadedChunk(chunkX, chunkY)
    {
        let key = ChunkMap.computeKey(chunkX, chunkY);
        if (this.loadedChunks.has(key))
        {
            return this.loadedChunks.get(key);
        }
        else
        {
            return await this.loadChunk(chunkX, chunkY);
        }
    }

    async loadChunk(chunkX, chunkY)
    {
        let result = null;
        for(let chunkMap of this.chunkMaps.values())
        {
            let result = await chunkMap.load(chunkX, chunkY);
            if (result)
            {
                this.loadedChunks.set(ChunkMap.computeKey(chunkX, chunkY), result);
                break;
            }
        }
        return result;
    }

    async unloadChunk(chunkX, chunkY)
    {
        let result = null;
        for(let chunkMap of this.chunkMaps.values())
        {
            let result = await chunkMap.unload(chunkX, chunkY);
            if (result)
            {
                this.loadedChunks.delete(ChunkMap.computeKey(chunkX, chunkY));
                break;
            }
        }
        return result;
    }

    isChunkLoaded(chunkX, chunkY)
    {
        let key = ChunkMap.computeKey(chunkX, chunkY);
        return this.loadedChunks.has(key);
    }
}
