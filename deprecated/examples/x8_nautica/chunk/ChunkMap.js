/**
 * @version 1.0.0
 * # Changelog
 * ## 1.0.0
 * - Created ChunkMap
 */
export class ChunkMap
{
    static computeKey(chunkX, chunkY)
    {
        return `${chunkX},${chunkY}`;
    }

    static parseKey(key)
    {
        let separator = key.indexOf(',');
        return [
            Number.parseInt(separator.substring(0, separator)),
            Number.parseInt(separator.substring(separator + 1))
        ];
    }

    constructor(chunkLoader)
    {
        this.loader = chunkLoader;
        this.loadedChunks = new Map();
        this.loadingChunks = new Map();
    }

    async load(chunkX, chunkY)
    {
        let key = ChunkMap.computeKey(chunkX, chunkY);
        let result;
        if (this.loadingChunks.has(key))
        {
            result = this.loadingChunks.get(key);
        }
        else
        {
            result = this.loader
                .load(chunkX, chunkY)
                .then(() => this.loadingChunks.delete(key));
            this.loadingChunks.set(key, result);
        }
        return await result;
    }

    async unload(chunkX, chunkY)
    {
        let key = ChunkMap.computeKey(chunkX, chunkY);
        if (this.loadedChunks.has(key))
        {
            let chunk = this.loadedChunks.get(key);
            this.loadedChunks.delete(key);
            await this.loader.unload(chunkX, chunkY, chunk);
            return true;
        }
        return false;
    }

    async unloadAll()
    {
        for(let [key, chunk] of this.loadedChunks.entries())
        {
            let [chunkX, chunkY] = ChunkMap.parseKey(key);
            this.loadedChunks.delete(key);
            await this.loader.unload(chunkX, chunkY, chunk);
        }
    }

    get(chunkX, chunkY)
    {
        return this.loadedChunks.get(ChunkMap.computeKey(chunkX, chunkY));
    }
    
    has(chunkX, chunkY)
    {
        return this.loadedChunks.has(ChunkMap.computeKey(chunkX, chunkY));
    }

    keys()
    {
        return this.loadedChunks.keys();
    }

    values()
    {
        return this.loadedChunks.values();
    }

    entries()
    {
        return this.loadedChunks.entries();
    }
}
