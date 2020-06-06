import { SimpleRandomGenerator } from './generators/SimpleRandomGenerator.js';

export const TILE_SIZE = 10;
export const CHUNK_SIZE = 16;
export const CHUNK_DATA_LENGTH = CHUNK_SIZE * CHUNK_SIZE;

export function toChunkId(chunkX, chunkY)
{
    return (chunkX << 16) + chunkY;
}

export function renderTileMap(ctx, tileMap, left, top, right, bottom)
{
    let renderedChunks = tileMap.chunksWithin([], left, top, right, bottom, false);
    // let renderedChunks = tileMap.loadedChunks.values();

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

export class TileMap
{
    constructor()
    {
        this.loadedChunks = new Map();

        this._loading = new Set();
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
        let chunkId = toChunkId(chunkX, chunkY);
        if (this.loadedChunks.has(chunkId))
        {
            return this.loadedChunks.get(chunkId);
        }
        else
        {
            if (forceLoad)
            {
                let chunk = new Chunk(chunkId, chunkX, chunkY);

                let promise = loadChunkData(chunk);
                promise.then(chunk => {
                    if (!this.loadedChunks.has(chunk.chunkId))
                    {
                        this.loadedChunks.set(chunk.chunkId, chunk);
                    }

                    if (this._loading.has(promise))
                    {
                        this._loading.delete(promise);
                    }
                })
                // Ignore errors.
                .catch(error => {});

                this._loading.add(promise);

                return chunk;
            }
            else
            {
                return null;
            }
        }
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

export async function loadChunkData(chunk)
{
    const rand = new SimpleRandomGenerator(chunk.chunkId);
    for(let i = 0; i < CHUNK_DATA_LENGTH; ++i)
    {
        chunk.setTile(i, Math.floor(rand.next() * 10));
    }
    return chunk;
}

export class Chunk
{
    constructor(chunkId, chunkX, chunkY, chunkData = undefined)
    {
        this.chunkId = chunkId;
        this.chunkX = chunkX;
        this.chunkY = chunkY;

        this.x = chunkX * CHUNK_SIZE * TILE_SIZE;
        this.y = chunkY * CHUNK_SIZE * TILE_SIZE;

        this.data = new Uint8Array(CHUNK_DATA_LENGTH);
        if (chunkData)
        {
            this.data.set(chunkData);
        }
        else
        {
            this.data.fill(0);
        }
    }

    setTile(index, value)
    {
        this.data[index] = value;
    }
    
    getTile(index)
    {
        return this.data[index];
    }
}
