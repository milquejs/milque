import { ChunkManager, TILE_SIZE, CHUNK_SIZE } from './ChunkManager.js';

export { TILE_SIZE, CHUNK_SIZE, CHUNK_DATA_LENGTH } from './ChunkManager.js';

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
        case 0:
            ctx.fillStyle = 'black';
            break;
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
    constructor(world)
    {
        this.world = world;
        this.chunkManager = new ChunkManager();
    }

    tileAt(x, y, forceLoad = true)
    {
        let chunk = this.chunkAt(x, y, forceLoad);
        let index = chunk.getTileIndex(x, y);
        return chunk.getTile(index);
    }

    chunkAt(x, y, forceLoad = true)
    {
        let chunkX = Math.floor((x / TILE_SIZE) / CHUNK_SIZE);
        let chunkY = Math.floor((y / TILE_SIZE) / CHUNK_SIZE);
        let chunkId = this.chunkManager.getChunkId(chunkX, chunkY);
        if (this.chunkManager.hasChunk(chunkId))
        {
            return this.chunkManager.getChunk(chunkId);
        }
        else if (forceLoad)
        {
            return this.chunkManager.loadChunkImmediately(this.world, chunkId, chunkX, chunkY);
        }
        else
        {
            return null;
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

    markActiveWithin(left, top, right, bottom, forceLoad = true)
    {
        let activeChunks = this.chunksWithin([], left, top, right, bottom, forceLoad);
        for(let chunk of activeChunks)
        {
            this.chunkManager.markActive(this.world, chunk.chunkId);
        }
    }
}
