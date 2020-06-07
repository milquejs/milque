import { SimpleRandomGenerator } from '../generators/SimpleRandomGenerator.js';

export const TILE_SIZE = 10;
export const CHUNK_SIZE = 16;
export const CHUNK_DATA_LENGTH = CHUNK_SIZE * CHUNK_SIZE;
export const MAX_CHUNK_IDLE_TIME = 10_000; // 10 seconds.

export function renderTileMap(ctx, tileMap, left, top, right, bottom)
{
    let renderedChunks = tileMap.chunksWithin([], left, top, right, bottom, false);

    for(let chunk of renderedChunks)
    {
        ctx.translate(chunk.x, chunk.y);
        renderChunk(ctx, chunk);
        ctx.translate(-chunk.x, -chunk.y);
    }
}

export function renderChunk(ctx, chunk)
{
    for(let y = 0; y < CHUNK_SIZE; ++y)
    {
        for(let x = 0; x < CHUNK_SIZE; ++x)
        {
            let i = x + y * CHUNK_SIZE;
            let value = chunk.getTile(i);
            renderTile(ctx, value);

            ctx.translate(TILE_SIZE, 0);
        }

        // Return to start of next row.
        ctx.translate(-CHUNK_SIZE * TILE_SIZE, TILE_SIZE);
    }

    // Return to origin.
    ctx.translate(0, -CHUNK_SIZE * TILE_SIZE);
}

export function renderTile(ctx, value)
{
    switch(value)
    {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            ctx.fillStyle = 'white';
            break;
        case 6:
        case 7:
        case 8:
            ctx.fillStyle = 'gray';
            break;
        case 9:
            ctx.fillStyle = 'dodgerblue';
            break;
        default:
            return;
    }

    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
}

export class ChunkLoader
{
    constructor(world, chunkConstructor, maxChunkIdleTime = MAX_CHUNK_IDLE_TIME)
    {
        this.world = world;
        this.chunkConstructor = chunkConstructor;
        this.chunksLoaded = new Map();

        this.maxChunkIdleTime = maxChunkIdleTime;

        this._isLoading = new Set();
        this._lastActiveTimes = new Map();
    }

    hasChunk(chunkX, chunkY)
    {
        const chunkId = this.getChunkId(chunkX, chunkY);
        return this.chunksLoaded.has(chunkId);
    }
    
    getChunk(chunkX, chunkY, forceLoad = true)
    {
        const chunkId = this.getChunkId(chunkX, chunkY);
        if (this.chunksLoaded.has(chunkId))
        {
            return this.chunksLoaded.get(chunkId);
        }
        else if (forceLoad)
        {
            let chunk = new (this.chunkConstructor)(chunkId, chunkX, chunkY);
            this._loadChunk(this.world, chunkId, chunk);
            return chunk;
        }
        else
        {
            return null;
        }
    }

    async loadChunk(chunkX, chunkY)
    {
        const chunkId = this.getChunkId(chunkX, chunkY);
        if (this.chunksLoaded.has(chunkId))
        {
            return this.chunksLoaded.get(chunkId);
        }
        else
        {
            let chunk = new (this.chunkConstructor)(chunkId, chunkX, chunkY);
            await this._loadChunk(this.world, chunkId, chunk);
            return chunk;
        }
    }

    unloadChunk(chunkX, chunkY)
    {
        const chunkId = this.getChunkId(chunkX, chunkY);
        if (this.chunksLoaded.has(chunkId))
        {
            let chunk = this.chunksLoaded.get(chunkId);
            this._unloadChunk(this.world, chunkId, chunk);
        }
    }

    async _loadChunk(world, chunkId, chunk)
    {
        this._unloadIdleChunks(world);

        this._isLoading.add(chunkId);
        this.chunksLoaded.set(chunkId, chunk);

        await this.chunkConstructor.loadChunkData(chunk)
            .then(() => {
                this._isLoading.delete(chunkId);
                chunk.onChunkLoaded(world);
            })
            .catch(() => {
                this._unloadChunk(world, chunkId, chunk);
            });
        return chunk;
    }

    _unloadChunk(world, chunkId, chunk)
    {
        this.chunksLoaded.delete(chunkId);
        
        chunk.onChunkUnloaded(world);

        this._lastActiveTimes.delete(chunkId);
    }

    _unloadIdleChunks(world)
    {
        const maxChunkIdleTime = this.maxChunkIdleTime;
        const currentChunkTime = this.chunkConstructor.getCurrentChunkTime(world);
        
        for(let chunk of this.chunksLoaded.values())
        {
            if (this._isLoading.has(chunk.chunkId)) continue;
            if (currentChunkTime - chunk.lastActiveTime >= maxChunkIdleTime)
            {
                this._unloadChunk(world, chunk.chunkId, chunk);
            }
        }
    }

    markActive(chunk)
    {
        this._lastActiveTimes.set(chunk.chunkId, this.chunkConstructor.getCurrentChunkTime(this.world));
    }

    isChunkLoading(chunk)
    {
        return this._isLoading.has(chunk.chunkId);
    }

    isChunkIdle(chunk)
    {
        const chunkId = chunk.chunkId;
        if (this._lastActiveTimes.has(chunkId))
        {
            let idleTime = this.chunkConstructor.getCurrentChunkTime(this.world) - this._lastActiveTimes.get(chunkId);
            return idleTime >= this.maxChunkIdleTime;
        }
        else
        {
            return true;
        }
    }

    getChunks()
    {
        return this.chunksLoaded.values();
    }

    getChunkId(chunkX, chunkY)
    {
        return (chunkX << 16) + chunkY;
    }
}

export class TileMap
{
    constructor(world = undefined, chunkConstructor = Chunk)
    {
        this.world = world;
        
        this.chunkLoader = new ChunkLoader(world, chunkConstructor);
    }

    tileAt(x, y, forceLoad = true)
    {
        let chunk = this.chunkAt(x, y, forceLoad);
        let tileX = ((x - chunk.x) / TILE_SIZE) % CHUNK_SIZE;
        let tileY = ((y - chunk.y) / TILE_SIZE) % CHUNK_SIZE;
        let index = tileX + tileY * CHUNK_SIZE;
        return chunk.getTile(index);
    }

    chunkAt(x, y, forceLoad = true)
    {
        let chunkX = Math.floor((x / TILE_SIZE) / CHUNK_SIZE);
        let chunkY = Math.floor((y / TILE_SIZE) / CHUNK_SIZE);
        return this.chunkLoader.getChunk(chunkX, chunkY, forceLoad);
    }

    chunksWithin(out, left, top, right, bottom, forceLoad = true)
    {
        const CHUNK_TILE_SIZE = CHUNK_SIZE * TILE_SIZE;
        left = Math.floor(left / CHUNK_TILE_SIZE) * CHUNK_TILE_SIZE;
        top = Math.floor(top / CHUNK_TILE_SIZE) * CHUNK_TILE_SIZE;
        for(let y = top; y < bottom; y += CHUNK_TILE_SIZE)
        {
            for(let x = left; x < right; x += CHUNK_TILE_SIZE)
            {
                let chunk = this.chunkAt(x, y, forceLoad);
                if (chunk)
                {
                    out.push(chunk);
                }
            }
        }
        return out;
    }

    markActiveWithin(left, top, right, bottom, forceLoad = true)
    {
        let activeChunks = this.chunksWithin([], left, top, right, bottom, forceLoad);
        for(let chunk of activeChunks)
        {
            this.chunkLoader.markActive(chunk);
        }
    }
}

export class Chunk
{
    static async loadChunkData(chunk)
    {
        const rand = new SimpleRandomGenerator(chunk.chunkId);
        for(let i = 0; i < CHUNK_DATA_LENGTH; ++i)
        {
            chunk.data.tiles[i] = Math.floor(rand.next() * 10);
        }
    }

    static getCurrentChunkTime(world)
    {
        return Date.now();
    }

    constructor(chunkId, chunkX, chunkY)
    {
        this.chunkId = chunkId;
        this.chunkX = chunkX;
        this.chunkY = chunkY;

        this.x = chunkX * CHUNK_SIZE * TILE_SIZE;
        this.y = chunkY * CHUNK_SIZE * TILE_SIZE;

        this.data = {
            tiles: new Uint8Array(CHUNK_DATA_LENGTH).fill(0),
        };
    }

    /** @abstract */
    onChunkLoaded(world) {}

    /** @abstract */
    onChunkUnloaded(world) {}

    setTile(index, value)
    {
        this.data.tiles[index] = value;
    }
    
    getTile(index)
    {
        return this.data.tiles[index];
    }
}
