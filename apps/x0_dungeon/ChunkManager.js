import { SimpleRandomGenerator, PriorityQueue } from './lib.js';

export const TILE_SIZE = 10;
export const CHUNK_SIZE = 16;
export const CHUNK_DATA_LENGTH = CHUNK_SIZE * CHUNK_SIZE;

export class ChunkManager
{
    static getCurrentChunkTime(world)
    {
        return Date.now();
    }

    constructor()
    {
        this.chunkLoaders = new PriorityQueue(comparePrioritizedChunkLoader);

        this._chunks = new Map();
        this._chunkOwners = new Map();
        
        this._lastActiveTimes = new Map();
        this._loadingChunkIds = new Set();
    }

    addChunkLoader(chunkLoader, priority = Infinity)
    {
        this.chunkLoaders.push(createPrioritizedChunkLoader(chunkLoader, priority));
        return this;
    }

    clearChunkLoaders()
    {
        this.chunkLoaders.clear();
    }

    async loadChunk(world, chunkId, chunkX, chunkY)
    {
        for(let { chunkLoader } of this.chunkLoaders)
        {
            if (chunkLoader.isValidChunk(chunkId))
            {
                let chunk = chunkLoader.createChunk(world, chunkId, chunkX, chunkY);
                await this.performChunkLoading(world, chunkLoader, chunkId, chunk);
                return result;
            }
        }
        return null;
    }

    loadChunkImmediately(world, chunkId, chunkX, chunkY)
    {
        for(let { chunkLoader } of this.chunkLoaders)
        {
            if (chunkLoader.isValidChunk(chunkId))
            {
                let chunk = chunkLoader.createChunk(world, chunkId, chunkX, chunkY);
                this.performChunkLoading(world, chunkLoader, chunkId, chunk);
                return chunk;
            }
        }
        return null;
    }

    /** @private */
    async performChunkLoading(world, chunkLoader, chunkId, chunk)
    {
        this.unloadIdleChunks(world);

        this._loadingChunkIds.add(chunkId);

        this._chunks.set(chunkId, chunk);
        this._chunkOwners.set(chunkId, chunkLoader);
        

        try
        {
            await chunkLoader.loadChunkData(world, chunk);
            this._loadingChunkIds.delete(chunkId);
            return chunk;
        }
        catch(e)
        {
            this.unloadChunk(world, chunkId);
            throw new Error(`Unable to load chunk ${chunkId} at chunk coords (${chunk.chunkX},${chunk.chunkY}) - ${e.message}`);
        }
    }

    unloadChunk(world, chunkId)
    {
        if (this._chunks.has(chunkId))
        {
            let chunkLoader = this._chunkOwners.get(chunkId);
            let chunk = this._chunks.get(chunkId);

            this._chunkOwners.delete(chunkId);
            this._chunks.delete(chunkId);

            this._lastActiveTimes.delete(chunkId);
            this._loadingChunkIds.delete(chunkId);

            chunkLoader.destroyChunk(world, chunkId, chunk);
        }
    }

    unloadLoadedChunks(world)
    {
        for(let chunk of this._chunks.values())
        {
            const chunkId = chunk.chunkId;
            if (this._loadingChunkIds.has(chunkId)) continue;
            this.unloadChunk(world, chunkId);
        }
    }

    unloadIdleChunks(world)
    {
        const currentChunkTime = this.constructor.getCurrentChunkTime(world);
        
        for(let chunk of this._chunks.values())
        {
            const chunkId = chunk.chunkId;
            if (this._loadingChunkIds.has(chunkId)) continue;
            if (currentChunkTime - this._lastActiveTimes.get(chunkId) >= chunk.maxChunkIdleTime)
            {
                this.unloadChunk(world, chunkId);
            }
        }
    }

    markActive(world, chunkId)
    {
        this._lastActiveTimes.set(chunkId, this.constructor.getCurrentChunkTime(world));
    }

    /** Assumes chunk with the given chunkId is loaded. */
    isChunkLoading(chunkId)
    {
        return this._loadingChunkIds.has(chunkId);
    }

    /** Assumes chunk with the given chunkId is loaded. */
    isChunkIdle(chunkId)
    {
        if (this._lastActiveTimes.has(chunkId))
        {
            let idleTime = this.constructor.getCurrentChunkTime(world) - this._lastActiveTimes.get(chunkId);
            let chunk = this._chunks.get(chunkId);
            return idleTime >= chunk.maxChunkIdleTime;
        }
        else
        {
            return true;
        }
    }

    hasChunk(chunkId)
    {
        return this._chunks.has(chunkId);
    }
    
    getChunk(chunkId)
    {
        if (this._chunks.has(chunkId))
        {
            return this._chunks.get(chunkId);
        }
        else
        {
            return null;
        }
    }

    getChunks()
    {
        return this._chunks.values();
    }

    getChunkId(chunkX, chunkY)
    {
        return (chunkX << 16) + chunkY;
    }
}

function createPrioritizedChunkLoader(chunkLoader, priority)
{
    return {
        chunkLoader,
        priority,
    };
}

function comparePrioritizedChunkLoader(a, b)
{
    return b.priority - a.priority;
}

export class ChunkLoader
{
    constructor()
    {
        this._chunksCreated = new Map();
    }

    isValidChunk(chunkId, chunk)
    {
        return true;
    }

    createChunk(world, chunkId, chunkX, chunkY)
    {
        let chunk = new Chunk(chunkId, chunkX, chunkY, Infinity);
        this._chunksCreated.set(chunkId, chunk);
        return chunk;
    }

    async loadChunkData(world, chunk)
    {
        const rand = new SimpleRandomGenerator(chunk.chunkId);
        for(let i = 0; i < CHUNK_DATA_LENGTH; ++i)
        {
            chunk.data.tiles[i] = Math.floor(rand.next() * 10);
        }
    }

    destroyChunk(world, chunkId, chunk)
    {
        this._chunksCreated.delete(chunkId);
    }
}

export class Chunk
{
    constructor(chunkId, chunkX, chunkY, maxChunkIdleTime = Infinity)
    {
        this.chunkId = chunkId;
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.maxChunkIdleTime = maxChunkIdleTime;

        this.x = chunkX * CHUNK_SIZE * TILE_SIZE;
        this.y = chunkY * CHUNK_SIZE * TILE_SIZE;

        this.data = {
            tiles: new Uint8Array(CHUNK_DATA_LENGTH).fill(0),
        };
    }

    setTile(index, value)
    {
        this.data.tiles[index] = value;
    }
    
    getTile(index)
    {
        return this.data.tiles[index];
    }

    getTileIndex(x, y)
    {
        let tileX = Math.floor((x - this.x) / TILE_SIZE) % CHUNK_SIZE;
        let tileY = Math.floor((y - this.y) / TILE_SIZE) % CHUNK_SIZE;
        return tileX + tileY * CHUNK_SIZE;
    }
}

export function saveChunkData(chunk)
{
    let result = {};
    result.tiles = chunk.data.tiles.slice();
    result.chunkId = chunk.chunkId;
    result.chunkX = chunk.chunkX;
    result.chunkY = chunk.chunkY;
    return result;
}
