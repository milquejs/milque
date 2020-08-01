import { drawBlockMap } from './BlockMapRenderer.js';

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
            drawBlockMap(ctx, chunk, blockSize);
            // ctx.fillStyle = 'white';
            // ctx.fillText(chunk.chunkId, 0, 16);
            // ctx.strokeStyle = 'white';
            // ctx.strokeRect(0, 0, blockMapWidth * blockSize, blockMapHeight * blockSize);
        }
        ctx.translate(-chunkX, -chunkY);
    }
}
