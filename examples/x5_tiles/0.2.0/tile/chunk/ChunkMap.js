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
        this.chunks = new Map();
    }

    async load(chunkX, chunkY)
    {
        let result = await this.loader.load(chunkX, chunkY);
        if (result)
        {
            this.chunks.set(ChunkMap.computeKey(chunkX, chunkY), result);
        }
        return result;
    }

    async unload(chunkX, chunkY)
    {
        let key = ChunkMap.computeKey(chunkX, chunkY);
        if (this.chunks.has(key))
        {
            let chunk = this.chunks.get(key);
            this.chunks.delete(key);
            await this.loader.unload(chunkX, chunkY, chunk);
            return true;
        }
        return false;
    }

    async unloadAll()
    {
        for(let [key, chunk] of this.chunks.entries())
        {
            let [chunkX, chunkY] = ChunkMap.parseKey(key);
            this.chunks.delete(key);
            await this.loader.unload(chunkX, chunkY, chunk);
        }
    }

    get(chunkX, chunkY)
    {
        return this.chunks.get(ChunkMap.computeKey(chunkX, chunkY));
    }

    set(chunkX, chunkY, chunk)
    {
        this.chunks.set(ChunkMap.computeKey(chunkX, chunkY), chunk);
    }

    has(chunkX, chunkY)
    {
        return this.chunks.has(ChunkMap.computeKey(chunkX, chunkY));
    }

    keys()
    {
        return this.chunks.keys();
    }

    values()
    {
        return this.chunks.values();
    }
}
