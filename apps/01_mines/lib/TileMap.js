import { SimpleRandomGenerator } from './generators/SimpleRandomGenerator.js';

export const TILE_SIZE = 10;
export const CHUNK_SIZE = 16;
export const CHUNK_DATA_LENGTH = CHUNK_SIZE * CHUNK_SIZE;

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
    constructor(chunkConstructor)
    {
        this.chunkConstructor = chunkConstructor;
        this.chunksLoaded = new Map();
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
            await this._loadChunk(chunkId, chunk);
            return chunk;
        }
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
            this._loadChunk(chunkId, chunk);
            return chunk;
        }
        else
        {
            return null;
        }
    }

    async _loadChunk(chunkId, chunk)
    {
        chunk.loading = true;
        this.chunksLoaded.set(chunkId, chunk);
        await this.chunkConstructor.loadChunkData(chunk)
            .then(chunk => { chunk.loading = false; })
            .catch(() => this.chunksLoaded.delete(chunkId));
        return chunk;
    }

    unloadChunk(chunkX, chunkY)
    {
        const chunkId = this.getChunkId(chunkX, chunkY);
        if (this.chunksLoaded.has(chunkId))
        {
            this.chunksLoaded.delete(chunkId);
        }
    }

    isChunkLoaded(chunkX, chunkY)
    {
        const chunkId = this.getChunkId(chunkX, chunkY);
        return this.chunksLoaded.has(chunkId);
    }

    getChunkId(chunkX, chunkY)
    {
        return (chunkX << 16) + chunkY;
    }
}

export class TileMap
{
    constructor(chunkLoader = new ChunkLoader(Chunk))
    {
        this.chunkLoader = chunkLoader;
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
        return chunk;
    }

    constructor(chunkId, chunkX, chunkY)
    {
        this.chunkId = chunkId;
        this.chunkX = chunkX;
        this.chunkY = chunkY;

        this.x = chunkX * CHUNK_SIZE * TILE_SIZE;
        this.y = chunkY * CHUNK_SIZE * TILE_SIZE;

        this.loading = false;

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
}
