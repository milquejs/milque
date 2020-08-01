import * as BlockRenderer from './BlockRenderer.js';

export async function load() {}

export function drawChunkMap(ctx, chunkMap, blockSize)
{
    const chunkBlockWidth = chunkMap.chunkWidth * blockSize;
    const chunkBlockHeight = chunkMap.chunkHeight * blockSize;
    for(let chunk of chunkMap.getLoadedChunks())
    {
        const chunkX = chunk.chunkCoordX * chunkBlockWidth;
        const chunkY = chunk.chunkCoordY * chunkBlockHeight;
        ctx.translate(chunkX, chunkY);
        {
            drawChunk(ctx, chunkMap, chunk, blockSize);
            // ctx.fillStyle = 'white';
            // ctx.fillText(chunk.chunkId, 0, 16);
            // ctx.strokeStyle = 'white';
            // ctx.strokeRect(0, 0, chunkBlockWidth, chunkBlockHeight);
        }
        ctx.translate(-chunkX, -chunkY);
    }
}

export function drawChunk(ctx, chunkMap, chunk, blockSize)
{
    const chunkWidth = chunkMap.chunkWidth;
    const chunkHeight = chunkMap.chunkHeight;

    const chunkOffsetX = chunk.chunkCoordX * chunkWidth;
    const chunkOffsetY = chunk.chunkCoordY * chunkHeight;
    let blockPos = chunkMap.at(chunkOffsetX, chunkOffsetY);
    for(let y = 0; y < chunkHeight; ++y)
    {
        for(let x = 0; x < chunkWidth; ++x)
        {
            blockPos.set(x + chunkOffsetX, y + chunkOffsetY);
            ctx.translate(x * blockSize, y * blockSize);
            {
                BlockRenderer.drawBlock(ctx, chunk, blockPos, blockSize);
            }
            ctx.translate(-x * blockSize, -y * blockSize);
        }
    }
}